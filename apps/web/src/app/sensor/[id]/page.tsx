import { SENSOR_TYPE_CONFIG } from "@fluxora/shared";
import { SensorAccessPanel } from "@/components/sensor-access-panel";
import { apiFetch, demoApi } from "@/lib/api";

type SensorDetail = {
  id: string;
  name: string;
  description: string;
  type: string;
  locationLabel?: string | null;
  pricingPerRead: number;
  pricingHourly: number;
  pricingDaily: number;
  pricingMonthly: number;
};

type SensorBlob = {
  blobName: string;
  merkleRoot: string;
  createdAt?: string;
  dataPoints?: number;
  preview?: Array<Record<string, unknown>>;
  manifest?: {
    storageNetwork?: string;
    source?: string;
    checksumSha256?: string;
  } | null;
};

const FALLBACK_WALLET = "0xfluxora-demo";

export default async function SensorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  await demoApi.seed();

  const sensorResponse = await apiFetch<SensorDetail>(`/api/sensors/${id}`, {
    cache: "no-store",
  });

  if (!sensorResponse.success || !sensorResponse.data) {
    return (
      <div className="mx-auto max-w-4xl px-4 pb-20 pt-36 text-center font-mono text-sm text-white/60 sm:px-6 lg:px-8">
        Sensor not found or failed to load.
      </div>
    );
  }

  const sensor = sensorResponse.data;
  const typeKey = (sensor.type in SENSOR_TYPE_CONFIG ? sensor.type : "custom") as keyof typeof SENSOR_TYPE_CONFIG;

  const previewResponse = await apiFetch<{ blobs?: SensorBlob[] }>(`/api/marketplace/${id}/data`, {
    cache: "no-store",
    headers: { "x-wallet-address": FALLBACK_WALLET },
  });

  const blobs = previewResponse.success ? previewResponse.data?.blobs ?? [] : [];
  const latestBlob = blobs[0];
  const previewRows = latestBlob?.preview?.slice(0, 3) ?? [];
  const recordCount = blobs.reduce((sum, blob) => sum + (blob.dataPoints ?? blob.preview?.length ?? 0), 0);
  const latestTimestamp = previewRows
    .map((row) => {
      const value = row.timestamp;
      return typeof value === "number" ? value : Number(value);
    })
    .filter((value) => !Number.isNaN(value))
    .sort((a, b) => b - a)[0];

  const pricingPlans = [
    ["Per read", `$${Number(sensor.pricingPerRead ?? 0).toFixed(3)}`],
    ["Hourly", `$${Number(sensor.pricingHourly ?? 0).toFixed(2)}`],
    ["Daily", `$${Number(sensor.pricingDaily ?? 0).toFixed(2)}`],
    ["Monthly", `$${Number(sensor.pricingMonthly ?? 0).toFixed(2)}`],
  ];

  const integrity = [
    ["Storage provider", latestBlob?.manifest?.storageNetwork || "Shelby testnet"],
    ["Blob source", latestBlob?.manifest?.source || "mock"],
    ["Merkle root", latestBlob?.merkleRoot ? `${latestBlob.merkleRoot.slice(0, 12)}...` : "Not available"],
    ["Checksum", latestBlob?.manifest?.checksumSha256 ? `${latestBlob.manifest.checksumSha256.slice(0, 12)}...` : "Not available"],
  ];

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
        <div className="mt-4 font-mono text-sm uppercase text-primary">
          {sensor.locationLabel || "Unknown location"} • {SENSOR_TYPE_CONFIG[typeKey].label}
        </div>
      </div>

      <section className="section-reveal mt-12 grid gap-4 sm:grid-cols-3">
        {[
          [`${Math.max(1, Math.round(recordCount / 1000))}K`, "indexed records"],
          [latestTimestamp ? new Date(latestTimestamp).toLocaleTimeString() : "Live", "latest preview tick"],
          [blobs.length > 0 ? String(blobs.length).padStart(2, "0") : "00", "Shelby blobs"],
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
              {previewRows.length > 0 ? (
                previewRows.map((row, index) => {
                  const timestamp = row.timestamp;
                  const values = row.values && typeof row.values === "object" ? Object.entries(row.values as Record<string, unknown>) : [];
                  const [metric, value] = values[0] ?? ["payload", JSON.stringify(row)];
                  return (
                    <div key={`${metric}-${index}`} className="motion-card flex items-center justify-between gap-4 border border-border px-4 py-3 font-mono text-sm text-white/70">
                      <span className="uppercase">{metric}</span>
                      <span className="text-white">{String(value)}</span>
                      <span className="text-white/40">
                        {typeof timestamp === "number" || typeof timestamp === "string"
                          ? new Date(Number(timestamp)).toLocaleString()
                          : "recent"}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="motion-card border border-border px-4 py-4 font-mono text-sm text-white/60">
                  Preview data will appear here after demo seeding and access grant.
                </div>
              )}
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
