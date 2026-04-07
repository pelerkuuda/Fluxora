const protocolHighlights = [
  {
    label: "Blob storage",
    value: "Shelby-backed uploads with verifiable integrity metadata",
  },
  {
    label: "Settlement",
    value: "Aptos payment and access flow for machine data products",
  },
  {
    label: "Packaging",
    value: "Batch sensor events into monetizable, queryable data blobs",
  },
];

const cliSteps = [
  ["01", "Register producer sensor", "Create a stream, pricing rules, and metadata surface."],
  ["02", "Ingest and batch data", "Collect telemetry, roll it into blobs, publish commitments."],
  ["03", "Grant paid access", "Buyers subscribe, verify provenance, and read with confidence."],
];

const metrics = [
  ["100", "storage epochs default"],
  ["0.001", "USDC per read baseline"],
  ["95%", "producer revenue split"],
  ["5 min", "default batch interval"],
];

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <section className="pt-8 lg:pt-12">
        <div className="overflow-hidden rounded-3xl border border-white/10 bg-[#07111b] shadow-[0_30px_120px_rgba(0,0,0,0.45)]">
          <div className="border-b border-white/10 bg-[#0d1723] px-5 py-3 text-[11px] uppercase tracking-[0.28em] text-[#8fb2d3] sm:px-8">
            fluxora / protocol shell / build on shelby
          </div>

          <div className="grid gap-10 px-5 py-10 sm:px-8 lg:grid-cols-[1.25fr_0.75fr] lg:px-10 lg:py-14">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#1d3956] bg-[#0b1a29] px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-[#8fb2d3]">
                <span className="h-2 w-2 rounded-full bg-[#4cc2ff]" />
                Shelby-native data marketplace
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-white sm:text-6xl lg:text-[76px]">
                Turn raw sensor output into verifiable, paid data products.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-[#9db0c3] sm:text-lg">
                Fluxora is a protocol-facing frontend for storing IoT telemetry on Shelby, publishing blob proofs,
                and selling access with cleaner marketplace rails.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  href="/marketplace"
                  className="inline-flex items-center justify-center rounded-xl border border-[#3d8cc7] bg-[#12304b] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#174062]"
                >
                  Open marketplace
                </a>
                <a
                  href="/dashboard"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3 text-sm font-medium text-[#dce8f5] transition hover:bg-white/[0.08]"
                >
                  Producer dashboard
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#08131f] p-4 text-sm text-[#cfe0ef]">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 text-[11px] uppercase tracking-[0.24em] text-[#7e97b0]">
                <span>session</span>
                <span>protocol-summary.ts</span>
              </div>
              <div className="space-y-4 pt-4 font-mono text-[13px] leading-7">
                <div>
                  <span className="text-[#4cc2ff]">network</span>
                  <span className="text-white"> = shelbynet</span>
                </div>
                <div>
                  <span className="text-[#4cc2ff]">storage</span>
                  <span className="text-white"> = blob uploads + merkle roots</span>
                </div>
                <div>
                  <span className="text-[#4cc2ff]">access</span>
                  <span className="text-white"> = per-read, hourly, daily, monthly</span>
                </div>
                <div>
                  <span className="text-[#4cc2ff]">producers</span>
                  <span className="text-white"> = sensors, labs, edge networks</span>
                </div>
                <div>
                  <span className="text-[#4cc2ff]">buyers</span>
                  <span className="text-white"> = analytics, AI, infra, research</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 py-8 lg:grid-cols-[0.95fr_1.05fr] lg:py-12">
        <div className="rounded-2xl border border-white/10 bg-[#08111a] p-6">
          <div className="text-[11px] uppercase tracking-[0.28em] text-[#7e97b0]">Why this exists</div>
          <h2 className="mt-4 text-3xl tracking-[-0.04em] text-white sm:text-4xl">
            Less marketing gloss, more protocol clarity.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-[#97abc0] sm:text-base">
            The redesign shifts Fluxora closer to Shelby source material: operational, developer-friendly, and explicit
            about blobs, commitments, storage duration, and paid access mechanics.
          </p>
        </div>

        <div className="grid gap-4">
          {protocolHighlights.map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-[#08111a] p-5">
              <div className="text-[11px] uppercase tracking-[0.24em] text-[#7e97b0]">{item.label}</div>
              <div className="mt-2 text-base leading-7 text-white">{item.value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-2xl border border-white/10 bg-[#08111a] p-6">
          <div className="text-[11px] uppercase tracking-[0.28em] text-[#7e97b0]">Operator flow</div>
          <div className="mt-6 space-y-4">
            {cliSteps.map(([index, title, body]) => (
              <div key={index} className="rounded-2xl border border-white/8 bg-[#0b1621] p-4">
                <div className="text-xs uppercase tracking-[0.24em] text-[#4cc2ff]">Step {index}</div>
                <div className="mt-2 text-lg text-white">{title}</div>
                <div className="mt-2 text-sm leading-7 text-[#97abc0]">{body}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {metrics.map(([value, label]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-[#08111a] p-6">
              <div className="text-3xl tracking-[-0.04em] text-white sm:text-4xl">{value}</div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-[#7e97b0]">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
