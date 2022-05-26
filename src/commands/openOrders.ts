import { getOpenOrders, loadClient } from "../helpers";
import { simplelog } from "../logger";
import { CliOpenOrdersArg } from "../types";

export const cliOpenOrders = async ({
  keypair,
  endpoint,
  commitment,
  markets,
  cluster,
}: CliOpenOrdersArg) => {
  const { marginExist, clientMargin, symbols, provider } = await loadClient(
    cluster,
    keypair,
    commitment,
    endpoint
  );

  if (marginExist) {
    try {
      const userMargin = await clientMargin;

      const openOrdersForAllMarkets = await getOpenOrders(
        userMargin,
        provider.connection,
        markets || symbols.perpMarkets
      );

      // remove markets with no open orders
      const openOrdersForMarkets = openOrdersForAllMarkets.filter(
        (oom) => oom.length !== 0
      );

      if (openOrdersForMarkets.length !== 0) {
        console.log("Open Orders");
        for (const o of openOrdersForMarkets) {
          console.log("============================================");

          for (const openOrders of o) {
            console.log(openOrders, "\n");
          }
        }
      } else {
        simplelog.info("No Open Orders!!");
      }
    } catch (e) {
      simplelog.error(`error getting positions. error: ${e}`);
    }
  } else {
    simplelog.error(
      `No Margin Account found. Create Margin account. zo-cli create-margin [options]`
    );
  }
};
