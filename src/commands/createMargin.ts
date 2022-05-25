import { Commitment } from "@solana/web3.js";
import { Margin } from "@zero_one/client";
import { loadClient } from "../helpers";
import { simplelog } from "../logger";
import { CliCreateMarginArg } from "../types";

export const cliCreateMargin = async ({
  cluster,
  keypair,
  commitment,
  endpoint,
}: CliCreateMarginArg) => {
  const { zoProgram, zoState, marginExist, marginKey } = await loadClient(
    cluster,
    keypair,
    commitment,
    endpoint
  );

  if (marginExist) {
    simplelog.info(`Margin already exist. Margin Key: ${marginKey.toBase58()}`);
  } else {
    try {
      const margin = await Margin.create(zoProgram, zoState, commitment);

      simplelog.info(`Margin created. Margin Key: ${margin.pubkey.toBase58()}`);
    } catch (e) {
      simplelog.error(`margin not created. Error: ${e}`);
    }
  }
};
