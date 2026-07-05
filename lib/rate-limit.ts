// Shared rate-limit helper.
//
// NOTE: This is an in-memory limiter. On serverless platforms (Vercel) each
// instance keeps its own map, so limits are per-instance and reset on cold
// start. It raises the cost of casual abuse but is NOT a strong guarantee.
// For production-grade limiting, back this with Upstash Redis / Vercel KV and
// swap the implementation of `rateLimit` — call sites do not need to change.

type Bucket = { count: number; resetAt: number };

const stores = new Map<string, Map<string, Bucket>>();

function getStore(namespace: string): Map<string, Bucket> {
  let store = stores.get(namespace);
  if (!store) {
    store = new Map();
    stores.set(namespace, store);
  }
  return store;
}

export interface RateLimitOptions {
  /** Logical bucket name, e.g. "apply", "admin-login". */
  namespace: string;
  /** Max requests allowed within the window. */
  max: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

/** Returns true if the request is allowed, false if the limit is exceeded. */
export function rateLimit(key: string, { namespace, max, windowMs }: RateLimitOptions): boolean {
  const store = getStore(namespace);
  const now = Date.now();
  const entry = store.get(key);
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

/** Best-effort client IP from proxy headers. */
export function getClientIp(headers: Headers): string {
  return headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
}
