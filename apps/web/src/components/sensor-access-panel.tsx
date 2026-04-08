"use client";

import { useMemo, useState } from "react";
import type { AccessPlan, ContractPaymentQuote } from "@fluxora/shared";
import { marketplaceApi, onchainApi } from "@/lib/api";
import { useWallet } from "./wallet-provider";

const PLAN_OPTIONS: { label: string; value: AccessPlan }[] = [
  { label: "Per read", value: "per_read" },
  { label: "Hourly", value: "hourly" },
  { label: "Daily", value: "daily" },
  { label: "Monthly", value: "monthly" },
];

interface SensorAccessPanelProps {
  sensorId: string;
}

export function SensorAccessPanel({ sensorId }: SensorAccessPanelProps) {
  const { session, connectWallet, isLoading } = useWallet();
  const [selectedPlan, setSelectedPlan] = useState<AccessPlan>("daily");
  const [quote, setQuote] = useState<ContractPaymentQuote | null>(null);
  const [preview, setPreview] = useState<Record<string, unknown>[]>([]);
  const [message, setMessage] = useState<string>("Request a quote to simulate on-chain access.");
  const [isWorking, setIsWorking] = useState(false);

  const canAct = useMemo(() => Boolean(session?.walletAddress), [session?.walletAddress]);

  const requestQuote = async () => {
    if (!session?.walletAddress) {
      setMessage("Connect wallet dulu buat request quote.");
      return;
    }

    setIsWorking(true);
    setMessage("Building payment quote...");

    const response = await onchainApi.quote({ sensorId, plan: selectedPlan });
    if (response.success && response.data) {
      setQuote(response.data);
      setMessage(`Quote ready, ${response.data.amount} ${response.data.currency} via ${response.data.functionName}`);
    } else {
      setMessage(response.error || "Failed to get quote");
    }

    setIsWorking(false);
  };

  const settleAndFetch = async () => {
    if (!session?.walletAddress) {
      setMessage("Connect wallet dulu buat settle access.");
      return;
    }

    if (!quote) {
      setMessage("Request quote dulu sebelum settle.");
      return;
    }

    setIsWorking(true);
    setMessage("Recording on-chain settlement...");

    const txHash = `0xfluxora${Date.now().toString(16)}`;
    const settle = await onchainApi.settle({
      sensorId,
      plan: selectedPlan,
      txHash,
      buyerAddress: session.walletAddress,
      amountPaid: quote.amount,
    });

    if (!settle.success) {
      setMessage(settle.error || "Failed to settle access");
      setIsWorking(false);
      return;
    }

    setMessage("Settlement recorded, loading Shelby preview...");
    const data = await marketplaceApi.getData(sensorId, session.walletAddress);

    if (data.success && data.data) {
      const blobs = (data.data as { blobs?: Array<{ preview?: Record<string, unknown>[] }> }).blobs ?? [];
      const flattened = blobs.flatMap((blob) => blob.preview ?? []);
      setPreview(flattened.slice(0, 6));
      setMessage(`Access granted. Loaded ${flattened.length} preview rows from Shelby-backed blobs.`);
    } else {
      setMessage(data.error || "Settlement recorded, but preview fetch failed.");
    }

    setIsWorking(false);
  };

  return (
    <div className="motion-frame border border-border p-6">
      <div className="font-mono text-xs uppercase tracking-[0.22em] text-white/45">Live access flow</div>
      <p className="mt-4 font-mono text-sm leading-7 text-white/60">
        Demo the Phase 2-3 path, request a quote, settle access, and fetch preview rows from stored Shelby manifests.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {PLAN_OPTIONS.map((plan) => (
          <button
            key={plan.value}
            onClick={() => setSelectedPlan(plan.value)}
            className={`motion-button border px-4 py-3 text-left font-mono text-sm uppercase transition-colors ${
              selectedPlan === plan.value ? "border-primary text-primary" : "border-border text-white/70"
            }`}
          >
            {plan.label}
          </button>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {!canAct ? (
          <button
            onClick={() => void connectWallet()}
            disabled={isLoading || isWorking}
            className="motion-button inline-flex h-12 items-center justify-center border border-primary px-6 font-mono text-sm uppercase text-primary transition-colors duration-150 ease-out hover:bg-primary hover:text-black disabled:opacity-60"
          >
            [Connect wallet]
          </button>
        ) : (
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => void requestQuote()}
              disabled={isWorking}
              className="motion-button inline-flex h-12 items-center justify-center border border-border px-6 font-mono text-sm uppercase text-white transition-colors duration-150 ease-out hover:border-primary hover:text-primary disabled:opacity-60"
            >
              [Request quote]
            </button>
            <button
              onClick={() => void settleAndFetch()}
              disabled={isWorking || !quote}
              className="motion-button inline-flex h-12 items-center justify-center border border-primary px-6 font-mono text-sm uppercase text-primary transition-colors duration-150 ease-out hover:bg-primary hover:text-black disabled:opacity-60"
            >
              [Settle + fetch]
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 border border-border p-4 font-mono text-sm text-white/70">
        <div className="text-white/45">Status</div>
        <div className="mt-2">{message}</div>
      </div>

      {quote ? (
        <div className="mt-4 border border-border p-4 font-mono text-sm text-white/70">
          <div className="text-white/45">Current quote</div>
          <div className="mt-2">{quote.amount} {quote.currency}</div>
          <div className="mt-1 text-white/45">{quote.functionName}</div>
        </div>
      ) : null}

      {preview.length > 0 ? (
        <div className="mt-4 space-y-3">
          {preview.map((row, index) => (
            <div key={index} className="motion-card border border-border px-4 py-3 font-mono text-xs text-white/70">
              <pre className="overflow-x-auto whitespace-pre-wrap">{JSON.stringify(row, null, 2)}</pre>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
