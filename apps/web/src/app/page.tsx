const signalLanes = [
  { region: "Jakarta mesh", category: "AQI / transit / curbside", utilization: "78% utilized" },
  { region: "Bali agrinet", category: "soil / irrigation / climate", utilization: "64% utilized" },
  { region: "Singapore marine", category: "weather / harbor / humidity", utilization: "82% utilized" },
  { region: "Surabaya mobility", category: "traffic / density / freight", utilization: "71% utilized" },
];

const operatingPrinciples = [
  {
    eyebrow: "01",
    title: "A market surface for machine output",
    body:
      "Fluxora frames live telemetry like a premium asset class, where producers package sensor streams into inventory and buyers subscribe with proof-aware access.",
  },
  {
    eyebrow: "02",
    title: "Storage disappears, integrity stays visible",
    body:
      "Shelby handles the blob layer while Fluxora exposes the trust layer, from batch lineage to merkle-backed confidence cues across the product shell.",
  },
  {
    eyebrow: "03",
    title: "Built for rhythm, not dashboards alone",
    body:
      "The interface is structured like an operating surface: tight composition, deliberate negative space, and cards that guide attention from signal to action.",
  },
];

const productSignals = [
  ["Real-time telemetry", "temperature, AQI, mobility, water systems"],
  ["Programmable access", "per-read and recurring plans"],
  ["Proof layer", "blob metadata, provenance, integrity"],
  ["Producer economics", "95% share routed to sensor owners"],
];

const featuredStreams = [
  {
    title: "Urban air intelligence",
    region: "Central Jakarta",
    stat: "128K+ readings",
    accent: "from-cyan-300/40 via-sky-400/15 to-transparent",
  },
  {
    title: "Agricultural moisture grid",
    region: "Ubud cluster",
    stat: "12-node live array",
    accent: "from-emerald-300/40 via-teal-400/15 to-transparent",
  },
  {
    title: "Mobility density feed",
    region: "Surabaya corridor",
    stat: "426 active blobs",
    accent: "from-violet-300/35 via-fuchsia-400/15 to-transparent",
  },
];

export default function Home() {
  return (
    <div className="pb-24">
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8 lg:pt-16">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[34px] border border-white/8 bg-white/[0.04] p-6 shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8 lg:p-10">
            <div className="mb-10 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-cyan-100/80">
                Fluxora // signal market layer
              </span>
              <span className="rounded-full border border-white/8 bg-white/[0.04] px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/45">
                Shelby-backed telemetry economy
              </span>
            </div>

            <div className="max-w-4xl space-y-6">
              <p className="text-xs uppercase tracking-[0.32em] text-white/38">Decentralized IoT marketplace</p>
              <h1 className="max-w-4xl text-5xl font-semibold leading-[0.92] tracking-[-0.06em] text-white sm:text-6xl lg:text-[86px]">
                Turn live sensor
                <span className="block bg-gradient-to-r from-white via-cyan-200 to-emerald-200 bg-clip-text text-transparent">
                  signals into premium data products.
                </span>
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
                Fluxora translates machine output into a market-native experience. Producers stream telemetry into Shelby-backed storage, buyers subscribe to verifiable feeds, and the interface keeps proof, pricing, and momentum in one visual rhythm.
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href="/marketplace"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-white px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
              >
                Explore marketplace
                <span className="transition group-hover:translate-x-1">↗</span>
              </a>
              <a
                href="/dashboard"
                className="inline-flex items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-6 py-4 text-sm font-medium text-white/85 transition hover:border-white/20 hover:bg-white/[0.08]"
              >
                Open producer console
              </a>
            </div>

            <div className="mt-14 grid gap-4 md:grid-cols-4">
              {[
                ["12.4M", "daily events"],
                ["480+", "producer wallets"],
                ["99.97%", "verified blob integrity"],
                ["95%", "creator revenue share"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-[26px] border border-white/8 bg-slate-950/70 p-5">
                  <div className="text-3xl font-semibold tracking-[-0.05em] text-white">{value}</div>
                  <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-white/38">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="rounded-[34px] border border-white/8 bg-[linear-gradient(180deg,rgba(8,15,30,0.92),rgba(3,8,20,0.98))] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
              <div className="flex items-center justify-between border-b border-white/8 pb-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-cyan-100/65">Live signal lanes</div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-white">Regional demand pulse</div>
                </div>
                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                  284 streams active
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {signalLanes.map((lane, index) => (
                  <div key={lane.region} className="rounded-[24px] border border-white/8 bg-white/[0.03] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="text-lg font-medium text-white">{lane.region}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.18em] text-white/38">{lane.category}</div>
                      </div>
                      <div className="text-xs text-cyan-200">{lane.utilization}</div>
                    </div>
                    <div className="mt-4 h-2 rounded-full bg-white/8">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-cyan-300 via-sky-400 to-emerald-300"
                        style={{ width: `${62 + index * 8}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[34px] border border-white/8 bg-white/[0.04] p-6">
              <div className="text-[11px] uppercase tracking-[0.24em] text-white/40">Operating stack</div>
              <div className="mt-4 space-y-4">
                {productSignals.map(([title, body]) => (
                  <div key={title} className="flex items-start gap-4 rounded-[22px] border border-white/8 bg-slate-950/65 p-4">
                    <div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_18px_rgba(34,211,238,0.8)]" />
                    <div>
                      <div className="text-sm font-semibold text-white">{title}</div>
                      <div className="mt-1 text-sm leading-7 text-slate-400">{body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-px overflow-hidden rounded-[34px] border border-white/8 bg-white/8 lg:grid-cols-3">
          {operatingPrinciples.map((item) => (
            <div key={item.eyebrow} className="bg-[linear-gradient(180deg,rgba(5,8,22,0.96),rgba(7,12,28,0.9))] p-8">
              <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/65">Vector {item.eyebrow}</div>
              <h2 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white">{item.title}</h2>
              <p className="mt-4 text-sm leading-8 text-slate-300">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
          <div className="rounded-[34px] border border-white/8 bg-white/[0.04] p-8">
            <div className="text-[11px] uppercase tracking-[0.28em] text-cyan-200/65">Featured inventory</div>
            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
              A market identity that feels like infrastructure, not a generic app.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-slate-300">
              The redesign pushes Fluxora toward a sharper capital-markets rhythm while preserving its own personality: marine-cyan accents, deep control-room contrast, and motion cues that feel alive without becoming template cosplay.
            </p>
            <div className="mt-8">
              <a
                href="/dashboard"
                className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-medium text-white/90 transition hover:border-cyan-300/20 hover:bg-cyan-300/10"
              >
                Review producer shell
                <span>→</span>
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {featuredStreams.map((stream) => (
              <div key={stream.title} className="group relative overflow-hidden rounded-[30px] border border-white/8 bg-slate-950/75 p-6 transition hover:-translate-y-1 hover:border-cyan-300/18">
                <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${stream.accent}`} />
                <div className="relative">
                  <div className="text-[11px] uppercase tracking-[0.24em] text-white/38">{stream.region}</div>
                  <div className="mt-8 text-2xl font-semibold tracking-[-0.04em] text-white">{stream.title}</div>
                  <div className="mt-3 text-sm leading-7 text-slate-300">{stream.stat}</div>
                  <div className="mt-12 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-cyan-200/70">
                    View listing <span className="transition group-hover:translate-x-1">↗</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
