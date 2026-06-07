// Validation functions for whitelist form fields
// Mirrors server-side validation in api/whitelist/submit/route.ts

const EVM_ADDRESS_REGEX = /^0x[0-9a-fA-F]{40}$/;

export function validateEthereumWallet(address: string): string | null {
  const trimmed = address.trim();
  if (!trimmed) return "Wallet address is required.";
  if (!EVM_ADDRESS_REGEX.test(trimmed)) return "Invalid Ethereum wallet address (must start with 0x and be 42 characters).";
  return null;
}

export function validateXHandle(handle: string): string | null {
  const trimmed = handle.trim().replace(/^@/, "");
  if (!trimmed) return "X username is required.";
  if (!/^[A-Za-z0-9_]{1,50}$/.test(trimmed)) return "Invalid X username. Use letters, numbers, underscores only (max 50 chars).";
  return null;
}

export function normalizeXHandle(handle: string): string {
  return handle.trim().replace(/^@/, "");
}

export function validateDiscordHandle(handle: string): string | null {
  const trimmed = handle.trim();
  if (!trimmed) return "Discord username is required.";
  // New format: username (2-32 chars, no discriminator)
  // Legacy format: username#1234
  const newFormat = /^[a-z0-9_.]{2,32}$/;
  const legacyFormat = /^.{2,32}#\d{4}$/;
  if (!newFormat.test(trimmed) && !legacyFormat.test(trimmed)) {
    return "Invalid Discord username format.";
  }
  return null;
}

export function validateEssay(text: string, minLength = 100): string | null {
  if (!text || text.trim().length < minLength) {
    return `Minimum ${minLength} characters required.`;
  }
  return null;
}

export interface WhitelistFormData {
  wallet_address: string;
  twitter_handle: string;
  discord_handle: string;
  ack_magiceden_only: boolean;
}

export interface FormErrors {
  wallet_address?: string;
  twitter_handle?: string;
  discord_handle?: string;
  ack_magiceden_only?: string;
}

export function validateWhitelistForm(data: WhitelistFormData): FormErrors {
  const errors: FormErrors = {};
  const walletErr = validateEthereumWallet(data.wallet_address);
  if (walletErr) errors.wallet_address = walletErr;
  const xErr = validateXHandle(data.twitter_handle);
  if (xErr) errors.twitter_handle = xErr;
  const discordErr = validateDiscordHandle(data.discord_handle);
  if (discordErr) errors.discord_handle = discordErr;
  if (!data.ack_magiceden_only) errors.ack_magiceden_only = "You must acknowledge that minting happens on Magic Eden only.";
  return errors;
}
