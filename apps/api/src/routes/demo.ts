import { FastifyInstance } from "fastify";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { sensors, users } from "../db/schema.js";
import { getShelbyService } from "../services/shelby.js";

const DEMO_SENSORS = [
  {
    id: "sensor-001",
    name: "Jakarta Air Quality Monitor",
    description: "High-frequency AQI feed from central Jakarta roads.",
    type: "air_quality",
    locationLabel: "Central Jakarta, Indonesia",
    pricingDaily: 5,
    pricingHourly: 0.5,
    pricingMonthly: 50,
    pricingPerRead: 0.001,
    sample: [
      { timestamp: Date.now() - 180000, values: { pm25: 42, pm10: 58, humidity: 71 }, unit: "aqi" },
      { timestamp: Date.now() - 120000, values: { pm25: 39, pm10: 54, humidity: 70 }, unit: "aqi" },
      { timestamp: Date.now() - 60000, values: { pm25: 41, pm10: 56, humidity: 69 }, unit: "aqi" },
    ],
  },
  {
    id: "sensor-002",
    name: "Bali Soil Moisture Array",
    description: "Crop and irrigation telemetry from Ubud greenhouses.",
    type: "soil_moisture",
    locationLabel: "Ubud, Bali, Indonesia",
    pricingDaily: 8,
    pricingHourly: 0.8,
    pricingMonthly: 72,
    pricingPerRead: 0.002,
    sample: [
      { timestamp: Date.now() - 180000, values: { moisture: 63, temperature: 28.3, irrigation: true }, unit: "%" },
      { timestamp: Date.now() - 120000, values: { moisture: 61, temperature: 28.1, irrigation: false }, unit: "%" },
      { timestamp: Date.now() - 60000, values: { moisture: 64, temperature: 28.4, irrigation: true }, unit: "%" },
    ],
  },
];

export async function demoRoutes(app: FastifyInstance) {
  app.post("/api/demo/seed", async (_request, reply) => {
    try {
      let [owner] = await db.select().from(users).where(eq(users.walletAddress, "0xfluxora-demo")).limit(1);
      if (!owner) {
        [owner] = await db
          .insert(users)
          .values({ walletAddress: "0xfluxora-demo", chainType: "aptos", displayName: "Fluxora Demo", role: "producer" })
          .returning();
      }

      const shelby = getShelbyService();
      const seeded: string[] = [];

      for (const sensor of DEMO_SENSORS) {
        const [existing] = await db.select().from(sensors).where(eq(sensors.id, sensor.id)).limit(1);

        if (!existing) {
          await db.insert(sensors).values({
            id: sensor.id,
            name: sensor.name,
            description: sensor.description,
            type: sensor.type,
            ownerId: owner.id,
            locationLat: -6.2,
            locationLng: 106.8,
            locationLabel: sensor.locationLabel,
            pricingPerRead: sensor.pricingPerRead,
            pricingHourly: sensor.pricingHourly,
            pricingDaily: sensor.pricingDaily,
            pricingMonthly: sensor.pricingMonthly,
            metadata: { seeded: "true" },
          });
        }

        await shelby.uploadBlob(
          sensor.id,
          sensor.sample.map((row) => ({
            timestamp: row.timestamp,
            values: row.values,
            unit: row.unit,
          })),
          sensor.sample[0].timestamp,
          sensor.sample[sensor.sample.length - 1].timestamp
        );

        seeded.push(sensor.id);
      }

      return { success: true, data: { seeded }, message: "Demo sensors and Shelby blobs seeded" };
    } catch (error) {
      console.error("[Demo] Seed failed", error);
      reply.status(500);
      return { success: false, error: "Failed to seed demo data" };
    }
  });
}
