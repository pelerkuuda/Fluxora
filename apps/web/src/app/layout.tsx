import type { Metadata } from "next";
import "./globals.css";
import { AptosWalletProvider } from "@/components/aptos-wallet-provider";
import { WalletProvider } from "@/components/wallet-provider";
import { ConnectWalletButton } from "@/components/connect-wallet-button";

export const metadata: Metadata = {
  title: "Fluxora — Shelby-native IoT Data Marketplace",
  description:
    "Store, verify, and monetize real-time IoT sensor streams with Shelby-backed blobs and Aptos settlement.",
  keywords: ["IoT", "sensor", "data marketplace", "Shelby", "blob storage", "Aptos"],
  openGraph: {
    title: "Fluxora",
    description: "Shelby-native IoT Data Marketplace",
    type: "website",
  },
};

const navItems = [
  ["Overview", "/"],
  ["Marketplace", "/marketplace"],
  ["Dashboard", "/dashboard"],
  ["Sample Stream", "/sensor/sensor-001"],
] as const;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#050b12] text-[#f5f9ff] antialiased">
        <AptosWalletProvider>
          <WalletProvider>
            <div className="relative min-h-screen overflow-hidden">
              <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#07111b]/92 backdrop-blur-xl">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                  <a href="/" className="flex items-center gap-4 text-white">
                    <div className="grid grid-cols-3 gap-1">
                      <span className="block h-2.5 w-2.5 rounded-sm bg-[#4cc2ff]" />
                      <span className="block h-2.5 w-2.5 rounded-sm bg-[#8fd7ff]" />
                      <span className="block h-2.5 w-2.5 rounded-sm bg-white" />
                      <span className="block h-2.5 w-2.5 rounded-sm bg-[#245680]" />
                      <span className="block h-2.5 w-2.5 rounded-sm bg-[#4cc2ff]" />
                      <span className="block h-2.5 w-2.5 rounded-sm bg-[#8fd7ff]" />
                    </div>
                    <div>
                      <div className="text-2xl font-semibold tracking-[-0.04em]">Fluxora</div>
                      <div className="mt-0.5 text-[10px] uppercase tracking-[0.34em] text-[#7e97b0]">Protocol-facing UI</div>
                    </div>
                  </a>

                  <div className="hidden items-center gap-6 md:flex">
                    {navItems.map(([label, href]) => (
                      <a
                        key={href}
                        href={href}
                        className="text-xs uppercase tracking-[0.22em] text-[#c7d8ea] transition hover:text-white"
                      >
                        {label}
                      </a>
                    ))}
                  </div>

                  <ConnectWalletButton />
                </div>
              </nav>

              <main>{children}</main>
            </div>
          </WalletProvider>
        </AptosWalletProvider>
      </body>
    </html>
  );
}
