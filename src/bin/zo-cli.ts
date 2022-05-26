#!/usr/bin/env node
const yargs = require("yargs");

import {
  cliBalances,
  cliCancelPerpOrder,
  cliCreateMargin,
  cliDeposit,
  cliPlacePerpOrder,
  cliPositions,
  cliSettleFunds,
  cliWithdraw,
  runLiquidator,
  cliZoData,
  setLevel,
  CliBalancesOptions,
  CliCancelPerpOrderOptions,
  CliDepositOptions,
  CliLiquidatorOptions,
  CliPlacePerpOrderOptions,
  CliPositionsOptions,
  CliSettleFundsOptions,
  CliWIthdrawOptions,
  CliZoDataArg,
} from "../";
import { cliOpenOrders } from "../commands";
import { CliOpenOrdersOptions } from "../types";

yargs.version("0.1.0");

yargs.scriptName("zo-cli");

yargs.command({
  command: "create-margin",
  describe: "create a margin account",
  builder: {
    keypair: {
      describe: "path to keypair",
      alias: "k",
      demandOption: true,
      type: "string",
    },
    cluster: {
      describe: "Solana cluster to connect to",
      alias: "c",
      demandOption: true,
      type: "string",
      choices: ["mainnet-beta", "devnet"],
    },
    endpoint: {
      describe: "custom endpoint url",
      alias: "e",
      type: "string",
    },
    loglevel: {
      describe: "log level",
      alias: "l",
      type: "string",
      choices: ["error", "info", "debug"],
    },
    commitment: {
      describe: "commitment level",
      // alias: "",
      type: "string",
      default: "confirmed",
      choices: ["recent", "processed", "confirmed", "finalized"],
    },
  },
  handler: (argv: CliBalancesOptions) => {
    // console.log("argv:", argv);
    const { loglevel, ...args } = argv;
    setLevel(loglevel);
    cliCreateMargin({ ...args });
  },
});

yargs.command({
  command: "place-perp-order",
  describe: "place a perp order",
  builder: {
    keypair: {
      describe: "path to keypair",
      alias: "k",
      demandOption: true,
      type: "string",
    },
    commitment: {
      describe: "commitment level",
      // alias: "",
      type: "string",
      choices: ["recent", "processed", "confirmed", "finalized"],
      default: "confirmed",
    },
    cluster: {
      describe: "Solana cluster to connect to",
      alias: "c",
      demandOption: true,
      type: "string",
      choices: ["mainnet-beta", "devnet"],
    },
    endpoint: {
      describe: "custom endpoint url",
      alias: "e",
      type: "string",
    },
    symbol: {
      describe: "market symbol e.g BTC-PERP, SOL-PERP, SOL-SQUARE",
      alias: "S",
      type: "string",
      demandOption: true,
    },
    size: {
      describe: "order size",
      alias: "s",
      type: "number",
      demandOption: true,
    },
    isLong: {
      describe: "long: true, short: false",
      alias: "long",
      type: "boolean",
      demandOption: true,
    },
    price: {
      describe: "price to pay",
      alias: "p",
      type: "number",
      demandOption: true,
    },
    ordertype: {
      describe:
        "order type - \nlimit: limit, \nioc: immediate or cancel, \npostonly: post only, \nreduceonlyioc - reduce-only immediate or cancel, \nreduceonlylimit - reduce-only limit, \nfok - fill or kill",
      alias: "o",
      type: "string",
      demandOption: true,
      choices: [
        "limit",
        "ioc",
        "postonly",
        "reduceonlyioc",
        "reduceonlylimit",
        "fok",
      ],
    },
    limit: {
      describe: "limit",
      type: "number",
    },
    clientId: {
      describe: "clientId",
      type: "number",
    },
    loglevel: {
      describe: "log level",
      alias: "l",
      type: "string",
      choices: ["error", "info", "debug"],
    },
  },
  handler: (argv: CliPlacePerpOrderOptions) => {
    // console.log("argv:", argv);
    const { loglevel, ...args } = argv;
    setLevel(loglevel);
    cliPlacePerpOrder({ ...args });
  },
});

