// Generates a strong admin password and the values the server needs to check it.
//
//   node scripts/hash-admin-password.mjs            # print only
//   node scripts/hash-admin-password.mjs --write    # also update .env.local
//
// The plain password is printed ONCE and never written to disk. Only its
// scrypt hash (ADMIN_PASSWORD_HASH) and a fresh session signing secret
// (ADMIN_SECRET) are stored. Rotating ADMIN_SECRET signs every admin out.
//
// The hash format must stay in sync with hashPassword() in lib/admin-auth.ts.

import { randomBytes, scrypt } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const SCRYPT = { log2N: 17, r: 8, p: 1, keyLen: 64, saltLen: 16 };

function hash(password) {
  const salt = randomBytes(SCRYPT.saltLen);
  const N = 2 ** SCRYPT.log2N;
  return new Promise((resolve, reject) => {
    scrypt(
      password,
      salt,
      SCRYPT.keyLen,
      { N, r: SCRYPT.r, p: SCRYPT.p, maxmem: 256 * N * SCRYPT.r },
      (err, key) =>
        err
          ? reject(err)
          : resolve(
              ["scrypt", SCRYPT.log2N, SCRYPT.r, SCRYPT.p, salt.toString("base64url"), key.toString("base64url")].join(":"),
            ),
    );
  });
}

/** Replaces (or appends) KEY=value lines and drops the keys in `remove`. */
function updateEnv(file, values, remove) {
  const lines = existsSync(file) ? readFileSync(file, "utf8").split(/\r?\n/) : [];
  const pending = new Map(Object.entries(values));
  const out = [];
  for (const line of lines) {
    const key = line.match(/^\s*([A-Z0-9_]+)\s*=/)?.[1];
    if (key && remove.includes(key)) continue;
    if (key && pending.has(key)) {
      out.push(`${key}=${pending.get(key)}`);
      pending.delete(key);
      continue;
    }
    out.push(line);
  }
  while (out.length && out[out.length - 1] === "") out.pop();
  for (const [key, value] of pending) out.push(`${key}=${value}`);
  writeFileSync(file, out.join("\n") + "\n", "utf8");
}

const password = randomBytes(24).toString("base64url"); // 32 chars, 192 bits
const passwordHash = await hash(password);
const secret = randomBytes(64).toString("base64url");

console.log("\nNEW ADMIN PASSWORD (shown once — store it in a password manager):\n");
console.log(`  ${password}\n`);
console.log(`ADMIN_PASSWORD_HASH=${passwordHash}`);
console.log(`ADMIN_SECRET=${secret}\n`);

if (process.argv.includes("--write")) {
  const envFile = path.resolve(import.meta.dirname, "..", ".env.local");
  updateEnv(envFile, { ADMIN_PASSWORD_HASH: passwordHash, ADMIN_SECRET: secret }, ["ADMIN_PASSWORD"]);
  console.log(`Updated ${path.relative(process.cwd(), envFile)} (ADMIN_PASSWORD removed).`);
}
console.log("Set the same ADMIN_PASSWORD_HASH and ADMIN_SECRET in Vercel → Settings → Environment Variables.\n");
