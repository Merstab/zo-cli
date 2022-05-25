import { getTxString, loadClient, toCancelPerpOrderOptions } from "../helpers";
import { simplelog } from "../logger";
import { CliCancelPerpOrderArg } from "../types";

export const cliCancelPerpOrder = async ({
  keypair,
  endpoint,
  cluster,
  commitment,
  symbol,
  isLong,
  orderId,
  clientId,
}: CliCancelPerpOrderArg) => {
  const { marginExist, clientMargin, zoCluster } = await loadClient(
    cluster,
    keypair,
    commitment,
    endpoint
  );
  if (marginExist) {
    try {
      const userMargin = await clientMargin;
      const cancelPerpOrderOptions = toCancelPerpOrderOptions(
        symbol,
        isLong,
        orderId,
        clientId
      );
      simplelog.info("Cancelling order...", cancelPerpOrderOptions);
      const tx = await userMargin.cancelPerpOrder(cancelPerpOrderOptions);
      simplelog.info(
        `\nOrder cancelled.\nTx Id: ${tx}\nExplorer: ${getTxString(
          tx,
          zoCluster
        )}`
      );
    } catch (e) {
      simplelog.error(`error placing order. error: ${e}`);
    }
  } else {
    simplelog.error(
      `No Margin Account found. Create Margin account. zo-cli create-margin [options]`
    );
  }
};