// cancel-perp-order
yargs.command({
  command: "cancel-perp-order",
  describe: "cancel perp order",
  builder: {
    keypair: {
      describe: "path to keypair",
      alias: "k",
      demandOption: true,
      type: "string",
    },
    commitment: {
      describe: "commitment level",
      // alias: "",
      type: "string",
      choices: ["recent", "processed", "confirmed", "finalized"],
      default: "confirmed",
    },
    cluster: {
      describe: "Solana cluster to connect to",
      alias: "c",
      demandOption: true,
      type: "string",
      choices: ["mainnet-beta", "devnet"],
    },
    endpoint: {
      describe: "custom endpoint url",
      alias: "e",
      type: "string",
    },
    symbol: {
      describe: "market symbol e.g BTC-PERP, SOL-PERP, SOL-SQUARE",
      alias: "S",
      type: "string",
      demandOption: true,
    },
    orderId: {
      describe: "order ID",
      alias: "o",
      type: "string",
      demandOption: true,
    },
    isLong: {
      describe: "long order: true, short order: false",
      alias: "long",
      type: "boolean",
      demandOption: true,
      choices: [true, false],
    },
    clientId: {
      describe: "clientId",
      type: "string",
    },
    loglevel: {
      describe: "log level",
      alias: "l",
      type: "string",
      choices: ["error", "info", "debug"],
    },
  },
  handler: (argv: CliCancelPerpOrderOptions) => {
    // console.log("argv:", argv);
    const { loglevel, ...args } = argv;
    setLevel(loglevel);
    cliCancelPerpOrder({ ...args });
  },
});

// deposit
yargs.command({
  command: "deposit",
  describe: "deposit collateral",
  builder: {
    keypair: {
      describe: "path to keypair",
      alias: "k",
      demandOption: true,
      type: "string",
    },
    commitment: {
      describe: "commitment level",
      // alias: "",
      type: "string",
      choices: ["recent", "processed", "confirmed", "finalized"],
      default: "confirmed",
    },
    cluster: {
      describe: "Solana cluster to connect to",
      alias: "c",
      demandOption: true,
      type: "string",
    },
    endpoint: {
      describe: "custom endpoint url",
      alias: "e",
      type: "string",
    },
    token: {
      describe: "collateral symbol e.g SOL, USDC ",
      alias: "S",
      type: "string",
      demandOption: true,
    },
    size: {
      describe: "size",
      alias: "s",
      type: "number",
      demandOption: true,
    },
    repayOnly: {
      describe: "repay",
      alias: "repayonly",
      type: "boolean",
      demandOption: true,
      choices: [true, false],
    },
    tokenAccount: {
      describe: "token account to transfer tokens from",
      type: "string",
    },
    loglevel: {
      describe: "log level",
      alias: "l",
      type: "string",
      choices: ["error", "info", "debug"],
    },
  },
  handler: (argv: CliDepositOptions) => {
    // console.log("argv:", argv);
    const { loglevel, ...args } = argv;
    setLevel(loglevel);
    cliDeposit({ ...args });
  },
});

// withdraw
yargs.command({
  command: "withdraw",
  describe: "withdraw collateral",
  builder: {
    keypair: {
      describe: "path to keypair",
      alias: "k",
      demandOption: true,
      type: "string",
    },
    commitment: {
      describe: "commitment level",
      // alias: "",
      type: "string",
      choices: ["recent", "processed", "confirmed", "finalized"],
      default: "confirmed",
    },
    cluster: {
      describe: "Solana cluster to connect to",
      alias: "c",
      demandOption: true,
      type: "string",
      choices: ["mainnet-beta", "devnet"],
    },
    endpoint: {
      describe: "custom endpoint url",
      alias: "e",
      type: "string",
    },
    token: {
      describe: "collateral symbol e.g SOL, BTC",
      alias: "S",
      type: "string",
      demandOption: true,
    },
    size: {
      describe: "size",
      alias: "s",
      type: "number",
      demandOption: true,
    },
    allowBorrow: {
      describe: "allow borrow",
      alias: "allowborrow",
      type: "boolean",
      demandOption: true,
      choices: [true, false],
    },
    tokenAccount: {
      describe: "token account to deposit tokens to",
      type: "string",
    },
    loglevel: {
      describe: "log level",
      alias: "l",
      type: "string",
      choices: ["error", "info", "debug"],
    },
  },
  handler: (argv: CliWIthdrawOptions) => {
    // console.log("argv:", argv);
    const { loglevel, ...args } = argv;
    setLevel(loglevel);
    cliWithdraw({ ...args });
  },
});

