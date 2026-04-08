import { FastifyInstance } from "fastify";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { sensors, subscriptions, users } from "../db/schema.js";
import { getOnchainService } from "../services/onchain.js";

const quoteSchema = z.object({
  sensorId: z.string().min(1),
  plan: z.enum(["per_read", "hourly", "daily", "monthly"]),
});

const settleSchema = z.object({
  sensorId: z.string().min(1),
  plan: z.enum(["per_read", "hourly", "daily", "monthly"]),
  txHash: z.string().min(8),
  buyerAddress: z.string().min(4),
  amountPaid: z.number().positive().optional(),
});

export async function onchainRoutes(app: FastifyInstance) {
  app.post("/api/onchain/quote", async (request, reply) => {
    try {
      const body = quoteSchema.parse(request.body);
      const [sensor] = await db.select().from(sensors).where(eq(sensors.id, body.sensorId)).limit(1);

      if (!sensor) {
        reply.status(404);
        return { success: false, error: "Sensor not found" };
      }

      const amount =
        body.plan === "hourly"
          ? sensor.pricingHourly
          : body.plan === "daily"
            ? sensor.pricingDaily
            : body.plan === "monthly"
              ? sensor.pricingMonthly
              : sensor.pricingPerRead;

      const quote = getOnchainService().quoteSubscription({
        sensorId: sensor.id,
        plan: body.plan,
        recipientAddress: sensor.ownerId,
        amount,
      });

      return { success: true, data: quote };
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400);
        return { success: false, error: JSON.stringify(error.errors) };
      }
      reply.status(500);
      return { success: false, error: "Failed to build quote" };
    }
  });

  app.post("/api/onchain/settle", async (request, reply) => {
    try {
      const body = settleSchema.parse(request.body);
      const [sensor] = await db.select().from(sensors).where(eq(sensors.id, body.sensorId)).limit(1);

      if (!sensor) {
        reply.status(404);
        return { success: false, error: "Sensor not found" };
      }

      const normalizedBuyerAddress = body.buyerAddress.trim().toLowerCase();

      let [buyer] = await db.select().from(users).where(eq(users.walletAddress, normalizedBuyerAddress)).limit(1);
      if (!buyer) {
        [buyer] = await db
          .insert(users)
          .values({ walletAddress: normalizedBuyerAddress, chainType: "aptos", role: "user" })
          .returning();
      }

      const now = new Date();
      const validUntil = new Date(
        now.getTime() +
          (body.plan === "hourly"
            ? 60 * 60 * 1000
            : body.plan === "daily"
              ? 24 * 60 * 60 * 1000
              : body.plan === "monthly"
                ? 30 * 24 * 60 * 60 * 1000
                : 365 * 24 * 60 * 60 * 1000)
      );

      const amountPaid =
        body.amountPaid ??
        (body.plan === "hourly"
          ? sensor.pricingHourly
          : body.plan === "daily"
            ? sensor.pricingDaily
            : body.plan === "monthly"
              ? sensor.pricingMonthly
              : sensor.pricingPerRead);

      const [subscription] = await db
        .insert(subscriptions)
        .values({
          buyerId: buyer.id,
          sensorId: sensor.id,
          plan: body.plan,
          status: "active",
          startTime: now,
          endTime: validUntil,
          txHash: body.txHash,
          amountPaid,
        })
        .returning();

      const receipt = getOnchainService().buildReceipt({
        subscriptionId: subscription.id,
        sensorId: sensor.id,
        buyerAddress: normalizedBuyerAddress,
        plan: body.plan,
        txHash: body.txHash,
        amountPaid,
        validUntil,
      });

      return { success: true, data: receipt, message: "On-chain access settlement recorded" };
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400);
        return { success: false, error: JSON.stringify(error.errors) };
      }
      reply.status(500);
      return { success: false, error: "Failed to settle on-chain access" };
    }
  });
}
