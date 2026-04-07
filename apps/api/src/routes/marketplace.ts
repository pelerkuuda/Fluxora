// Fluxora Marketplace Routes
// Browse, subscribe, and access sensor data

import { FastifyInstance } from "fastify";
import { z } from "zod";
import { eq, desc, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { sensors, dataBlobs, subscriptions, users } from "../db/schema.js";

const subscribeSchema = z.object({
  sensorId: z.string(),
  plan: z.enum(["per_read", "hourly", "daily", "monthly"]),
  txHash: z.string().min(1),
  buyerAddress: z.string().min(1),
});

export async function marketplaceRoutes(app: FastifyInstance) {
  // GET /api/marketplace — Browse sensor listings
  app.get("/api/marketplace", async (request, reply) => {
    const {
      type,
      search,
      sortBy = "created",
      page = 1,
      limit = 20,
    } = request.query as {
      type?: string;
      search?: string;
      sortBy?: string;
      page?: number;
      limit?: number;
    };

    try {
      // Get sensors with blob count
      const results = await db
        .select({
          sensor: sensors,
          totalBlobs: sql<number>`count(${dataBlobs.id})::int`,
          totalDataPoints: sql<number>`coalesce(sum(${dataBlobs.dataPoints}), 0)::int`,
          lastUpdated: sql<Date>`max(${dataBlobs.createdAt})`,
        })
        .from(sensors)
        .leftJoin(dataBlobs, eq(sensors.id, dataBlobs.sensorId))
        .where(eq(sensors.status, "active"))
        .groupBy(sensors.id)
        .orderBy(desc(sensors.createdAt))
        .limit(Number(limit))
        .offset((Number(page) - 1) * Number(limit));

      const listings = results.map((r) => ({
        ...r.sensor,
        totalBlobs: r.totalBlobs,
        totalDataPoints: r.totalDataPoints,
        lastUpdated: r.lastUpdated,
      }));

      return {
        success: true,
        data: listings,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: listings.length,
          hasMore: listings.length === Number(limit),
        },
      };
    } catch (err) {
      console.error("[Marketplace] Error:", err);
      reply.status(500);
      return { success: false, error: "Failed to fetch marketplace listings" };
    }
  });

  // POST /api/marketplace/subscribe — Subscribe to sensor data
  app.post("/api/marketplace/subscribe", async (request, reply) => {
    try {
      const body = subscribeSchema.parse(request.body);

      // Verify sensor exists
      const [sensor] = await db
        .select()
        .from(sensors)
        .where(eq(sensors.id, body.sensorId))
        .limit(1);

      if (!sensor) {
        reply.status(404);
        return { success: false, error: "Sensor not found" };
      }

      // TODO: Verify tx on Aptos chain
      // const verified = await verifyAptosTransaction(body.txHash);

      // Calculate subscription end time based on plan
      const now = new Date();
      let endTime: Date;
      let amount: number;

      switch (body.plan) {
        case "hourly":
          endTime = new Date(now.getTime() + 60 * 60 * 1000);
          amount = sensor.pricingHourly;
          break;
        case "daily":
          endTime = new Date(now.getTime() + 24 * 60 * 60 * 1000);
          amount = sensor.pricingDaily;
          break;
        case "monthly":
          endTime = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
          amount = sensor.pricingMonthly;
          break;
        default: // per_read
          endTime = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
          amount = sensor.pricingPerRead;
      }

      // Find or create buyer user
      const normalizedBuyerAddress = body.buyerAddress.trim().toLowerCase();

      let [buyer] = await db
        .select()
        .from(users)
        .where(eq(users.walletAddress, normalizedBuyerAddress))
        .limit(1);

      if (!buyer) {
        [buyer] = await db
          .insert(users)
          .values({
            walletAddress: normalizedBuyerAddress,
            chainType: "ethereum",
            role: "user",
          })
          .returning();
      }

      // Create subscription
      const [subscription] = await db
        .insert(subscriptions)
        .values({
          buyerId: buyer.id,
          sensorId: body.sensorId,
          plan: body.plan,
          startTime: now,
          endTime,
          txHash: body.txHash,
          amountPaid: amount,
        })
        .returning();

      return {
        success: true,
        data: subscription,
        message: `Subscribed to ${sensor.name} (${body.plan} plan)`,
      };
    } catch (err) {
      if (err instanceof z.ZodError) {
        reply.status(400);
        return { success: false, error: err.errors };
      }
      console.error("[Marketplace] Subscribe error:", err);
      reply.status(500);
      return { success: false, error: "Failed to subscribe" };
    }
  });

  // GET /api/marketplace/:sensorId/data — Access sensor data (requires subscription)
  app.get("/api/marketplace/:sensorId/data", async (request, reply) => {
    const { sensorId } = request.params as { sensorId: string };
    const buyerAddress = request.headers["x-wallet-address"] as string;

    if (!buyerAddress) {
      reply.status(401);
      return { success: false, error: "Missing wallet address" };
    }

    try {
      // Check active subscription
      const [buyer] = await db
        .select()
        .from(users)
        .where(eq(users.walletAddress, buyerAddress))
        .limit(1);

      if (!buyer) {
        reply.status(403);
        return { success: false, error: "No subscription found" };
      }

      const activeSubs = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.buyerId, buyer.id))
        .limit(1);

      const hasAccess = activeSubs.some(
        (s) =>
          s.sensorId === sensorId &&
          s.status === "active" &&
          new Date(s.endTime) > new Date()
      );

      if (!hasAccess) {
        reply.status(403);
        return {
          success: false,
          error: "No active subscription for this sensor",
        };
      }

      // Get blobs for this sensor
      const blobs = await db
        .select()
        .from(dataBlobs)
        .where(eq(dataBlobs.sensorId, sensorId))
        .orderBy(desc(dataBlobs.createdAt))
        .limit(50);

      // TODO: Actually download from Shelby
      // const shelby = getShelbyService();
      // const data = await Promise.all(blobs.map(b => shelby.downloadBlob(b.blobName)));

      return {
        success: true,
        data: {
          blobs,
          message: "Use blob names to download data via Shelby SDK",
        },
      };
    } catch (err) {
      console.error("[Marketplace] Data access error:", err);
      reply.status(500);
      return { success: false, error: "Failed to access data" };
    }
  });
}
