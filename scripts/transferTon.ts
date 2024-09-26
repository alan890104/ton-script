/**
 * Generate TON wallet v4 and save it to .env file
 */

import { Address, internal, toNano } from "@ton/ton";
import {
  fromUnits,
  fundingAddress,
  getWallet,
  toUnits,
  waitForDeploy,
} from "./utils";
import * as dotenv from "dotenv";
dotenv.config();

const args = process.argv.slice(2);

async function main() {
  const mnemonic = process.env.WALLET_MNEMONIC as string;
  if (!mnemonic) {
    throw new Error("WALLET_MNEMONIC not found in .env file");
  }

  const transferAmount = toUnits(args[0], 9);
  const transferTarget = Address.parse(args[1]);

  const { wallet, secretKey } = await getWallet(mnemonic);
  const walletSeqno = await wallet.getSeqno();
  const balance = await wallet.getBalance();

  if (balance < transferAmount) {
    throw new Error(
      `Insufficient balance: ${fromUnits(
        balance,
        9
      )} TON, required: ${fromUnits(transferAmount, 9)} TON`
    );
  }

  console.log(
    `Transferring ${fromUnits(
      transferAmount,
      9
    )} TON to ${transferTarget.toString()}`
  );
  await wallet.sendTransfer({
    seqno: walletSeqno,
    secretKey,
    messages: [internal({ to: transferTarget, value: transferAmount })],
  });
}

main().catch(console.error);
