import { loadClient } from "../helpers";
import { simplelog } from "../logger";
import { CliZoDataArg } from "../types";

export const cliZoData = async ({
  keypair,
  endpoint,
  commitment,
  cluster,
  verbose,
}: CliZoDataArg) => {
  const { zoState, symbols } = await loadClient(
    cluster,
    keypair,
    commitment,
    endpoint
  );

  if (!verbose) {
    console.log("Market Info:");
    console.log("==========================");
    const marketInfo = symbols.perpMarkets.map((m) => {
      const { symbol, markPrice, indexPrice } = zoState.markets[m];
      return {
        symbol,
        indexPrice: indexPrice.decimal,
        markPrice: markPrice.decimal,
      };
    });
    for (const m of marketInfo) {
      // console.log(m, "\n");
      console.log("symbol:", m.symbol);
      console.log("index price:", m.indexPrice);
      console.log("mark price:", m.markPrice);
      console.log("");
    }

    console.log("Collateral/Token Info:");
    console.log("==========================");
    const collateralInfo = symbols.collaterals.map((m) => {
      const { symbol, indexPrice } = zoState.assets[m];
      return {
        symbol,
        indexPrice: indexPrice.decimal,
      };
    });
    for (const c of collateralInfo) {
      console.log("symbol:", c.symbol);
      console.log("index price:", c.indexPrice);
      console.log("");
      // console.log(c, "\n");
    }
  } else {
    console.log("Market Symbols:");
    console.log("==========================");
    for (const s of symbols.perpMarkets) {
      console.log(s);
    }
    console.log("");

    console.log("Collateral Symbols:");
    console.log("==========================");
    for (const s of symbols.collaterals) {
      console.log(s);
    }
    console.log("");

    const marketInfo = symbols.perpMarkets.map((m) => {
      const { baseImf, fundingIndex, symbol, markPrice, indexPrice, pmmf } =
        zoState.markets[m];
      return {
        symbol,
        indexPrice: indexPrice.decimal,
        markPrice: markPrice.decimal,
        fundingIndex,
        baseImf,
        pmmf,
      };
    });

    console.log("Market Info");
    console.log("==========================");
    for (const m of marketInfo) {
      console.log(m, "\n");
    }

    const collateralInfo = symbols.collaterals.map((m) => {
      const {
        symbol,
        mint,
        indexPrice,
        maxDeposit,
        supply,
        supplyApy,
        borrows,
        borrowsApy,
        isBorrowable,
        weight,
        isSwappable,
        liqFee,
      } = zoState.assets[m];
      return {
        symbol,
        indexPrice: indexPrice.decimal,
        mint: mint.toBase58(),
        maxDeposit,
        supply,
        supplyApy,
        borrows,
        borrowsApy,
        isBorrowable,
        isSwappable,
        weight: weight / 1000,
        liqFee: liqFee / 1000,
      };
    });

    console.log("Collateral Info");
    console.log("==========================");
    for (const c of collateralInfo) {
      console.log(c, "\n");
    }
  }
  try {
  } catch (e) {
    simplelog.error(`error getting positions. error: ${e}`);
  }
};
