import type { Metadata } from "next";
import "./globals.css";
import { AptosWalletProvider } from "@/components/aptos-wallet-provider";
import { WalletProvider } from "@/components/wallet-provider";
import { ConnectWalletButton } from "@/components/connect-wallet-button";

export const metadata: Metadata = {
  title: "Fluxora — Decentralized Sensor Data Marketplace",
  description: "A Shelby-powered marketplace for verified machine and sensor data.",
  openGraph: {
    title: "Fluxora",
    description: "A Shelby-powered marketplace for verified machine and sensor data.",
    type: "website",
  },
};

const navItems = [
  ["Index", "/"],
  ["Marketplace", "/marketplace"],
  ["Explore", "/explore"],
  ["Dashboard", "/dashboard"],
] as const;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <AptosWalletProvider>
          <WalletProvider>
            <div className="fixed left-0 top-0 z-50 w-full pt-6 md:pt-8">
              <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <a href="/" className="text-left">
                  <div className="text-2xl tracking-[-0.05em] text-white">Fluxora</div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/45">Signal market</div>
                </a>

                <nav className="hidden items-center justify-center border border-border bg-black/80 px-5 py-3 backdrop-blur-sm lg:flex">
                  <div className="flex items-center gap-x-8">
                    {navItems.map(([label, href]) => (
                      <a
                        key={href}
                        href={href}
                        className="font-mono text-sm uppercase text-white/60 transition-colors duration-150 ease-out hover:text-white"
                      >
                        {label}
                      </a>
                    ))}
                  </div>
                </nav>

                <ConnectWalletButton />
              </header>
            </div>

            <main>{children}</main>
          </WalletProvider>
        </AptosWalletProvider>
      </body>
    </html>
  );
}
