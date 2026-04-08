export type AccessPlan = "per_read" | "hourly" | "daily" | "monthly";

export interface WalletChallenge {
  challengeId: string;
  walletAddress: string;
  chainType: "ethereum" | "solana" | "aptos";
  message: string;
  nonce: string;
  expiresAt: string;
}

export interface WalletVerificationRequest {
  challengeId: string;
  walletAddress: string;
  chainType: "ethereum" | "solana" | "aptos";
  signature: string;
  displayName?: string;
  role?: "user" | "producer" | "admin";
}

export interface ContractPaymentQuote {
  sensorId: string;
  plan: AccessPlan;
  amount: number;
  currency: "USDC" | "APT";
  recipientAddress: string;
  moduleAddress: string;
  functionName: string;
  args: string[];
}

export interface AccessGrantReceipt {
  subscriptionId: string;
  sensorId: string;
  buyerAddress: string;
  plan: AccessPlan;
  txHash: string;
  amountPaid: number;
  validUntil: string;
  settlementNetwork: string;
}

export interface ShelbyBlobManifest {
  blobName: string;
  merkleRoot: string;
  checksumSha256: string;
  sizeBytes: number;
  contentType: string;
  encoding: "json" | "jsonl";
  createdAt: string;
  storageNetwork: string;
  source: "mock" | "shelby-sdk";
}
