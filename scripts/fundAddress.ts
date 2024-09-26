/**
 * fund an address with faucet, arguments: address
 */

import { Address } from "@ton/core";
import { fundingAddress } from "./utils";

const args = process.argv.slice(2);

async function main() {
  const targetAddress = Address.parse(args[0]);

  console.log(`Funding address: ${targetAddress}`);
  await fundingAddress(targetAddress);

  console.log(`Funded successfully`);
}

main().catch(console.error);