// settle funds
yargs.command({
  command: "settle-funds",
  describe: "settle PnL",
  builder: {
    keypair: {
      describe: "path to keypair",
      alias: "k",
      demandOption: true,
      type: "string",
    },
    commitment: {
      describe: "commitment level",
      // alias: "",
      type: "string",
      choices: ["recent", "processed", "confirmed", "finalized"],
      default: "confirmed",
    },
    cluster: {
      describe: "Solana cluster to connect to",
      alias: "c",
      demandOption: true,
      type: "string",
      choices: ["mainnet-beta", "devnet"],
    },
    endpoint: {
      describe: "custom endpoint url",
      alias: "e",
      type: "string",
    },
    symbol: {
      describe: "market symbol e.g SOL-PERP, BTC-PERP, SOL-SQUARE",
      alias: "S",
      type: "string",
      demandOption: true,
    },
    loglevel: {
      describe: "log level",
      alias: "l",
      type: "string",
      choices: ["error", "info", "debug"],
    },
  },
  handler: (argv: CliSettleFundsOptions) => {
    // console.log("argv:", argv);
    const { loglevel, ...args } = argv;
    setLevel(loglevel);
    cliSettleFunds({ ...args });
  },
});

// balances
yargs.command({
  command: "balances",
  describe: "check balances and risk",
  builder: {
    keypair: {
      describe: "path to keypair",
      alias: "k",
      demandOption: true,
      type: "string",
    },
    commitment: {
      describe: "commitment level",
      // alias: "",
      type: "string",
      choices: ["recent", "processed", "confirmed", "finalized"],
      default: "confirmed",
    },
    cluster: {
      describe: "Solana cluster to connect to",
      alias: "c",
      demandOption: true,
      type: "string",
      choices: ["mainnet-beta", "devnet"],
    },
    endpoint: {
      describe: "custom endpoint url",
      alias: "e",
      type: "string",
    },
    loglevel: {
      describe: "log level",
      alias: "l",
      type: "string",
      choices: ["error", "info", "debug"],
    },
  },
  handler: (argv) => {
    // console.log("argv:", argv);
    const { loglevel, ...args } = argv;
    setLevel(loglevel);
    cliBalances({ ...args });
  },
});

// positions
yargs.command({
  command: "positions",
  describe: "view positions",
  builder: {
    keypair: {
      describe: "path to keypair",
      alias: "k",
      demandOption: true,
      type: "string",
    },
    commitment: {
      describe: "commitment level",
      // alias: "",
      type: "string",
      choices: ["recent", "processed", "confirmed", "finalized"],
      default: "confirmed",
    },
    cluster: {
      describe: "Solana cluster to connect to",
      alias: "c",
      demandOption: true,
      type: "string",
      choices: ["mainnet-beta", "devnet"],
    },
    endpoint: {
      describe: "custom endpoint url",
      alias: "e",
      type: "string",
    },
    loglevel: {
      describe: "log level",
      alias: "l",
      type: "string",
      choices: ["error", "info", "debug"],
    },
  },
  handler: (argv: CliPositionsOptions) => {
    // console.log("argv:", argv);
    const { loglevel, ...args } = argv;
    setLevel(loglevel);
    cliPositions({ ...args });
  },
});

