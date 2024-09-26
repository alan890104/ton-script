/**
 * Generate TON wallet v4 and save it to .env file
 */

import { Address, TonClient } from "@ton/ton";
import { fromUnits } from "./utils";

import { JSONRPC_ENDPOINT } from "./config";

const args = process.argv.slice(2);

async function main() {
  const address = Address.parse(args[0]);
  const api = new TonClient({ endpoint: JSONRPC_ENDPOINT });
  const balance = await api.getBalance(address);
  console.log(`Balance of ${address.toString()}: ${fromUnits(balance, 9)} TON`);
}

main().catch(console.error);
