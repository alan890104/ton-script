/**
 * Generate TON wallet v4 and save it to .env file
 */

import { internal, toNano } from "@ton/ton";
import { fromUnits, fundingAddress, getWallet, toUnits, waitForDeploy } from "./utils";
import * as dotenv from "dotenv";
dotenv.config();

async function main() {
  const mnemonic = process.env.WALLET_MNEMONIC as string;
  if (!mnemonic) {
    throw new Error("WALLET_MNEMONIC not found in .env file");
  }
  const { wallet, secretKey } = await getWallet(mnemonic);
  const walletAddress = wallet.address;
  const walletSeqno = await wallet.getSeqno();

  // fund wallet
  console.log(`Funding wallet: ${walletAddress}`);
  await fundingAddress(walletAddress);

  // sleep for a while to wait for funds
  console.log("Waiting for funds...");
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // deploy wallet
  console.log(`Deploying wallet: ${walletAddress}`);
  await wallet.sendTransfer({
    seqno: walletSeqno,
    secretKey,
    messages: [internal({ to: wallet.address, value: toNano("1") })],
  });

  await waitForDeploy(walletAddress);

  // check wallet balance
  const walletBalance = await wallet.getBalance();
  console.log(
    `Wallet successfully deployed, wallet balance: ${fromUnits(
      walletBalance,
      9
    )} TON`
  );
}

main().catch(console.error);
