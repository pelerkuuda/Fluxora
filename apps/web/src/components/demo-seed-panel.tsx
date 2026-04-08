"use client";

import { useState } from "react";
import { demoApi } from "@/lib/api";

export function DemoSeedPanel() {
  const [status, setStatus] = useState("Seed demo sensors and Shelby blobs for presentation mode.");
  const [isLoading, setIsLoading] = useState(false);

  const handleSeed = async () => {
    setIsLoading(true);
    setStatus("Seeding demo data...");
    const response = await demoApi.seed();

    if (response.success && response.data) {
      setStatus(`Seeded sensors: ${response.data.seeded.join(", ")}`);
    } else {
      setStatus(response.error || "Failed to seed demo data");
    }

    setIsLoading(false);
  };

  return (
    <div className="motion-frame border border-border p-6">
      <div className="font-mono text-xs uppercase tracking-[0.22em] text-white/45">Demo mode</div>
      <p className="mt-4 font-mono text-sm leading-7 text-white/60">
        Prime the app with seeded sensors and Shelby-backed preview payloads before the live walkthrough.
      </p>
      <button
        onClick={() => void handleSeed()}
        disabled={isLoading}
        className="motion-button mt-6 inline-flex h-12 items-center justify-center border border-primary px-6 font-mono text-sm uppercase text-primary transition-colors duration-150 ease-out hover:bg-primary hover:text-black disabled:opacity-60"
      >
        [Seed demo data]
      </button>
      <div className="mt-4 border border-border p-4 font-mono text-sm text-white/70">{status}</div>
    </div>
  );
}
