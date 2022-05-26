import {
  getLastOpenOrderForMarket,
  getTxString,
  loadClient,
  toPlacePerpOrderOptions,
} from "../helpers";
import { simplelog } from "../logger";
import { CliPlacePerpOrderArg } from "../types";

export const cliPlacePerpOrder = async ({
  cluster,
  keypair,
  commitment,
  symbol,
  isLong,
  ordertype,
  price,
  size,
  endpoint,
  limit,
  clientId,
}: CliPlacePerpOrderArg) => {
  const { marginExist, clientMargin, zoCluster, provider } = await loadClient(
    cluster,
    keypair,
    commitment,
    endpoint
  );

  if (marginExist) {
    try {
      simplelog.debug("margin loaded.");
      const userMargin = await clientMargin;
      simplelog.debug("margin loaded.");
      const placePerpOrderOptions = toPlacePerpOrderOptions(
        symbol,
        ordertype,
        isLong,
        price,
        size,
        limit,
        clientId
      );
      simplelog.info(`Placing order...`, placePerpOrderOptions);

      const tx = await userMargin.placePerpOrder(placePerpOrderOptions);

      await userMargin.refresh();

      simplelog.info(`Getting Order info...`);

      const order = await getLastOpenOrderForMarket(
        userMargin,
        provider.connection,
        symbol
      );

      simplelog.info(
        `Order placed. \n\nTx Id: ${tx} \n\nExplorer: ${getTxString(
          tx,
          zoCluster
        )}`
      );
      simplelog.info(`Latest Order`);
      console.log("===========================");

      console.log(order);
    } catch (e) {
      simplelog.error(`error placing order. error: ${e}`);
    }
  } else {
    simplelog.error(
      `No Margin Account found. Create Margin account. zo-cli create-margin [options]`
    );
  }
};
