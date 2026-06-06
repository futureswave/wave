import { cookies } from "next/headers";
import { createHmac } from "crypto";

function getSecret(): string {
  return process.env.ADMIN_SECRET ?? "dev-fallback-secret-change-in-prod";
}

export function signAdminToken(): string {
  const payload = Date.now().toString();
  const sig = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return `${payload}.${sig}`;
}

export function verifyAdminToken(token: string): boolean {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", getSecret()).update(payload).digest("hex");
  return sig === expected;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("vanth_admin")?.value;
  if (!token) return false;
  return verifyAdminToken(token);
}
