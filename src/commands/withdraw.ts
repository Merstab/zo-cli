import { getTxString, loadClient } from "../helpers";
import { simplelog } from "../logger";
import { CliWithdrawArg } from "../types";

export const cliWithdraw = async ({
  keypair,
  endpoint,
  cluster,
  commitment,
  token,
  size,
  allowBorrow,
}: CliWithdrawArg) => {
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
      simplelog.info(`Withdrawing ${size} ${token} from vault...`, {
        allowBorrow,
      });
      const tx = await userMargin.withdraw(collateralMint, size, allowBorrow);

      simplelog.info(
        `Withdrawn ${size} ${token} from vault. \nTransaction Id: ${tx} \nExplorer: ${getTxString(
          tx,
          zoCluster
        )}`
      );
    } catch (e) {
      simplelog.error(`error depositing ${token} to vault. error: ${e}`);
    }
  } else {
    simplelog.error(
      `No Margin Account found. Create Margin account. zo-cli create-margin [options]`
    );
  }
};
