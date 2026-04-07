"use client";

import { useEffect, useState } from "react";
import { sensorsApi } from "@/lib/api";
import { useWallet } from "./wallet-provider";

interface DashboardSensor {
  id: string;
  name: string;
  type: string;
  status: string;
  pricingDaily: number;
}

const operatorStats = [
  ["batch interval", "5 min"],
  ["default storage", "100 epochs"],
  ["revenue share", "95 / 3 / 2"],
];

export function DashboardClient() {
  const { session } = useWallet();
  const [mySensors, setMySensors] = useState<DashboardSensor[]>([]);

  useEffect(() => {
    const loadSensors = async () => {
      if (!session?.walletAddress) return;
      const response = await sensorsApi.list({ owner: "me", limit: 20 }, session.walletAddress);
      if (response.success && Array.isArray(response.data)) {
        setMySensors(response.data as DashboardSensor[]);
      }
    };

    void loadSensors();
  }, [session?.walletAddress]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-3xl border border-white/10 bg-[#07111b] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="text-[11px] uppercase tracking-[0.28em] text-[#7e97b0]">dashboard / producer operator panel</div>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.04] tracking-[-0.05em] text-white sm:text-6xl lg:text-[70px]">
          Manage ingestion, pricing, and blob-backed inventory.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[#9db0c3]">
          A more protocol-faithful control surface for monitoring your streams, checking status, and tuning access.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {operatorStats.map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-[#0a1622] p-4">
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#6f8aa4]">{label}</div>
              <div className="mt-2 text-xl text-white">{value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8 space-y-4">
        {mySensors.length > 0 ? (
          mySensors.map((sensor) => (
            <a
              key={sensor.id}
              href={`/sensor/${sensor.id}`}
              className="block rounded-2xl border border-white/10 bg-[#08111a] p-6 transition hover:border-[#27537a] hover:bg-[#0b1723]"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[#7e97b0]">{sensor.type}</div>
                  <h2 className="mt-3 text-3xl tracking-[-0.03em] text-white">{sensor.name}</h2>
                  <div className="mt-3 text-sm leading-7 text-[#97abc0]">status = {sensor.status}</div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:text-right">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[#6f8aa4]">daily price</div>
                    <div className="mt-1 text-2xl text-white">${Number(sensor.pricingDaily).toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[#6f8aa4]">action</div>
                    <div className="mt-1 text-sm text-[#dce8f5]">inspect stream</div>
                  </div>
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="rounded-2xl border border-white/10 bg-[#08111a] p-10 text-center text-[#97abc0]">
            {session ? "Belum ada sensor untuk wallet ini." : "Connect wallet dulu buat buka producer panel."}
          </div>
        )}
      </section>
    </div>
  );
}
