import { loadClient } from "../helpers";
import { simplelog } from "../logger";
import { CliListSymbolsArg } from "../types";

export const cliListSymbols = async ({
  keypair,
  endpoint,
  commitment,
  cluster,
}: CliListSymbolsArg) => {
  const { zoState } = await loadClient(cluster, keypair, commitment, endpoint);
  console.log("Market Symbols:");
  zoState.data.perpMarkets.map((m) => console.log(m.symbol));
  console.log("");

  console.log("Collateral Symbols:");
  zoState.data.collaterals.map((m) => console.log(m.oracleSymbol));
  try {
  } catch (e) {
    simplelog.error(`error getting positions. error: ${e}`);
  }
};
