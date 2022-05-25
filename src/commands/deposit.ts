import { PublicKey } from "@solana/web3.js";
import { getTxString, loadClient } from "../helpers";
import { simplelog } from "../logger";
import { CliDepositArg } from "../types";

export const cliDeposit = async ({
  keypair,
  endpoint,
  cluster,
  commitment,
  token,
  size, // string to BN. should multiply by decimal
  repayOnly,
  tokenAccount,
}: CliDepositArg) => {
  const { marginExist, clientMargin, zoCluster } = await loadClient(
    cluster,
    keypair,
    commitment,
    endpoint
  );

  if (marginExist) {
    try {
      const userMargin = await clientMargin;
      const collateralMint = userMargin.state.data.collaterals.filter(
        (market) => market.oracleSymbol === token
      )[0].mint;

      simplelog.info(`Depositing ${size} ${token} to vault... \n`);
      const tx = await userMargin.deposit(
        collateralMint,
        size,
        repayOnly,
        // tokenAccount ? new PublicKey(tokenAccount) : undefined
        new PublicKey(tokenAccount)
      );
      simplelog.info(
        `Deposited ${size} ${token} to vault. Transaction Id: ${getTxString(
          tx,
          zoCluster
        )} `
      );
      //   }
    } catch (e) {
      simplelog.error(`error depositing ${token} to vault. error: ${e}`);
    }
  } else {
    simplelog.error(
      `No Margin Account found. Create Margin account. zo-cli create-margin [options]`
    );
  }
};
