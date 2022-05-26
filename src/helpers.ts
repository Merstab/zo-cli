import {
  Cluster,
  createProgram,
  createProvider,
  Margin,
  OrderType,
  State,
  ZO_DEVNET_STATE_KEY,
  ZO_MAINNET_STATE_KEY,
} from "@zero_one/client";
import { CliOrderType, ClusterKind, Config } from "./types";
import { BN, Wallet } from "@project-serum/anchor";
import fs from "fs";
import { Commitment, Connection, Keypair } from "@solana/web3.js";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { simplelog } from "./logger";

export const cliOrderTypeToOrderType = (ordertype: CliOrderType): OrderType => {
  if (ordertype === "limit") {
    return { limit: {} };
  } else if (ordertype === "ioc") {
    return { immediateOrCancel: {} };
  } else if (ordertype === "postonly") {
    return { postOnly: {} };
  } else if (ordertype === "reduceonlyioc") {
    return { reduceOnlyIoc: {} };
  } else if (ordertype === "reduceonlylimit") {
    return { reduceOnlyLimit: {} };
  } else if (ordertype === "fok") {
    return { fillOrKill: {} };
  } else throw new Error(`Invaid order type: ${ordertype}`);
};

export const toPlacePerpOrderOptions = (
  symbol: string,
  orderType: CliOrderType,
  isLong: boolean,
  price: number,
  size: number,
  limit?: number,
  clientId?: number
): Readonly<{
  symbol: string;
  orderType: OrderType;
  isLong: boolean;
  price: number;
  size: number;
  limit?: number;
  clientId?: number;
}> => {
  return {
    symbol,
    orderType: cliOrderTypeToOrderType(orderType),
    isLong,
    price,
    size,
    limit,
    clientId,
  };
};

export const toCancelPerpOrderOptions = (
  symbol: string,
  isLong?: boolean,
  orderId?: string,
  clientId?: string
) => {
  return {
    symbol,
    isLong,
    orderId: new BN(orderId),
    clientId: new BN(clientId),
  };
};

export function getTxString(tx: string, cluster: Cluster) {
  return `https://explorer.solana.com/tx/${tx}${
    cluster == Cluster.Devnet ? "?cluster=devnet" : ""
  }`;
}

export function loadWalletKey(keypair): Keypair {
  if (!keypair || keypair == "") {
    throw new Error("Keypair is required!");
  }

  const decodedKey = new Uint8Array(
    keypair.endsWith(".json") && !Array.isArray(keypair)
      ? JSON.parse(fs.readFileSync(keypair).toString())
      : bs58.decode(keypair)
  );

  const loaded = Keypair.fromSecretKey(decodedKey);
  simplelog.info(`wallet public key: ${loaded.publicKey}`);
  return loaded;
}

const DEFAULT_DEVNET_ENDPOINT = "https://api.devnet.solana.com/";
const DEFAULT_MAINNET_ENDPOINT = "https://solana-api.projectserum.com/";

export function loadConfig(
  cluster: ClusterKind,
  keypair: string,
  commitment: Commitment,
  endpoint?: string
): Config {
  simplelog.info(`Cluster: ${cluster}`);
  simplelog.info(`Keypair path: ${keypair}`);

  const key = loadWalletKey(keypair);
  const wallet = new Wallet(key);
  if (cluster === "devnet") {
    const connection = new Connection(
      endpoint || DEFAULT_DEVNET_ENDPOINT,
      commitment as Commitment
    );
    const provider = createProvider(connection, wallet, {
      skipPreflight: true,
      preflightCommitment: commitment,
      commitment: commitment,
    });
    const zoProgram = createProgram(provider, Cluster.Devnet);

    return {
      zoCluster: Cluster.Devnet,
      zoStateKey: ZO_DEVNET_STATE_KEY,
      connection,
      provider,
      zoProgram,
    };
  } else if (cluster === "mainnet-beta") {
    const connection = new Connection(endpoint || DEFAULT_MAINNET_ENDPOINT);
    const provider = createProvider(connection, wallet);
    const zoProgram = createProgram(provider, Cluster.Mainnet);
    return {
      zoCluster: Cluster.Mainnet,
      zoStateKey: ZO_MAINNET_STATE_KEY,
      connection,
      provider,
      zoProgram,
    };
  } else {
    throw new Error("Invalid Cluster");
  }
}

export async function loadClient(
  cluster: ClusterKind,
  keypair: string,
  commitment: Commitment,
  endpoint?: string
) {
  const { provider, zoProgram, zoStateKey, zoCluster } = loadConfig(
    cluster,
    keypair,
    commitment,
    endpoint
  );

  simplelog.info("loading client...");

  const zoState = await State.load(zoProgram, zoStateKey);

  simplelog.info(`state key: ${zoState.pubkey.toBase58()}`);

  const marginExist = await Margin.exists(
    zoProgram,
    zoState,
    provider.wallet.publicKey
  );

  const perpMarkets = zoState.data.perpMarkets.map((m) => m.symbol);
  const collaterals = zoState.data.collaterals.map((m) => m.oracleSymbol);

  const symbols = { perpMarkets, collaterals };

  simplelog.info(`margin exist: ${marginExist}`);

  const [marginKey] = await Margin.getMarginKey(
    zoState,
    provider.wallet.publicKey,
    zoProgram
  );

  const clientMargin = marginExist
    ? Margin.load(zoProgram, zoState, undefined, provider.wallet.publicKey)
    : undefined;

  simplelog.info("client loaded.\n");
  return {
    zoCluster,
    provider,
    zoProgram,
    symbols,
    zoState,
    marginExist,
    marginKey,
    clientMargin,
  };
}

export async function getOpenOrders(
  margin: Margin,
  connection: Connection,
  symbols: string[]
) {
  return await Promise.all(
    symbols.map(async (marketSymbol) => {
      const market = await margin.state.getMarketBySymbol(marketSymbol);
      const openOrdersForMarket = await market.loadOrdersForOwner(
        connection,
        margin.control.pubkey
      );
      return openOrdersForMarket
        .map((oo) => {
          const {
            controlAddress,
            clientId,
            orderId,
            feeTier,
            price,
            size,
            openOrdersSlot,
            side,
          } = oo;
          return {
            market: marketSymbol,
            openOrdersSlot,
            side,
            price,
            size,
            orderId: orderId.toString(),
            clientId: clientId.toString(),
            feeTier,
            controlAddress: controlAddress.toBase58(),
          };
        })
        .sort((a, b) => b.openOrdersSlot - a.openOrdersSlot);
    })
  );
}

export async function getLastOpenOrderForMarket(
  margin: Margin,
  connection: Connection,
  symbol: string
) {
  const orders = await getOpenOrders(margin, connection, [symbol]);
  return orders[0][0];
}
