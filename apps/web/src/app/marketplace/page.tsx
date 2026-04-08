import { SENSOR_TYPE_CONFIG } from "@fluxora/shared";
import { SensorAccessPanel } from "@/components/sensor-access-panel";

const DEMO_LISTINGS = [
  {
    id: "sensor-001",
    name: "Jakarta Air Quality Monitor",
    type: "air_quality" as const,
    locationLabel: "Central Jakarta, Indonesia",
    pricingDaily: 5,
    totalDataPoints: 128400,
  },
  {
    id: "sensor-002",
    name: "Bali Soil Moisture Array",
    type: "soil_moisture" as const,
    locationLabel: "Ubud, Bali, Indonesia",
    pricingDaily: 8,
    totalDataPoints: 86200,
  },
  {
    id: "sensor-003",
    name: "Surabaya Traffic Counter",
    type: "traffic" as const,
    locationLabel: "Surabaya, East Java",
    pricingDaily: 4,
    totalDataPoints: 256000,
  },
  {
    id: "sensor-004",
    name: "Singapore Weather Hub",
    type: "weather" as const,
    locationLabel: "Marina Bay, Singapore",
    pricingDaily: 6,
    totalDataPoints: 340000,
  },
];

export default function MarketplacePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-36 sm:px-6 lg:px-8">
      <div className="section-reveal text-center">
        <div className="font-mono text-xs uppercase tracking-[0.24em] text-white/45">MARKETPLACE</div>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl">Verified machine data, ready to buy.</h1>
        <p className="mx-auto mt-6 max-w-[560px] font-mono text-sm leading-7 text-white/60 sm:text-base">
          Browse Shelby-powered telemetry feeds with straightforward pricing and cleaner source attribution.
        </p>
      </div>

      <section className="section-reveal mt-12 grid gap-4 sm:grid-cols-3">
        {[
          ["04", "featured feeds"],
          ["$4-$8", "daily access range"],
          ["826K", "sampled points indexed"],
        ].map(([value, label]) => (
          <div key={label} className="motion-card motion-frame border border-border px-5 py-4 text-center">
            <div className="text-2xl tracking-[-0.04em] text-white sm:text-3xl">{value}</div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">{label}</div>
          </div>
        ))}
      </section>

      <div className="section-reveal mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="motion-frame h-fit border border-border p-5">
          <div className="font-mono text-xs uppercase tracking-[0.22em] text-white/45">Filters</div>
          <div className="mt-5 space-y-3">
            <button className="motion-button w-full border border-primary px-4 py-3 text-left font-mono text-sm uppercase text-primary">
              All streams
            </button>
            {Object.entries(SENSOR_TYPE_CONFIG).slice(0, 6).map(([key, config]) => (
              <button
                key={key}
                className="motion-button w-full border border-border px-4 py-3 text-left font-mono text-sm uppercase text-white/70 transition-colors duration-150 ease-out hover:text-white"
              >
                {config.icon} {config.label}
              </button>
            ))}
          </div>
        </aside>

        <div className="space-y-4">
          {DEMO_LISTINGS.map((listing) => (
            <div key={listing.id} className="motion-card motion-frame border border-border p-6 transition-colors duration-150 ease-out hover:border-primary">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="lg:max-w-xl">
                  <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
                    {SENSOR_TYPE_CONFIG[listing.type].label}
                  </div>
                  <a href={`/sensor/${listing.id}`} className="block">
                    <h2 className="mt-3 font-serif text-3xl text-white">{listing.name}</h2>
                  </a>
                  <div className="mt-2 font-mono text-sm text-white/60">{listing.locationLabel}</div>
                </div>

                <div className="grid gap-4 font-mono text-sm uppercase text-white/65 sm:grid-cols-2 lg:text-right">
                  <div>
                    <div className="text-white/40">Daily access</div>
                    <div className="mt-2 text-2xl text-white">${listing.pricingDaily}</div>
                  </div>
                  <div>
                    <div className="text-white/40">Data points</div>
                    <div className="mt-2 text-white">{(listing.totalDataPoints / 1000).toFixed(0)}K</div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <SensorAccessPanel sensorId={listing.id} compact />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
