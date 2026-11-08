import { readFile } from "node:fs/promises";
import path from "node:path";
import { isAdminAuthenticated } from "@/lib/admin-auth";

// Serves the unreleased trait artwork in private/traits to signed-in admins
// only. Anyone else gets the same 404 a missing file would, so the route does
// not even confirm that it exists.

export const dynamic = "force-dynamic";

const ROOT = path.join(process.cwd(), "private", "traits");

/** Segments may contain letters, digits, spaces and a few punctuation marks. */
const SAFE_SEGMENT = /^[\p{L}\p{N} _\-()'.,&+]+$/u;

function notFound() {
  return new Response("Not found", {
    status: 404,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  if (!(await isAdminAuthenticated())) return notFound();

  const { path: segments } = await params;
  if (!Array.isArray(segments) || segments.length === 0 || segments.length > 5) {
    return notFound();
  }

  // Next.js hands us decoded segments; reject anything that could climb out of
  // ROOT or smuggle a separator.
  for (const segment of segments) {
    if (
      !segment ||
      segment === "." ||
      segment === ".." ||
      segment.includes("/") ||
      segment.includes("\\") ||
      segment.includes("\0") ||
      !SAFE_SEGMENT.test(segment)
    ) {
      return notFound();
    }
  }
  if (!segments[segments.length - 1].toLowerCase().endsWith(".webp")) return notFound();

  const file = path.resolve(ROOT, ...segments);
  if (!file.startsWith(ROOT + path.sep)) return notFound();

  let body: Buffer;
  try {
    body = await readFile(file);
  } catch {
    return notFound();
  }

  return new Response(new Uint8Array(body), {
    status: 200,
    headers: {
      "Content-Type": "image/webp",
      "Content-Length": String(body.length),
      "Cache-Control": "private, no-store, max-age=0",
      "X-Robots-Tag": "noindex, nofollow",
      "X-Content-Type-Options": "nosniff",
      "Cross-Origin-Resource-Policy": "same-origin",
    },
  });
}
