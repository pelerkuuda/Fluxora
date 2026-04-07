import { SENSOR_TYPE_CONFIG } from "@fluxora/shared";

const DEMO_LISTINGS = [
  {
    id: "sensor-001",
    name: "Jakarta Air Quality Monitor",
    type: "air_quality" as const,
    description: "PM2.5, PM10, CO2, and NO2 levels from Central Jakarta. Updated every 5 minutes.",
    locationLabel: "Central Jakarta, Indonesia",
    pricingPerRead: 0.001,
    pricingDaily: 5,
    pricingMonthly: 50,
    totalDataPoints: 128400,
    totalBlobs: 214,
    subscribers: 23,
    status: "active",
  },
  {
    id: "sensor-002",
    name: "Bali Soil Moisture Array",
    type: "soil_moisture" as const,
    description: "12-sensor array monitoring rice paddy irrigation. Real-time soil moisture and pH.",
    locationLabel: "Ubud, Bali, Indonesia",
    pricingPerRead: 0.002,
    pricingDaily: 8,
    pricingMonthly: 75,
    totalDataPoints: 86200,
    totalBlobs: 143,
    subscribers: 8,
    status: "active",
  },
  {
    id: "sensor-003",
    name: "Surabaya Traffic Counter",
    type: "traffic" as const,
    description: "Vehicle count, speed, and density on Jl. Ahmad Yani. Camera + radar fusion.",
    locationLabel: "Surabaya, East Java",
    pricingPerRead: 0.001,
    pricingDaily: 4,
    pricingMonthly: 40,
    totalDataPoints: 256000,
    totalBlobs: 426,
    subscribers: 31,
    status: "active",
  },
  {
    id: "sensor-004",
    name: "Singapore Weather Hub",
    type: "weather" as const,
    description: "Full weather station, temp, humidity, pressure, wind, rainfall. Rooftop deployment.",
    locationLabel: "Marina Bay, Singapore",
    pricingPerRead: 0.001,
    pricingDaily: 6,
    pricingMonthly: 55,
    totalDataPoints: 340000,
    totalBlobs: 567,
    subscribers: 45,
    status: "active",
  },
  {
    id: "sensor-005",
    name: "Bandung Noise Monitor",
    type: "noise" as const,
    description: "dB levels near industrial zone. Compliance monitoring for local regulation.",
    locationLabel: "Bandung, West Java",
    pricingPerRead: 0.001,
    pricingDaily: 3,
    pricingMonthly: 30,
    totalDataPoints: 64800,
    totalBlobs: 108,
    subscribers: 5,
    status: "active",
  },
  {
    id: "sensor-006",
    name: "Citarum River Water Quality",
    type: "water_quality" as const,
    description: "pH, dissolved oxygen, turbidity, and heavy metals. Environmental monitoring.",
    locationLabel: "Citarum River, West Java",
    pricingPerRead: 0.003,
    pricingDaily: 10,
    pricingMonthly: 90,
    totalDataPoints: 42000,
    totalBlobs: 70,
    subscribers: 12,
    status: "active",
  },
];

const sensorTypes = Object.entries(SENSOR_TYPE_CONFIG);

