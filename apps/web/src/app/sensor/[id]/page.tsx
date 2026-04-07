const pricingPlans = [
  ["Per read", "$0.001"],
  ["Hourly", "$0.50"],
  ["Daily", "$5"],
  ["Monthly", "$50"],
];

const integrity = [
  ["Storage provider", "Shelby Testnet"],
  ["Merkle root", "0x7a8f...c2d1"],
  ["Erasure coding", "Verified"],
  ["Audit", "Passed"],
];

const sampleRows = [
  ["2026-04-07 16:40", "PM2.5", "42 AQI"],
  ["2026-04-07 16:45", "PM10", "31 AQI"],
  ["2026-04-07 16:50", "CO2", "612 ppm"],
  ["2026-04-07 16:55", "NO2", "18 ppb"],
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
    location: "Central Jakarta, Indonesia",
    description:
      "Urban air-quality telemetry packaged into Shelby blobs, tracked with integrity metadata, and exposed through paid access plans for monitoring, analytics, and model training use cases.",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <div className="mb-5 text-xs uppercase tracking-[0.24em] text-[#6f8aa4]">
        <a href="/marketplace" className="hover:text-white">
          marketplace
        </a>{" "}
        / {sensor.name}
      </div>

      <section className="rounded-3xl border border-white/10 bg-[#07111b] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="text-[11px] uppercase tracking-[0.28em] text-[#7e97b0]">sensor / detail / verified stream</div>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.04] tracking-[-0.05em] text-white sm:text-6xl lg:text-[68px]">
          {sensor.name}
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[#9db0c3]">{sensor.description}</p>
        <div className="mt-4 text-sm uppercase tracking-[0.18em] text-[#4cc2ff]">{sensor.location}</div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.62fr_0.38fr]">
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#08111a] p-6">
            <div className="text-[11px] uppercase tracking-[0.26em] text-[#7e97b0]">Recent sample payload</div>
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/10">
              <div className="grid grid-cols-3 border-b border-white/10 bg-[#0d1723] px-4 py-3 text-[11px] uppercase tracking-[0.22em] text-[#6f8aa4]">
                <span>timestamp</span>
                <span>field</span>
                <span>value</span>
              </div>
              {sampleRows.map((row) => (
                <div key={row.join("-")} className="grid grid-cols-3 border-b border-white/10 bg-[#08111a] px-4 py-3 text-sm text-[#dce8f5] last:border-b-0">
                  <span>{row[0]}</span>
                  <span>{row[1]}</span>
                  <span>{row[2]}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#08111a] p-6">
            <div className="text-[11px] uppercase tracking-[0.26em] text-[#7e97b0]">Access plans</div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {pricingPlans.map(([label, price]) => (
                <div key={label} className="rounded-2xl border border-white/10 bg-[#0b1621] p-5">
                  <div className="text-[11px] uppercase tracking-[0.18em] text-[#6f8aa4]">{label}</div>
                  <div className="mt-2 text-2xl text-white">{price}</div>
                </div>
              ))}
            </div>
            <button className="mt-6 inline-flex items-center justify-center rounded-xl border border-[#27537a] bg-[#0e2740] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#143556]">
              Connect wallet
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#08111a] p-6">
          <div className="text-[11px] uppercase tracking-[0.26em] text-[#7e97b0]">Integrity layer</div>
          <div className="mt-5 space-y-3">
            {integrity.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-[#0b1621] p-4">
                <div className="text-sm text-[#97abc0]">{label}</div>
                <div className="mt-2 font-mono text-sm uppercase tracking-[0.12em] text-white">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
