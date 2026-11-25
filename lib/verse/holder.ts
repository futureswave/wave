import "server-only";

// On-chain VANTH ownership check through Helius DAS (read-only, no signing).
// Disabled until both env vars are set — the collection has not minted yet.

export function holderCheckEnabled(): boolean {
  return Boolean(process.env.HELIUS_API_KEY && process.env.VANTH_COLLECTION_ADDRESS);
}

export function collectionAddress(): string | null {
  return process.env.VANTH_COLLECTION_ADDRESS ?? null;
}

interface DasAsset {
  grouping?: { group_key: string; group_value: string }[];
  burnt?: boolean;
}

export async function countVanthHeld(wallet: string): Promise<number> {
  const apiKey = process.env.HELIUS_API_KEY;
  const collection = process.env.VANTH_COLLECTION_ADDRESS;
  if (!apiKey || !collection) throw new Error("HOLDER_CHECK_DISABLED");

  let held = 0;
  // Hard page cap so a huge wallet cannot keep the function busy.
  for (let page = 1; page <= 10; page++) {
    const res = await fetch(`https://mainnet.helius-rpc.com/?api-key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: "vanth-holder",
        method: "getAssetsByOwner",
        params: { ownerAddress: wallet, page, limit: 1000 },
      }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`Helius ${res.status}`);
    const json = (await res.json()) as { result?: { items: DasAsset[] } };
    const items = json.result?.items ?? [];
    held += items.filter(
      (a) => !a.burnt && a.grouping?.some((g) => g.group_key === "collection" && g.group_value === collection),
    ).length;
    if (items.length < 1000) break;
  }
  return held;
}
