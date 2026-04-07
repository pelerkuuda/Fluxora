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
  createdAt: string | Date;
}

const sensorTypeLabels: Record<string, string> = {
  temperature: "🌡️ Temperature",
  humidity: "💧 Humidity",
  air_quality: "🌫️ Air Quality",
  soil_moisture: "🌱 Soil Moisture",
  traffic: "🚗 Traffic",
  weather: "⛅ Weather",
  energy: "⚡ Energy",
  water_quality: "🌊 Water Quality",
  noise: "🔊 Noise",
  radiation: "☢️ Radiation",
  custom: "📡 Custom",
};

export function DashboardClient() {
  const { session, isLoading } = useWallet();
  const [mySensors, setMySensors] = useState<DashboardSensor[]>([]);
  const [loadingSensors, setLoadingSensors] = useState(false);

  useEffect(() => {
    const loadSensors = async () => {
      if (!session?.walletAddress) return;

      setLoadingSensors(true);
      const response = await sensorsApi.list({ owner: "me", limit: 20 }, session.walletAddress);

      if (response.success && Array.isArray(response.data)) {
        setMySensors(response.data as DashboardSensor[]);
      }

      setLoadingSensors(false);
    };

    void loadSensors();
  }, [session?.walletAddress]);

  const stats = [
    { label: "Connected Wallet", value: session ? "1" : "0", hint: session ? "identity active" : "awaiting session" },
    { label: "Managed Sensors", value: String(mySensors.length), hint: session ? "wallet scoped inventory" : "connect to load" },
    { label: "Active Listings", value: String(mySensors.filter((s) => s.status === "active").length), hint: "sellable streams" },
    { label: "Projected Daily", value: `$${mySensors.reduce((sum, sensor) => sum + Number(sensor.pricingDaily || 0), 0).toFixed(2)}`, hint: "pricing snapshot" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
        <section className="rounded-[34px] border border-white/8 bg-white/[0.04] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-cyan-100/80">
              Producer console
            </span>
            <span className="rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/40">
              Wallet-native operating shell
            </span>
          </div>

          <div className="mt-8 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-white/38">Dashboard rhythm</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-[60px] lg:leading-[0.96]">
              Manage your sensor inventory like a premium stream business.
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-300">
              The shell is now aligned with the landing and marketplace surfaces, tighter typography, stronger information hierarchy, and calmer spacing so ownership, status, and revenue signals read instantly.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-[24px] border border-white/8 bg-slate-950/70 p-5">
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">{stat.label}</div>
                <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">{stat.value}</div>
                <div className="mt-2 text-sm text-slate-400">{stat.hint}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[34px] border border-white/8 bg-[linear-gradient(180deg,rgba(7,12,28,0.92),rgba(5,8,22,0.98))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-5 border-b border-white/8 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/65">Wallet state</div>
              <div className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">
                {session ? `Connected as ${session.displayName || "Producer"}` : "No wallet session yet"}
              </div>
            </div>
            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              {session ? "Producer identity live" : "Connect wallet to unlock"}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ["Persisted session", "frontend keeps wallet context warm between page loads"],
              ["Ownership scope", "sensor listing filters by connected wallet with owner=me"],
              ["Lifecycle control", "create, update, and deactivate are already wallet-aware"],
            ].map(([title, body]) => (
              <div key={title} className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                <div className="text-sm font-semibold text-white">{title}</div>
                <div className="mt-2 text-sm leading-7 text-slate-400">{body}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">Status note</div>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              This dashboard shell is intentionally more architectural than appy. It should feel like the operating surface for a serious sensor business, not a starter admin panel with a dark background.
            </p>
          </div>
        </section>
      </div>

      <section className="mt-8">
        <div className="mb-5 flex items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/65">Owned inventory</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">My sensors</h2>
          </div>
          <a
            href="/marketplace"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/75 transition hover:border-cyan-300/20 hover:bg-cyan-300/10 hover:text-white"
          >
            View market shell
            <span>↗</span>
          </a>
        </div>

        {!session && !isLoading && (
          <div className="rounded-[30px] border border-dashed border-white/12 bg-white/[0.03] p-10 text-center text-slate-400">
            Connect wallet dulu biar inventory sensor milikmu bisa muncul di shell ini.
          </div>
        )}

        {session && loadingSensors && (
          <div className="rounded-[30px] border border-white/8 bg-white/[0.03] p-10 text-center text-slate-400">
            Loading owned sensors...
          </div>
        )}

        {session && !loadingSensors && mySensors.length === 0 && (
          <div className="rounded-[30px] border border-dashed border-white/12 bg-white/[0.03] p-10 text-center text-slate-400">
            Belum ada sensor yang terdaftar untuk wallet ini.
          </div>
        )}

        <div className="space-y-4">
          {mySensors.map((sensor) => (
            <div
              key={sensor.id}
              className="rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.22)] transition hover:border-cyan-300/16 hover:bg-white/[0.05]"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="max-w-2xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white">{sensor.name}</h3>
                    <span className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                      {sensor.status}
                    </span>
                  </div>
                  <div className="mt-3 text-sm leading-7 text-slate-400">
                    {sensorTypeLabels[sensor.type] ?? sensor.type}
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[440px]">
                  <div className="rounded-[22px] border border-white/8 bg-slate-950/55 p-4 text-center">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">Daily price</div>
                    <div className="mt-2 text-xl font-semibold text-white">${Number(sensor.pricingDaily).toFixed(2)}</div>
                  </div>
                  <div className="rounded-[22px] border border-white/8 bg-slate-950/55 p-4 text-center">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-white/35">Created</div>
                    <div className="mt-2 text-sm font-medium text-white">{new Date(sensor.createdAt).toLocaleDateString()}</div>
                  </div>
                  <a
                    href={`/sensor/${sensor.id}`}
                    className="inline-flex items-center justify-center gap-2 rounded-[22px] bg-white px-4 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
                  >
                    Manage stream
                    <span>→</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