export default function MarketplacePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
      <div className="grid gap-6 lg:grid-cols-[0.84fr_1.16fr]">
        <section className="rounded-[34px] border border-white/8 bg-white/[0.04] p-8 shadow-[0_30px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-cyan-100/80">
              Marketplace shell
            </span>
            <span className="rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/40">
              Curated sensor inventory
            </span>
          </div>

          <div className="mt-8 max-w-xl">
            <p className="text-xs uppercase tracking-[0.28em] text-white/38">Fluxora listings</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl lg:text-[60px] lg:leading-[0.95]">
              Browse signal streams with a cleaner pricing and trust hierarchy.
            </h1>
            <p className="mt-5 text-base leading-8 text-slate-300">
              This shell leans into stronger layout rhythm, calmer card density, and more premium CTA behavior so each listing feels like a productized data asset, not just a table row wearing dark mode.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              ["2,400+", "active sensors"],
              ["11", "signal categories"],
              ["$0.001", "entry per-read pricing"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-[24px] border border-white/8 bg-slate-950/70 p-5">
                <div className="text-2xl font-semibold tracking-[-0.04em] text-white">{value}</div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-white/38">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[34px] border border-white/8 bg-[linear-gradient(180deg,rgba(7,12,28,0.92),rgba(5,8,22,0.98))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col gap-5 border-b border-white/8 pb-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/65">Discovery controls</div>
              <div className="mt-3 text-2xl font-semibold tracking-[-0.04em] text-white">Filter signal inventory</div>
            </div>
            <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
              Live listings synced
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100">
              All streams
            </button>
            {sensorTypes.map(([key, config]) => (
              <button
                key={key}
                className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-white/62 transition hover:border-cyan-300/20 hover:bg-cyan-300/10 hover:text-white"
              >
                {config.icon} {config.label}
              </button>
            ))}
          </div>

          <div className="mt-5 rounded-[24px] border border-white/10 bg-white/[0.03] p-3">
            <input
              type="text"
              placeholder="Search by region, sensor type, producer, or use case..."
              className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/30 outline-none"
            />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              ["Proof-aware", "merkle-backed blob history"],
              ["Flexible plans", "per-read to monthly access"],
              ["Producer-first", "clear revenue split surface"],
            ].map(([title, body]) => (
              <div key={title} className="rounded-[22px] border border-white/8 bg-white/[0.03] p-4">
                <div className="text-sm font-semibold text-white">{title}</div>
                <div className="mt-2 text-sm leading-7 text-slate-400">{body}</div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {DEMO_LISTINGS.map((listing) => {
          const typeConfig = SENSOR_TYPE_CONFIG[listing.type];
          return (
            <a
              key={listing.id}
              href={`/sensor/${listing.id}`}
              className="group rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.24)] transition hover:-translate-y-1 hover:border-cyan-300/18 hover:bg-white/[0.05]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl">
                    {typeConfig.icon}
                  </div>
                  <div>
                    <div className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/45">
                      {typeConfig.label}
                    </div>
                  </div>
                </div>
                <span className="flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Live
                </span>
              </div>

              <div className="mt-7">
                <h3 className="text-2xl font-semibold tracking-[-0.04em] text-white transition group-hover:text-cyan-100">
                  {listing.name}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-300">
                  {listing.description}
                </p>
              </div>

              <div className="mt-6 rounded-[24px] border border-white/8 bg-slate-950/55 p-4">
                <div className="text-[11px] uppercase tracking-[0.22em] text-white/38">Location</div>
                <div className="mt-2 text-sm text-white/85">{listing.locationLabel}</div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4 text-center">
                  <div className="text-base font-semibold text-white">{(listing.totalDataPoints / 1000).toFixed(0)}K</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/35">Points</div>
                </div>
                <div className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4 text-center">
                  <div className="text-base font-semibold text-white">{listing.totalBlobs}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/35">Blobs</div>
                </div>
                <div className="rounded-[20px] border border-white/8 bg-white/[0.03] p-4 text-center">
                  <div className="text-base font-semibold text-white">{listing.subscribers}</div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/35">Subs</div>
                </div>
              </div>

              <div className="mt-6 flex items-end justify-between border-t border-white/8 pt-5">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.22em] text-white/35">Daily access</div>
                  <div className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-white">
                    ${listing.pricingDaily}
                    <span className="ml-2 text-sm font-normal text-white/45">/ day</span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-950 transition group-hover:bg-cyan-100">
                  View stream
                  <span className="transition group-hover:translate-x-1">↗</span>
                </span>
              </div>
            </a>
          );
        })}
      </section>
    </div>
  );
}
