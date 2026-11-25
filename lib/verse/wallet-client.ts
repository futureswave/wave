// Minimal browser-side Solana wallet access (Phantom, Solflare, Backpack) via
// their injected providers. We only ever ask for `connect` and `signMessage`:
// never a transaction, never a seed phrase.

type PublicKeyLike = { toString(): string };

export interface InjectedWallet {
  publicKey?: PublicKeyLike | null;
  connect(): Promise<{ publicKey?: PublicKeyLike } | void>;
  disconnect(): Promise<void>;
  signMessage(message: Uint8Array, display?: "utf8"): Promise<{ signature: Uint8Array } | Uint8Array>;
}

export type WalletId = "phantom" | "solflare" | "backpack";

export const WALLETS: { id: WalletId; name: string; url: string }[] = [
  { id: "phantom", name: "Phantom", url: "https://phantom.com/download" },
  { id: "solflare", name: "Solflare", url: "https://solflare.com/download" },
  { id: "backpack", name: "Backpack", url: "https://backpack.app/download" },
];

type WalletWindow = {
  phantom?: { solana?: InjectedWallet & { isPhantom?: boolean } };
  solana?: InjectedWallet & { isPhantom?: boolean };
  solflare?: InjectedWallet & { isSolflare?: boolean };
  backpack?: InjectedWallet;
};

export function getWallet(id: WalletId): InjectedWallet | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as WalletWindow;
  if (id === "phantom") return w.phantom?.solana ?? (w.solana?.isPhantom ? w.solana : null) ?? null;
  if (id === "solflare") return w.solflare?.isSolflare ? w.solflare : null;
  return w.backpack ?? null;
}

function toBase64(bytes: Uint8Array): string {
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin);
}

/** Connect → fetch challenge → sign message → server verifies and sets the session cookie. */
export async function signInWithWallet(id: WalletId): Promise<void> {
  const provider = getWallet(id);
  if (!provider) throw new Error("WALLET_NOT_FOUND");

  const res = await provider.connect();
  const pk = (res && "publicKey" in res ? res.publicKey : null) ?? provider.publicKey;
  if (!pk) throw new Error("Wallet did not share a public key.");
  const wallet = pk.toString();

  const nonceRes = await fetch("/api/verse/auth/nonce", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet }),
  });
  const challenge = await nonceRes.json();
  if (!nonceRes.ok) throw new Error(challenge.error ?? "Could not start sign-in.");

  const signed = await provider.signMessage(new TextEncoder().encode(challenge.message), "utf8");
  const signature = signed instanceof Uint8Array ? signed : signed.signature;

  const verifyRes = await fetch("/api/verse/auth/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ wallet, nonce: challenge.nonce, signature: toBase64(signature) }),
  });
  const result = await verifyRes.json();
  if (!verifyRes.ok) throw new Error(result.error ?? "Sign-in failed.");
}

export async function signOutWallet(): Promise<void> {
  await fetch("/api/verse/auth", { method: "DELETE" });
  for (const { id } of WALLETS) {
    try {
      await getWallet(id)?.disconnect();
    } catch {
      // provider already disconnected
    }
  }
}
