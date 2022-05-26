import { loadClient } from "../helpers";
import { simplelog } from "../logger";
import { CliPositionsArg } from "../types";

export const cliPositions = async ({
  keypair,
  endpoint,
  commitment,
  cluster,
}: CliPositionsArg) => {
  const { marginExist, clientMargin } = await loadClient(
    cluster,
    keypair,
    commitment,
    endpoint
  );

  if (marginExist) {
    try {
      const userMargin = await clientMargin;

      const userPositions = userMargin.positions;

      const positionsData = userPositions
        .filter(
          (p) =>
            p.coins.decimal.toNumber() !== 0 &&
            p.pCoins.decimal.toNumber() !== 0
        )
        .map((position) => {
          return {
            market: userMargin.state.markets[position.marketKey].symbol,
            baseSize: position.coins.decimal,
            quoteSize: position.pCoins.decimal,
            baseSizeUSD: position.coins.decimal.mul(
              userMargin.state.markets[position.marketKey]!.indexPrice.decimal
            ),
            unrealisedPnL: userMargin.positionPnL(position),
            realisedPnL: position.realizedPnL.decimal,
            liqPrice: userMargin.liqPrice(position),
            funding: userMargin.positionFunding(position),
          };
        });

      if (positionsData.length !== 0) {
        console.log("Positions:");
        console.log("==========================================");

        for (const p of positionsData) {
          console.log(p, "\n");
        }
      } else {
        simplelog.info("No Positions!!");
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
