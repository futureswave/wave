import "server-only";
import { createPublicKey, verify } from "crypto";

const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
const MAP = new Map([...ALPHABET].map((c, i) => [c, i]));

export function base58Decode(input: string): Uint8Array | null {
  const bytes: number[] = [];
  for (const ch of input) {
    const value = MAP.get(ch);
    if (value === undefined) return null;
    let carry = value;
    for (let i = 0; i < bytes.length; i++) {
      carry += bytes[i] * 58;
      bytes[i] = carry & 0xff;
      carry >>= 8;
    }
    while (carry > 0) {
      bytes.push(carry & 0xff);
      carry >>= 8;
    }
  }
  for (const ch of input) {
    if (ch !== "1") break;
    bytes.push(0);
  }
  return Uint8Array.from(bytes.reverse());
}

// DER prefix of an Ed25519 SubjectPublicKeyInfo; the raw 32-byte key follows.
const ED25519_SPKI_PREFIX = Buffer.from("302a300506032b6570032100", "hex");

/** Verifies an Ed25519 signature made by a Solana wallet over `message`. */
export function verifySolanaSignature(wallet: string, message: string, signature: Uint8Array): boolean {
  const pub = base58Decode(wallet);
  if (!pub || pub.length !== 32 || signature.length !== 64) return false;
  try {
    const key = createPublicKey({
      key: Buffer.concat([ED25519_SPKI_PREFIX, Buffer.from(pub)]),
      format: "der",
      type: "spki",
    });
    return verify(null, Buffer.from(message, "utf8"), key, Buffer.from(signature));
  } catch {
    return false;
  }
}

/** The exact text the wallet signs. Rebuilt server-side from stored values. */
export function buildSignInMessage(wallet: string, nonce: string, issuedAt: string): string {
  return [
    "vanthverse.com wants you to sign in with your Solana account:",
    wallet,
    "",
    "Sign in to the VANTH Verse registry.",
    "This is NOT a transaction: it costs nothing and moves no assets.",
    "VANTH will never ask for your seed phrase or private key.",
    "",
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt}`,
  ].join("\n");
}
