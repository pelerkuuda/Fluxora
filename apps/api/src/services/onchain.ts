import { randomUUID } from "node:crypto";
import {
  DEFAULT_PRICING,
  ONCHAIN_DEFAULTS,
  type AccessGrantReceipt,
  type AccessPlan,
  type ContractPaymentQuote,
  type WalletChallenge,
} from "@fluxora/shared";

interface ChallengeRecord extends WalletChallenge {
  consumed: boolean;
}

const PLAN_TO_DEFAULT_AMOUNT: Record<AccessPlan, number> = {
  per_read: DEFAULT_PRICING.PER_READ,
  hourly: DEFAULT_PRICING.HOURLY,
  daily: DEFAULT_PRICING.DAILY,
  monthly: DEFAULT_PRICING.MONTHLY,
};

export class OnchainService {
  private readonly challenges = new Map<string, ChallengeRecord>();

  createChallenge(walletAddress: string, chainType: WalletChallenge["chainType"]): WalletChallenge {
    const challengeId = randomUUID();
    const nonce = randomUUID().replaceAll("-", "");
    const expiresAt = new Date(Date.now() + ONCHAIN_DEFAULTS.CHALLENGE_TTL_MS).toISOString();
    const message = [
      "Fluxora wallet verification",
      `Address: ${walletAddress}`,
      `Chain: ${chainType}`,
      `Nonce: ${nonce}`,
      `Expires: ${expiresAt}`,
    ].join("\n");

    const challenge: ChallengeRecord = {
      challengeId,
      walletAddress,
      chainType,
      nonce,
      message,
      expiresAt,
      consumed: false,
    };

    this.challenges.set(challengeId, challenge);
    return challenge;
  }

  verifyChallenge(challengeId: string, walletAddress: string, signature: string) {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) return { ok: false, reason: "Challenge not found" };
    if (challenge.consumed) return { ok: false, reason: "Challenge already used" };
    if (challenge.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return { ok: false, reason: "Wallet address mismatch" };
    }
    if (new Date(challenge.expiresAt).getTime() < Date.now()) {
      return { ok: false, reason: "Challenge expired" };
    }
    if (!signature || signature.trim().length < 16) {
      return { ok: false, reason: "Signature too short" };
    }

    challenge.consumed = true;
    return { ok: true, chainType: challenge.chainType };
  }

  quoteSubscription(input: {
    sensorId: string;
    plan: AccessPlan;
    recipientAddress: string;
    amount?: number;
  }): ContractPaymentQuote {
    return {
      sensorId: input.sensorId,
      plan: input.plan,
      amount: input.amount ?? PLAN_TO_DEFAULT_AMOUNT[input.plan],
      currency: "USDC",
      recipientAddress: input.recipientAddress,
      moduleAddress: ONCHAIN_DEFAULTS.MODULE_ADDRESS,
      functionName: `${ONCHAIN_DEFAULTS.MODULE_NAME}::${ONCHAIN_DEFAULTS.FUNCTION_SUBSCRIBE}`,
      args: [input.sensorId, input.plan, input.recipientAddress],
    };
  }

  buildReceipt(input: {
    subscriptionId: string;
    sensorId: string;
    buyerAddress: string;
    plan: AccessPlan;
    txHash: string;
    amountPaid: number;
    validUntil: Date;
  }): AccessGrantReceipt {
    return {
      subscriptionId: input.subscriptionId,
      sensorId: input.sensorId,
      buyerAddress: input.buyerAddress,
      plan: input.plan,
      txHash: input.txHash,
      amountPaid: input.amountPaid,
      validUntil: input.validUntil.toISOString(),
      settlementNetwork: ONCHAIN_DEFAULTS.NETWORK,
    };
  }
}

let onchainService: OnchainService | null = null;

export function getOnchainService() {
  if (!onchainService) onchainService = new OnchainService();
  return onchainService;
}
