import { cookies } from "next/headers";
import { createHmac, randomBytes, scrypt, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "vanth_admin";
export const TOKEN_TTL_MS = 1000 * 60 * 60 * 12; // 12 hours

const MIN_SECRET_LENGTH = 32;

function getSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.length < MIN_SECRET_LENGTH) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        `ADMIN_SECRET is missing or shorter than ${MIN_SECRET_LENGTH} characters. ` +
          "Refusing to run without a strong signing secret.",
      );
    }
    return "dev-fallback-secret-change-in-prod-0000000000";
  }
  return secret;
}

// --- password hashing -------------------------------------------------------
//
// Stored as `scrypt:<log2N>:<r>:<p>:<saltB64url>:<hashB64url>`. Colons, not
// `$`, because Next's dotenv loader expands `$NAME` inside .env values and
// would silently corrupt a `$`-delimited hash.

const SCRYPT = { log2N: 17, r: 8, p: 1, keyLen: 64, saltLen: 16 };

function scryptAsync(
  password: string,
  salt: Buffer,
  keyLen: number,
  opts: { N: number; r: number; p: number },
): Promise<Buffer> {
  // scrypt needs ~128·N·r bytes; raise Node's 32 MB default accordingly.
  const maxmem = 256 * opts.N * opts.r;
  return new Promise((resolve, reject) => {
    scrypt(password, salt, keyLen, { ...opts, maxmem }, (err, key) =>
      err ? reject(err) : resolve(key),
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SCRYPT.saltLen);
  const key = await scryptAsync(password, salt, SCRYPT.keyLen, {
    N: 2 ** SCRYPT.log2N,
    r: SCRYPT.r,
    p: SCRYPT.p,
  });
  return [
    "scrypt",
    SCRYPT.log2N,
    SCRYPT.r,
    SCRYPT.p,
    salt.toString("base64url"),
    key.toString("base64url"),
  ].join(":");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.trim().split(":");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;

  const [, log2N, r, p, saltB64, hashB64] = parts;
  const N = 2 ** Number(log2N);
  const salt = Buffer.from(saltB64, "base64url");
  const expected = Buffer.from(hashB64, "base64url");
  if (!Number.isInteger(Number(log2N)) || Number(log2N) < 14 || Number(log2N) > 20) return false;
  if (!salt.length || !expected.length) return false;

  try {
    const actual = await scryptAsync(password, salt, expected.length, {
      N,
      r: Number(r),
      p: Number(p),
    });
    return timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

// --- session token ----------------------------------------------------------
//
// `<issuedAt>.<nonce>.<hmac>` — the random nonce makes every session token
// unique even when two are issued in the same millisecond.

function sign(payload: string): string {
  return createHmac("sha256", getSecret()).update(payload).digest("base64url");
}

export function signAdminToken(): string {
  const payload = `${Date.now()}.${randomBytes(16).toString("base64url")}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAdminToken(token: string): boolean {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [issued, nonce, sig] = parts;
  if (!issued || !nonce || !sig) return false;

  const sigBuf = Buffer.from(sig);
  const expectedBuf = Buffer.from(sign(`${issued}.${nonce}`));
  if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
    return false;
  }

  const issuedAt = Number(issued);
  const age = Date.now() - issuedAt;
  return Number.isFinite(issuedAt) && age >= 0 && age <= TOKEN_TTL_MS;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}
