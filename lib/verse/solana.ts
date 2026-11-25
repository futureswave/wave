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

export interface SignInOrigin {
  /** Host (with port if any), e.g. "vanthverse.com" or "localhost:3000". */
  domain: string;
  /** Full origin, e.g. "https://vanthverse.com". */
  uri: string;
}

const HOST_RE = /^[a-z0-9.-]+(:\d{1,5})?$/i;

/**
 * The origin the wallet will see in the sign-in message. Wallets (Phantom)
 * check that the SIWS domain matches the page requesting the signature, so it
 * must come from the actual request host rather than a hard-coded domain.
 */
export function requestOrigin(headers: Headers): SignInOrigin | null {
  const host = (headers.get("x-forwarded-host") ?? headers.get("host") ?? "").split(",")[0].trim();
  if (!HOST_RE.test(host)) return null;
  const proto = (headers.get("x-forwarded-proto") ?? "").split(",")[0].trim()
    || (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  if (proto !== "http" && proto !== "https") return null;
  return { domain: host, uri: `${proto}://${host}` };
}

/**
 * The exact text the wallet signs, in Sign-In With Solana (SIWS / CAIP-122)
 * format. Wallets parse messages that start with "<domain> wants you to sign
 * in…" strictly: the statement must be a single line and URI / Version /
 * Chain ID / Nonce / Issued At must follow in this order. Rebuilt server-side
 * from stored values on verify.
 */
export function buildSignInMessage(
  wallet: string,
  nonce: string,
  issuedAt: string,
  origin: SignInOrigin,
): string {
  return [
    `${origin.domain} wants you to sign in with your Solana account:`,
    wallet,
    "",
    "Sign in to the VANTH Verse registry. This is not a transaction: it costs nothing and moves no assets.",
    "",
    `URI: ${origin.uri}`,
    "Version: 1",
    "Chain ID: mainnet",
    `Nonce: ${nonce}`,
    `Issued At: ${issuedAt}`,
  ].join("\n");
}
