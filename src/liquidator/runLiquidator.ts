import Liquidator from "./Liquidator";
import { simplelog } from "../logger";
import { loadClient } from "../helpers";
import { CliLiquidatorArgs, LiquidatorConfig } from "../types";

export async function runLiquidator(liquidatorArgs: CliLiquidatorArgs) {
  const {
    cluster,
    endpoint,
    keypair,
    commitment,
    liquidationCheckInterval,
    liquidationTolerance,
    maxActiveLiquidations,
    maxLeverage,
    maxNotionalPerPositionClose,
    maxUnliquidatedTime,
    rebalanceThreshold,
  } = liquidatorArgs;

  const { zoProgram, zoCluster, marginExist } = await loadClient(
    cluster,
    keypair,
    commitment,
    endpoint
  );
  if (marginExist) {
    try {
      const liqConfig: LiquidatorConfig = {
        liquidationCheckInterval,
        liquidationTolerance,
        maxActiveLiquidations,
        maxLeverage,
        maxNotionalPerPositionClose,
        maxUnliquidatedTime,
        rebalanceThreshold,
      };

      simplelog.info("*** STARTING LIQUIDATOR ***");

      const liquidator = new Liquidator(zoCluster, zoProgram, liqConfig);
      await liquidator.launch();
    } catch (_) {
      simplelog.error("*** LIQUIDATOR FAILED ***");
      simplelog.error(_);
      simplelog.error("*** LIQUIDATOR RESTARTING ***");
      await runLiquidator(liquidatorArgs);
    }
  } else {
    simplelog.error(
      `No Margin Account found. Create Margin account. zo-cli create-margin [options]`
    );
  }
}
