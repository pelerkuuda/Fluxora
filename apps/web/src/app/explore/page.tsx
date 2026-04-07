// Fluxora Explore Page — Map View

export default function ExplorePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10">
        <h1 className="text-3xl font-bold sm:text-4xl">Explore Sensors</h1>
        <p className="mt-2 text-gray-400">
          Discover IoT sensors around the world. Click a pin to view data and subscribe.
        </p>
      </div>

      {/* Map Placeholder */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
        <div className="flex h-[500px] items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <h3 className="text-lg font-semibold mb-2">Interactive Map</h3>
            <p className="text-sm text-gray-400 max-w-md">
              Map integration coming soon. Will use Mapbox GL to show sensor locations worldwide
              with real-time data overlays.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {[
                { city: "Jakarta", sensors: 5, flag: "🇮🇩" },
                { city: "Singapore", sensors: 3, flag: "🇸🇬" },
                { city: "Tokyo", sensors: 8, flag: "🇯🇵" },
                { city: "Bangkok", sensors: 4, flag: "🇹🇭" },
                { city: "Sydney", sensors: 2, flag: "🇦🇺" },
              ].map((loc) => (
                <div
                  key={loc.city}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm"
                >
                  <span>{loc.flag}</span>
                  <span>{loc.city}</span>
                  <span className="text-xs text-gray-500">{loc.sensors} sensors</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 text-center">
          <div className="text-3xl font-bold">12</div>
          <div className="text-sm text-gray-400">Countries</div>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 text-center">
          <div className="text-3xl font-bold">2,400+</div>
          <div className="text-sm text-gray-400">Active Sensors</div>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6 text-center">
          <div className="text-3xl font-bold">11</div>
          <div className="text-sm text-gray-400">Sensor Types</div>
        </div>
      </div>
    </div>
  );
}
