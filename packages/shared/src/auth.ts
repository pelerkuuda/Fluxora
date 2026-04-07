export type SupportedChain = "ethereum" | "solana" | "aptos";

export interface WalletSession {
  userId: string;
  walletAddress: string;
  chainType: SupportedChain;
  role: "user" | "producer" | "admin";
  displayName?: string | null;
  avatar?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data?: WalletSession;
  error?: string;
  message?: string;
}
