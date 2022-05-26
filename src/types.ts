import { Commitment, Connection, PublicKey } from "@solana/web3.js";
import { Cluster, Zo } from "@zero_one/client";
import {
  Provider,
  Program,
} from "@zero_one/client/node_modules/@project-serum/anchor";

export type ClusterKind = "mainnet-beta" | "devnet";

export type CliOrderType =
  | "limit"
  | "ioc"
  | "postonly"
  | "reduceonlyioc"
  | "reduceonlylimit"
  | "fok";

export interface Config {
  zoCluster: Cluster;
  zoStateKey: PublicKey;
  connection: Connection;
  provider: Provider;
  zoProgram: Program<Zo>;
}

export interface CliBaseArg {
  cluster: ClusterKind;
  keypair: string;
  commitment: Commitment;
  endpoint?: string;
}

export interface CliBalancesArg extends CliBaseArg {}

export interface CliCreateMarginArg extends CliBaseArg {}

export interface CliPositionsArg extends CliBaseArg {}

export interface CliZoDataArg extends CliBaseArg {
  verbose: boolean;
}

export interface CliSettleFundsArg extends CliBaseArg {
  symbol: string;
}

export interface CliOpenOrdersArg extends CliBaseArg {
  markets: string[];
}

export interface CliPlacePerpOrderArg extends CliBaseArg {
  symbol: string;
  isLong: boolean;
  ordertype: CliOrderType;
  price: number;
  size: number;
  limit?: number;
  clientId?: number;
}

export interface CliWithdrawArg extends CliBaseArg {
  token: string;
  size: number;
  allowBorrow: boolean;
}
export interface CliDepositArg extends CliBaseArg {
  token: string;
  size: number;
  repayOnly: boolean;
  tokenAccount?: string;
}

export interface CliCancelPerpOrderArg extends CliBaseArg {
  symbol: string;
  isLong?: boolean;
  orderId?: string;
  clientId?: string;
}

export interface LiquidatorConfig {
  maxActiveLiquidations: number;
  liquidationCheckInterval: number;
  maxLeverage: number;
  liquidationTolerance: number;
  maxNotionalPerPositionClose: number;
  rebalanceThreshold: number;
  maxUnliquidatedTime: number;
}

export interface CliLiquidatorArgs extends CliBaseArg, LiquidatorConfig {}

export interface LogLevelOption {
  loglevel: string;
}

export interface CliBalancesOptions extends LogLevelOption, CliBalancesArg {}

export interface CliBalancesOptions extends LogLevelOption, CliBalancesArg {}

export interface CliPlacePerpOrderOptions
  extends LogLevelOption,
    CliPlacePerpOrderArg {}

export interface CliCancelPerpOrderOptions
  extends LogLevelOption,
    CliCancelPerpOrderArg {}

export interface CliCreateMarginOptions
  extends LogLevelOption,
    CliCreateMarginArg {}

export interface CliDepositOptions extends LogLevelOption, CliDepositArg {}

export interface CliLiquidatorOptions
  extends LogLevelOption,
    CliLiquidatorArgs {}

export interface CliPositionsOptions extends LogLevelOption, CliPositionsArg {}

export interface CliOpenOrdersOptions
  extends LogLevelOption,
    CliOpenOrdersArg {}

export interface CliSettleFundsOptions
  extends LogLevelOption,
    CliSettleFundsArg {}

export interface CliWIthdrawOptions extends LogLevelOption, CliWithdrawArg {}