// open orders
yargs.command({
  command: "open-orders",
  describe: "view open orders",
  builder: {
    keypair: {
      describe: "path to keypair",
      alias: "k",
      demandOption: true,
      type: "string",
    },
    commitment: {
      describe: "commitment level",
      // alias: "",
      type: "string",
      choices: ["recent", "processed", "confirmed", "finalized"],
      default: "confirmed",
    },

    markets: {
      describe: "market symbols to get Open Orders for market",
      alias: "S",
      type: "array",
    },
    cluster: {
      describe: "Solana cluster to connect to",
      alias: "c",
      demandOption: true,
      type: "string",
      choices: ["mainnet-beta", "devnet"],
    },
    endpoint: {
      describe: "custom endpoint url",
      alias: "e",
      type: "string",
    },
    loglevel: {
      describe: "log level",
      alias: "l",
      type: "string",
      choices: ["error", "info", "debug"],
    },
  },
  handler: (argv: CliOpenOrdersOptions) => {
    // console.log("argv:", argv);
    const { loglevel, ...args } = argv;
    setLevel(loglevel);
    cliOpenOrders({ ...args });
  },
});

// list symbols
yargs.command({
  command: "zo-data",
  describe: "list current market and collateral data",
  builder: {
    keypair: {
      describe: "path to keypair",
      alias: "k",
      demandOption: true,
      type: "string",
    },
    commitment: {
      describe: "commitment level",
      // alias: "",
      type: "string",
      choices: ["recent", "processed", "confirmed", "finalized"],
      default: "confirmed",
    },
    cluster: {
      describe: "Solana cluster to connect to",
      alias: "c",
      demandOption: true,
      type: "string",
      choices: ["mainnet-beta", "devnet"],
    },
    endpoint: {
      describe: "custom endpoint url",
      alias: "e",
      type: "string",
    },
    verbose: {
      alias: "v",
      type: "boolean",
    },
  },
  handler: (argv: CliZoDataArg) => {
    // console.log("argv:", argv);
    cliZoData({ ...argv });
  },
});

// run-liquidator
yargs.command({
  command: "run-liquidator",
  describe: "run liquidator to liquidate accounts",
  builder: {
    keypair: {
      describe: "path to keypair",
      alias: "k",
      demandOption: true,
      type: "string",
    },
    commitment: {
      describe: "commitment level",
      // alias: "",
      type: "string",
      choices: ["recent", "processed", "confirmed", "finalized"],
      default: "confirmed",
    },
    cluster: {
      describe: "Solana cluster to connect to",
      alias: "c",
      demandOption: true,
      type: "string",
      choices: ["mainnet-beta", "devnet"],
    },
    endpoint: {
      describe: "custom endpoint url",
      alias: "e",
      type: "string",
    },
    // liquidationCheckInterval
    liquidationCheckInterval: {
      describe: "How often to check for liquidations accross margin accounts",
      alias: "lci",
      type: "number",
      default: 100,
    },
    // liquidationTolerance
    liquidationTolerance: {
      describe: "how sensitive liquidator is (0.99 recommended)",
      alias: "lt",
      type: "number",
      default: 0.99,
    },

    // maxActiveLiquidations
    maxActiveLiquidations: {
      describe: "Max concurrent liquidations",
      alias: "mal",
      type: "number",
      default: 10,
    },
    //   maxLeverage,
    maxLeverage: {
      describe: "Max leverage that liquidator can take on",
      alias: "ml",
      type: "number",
      default: 5,
    },
    //   maxNotionalPerPositionClose,
    maxNotionalPerPositionClose: {
      describe: "Max notional per position to close",
      alias: "mnpc",
      type: "number",
      default: 100_000,
    },
    //   maxUnliquidatedTime,
    maxUnliquidationTime: {
      describe:
        "for how long can account stay unliquidated before liquidator will print an error",
      alias: "mult",
      type: "number",
      default: 700000,
    },
    //   rebalanceThreshold,
    rebalanceThreshold: {
      describe:
        "At what fraction of the margin account's notional relative to account value, account should rebalance",
      alias: "rt",
      type: "number",
      default: 0.05,
    },
    loglevel: {
      describe: "log level",
      alias: "l",
      type: "string",
      choices: ["error", "info", "debug"],
    },
  },
  handler: (argv: CliLiquidatorOptions) => {
    // console.log("argv:", argv);
    const { loglevel, ...args } = argv;
    setLevel(loglevel);
    runLiquidator({ ...args });
  },
});

yargs.parse();
