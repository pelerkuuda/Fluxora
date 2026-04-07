const sensorVitals = [
  { label: "Data points", value: "128.4K", hint: "captured and indexed" },
  { label: "Shelby blobs", value: "214", hint: "proof-backed storage units" },
  { label: "Subscribers", value: "23", hint: "active paid access" },
  { label: "Uptime", value: "99.7%", hint: "stream reliability" },
];

const integrityChecks = [
  ["Storage provider", "Shelby Testnet"],
  ["Latest merkle root", "0x7a8f...c2d1"],
  ["Erasure coding", "Verified ✓"],
  ["Aptos audit", "Passed ✓"],
];

const pricingPlans = [
  { plan: "Per read", price: "$0.001", period: "single blob access", highlight: false },
  { plan: "Hourly", price: "$0.50", period: "short-lived monitoring", highlight: false },
  { plan: "Daily", price: "$5", period: "best for active analysis", highlight: true },
  { plan: "Monthly", price: "$50", period: "persistent feed subscription", highlight: false },
];

const relatedSignals = [
  ["Update cadence", "5-minute batch rhythm with buffered upload flow"],
  ["Signal category", "air quality / civic environment / urban monitoring"],
  ["Producer economics", "95% routed to owner, 5% split platform + storage"],
];

export default async function SensorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const sensor = {
    id,
    name: "Jakarta Air Quality Monitor",
    type: "Air quality stream",
    icon: "🌫️",
    description:
      "PM2.5, PM10, CO2, and NO2 levels from Central Jakarta. High-precision Sensirion SPS30 sensor array mounted at 3m elevation, publishing a clean urban atmosphere feed with proof-aware storage and recurring monetization.",
    location: { lat: -6.2088, lng: 106.8456, label: "Central Jakarta, Indonesia" },
    status: "active",
    pricing: { perRead: 0.001, hourly: 0.5, daily: 5, monthly: 50 },
    totalDataPoints: 128400,
    totalBlobs: 214,
    subscribers: 23,
    uptime: "99.7%",
    owner: "0x1a2b...3c4d",
    createdAt: "2025-12-15",
  };

  const recentData = [
    { time: "08:00", pm25: 42, pm10: 68, co2: 412, no2: 18 },
    { time: "07:55", pm25: 40, pm10: 65, co2: 408, no2: 17 },
    { time: "07:50", pm25: 45, pm10: 72, co2: 420, no2: 19 },
    { time: "07:45", pm25: 38, pm10: 61, co2: 405, no2: 16 },
    { time: "07:40", pm25: 41, pm10: 66, co2: 415, no2: 18 },
    { time: "07:35", pm25: 44, pm10: 70, co2: 418, no2: 20 },
    { time: "07:30", pm25: 39, pm10: 63, co2: 410, no2: 17 },
    { time: "07:25", pm25: 43, pm10: 69, co2: 416, no2: 19 },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="mb-6 flex items-center gap-2 text-sm text-white/42">
        <a href="/marketplace" className="transition hover:text-white">
          Marketplace
        </a>
        <span>/</span>
        <span className="text-white/78">{sensor.name}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[34px] border border-white/8 bg-white/[0.04] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-cyan-100/80">
              Signal detail
            </span>
            <span className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-emerald-300">
              Live stream active
            </span>
          </div>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-[24px] border border-white/10 bg-white/[0.04] text-3xl">
                  {sensor.icon}
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">{sensor.type}</div>
                  <h1 className="mt-2 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-[58px] lg:leading-[0.96]">
                    {sensor.name}
                  </h1>
                </div>
              </div>
              <p className="text-base leading-8 text-slate-300">{sensor.description}</p>
            </div>

            <div className="rounded-[26px] border border-white/8 bg-slate-950/70 p-5 sm:min-w-[220px]">
              <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">Location</div>
              <div className="mt-3 text-lg font-semibold text-white">{sensor.location.label}</div>
              <div className="mt-4 text-sm leading-7 text-slate-400">
                {sensor.location.lat}, {sensor.location.lng}
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {sensorVitals.map((item) => (
              <div key={item.label} className="rounded-[24px] border border-white/8 bg-slate-950/70 p-5">
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">{item.label}</div>
                <div className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">{item.value}</div>
                <div className="mt-2 text-sm text-slate-400">{item.hint}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[34px] border border-white/8 bg-[linear-gradient(180deg,rgba(7,12,28,0.92),rgba(5,8,22,0.98))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-5 border-b border-white/8 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/65">Access shell</div>
              <div className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">Subscribe to this signal stream</div>
            </div>
            <div className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100/80">
              Proof-aware pricing
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {pricingPlans.map((plan) => (
              <button
                key={plan.plan}
                className={`w-full rounded-[24px] border p-5 text-left transition ${
                  plan.highlight
                    ? "border-cyan-300/20 bg-cyan-300/10 hover:bg-cyan-300/14"
                    : "border-white/8 bg-white/[0.03] hover:border-white/14 hover:bg-white/[0.05]"
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-white">{plan.plan}</div>
                    <div className="mt-1 text-sm text-slate-400">{plan.period}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold tracking-[-0.04em] text-white">{plan.price}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <button className="mt-5 inline-flex w-full items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-950 transition hover:bg-cyan-100">
            Connect wallet & subscribe
            <span>↗</span>
          </button>

          <p className="mt-4 text-center text-xs leading-6 text-slate-500">
            Payment rails can extend across Shelby DAA / Aptos-facing flows. 95% routes to the producer.
          </p>

          <div className="mt-6 rounded-[26px] border border-white/8 bg-white/[0.03] p-5">
            <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">Producer identity</div>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-lg">
                👤
              </div>
              <div>
                <div className="font-mono text-sm text-white">{sensor.owner}</div>
                <div className="mt-1 text-sm text-slate-400">Producer since {sensor.createdAt}</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.08fr_0.92fr]">
        <section className="rounded-[34px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)]">
          <div className="flex items-end justify-between gap-4 border-b border-white/8 pb-5">
            <div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/65">Live preview</div>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">Recent telemetry sample</h2>
            </div>
            <div className="text-xs uppercase tracking-[0.18em] text-white/35">Last 8 readings</div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-[24px] border border-white/8 bg-slate-950/55">
            <table className="w-full min-w-[680px] text-sm">
              <thead>
                <tr className="border-b border-white/8 text-left text-white/40">
                  <th className="px-5 py-4 font-medium">Time</th>
                  <th className="px-5 py-4 text-right font-medium">PM2.5</th>
                  <th className="px-5 py-4 text-right font-medium">PM10</th>
                  <th className="px-5 py-4 text-right font-medium">CO₂</th>
                  <th className="px-5 py-4 text-right font-medium">NO₂</th>
                </tr>
              </thead>
              <tbody>
                {recentData.map((row, index) => (
                  <tr key={index} className="border-b border-white/[0.05] last:border-0 hover:bg-white/[0.03]">
                    <td className="px-5 py-4 text-white/84">{row.time}</td>
                    <td className={`px-5 py-4 text-right font-medium ${row.pm25 > 40 ? "text-amber-300" : "text-emerald-300"}`}>
                      {row.pm25}
                    </td>
                    <td className="px-5 py-4 text-right text-white/78">{row.pm10}</td>
                    <td className="px-5 py-4 text-right text-white/78">{row.co2}</td>
                    <td className="px-5 py-4 text-right text-white/78">{row.no2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm leading-7 text-slate-400">
            Preview is intentionally shallow. Full historical access unlocks through a paid subscription plan and blob retrieval workflow.
          </p>
        </section>

        <section className="space-y-6">
          <div className="rounded-[34px] border border-white/8 bg-white/[0.04] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.22)]">
            <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/65">Integrity panel</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">Proof and trust layer</h2>
            <div className="mt-5 space-y-3">
              {integrityChecks.map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-4 rounded-[22px] border border-white/8 bg-slate-950/55 p-4">
                  <span className="text-sm text-slate-400">{label}</span>
                  <span className="text-sm font-medium text-white">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[34px] border border-white/8 bg-[linear-gradient(180deg,rgba(7,12,28,0.92),rgba(5,8,22,0.98))] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.22)]">
            <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/65">Operating profile</div>
            <div className="mt-5 space-y-4">
              {relatedSignals.map(([title, body]) => (
                <div key={title} className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                  <div className="text-sm font-semibold text-white">{title}</div>
                  <div className="mt-2 text-sm leading-7 text-slate-400">{body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
