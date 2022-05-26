## ZO-CLI

<br/>

CLI Trading CLient for 01 Exchange

`yarn` or `npm install`

run locally:

```sh
yarn build
node dist/bin/zo-cli.js --help
```

or

install globally:

```sh
npm link
zo-cli --help

```

```sh
zo-cli [command]

Commands:
  zo-cli create-margin      create a margin account
  zo-cli place-perp-order   place a perp order
  zo-cli cancel-perp-order  cancel perp order
  zo-cli deposit            deposit collateral
  zo-cli withdraw           withdraw collateral
  zo-cli settle-funds       settle PnL
  zo-cli balances           check balances and risk
  zo-cli positions          view positions
  zo-cli open-orders        view open orders
  zo-cli zo-data            list current market and collateral data
  zo-cli run-liquidator     run liquidator to liquidate accounts

Options:
  --help     Show help                                                 [boolean]
  --version  Show version number                                       [boolean]

```

Uninstall: `npm uninstall -g zo-cli`
