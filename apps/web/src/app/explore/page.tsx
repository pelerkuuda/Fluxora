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
      <div className="text-center">
        <div className="font-mono text-xs uppercase tracking-[0.24em] text-white/45">EXPLORE</div>
        <h1 className="mt-4 font-serif text-4xl sm:text-5xl md:text-6xl">Scan the live signal footprint.</h1>
        <p className="mx-auto mt-6 max-w-[620px] font-mono text-sm leading-7 text-white/60 sm:text-base">
          A spatial view of verified machine telemetry, organized by city clusters and ready for deeper marketplace access.
        </p>
      </div>

      <section className="mt-12 border border-border p-6 sm:p-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch">
          <div className="flex min-h-[420px] flex-1 items-center justify-center border border-dashed border-border bg-white/[0.02] text-center">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.24em] text-white/45">Mapbox layer pending</div>
              <div className="mt-4 font-serif text-3xl sm:text-4xl">Global sensor atlas</div>
              <p className="mx-auto mt-4 max-w-md font-mono text-sm leading-7 text-white/60">
                The interactive world map lands next, with city pins, real-time overlays, and instant routing into each telemetry stream.
              </p>
            </div>
          </div>

          <div className="w-full lg:max-w-sm">
            <div className="font-mono text-xs uppercase tracking-[0.22em] text-white/45">City clusters</div>
            <div className="mt-5 space-y-4">
              {locations.map(([city, count, note]) => (
                <div key={city} className="border border-border p-4">
                  <div className="font-serif text-2xl text-white">{city}</div>
                  <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.18em] text-primary">{count}</div>
                  <p className="mt-3 font-mono text-sm leading-6 text-white/60">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-3">
        {stats.map(([value, label]) => (
          <div key={label} className="border border-border px-5 py-4 text-center">
            <div className="text-2xl tracking-[-0.04em] text-white sm:text-3xl">{value}</div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">{label}</div>
          </div>
        ))}
      </section>
    </div>
  );
}
