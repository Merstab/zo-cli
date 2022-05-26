import { getTxString, loadClient } from "../helpers";
import { simplelog } from "../logger";
import { CliSettleFundsArg } from "../types";

export const cliSettleFunds = async ({
  keypair,
  endpoint,
  commitment,
  cluster,
  symbol,
}: CliSettleFundsArg) => {
  const { marginExist, clientMargin, zoCluster } = await loadClient(
    cluster,
    keypair,
    commitment,
    endpoint
  );

  if (marginExist) {
    try {
      const userMargin = await clientMargin;

      simplelog.info(`Settling funds for ${symbol} market...`);
      const tx = await userMargin.settleFunds(symbol);
      simplelog.info(
        `Settle Funds. \n\nTransaction Id: ${tx} \n\nExplorer: ${getTxString(
          tx,
          zoCluster
        )}`
      );
    } catch (e) {
      simplelog.error(`error getting positions. error: ${e}`);
    }
  } else {
    simplelog.error(
      `No Margin Account found. Create Margin account. zo-cli create-margin [options]`
    );
  }
};
