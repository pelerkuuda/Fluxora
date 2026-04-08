import { SensorAccessPanel } from "@/components/sensor-access-panel";

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
      "A verified urban telemetry feed for buyers who need consistent air-quality data with provenance and paid access controls.",
  };

  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-36 sm:px-6 lg:px-8">
      <div className="font-mono text-xs uppercase tracking-[0.24em] text-white/45">
        <a href="/marketplace" className="hover:text-white">
          Marketplace
        </a>{" "}
        / {sensor.name}
      </div>

      <div className="section-reveal mt-8 max-w-4xl">
        <div className="font-mono text-xs uppercase tracking-[0.24em] text-white/45">STREAM DETAIL</div>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl">{sensor.name}</h1>
        <p className="mt-6 max-w-[620px] font-mono text-sm leading-7 text-white/60 sm:text-base">{sensor.description}</p>
        <div className="mt-4 font-mono text-sm uppercase text-primary">{sensor.location}</div>
      </div>

      <section className="section-reveal mt-12 grid gap-4 sm:grid-cols-3">
        {[
          ["128.4K", "indexed records"],
          ["1.2s", "average read latency"],
          ["24/7", "stream availability"],
        ].map(([value, label]) => (
          <div key={label} className="motion-card motion-frame border border-border px-5 py-4 text-center">
            <div className="text-2xl tracking-[-0.04em] text-white sm:text-3xl">{value}</div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">{label}</div>
          </div>
        ))}
      </section>

      <section className="section-reveal orbit-shell mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <div className="motion-frame border border-border p-6">
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-white/45">Access plans</div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {pricingPlans.map(([label, price]) => (
                <div key={label} className="motion-card border border-border p-5">
                  <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">{label}</div>
                  <div className="mt-2 text-2xl text-white">{price}</div>
                </div>
              ))}
            </div>
          </div>

          <SensorAccessPanel sensorId={sensor.id} />

          <div className="motion-frame border border-border p-6">
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-white/45">Recent samples</div>
            <div className="mt-6 space-y-3">
              {[
                ["PM2.5", "42 ug/m3", "17:24 UTC"],
                ["PM10", "58 ug/m3", "17:24 UTC"],
                ["Humidity", "71%", "17:24 UTC"],
              ].map(([metric, value, timestamp]) => (
                <div key={metric} className="motion-card flex items-center justify-between border border-border px-4 py-3 font-mono text-sm text-white/70">
                  <span>{metric}</span>
                  <span className="text-white">{value}</span>
                  <span className="text-white/40">{timestamp}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="motion-frame border border-border p-6">
          <div className="font-mono text-xs uppercase tracking-[0.22em] text-white/45">Integrity layer</div>
          <div className="mt-6 space-y-4">
            {integrity.map(([label, value]) => (
              <div key={label} className="motion-card border border-border p-4">
                <div className="font-mono text-sm text-white/45">{label}</div>
                <div className="mt-2 font-mono text-sm uppercase text-white">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
