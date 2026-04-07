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
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-36 sm:px-6 lg:px-8">
      <div className="section-reveal text-center">
        <div className="font-mono text-xs uppercase tracking-[0.24em] text-white/45">DASHBOARD</div>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl">Operate your sensor portfolio.</h1>
        <p className="mx-auto mt-6 max-w-[560px] font-mono text-sm leading-7 text-white/60 sm:text-base">
          Track your streams, review pricing, and manage access from one cleaner control surface.
        </p>
      </div>

      <section className="section-reveal mt-12 grid gap-4 sm:grid-cols-3">
        {[
          ["08", "owned streams"],
          ["$312", "monthly run rate"],
          ["99.2%", "uptime health"],
        ].map(([value, label]) => (
          <div key={label} className="motion-card motion-frame border border-border px-5 py-4 text-center">
            <div className="text-2xl tracking-[-0.04em] text-white sm:text-3xl">{value}</div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">{label}</div>
          </div>
        ))}
      </section>

      <section className="section-reveal mt-8 space-y-4">
        {mySensors.length > 0 ? (
          mySensors.map((sensor) => (
            <a key={sensor.id} href={`/sensor/${sensor.id}`} className="motion-card motion-frame block border border-border p-6 transition-colors duration-150 ease-out hover:border-primary">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">{sensor.type}</div>
                  <h2 className="mt-3 font-serif text-3xl text-white">{sensor.name}</h2>
                  <div className="mt-2 font-mono text-sm text-white/60">Status: {sensor.status}</div>
                </div>

                <div className="font-mono text-sm uppercase text-white/65 lg:text-right">
                  <div className="text-white/40">Daily price</div>
                  <div className="mt-2 text-2xl text-white">${Number(sensor.pricingDaily).toFixed(2)}</div>
                </div>
              </div>
            </a>
          ))
        ) : (
          <div className="border border-border p-10 text-center font-mono text-sm text-white/60">
            {session ? "Belum ada sensor untuk wallet ini." : "Connect wallet dulu buat buka dashboard producer."}
          </div>
        )}
      </section>
    </div>
  );
}
