import { SENSOR_TYPE_CONFIG } from "@fluxora/shared";

const DEMO_LISTINGS = [
  {
    id: "sensor-001",
    name: "Jakarta Air Quality Monitor",
    type: "air_quality" as const,
    locationLabel: "Central Jakarta, Indonesia",
    pricingDaily: 5,
    totalDataPoints: 128400,
    storageEpochs: 100,
    merkleRoot: "0x7a8f...c2d1",
  },
  {
    id: "sensor-002",
    name: "Bali Soil Moisture Array",
    type: "soil_moisture" as const,
    locationLabel: "Ubud, Bali, Indonesia",
    pricingDaily: 8,
    totalDataPoints: 86200,
    storageEpochs: 120,
    merkleRoot: "0x3fd1...a904",
  },
  {
    id: "sensor-003",
    name: "Surabaya Traffic Counter",
    type: "traffic" as const,
    locationLabel: "Surabaya, East Java",
    pricingDaily: 4,
    totalDataPoints: 256000,
    storageEpochs: 90,
    merkleRoot: "0x91bc...ee12",
  },
  {
    id: "sensor-004",
    name: "Singapore Weather Hub",
    type: "weather" as const,
    locationLabel: "Marina Bay, Singapore",
    pricingDaily: 6,
    totalDataPoints: 340000,
    storageEpochs: 144,
    merkleRoot: "0x10da...9fbb",
  },
];

export default function MarketplacePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
      <section className="rounded-3xl border border-white/10 bg-[#07111b] px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
        <div className="text-[11px] uppercase tracking-[0.28em] text-[#7e97b0]">marketplace / verified streams</div>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.04] tracking-[-0.05em] text-white sm:text-6xl lg:text-[70px]">
          Browse machine data streams with protocol-visible storage facts.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-[#9db0c3]">
          Every listing is framed around access price, blob volume, storage duration, and integrity metadata instead of
          vague marketplace fluff.
        </p>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-[0.32fr_0.68fr]">
        <aside className="rounded-2xl border border-white/10 bg-[#08111a] p-6">
          <div className="text-[11px] uppercase tracking-[0.26em] text-[#7e97b0]">Filter by sensor type</div>
          <div className="mt-5 space-y-3">
            <button className="w-full rounded-xl border border-[#27537a] bg-[#0e2740] px-4 py-3 text-left text-sm text-white transition hover:bg-[#143556]">
              All streams
            </button>
            {Object.entries(SENSOR_TYPE_CONFIG).slice(0, 6).map(([key, config]) => (
              <button
                key={key}
                className="w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-left text-sm text-[#dce8f5] transition hover:bg-white/[0.06]"
              >
                {config.icon} {config.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-4">
          {DEMO_LISTINGS.map((listing) => (
            <a
              key={listing.id}
              href={`/sensor/${listing.id}`}
              className="block rounded-2xl border border-white/10 bg-[#08111a] p-6 transition hover:border-[#27537a] hover:bg-[#0b1723]"
            >
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-[#7e97b0]">
                    {SENSOR_TYPE_CONFIG[listing.type].label}
                  </div>
                  <h2 className="mt-3 text-3xl tracking-[-0.04em] text-white">{listing.name}</h2>
                  <div className="mt-3 text-sm leading-7 text-[#97abc0]">{listing.locationLabel}</div>
                </div>

                <div className="grid min-w-[220px] gap-3 sm:grid-cols-3 lg:grid-cols-1">
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[#6f8aa4]">Daily access</div>
                    <div className="mt-1 text-2xl text-white">${listing.pricingDaily}</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[#6f8aa4]">Data points</div>
                    <div className="mt-1 text-sm text-[#dce8f5]">{(listing.totalDataPoints / 1000).toFixed(0)}K points</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.22em] text-[#6f8aa4]">Storage epochs</div>
                    <div className="mt-1 text-sm text-[#dce8f5]">{listing.storageEpochs} epochs</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-3 border-t border-white/10 pt-5 text-sm text-[#b9cadd] sm:grid-cols-3">
                <div>
                  <span className="text-[#6f8aa4]">merkle_root</span>
                  <div className="mt-1 font-mono text-[13px] text-white">{listing.merkleRoot}</div>
                </div>
                <div>
                  <span className="text-[#6f8aa4]">access_model</span>
                  <div className="mt-1 text-white">per_read + subscriptions</div>
                </div>
                <div>
                  <span className="text-[#6f8aa4]">network</span>
                  <div className="mt-1 text-white">Shelby / Aptos</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
