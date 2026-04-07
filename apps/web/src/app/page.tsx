const metrics = [
  ["12.4M", "telemetry events / day"],
  ["480+", "producer identities"],
  ["99.97%", "integrity confidence"],
];

export default function Home() {
  return (
    <section className="flex min-h-screen flex-col justify-between px-4 pb-16 pt-36 sm:px-6 lg:px-8">
      <div />

      <div className="mx-auto w-full max-w-6xl text-center">
        <div className="reveal-up mb-6 inline-flex h-8 items-center justify-center border border-border bg-[#262626]/50 px-3 font-mono text-sm font-medium text-white/50 backdrop-blur-xs">
          <span className="pulse-dot mr-2 inline-block h-2.5 w-2.5 rounded-full bg-primary shadow-glow shadow-primary/50" />
          BETA RELEASE
        </div>

        <h1 className="reveal-up reveal-delay-1 font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[92px]">
          Unlock your <br />
          <i className="font-light">signal</i> economy
        </h1>

        <p className="reveal-up reveal-delay-2 mx-auto mt-8 max-w-[560px] text-balance font-mono text-sm text-white/60 sm:text-base">
          Through Shelby-backed storage, verifiable machine telemetry, and premium access rails for live sensor data.
        </p>

        <div className="reveal-up reveal-delay-3 mt-14 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="/marketplace"
            className="motion-button inline-flex h-12 items-center justify-center border border-border px-6 font-mono text-sm uppercase text-white transition-colors duration-150 ease-out hover:border-primary hover:text-primary"
          >
            [Open Marketplace]
          </a>
          <a
            href="/dashboard"
            className="motion-button inline-flex h-12 items-center justify-center border border-border px-6 font-mono text-sm uppercase text-white/70 transition-colors duration-150 ease-out hover:text-white"
          >
            [Producer Dashboard]
          </a>
        </div>
      </div>

      <div className="reveal-up reveal-delay-4 mx-auto grid w-full max-w-6xl gap-4 sm:grid-cols-3">
        {metrics.map(([value, label]) => (
          <div key={label} className="motion-card motion-frame border border-border px-5 py-4 text-center">
            <div className="text-2xl tracking-[-0.04em] text-white sm:text-3xl">{value}</div>
            <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] text-white/45">{label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
