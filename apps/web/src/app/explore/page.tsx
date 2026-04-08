const mapPoints = [
  { city: "Jakarta", top: "42%", left: "78%", label: "Air quality", streams: 5 },
  { city: "Singapore", top: "58%", left: "82%", label: "Weather", streams: 3 },
  { city: "Tokyo", top: "36%", left: "88%", label: "Industrial", streams: 8 },
  { city: "Bangkok", top: "50%", left: "76%", label: "Mobility", streams: 4 },
  { city: "Sydney", top: "78%", left: "90%", label: "Coastal env", streams: 2 },
];

const locations = [
  ["Jakarta", "05 active streams", "High-demand air quality + traffic"],
  ["Singapore", "03 active streams", "Commercial weather and logistics"],
  ["Tokyo", "08 active streams", "Dense industrial telemetry lanes"],
  ["Bangkok", "04 active streams", "Mobility and heat index feeds"],
  ["Sydney", "02 active streams", "Coastal environmental monitoring"],
];

const stats = [
  ["12", "countries online"],
  ["2.4K+", "active sensors"],
  ["11", "signal classes"],
];

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 pt-36 sm:px-6 lg:px-8">
      <div className="section-reveal text-center">
        <div className="font-mono text-xs uppercase tracking-[0.24em] text-white/45">EXPLORE</div>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl">Scan the live signal footprint.</h1>
        <p className="mx-auto mt-6 max-w-[620px] font-mono text-sm leading-7 text-white/60 sm:text-base">
          A spatial view of verified machine telemetry, organized by city clusters and ready for deeper marketplace access.
        </p>
      </div>

      <section className="section-reveal orbit-shell mt-12 border border-border p-6 sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch">
          <div className="motion-frame relative flex min-h-[420px] flex-1 items-center justify-center overflow-hidden border border-dashed border-border bg-white/[0.02] text-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,199,0,0.08),transparent_45%)]" />
            <div className="absolute inset-[12%] rounded-[999px] border border-white/8" />
            <div className="absolute inset-[22%] rounded-[999px] border border-white/8" />
            <div className="absolute inset-[32%] rounded-[999px] border border-white/8" />

            {mapPoints.map((point) => (
              <div
                key={point.city}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ top: point.top, left: point.left }}
              >
                <div className="pulse-dot h-3 w-3 rounded-full bg-primary shadow-[0_0_18px_rgba(255,199,0,0.55)]" />
                <div className="mt-3 border border-border bg-black/85 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/70 backdrop-blur-sm">
                  <div className="text-primary">{point.city}</div>
                  <div className="mt-1">{point.label}</div>
                  <div className="mt-1 text-white/45">{point.streams} streams</div>
                </div>
              </div>
            ))}

            <div className="relative z-10 max-w-md px-6">
              <div className="font-mono text-xs uppercase tracking-[0.24em] text-white/45">Interactive footprint</div>
              <div className="mt-4 font-serif text-3xl sm:text-4xl">Global sensor atlas</div>
              <p className="mx-auto mt-4 font-mono text-sm leading-7 text-white/60">
                Demo-mode geospatial layout with live city pins, Shelby-backed stream clusters, and instant routing into access flows.
              </p>
            </div>
          </div>

          <div className="w-full lg:max-w-sm">
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-white/45">City clusters</div>
            <div className="mt-5 space-y-4">
              {locations.map(([city, count, note]) => (
                <div key={city} className="motion-card motion-frame border border-border p-4">
                  <div className="font-serif text-2xl text-white">{city}</div>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">{count}</div>
                  <p className="mt-3 font-mono text-sm leading-6 text-white/60">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-reveal mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map(([value, label]) => (
          <div key={label} className="motion-card motion-frame border border-border px-5 py-4 text-center">
            <div className="text-2xl tracking-[-0.04em] text-white sm:text-3xl">{value}</div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">{label}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
