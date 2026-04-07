"use client";

import { useWallet } from "./wallet-provider";

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function ConnectWalletButton() {
  const { session, isLoading, connectWallet, disconnectWallet, isPetraReady } = useWallet();

  if (session) {
    return (
      <div className="flex items-center gap-2">
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-300">
          {shortenAddress(session.walletAddress)}
        </div>
        <button
          onClick={() => void disconnectWallet()}
          className="rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-gray-300 transition hover:bg-white/5"
        >
          Disconnect
        </button>
      </div>
    );
  }

  let label = "Connect Petra";
  if (isLoading) label = "Connecting...";
  else if (!isPetraReady) label = "Install Petra";

  return (
    <button
      onClick={() => void connectWallet()}
      disabled={isLoading}
      title={isPetraReady ? "Connect with Petra" : "Petra not detected, open install page"}
      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {label}
    </button>
  );
}
