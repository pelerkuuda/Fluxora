"use client";

import { useWallet } from "./wallet-provider";

function shortenAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function ConnectWalletButton() {
  const { session, isLoading, connectWallet, disconnectWallet, isPetraReady } = useWallet();

  if (session) {
    return (
      <div className="flex items-center gap-3 border border-border bg-black/80 px-4 py-3 backdrop-blur-sm">
        <div className="font-mono text-xs uppercase text-white/50">{shortenAddress(session.walletAddress)}</div>
        <button
          onClick={() => void disconnectWallet()}
          className="font-mono text-xs uppercase text-primary transition-colors duration-150 ease-out hover:text-primary/80"
        >
          [Disconnect]
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
      className="border border-border bg-black/80 px-4 py-3 font-mono text-xs uppercase text-primary transition-colors duration-150 ease-out hover:border-primary disabled:cursor-not-allowed disabled:opacity-60"
    >
      [{label}]
    </button>
  );
}
