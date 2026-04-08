"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useWallet as useAptosWallet } from "@aptos-labs/wallet-adapter-react";
import type { WalletSession } from "@fluxora/shared";
import { authApi } from "@/lib/api";
import { createDemoSignature } from "@/lib/wallet-signature";

interface WalletContextValue {
  session: WalletSession | null;
  isLoading: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  isPetraReady: boolean;
}

const WalletContext = createContext<WalletContextValue | undefined>(undefined);
const STORAGE_KEY = "fluxora.wallet.session";

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { account, connected, connect, disconnect, wallets } = useAptosWallet();
  const [session, setSession] = useState<WalletSession | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isBooting, setIsBooting] = useState(true);

  const isPetraReady = wallets.some((wallet) => wallet.name.toLowerCase().includes("petra"));
  const isLoading = isBooting || isConnecting;

  useEffect(() => {
    const restoreSession = async () => {
      if (connected) {
        setIsBooting(false);
        return;
      }

      const saved = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (!saved) {
        setIsBooting(false);
        return;
      }

      try {
        const parsed = JSON.parse(saved) as WalletSession;
        const response = await authApi.me(parsed.walletAddress);

        if (response.success && response.data) {
          setSession(response.data);
        } else {
          window.localStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsBooting(false);
      }
    };

    void restoreSession();
  }, [connected]);

  useEffect(() => {
    const syncSession = async () => {
      if (!connected || !account?.address) {
        setSession(null);
        if (typeof window !== "undefined") {
          window.localStorage.removeItem(STORAGE_KEY);
        }
        setIsConnecting(false);
        setIsBooting(false);
        return;
      }

      try {
        const walletAddress = account.address.toString();
        const challenge = await authApi.challenge({
          walletAddress,
          chainType: "aptos",
        });

        let response;
        if (challenge.success && challenge.data) {
          const signature = await createDemoSignature(challenge.data.message, walletAddress);
          response = await authApi.verify({
            challengeId: challenge.data.challengeId,
            walletAddress,
            chainType: "aptos",
            signature,
            role: "producer",
            displayName: "Petra User",
          });
        } else {
          response = await authApi.connect({
            walletAddress,
            chainType: "aptos",
            role: "producer",
            displayName: "Petra User",
          });
        }

        if (response.success && response.data) {
          setSession(response.data);
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(response.data));
        }
      } finally {
        setIsConnecting(false);
        setIsBooting(false);
      }
    };

    void syncSession();
  }, [connected, account?.address]);

  const connectWallet = async () => {
    const petraWallet = wallets.find((wallet) => wallet.name.toLowerCase().includes("petra"));

    if (!petraWallet) {
      window.open("https://petra.app/", "_blank", "noopener,noreferrer");
      return;
    }

    setIsConnecting(true);

    try {
      await connect(petraWallet.name);
    } catch (error) {
      console.error("[WalletProvider] Failed to connect Petra", error);
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
    } finally {
      setSession(null);
      setIsConnecting(false);
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  const value = useMemo(
    () => ({ session, isLoading, connectWallet, disconnectWallet, isPetraReady }),
    [session, isLoading, isPetraReady]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function useWallet() {
  const context = useContext(WalletContext);

  if (!context) {
    throw new Error("useWallet must be used inside WalletProvider");
  }

  return context;
}
