import type { Metadata } from "next";
import "./globals.css";
import { AptosWalletProvider } from "@/components/aptos-wallet-provider";
import { WalletProvider } from "@/components/wallet-provider";
import { ConnectWalletButton } from "@/components/connect-wallet-button";

export const metadata: Metadata = {
  title: "Fluxora — Decentralized IoT Data Marketplace",
  description:
    "Buy and sell real-time IoT sensor data on Shelby Protocol. Temperature, air quality, traffic, and more.",
  keywords: ["IoT", "sensor", "data marketplace", "Shelby", "decentralized", "DePIN"],
  openGraph: {
    title: "Fluxora",
    description: "Decentralized IoT Data Marketplace on Shelby Protocol",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#050816] text-white antialiased">
        <AptosWalletProvider>
          <WalletProvider>
            <div className="relative min-h-screen overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.14),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_20%)]" />
              <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:72px_72px]" />

              <nav className="sticky top-0 z-50 px-4 pt-4 sm:px-6 lg:px-8">
                <div className="mx-auto flex max-w-7xl items-center justify-between rounded-[28px] border border-white/8 bg-[#050816]/78 px-5 py-4 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-2xl">
                  <a href="/" className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-lg shadow-[0_0_40px_rgba(34,211,238,0.16)]">
                      🌊
                    </div>
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/65">Fluxora</div>
                      <div className="text-base font-semibold tracking-[0.18em] text-white/90">SIGNAL MARKET</div>
                    </div>
                  </a>

                  <div className="hidden items-center gap-2 md:flex">
                    {[
                      ["Marketplace", "/marketplace"],
                      ["Explore", "/explore"],
                      ["Dashboard", "/dashboard"],
                    ].map(([label, href]) => (
                      <a
                        key={href}
                        href={href}
                        className="rounded-full border border-transparent px-4 py-2 text-sm text-white/55 transition hover:border-white/10 hover:bg-white/5 hover:text-white"
                      >
                        {label}
                      </a>
                    ))}
                    <div className="ml-3 rounded-full border border-white/8 bg-white/[0.03] p-1">
                      <ConnectWalletButton />
                    </div>
                  </div>
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
