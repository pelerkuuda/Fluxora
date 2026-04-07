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

      <div className="mt-8 max-w-4xl">
        <div className="font-mono text-xs uppercase tracking-[0.24em] text-white/45">STREAM DETAIL</div>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl">{sensor.name}</h1>
        <p className="mt-6 max-w-[620px] font-mono text-sm leading-7 text-white/60 sm:text-base">{sensor.description}</p>
        <div className="mt-4 font-mono text-sm uppercase text-primary">{sensor.location}</div>
      </div>

      <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="border border-border p-6">
          <div className="font-mono text-xs uppercase tracking-[0.22em] text-white/45">Access plans</div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {pricingPlans.map(([label, price]) => (
              <div key={label} className="border border-border p-5">
                <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">{label}</div>
                <div className="mt-2 text-2xl text-white">{price}</div>
              </div>
            ))}
          </div>
          <button className="mt-8 inline-flex h-12 items-center justify-center border border-primary px-6 font-mono text-sm uppercase text-primary transition-colors duration-150 ease-out hover:bg-primary hover:text-black">
            Connect wallet
          </button>
        </div>

        <div className="border border-border p-6">
          <div className="font-mono text-xs uppercase tracking-[0.22em] text-white/45">Integrity layer</div>
          <div className="mt-6 space-y-4">
            {integrity.map(([label, value]) => (
              <div key={label} className="border border-border p-4">
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
