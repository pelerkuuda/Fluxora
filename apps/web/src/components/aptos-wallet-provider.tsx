"use client";

import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const aptos = new Aptos(aptosConfig);

export function AptosWalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <AptosWalletAdapterProvider
      autoConnect
      dappConfig={{
        network: Network.TESTNET,
        aptosApiKeys: {
          testnet: process.env.NEXT_PUBLIC_APTOS_API_KEY,
        },
        aptosConnect: {
          dappId: process.env.NEXT_PUBLIC_APTOS_DAPP_ID || "fluxora",
        },
      }}
      onError={(error) => {
        console.error("[AptosWallet]", error);
      }}
    >
      {children}
    </AptosWalletAdapterProvider>
  );
}

export { aptos };
