import { loadClient } from "../helpers";
import { simplelog } from "../logger";
import { CliBalancesArg } from "../types";

export const cliBalances = async ({
  keypair,
  endpoint,
  commitment,
  cluster,
}: CliBalancesArg) => {
  const { marginExist, clientMargin } = await loadClient(
    cluster,
    keypair,
    commitment,
    endpoint
  );

  if (marginExist) {
    try {
      const userMargin = await clientMargin;
      const userBalances = userMargin.state.data.collaterals.map((market) => {
        return {
          symbol: market.oracleSymbol,
          mint: market.mint.toBase58(),
          balance: userMargin.balances[market.oracleSymbol].toString(),
        };
      });

      console.log("Collateral Balances:");
      for (let balance of userBalances) {
        console.log(`${balance.symbol}: ${balance.balance}`);
      }
      console.log("");

      console.log(
        `Cumulative Unrealised PnL: ${userMargin.cumulativeUnrealizedPnL}\n`
      );
      // total account value
      console.log(`Total Account Value: ${userMargin.weightedAccountValue}\n`);

      // total collateral value
      console.log(
        `Total Collateral Value: ${userMargin.weightedCollateralValue}\n`
      );

      // total position notional
      console.log(
        `Total Position Notional: ${userMargin.totalPositionNotional}\n`
      );

      // mf
      console.log(`Margin Fraction: ${userMargin.marginFraction}\n`);

      // omf
      console.log(`Open Margin Fraction: ${userMargin.openMarginFraction}\n`);

      // imf
      console.log(
        `Initial Margin Fraction: ${userMargin.initialMarginFraction()}\n`
      );

      //mmf
      console.log(
        `Maintenance Margin Fraction: ${userMargin.maintenanceMarginFraction}`
      );
    } catch (e) {
      simplelog.error(`error getting balances. error: ${e}`);
    }
  } else {
    simplelog.error(
      `No Margin Account found. Create Margin account. zo-cli create-margin [options]`
    );
  }
};
