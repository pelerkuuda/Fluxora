"use client";

import { useEffect, useMemo, useState } from "react";
import { SENSOR_TYPE_CONFIG } from "@fluxora/shared";
import { SensorAccessPanel } from "@/components/sensor-access-panel";
import { demoApi, marketplaceApi } from "@/lib/api";

const FILTER_KEYS = ["temperature", "humidity", "air_quality", "soil_moisture", "traffic", "weather"] as const;

type FilterKey = (typeof FILTER_KEYS)[number];

type MarketplaceListing = {
  id: string;
  name: string;
  type: string;
  description?: string | null;
  locationLabel?: string | null;
  pricingDaily: number;
  totalDataPoints?: number;
};

export function MarketplaceClient() {
  const [activeFilter, setActiveFilter] = useState<FilterKey | "all">("all");
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadListings = async () => {
      setLoading(true);
      setError(null);

      await demoApi.seed();
      const response = await marketplaceApi.browse();

      if (response.success && Array.isArray(response.data)) {
        setListings(response.data as MarketplaceListing[]);
      } else {
        setError(response.error || "Failed to load marketplace listings");
      }

      setLoading(false);
    };

    void loadListings();
  }, []);

  const filteredListings = useMemo(() => {
    if (activeFilter === "all") return listings;
    return listings.filter((listing) => listing.type === activeFilter);
  }, [activeFilter, listings]);

  const filterCounts = useMemo(() => {
    return FILTER_KEYS.reduce(
      (acc, key) => {
        acc[key] = listings.filter((listing) => listing.type === key).length;
        return acc;
      },
      {} as Record<FilterKey, number>
    );
  }, [listings]);

  const stats = useMemo(() => {
    const totalPoints = filteredListings.reduce((sum, listing) => sum + (listing.totalDataPoints ?? 0), 0);
    const prices = filteredListings.map((listing) => Number(listing.pricingDaily ?? 0)).filter((price) => !Number.isNaN(price));
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

    return [
      [String(filteredListings.length).padStart(2, "0"), activeFilter === "all" ? "featured feeds" : `${activeFilter} feeds`],
      [`$${minPrice}${maxPrice !== minPrice ? `-$${maxPrice}` : ""}`, "daily access range"],
      [`${Math.max(1, Math.round(totalPoints / 1000))}K`, "sampled points indexed"],
    ] as const;
  }, [activeFilter, filteredListings]);

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
        {stats.map(([value, label]) => (
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
            <button
              onClick={() => setActiveFilter("all")}
              className={`motion-button flex w-full items-center justify-between border px-4 py-3 text-left font-mono text-sm uppercase ${
                activeFilter === "all" ? "border-primary text-primary" : "border-border text-white/70 hover:text-white"
              }`}
            >
              <span>All streams</span>
              <span className="text-[11px] text-white/45">{listings.length}</span>
            </button>
            {FILTER_KEYS.map((key) => {
              const config = SENSOR_TYPE_CONFIG[key];
              const isActive = activeFilter === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveFilter(key)}
                  className={`motion-button flex w-full items-center justify-between border px-4 py-3 text-left font-mono text-sm uppercase transition-colors duration-150 ease-out ${
                    isActive ? "border-primary text-primary" : "border-border text-white/70 hover:text-white"
                  }`}
                >
                  <span>{config.label}</span>
                  <span className="text-[11px] text-white/45">{filterCounts[key]}</span>
                </button>
              );
            })}
          </div>
        </aside>

        <div className="space-y-4">
          {loading ? (
            <div className="border border-border p-10 text-center font-mono text-sm text-white/60">
              Loading marketplace streams...
            </div>
          ) : error ? (
            <div className="border border-border p-10 text-center font-mono text-sm text-amber-300">
              {error}
            </div>
          ) : filteredListings.length > 0 ? (
            filteredListings.map((listing) => {
              const typeKey = (listing.type in SENSOR_TYPE_CONFIG ? listing.type : "custom") as keyof typeof SENSOR_TYPE_CONFIG;
              return (
                <div key={listing.id} className="motion-card motion-frame border border-border p-6 transition-colors duration-150 ease-out hover:border-primary">
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="lg:max-w-xl">
                      <div className="font-mono text-[11px] uppercase tracking-[0.22em] text-white/45">
                        {SENSOR_TYPE_CONFIG[typeKey].label}
                      </div>
                      <a href={`/sensor/${listing.id}`} className="block">
                        <h2 className="mt-3 font-serif text-3xl text-white">{listing.name}</h2>
                      </a>
                      <div className="mt-2 font-mono text-sm text-white/60">{listing.locationLabel || "Unknown location"}</div>
                      {listing.description ? (
                        <p className="mt-4 max-w-2xl font-mono text-sm leading-7 text-white/55">{listing.description}</p>
                      ) : null}
                    </div>

                    <div className="grid gap-4 font-mono text-sm uppercase text-white/65 sm:grid-cols-2 lg:text-right">
                      <div>
                        <div className="text-white/40">Daily access</div>
                        <div className="mt-2 text-2xl text-white">${Number(listing.pricingDaily ?? 0).toFixed(2)}</div>
                      </div>
                      <div>
                        <div className="text-white/40">Data points</div>
                        <div className="mt-2 text-white">{Math.max(1, Math.round((listing.totalDataPoints ?? 0) / 1000))}K</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <SensorAccessPanel sensorId={listing.id} compact />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="border border-border p-10 text-center font-mono text-sm text-white/60">
              No streams available for this filter yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
