// Fluxora Sensor Detail Page

export default async function SensorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // Demo data — in production this comes from API
  const sensor = {
    id,
    name: "Jakarta Air Quality Monitor",
    type: "air_quality",
    icon: "🌫️",
    description:
      "PM2.5, PM10, CO2, and NO2 levels from Central Jakarta. High-precision Sensirion SPS30 sensor array mounted at 3m elevation. Updated every 5 minutes. Data verified on-chain via Shelby merkle roots.",
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

  // Simulated recent data points
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
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
        <a href="/marketplace" className="hover:text-white">Marketplace</a>
        <span>/</span>
        <span className="text-white">{sensor.name}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="text-4xl">{sensor.icon}</span>
              <div>
                <h1 className="text-2xl font-bold sm:text-3xl">{sensor.name}</h1>
                <div className="mt-1 flex items-center gap-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    Live
                  </span>
                  <span>📍 {sensor.location.label}</span>
                </div>
              </div>
            </div>
            <p className="mt-4 leading-relaxed text-gray-400">{sensor.description}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: "Data Points", value: "128.4K" },
              { label: "Blobs on Shelby", value: "214" },
              { label: "Subscribers", value: "23" },
              { label: "Uptime", value: sensor.uptime },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-white/5 bg-white/[0.02] p-4 text-center">
                <div className="text-lg font-bold">{s.value}</div>
                <div className="text-[10px] text-gray-500">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Live Data Preview */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">Live Data Preview</h2>
            <div className="overflow-x-auto rounded-xl border border-white/5">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="px-4 py-3 text-left font-medium text-gray-400">Time</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-400">PM2.5 (μg/m³)</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-400">PM10 (μg/m³)</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-400">CO₂ (ppm)</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-400">NO₂ (ppb)</th>
                  </tr>
                </thead>
                <tbody>
                  {recentData.map((row, i) => (
                    <tr key={i} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                      <td className="px-4 py-2.5 text-gray-300">{row.time}</td>
                      <td className={`px-4 py-2.5 text-right ${row.pm25 > 40 ? "text-amber-400" : "text-emerald-400"}`}>
                        {row.pm25}
                      </td>
                      <td className="px-4 py-2.5 text-right text-gray-300">{row.pm10}</td>
                      <td className="px-4 py-2.5 text-right text-gray-300">{row.co2}</td>
                      <td className="px-4 py-2.5 text-right text-gray-300">{row.no2}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-gray-600">
              Showing last 8 readings. Subscribe to access full historical data.
            </p>
          </div>

          {/* Shelby Info */}
          <div className="rounded-xl border border-indigo-500/10 bg-indigo-500/5 p-6">
            <h3 className="mb-3 flex items-center gap-2 font-semibold">
              <span>🔐</span> Data Integrity (Shelby Protocol)
            </h3>
            <div className="space-y-2 text-sm text-gray-400">
              <div className="flex justify-between">
                <span>Storage Provider</span>
                <span className="font-mono text-xs text-gray-300">Shelby Testnet</span>
              </div>
              <div className="flex justify-between">
                <span>Latest Merkle Root</span>
                <span className="font-mono text-xs text-indigo-300">0x7a8f...c2d1</span>
              </div>
              <div className="flex justify-between">
                <span>Erasure Coding</span>
                <span className="text-emerald-400">Verified ✓</span>
              </div>
              <div className="flex justify-between">
                <span>On-chain Audit (Aptos)</span>
                <span className="text-emerald-400">Passed ✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar - Pricing */}
        <div className="space-y-6">
          <div className="sticky top-24 space-y-6">
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <h3 className="mb-4 text-lg font-semibold">Subscribe</h3>
              <div className="space-y-3">
                {[
                  { plan: "Per Read", price: `$${sensor.pricing.perRead}`, period: "per read", highlight: false },
                  { plan: "Hourly", price: `$${sensor.pricing.hourly}`, period: "per hour", highlight: false },
                  { plan: "Daily", price: `$${sensor.pricing.daily}`, period: "per day", highlight: true },
                  { plan: "Monthly", price: `$${sensor.pricing.monthly}`, period: "per month", highlight: false },
                ].map((p) => (
                  <button
                    key={p.plan}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      p.highlight
                        ? "border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20"
                        : "border-white/5 bg-white/[0.02] hover:border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{p.plan}</span>
                      <div>
                        <span className="font-bold">{p.price}</span>
                        <span className="text-xs text-gray-500"> {p.period}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <button className="mt-4 w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold transition hover:bg-indigo-500">
                Connect Wallet & Subscribe
              </button>
              <p className="mt-3 text-center text-[10px] text-gray-600">
                Payment via ETH or SOL (Shelby DAA) • 95% goes to producer
              </p>
            </div>

            {/* Producer Info */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
              <h3 className="mb-3 text-sm font-semibold text-gray-400">Producer</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20 text-lg">
                  👤
                </div>
                <div>
                  <div className="font-mono text-sm">{sensor.owner}</div>
                  <div className="text-xs text-gray-500">Since {sensor.createdAt}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
