/**
 * Generate TON wallet v4 and save it to .env file
 */

import { mnemonicToWalletKey, mnemonicNew } from "@ton/crypto";
import { WalletContractV4 } from "@ton/ton";
import { writeFileSync, existsSync } from "fs";

const writeEnv = async (mnemonic: string[]) => {
  if (existsSync(".env")) {
    throw new Error("File .env already exists");
  }
  const keyPair = await mnemonicToWalletKey(mnemonic);
  const publicKey = keyPair.publicKey;
  const contract = WalletContractV4.create({ workchain: 0, publicKey });
  const content = `WALLET_VERSION="v4"\nWALLET_MNEMONIC="${mnemonic.join(
    " "
  )}"\nWALLET_ADDRESS="${contract.address.toString()}"`;
  writeFileSync(".env", content);
};

async function main() {
  const mnemonic = await mnemonicNew();
  await writeEnv(mnemonic);
}

main().catch(console.error);
