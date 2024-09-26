import { mnemonicToWalletKey } from "@ton/crypto";
import { FAUCET_ENDPOINT, JSONRPC_ENDPOINT } from "./config";
import { Address, TonClient, WalletContractV4 } from "@ton/ton";

export const getWallet = async (mnemonic: string) => {
  const keyPair = await mnemonicToWalletKey(mnemonic.split(" "));
  const publicKey = keyPair.publicKey;
  const secretKey = keyPair.secretKey;
  const contract = WalletContractV4.create({ workchain: 0, publicKey });

  const api = new TonClient({ endpoint: JSONRPC_ENDPOINT });
  const wallet = api.open(contract);
  return {
    wallet,
    publicKey,
    secretKey,
    mnemonic,
  };
};

export const waitForDeploy = async (
  address: Address,
  sleepDuration: number = 2000
) => {
  const api = new TonClient({ endpoint: JSONRPC_ENDPOINT });
  let state = "unknown";
  let attempts = 0;
  while ((await api.getContractState(address)).state !== "active") {
    console.log(`Waiting for contract deployment... ${attempts}`);
    await new Promise((resolve) => setTimeout(resolve, sleepDuration));
    attempts++;
  }
};

export const fundingAddress = async (address: Address) => {
  const result = await fetch(FAUCET_ENDPOINT, {
    method: "POST",
    body: JSON.stringify({ address: address.toString() }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const { code, msg } = (await result.json()) as { code: number; msg: string };
  if (code !== 0) {
    throw new Error(`Error funding wallet: ${msg}`);
  }
};

function getMultiplier(decimals: number): bigint {
  let x = 1n;
  for (let i = 0; i < decimals; i++) {
    x *= 10n;
  }
  return x;
}

export function toUnits(src: string | bigint, decimals: number): bigint {
  const MULTIPLIER = getMultiplier(decimals);

  if (typeof src === "bigint") {
    return src * MULTIPLIER;
  } else {
    // Check sign
    let neg = false;
    while (src.startsWith("-")) {
      neg = !neg;
      src = src.slice(1);
    }

    // Split string
    if (src === ".") {
      throw Error("Invalid number");
    }
    let parts = src.split(".");
    if (parts.length > 2) {
      throw Error("Invalid number");
    }

    // Prepare parts
    let whole = parts[0];
    let frac = parts[1];
    if (!whole) {
      whole = "0";
    }
    if (!frac) {
      frac = "0";
    }
    if (frac.length > decimals) {
      throw Error("Invalid number");
    }
    while (frac.length < decimals) {
      frac += "0";
    }

    // Convert
    let r = BigInt(whole) * MULTIPLIER + BigInt(frac);
    if (neg) {
      r = -r;
    }
    return r;
  }
}

export function fromUnits(src: bigint | string, decimals: number): string {
  const MULTIPLIER = getMultiplier(decimals);

  let v = BigInt(src);
  let neg = false;
  if (v < 0) {
    neg = true;
    v = -v;
  }

  // Convert fraction
  let frac = v % MULTIPLIER;
  let facStr = frac.toString();
  while (facStr.length < decimals) {
    facStr = "0" + facStr;
  }
  facStr = facStr.match(/^([0-9]*[1-9]|0)(0*)/)![1];

  // Convert whole
  let whole = v / MULTIPLIER;
  let wholeStr = whole.toString();

  // Value
  let value = `${wholeStr}${facStr === "0" ? "" : `.${facStr}`}`;
  if (neg) {
    value = "-" + value;
  }

  return value;
}
