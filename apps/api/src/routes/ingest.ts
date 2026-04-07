// Fluxora Data Ingestion Routes
// Receives data from IoT sensors and buffers for batch upload

import { FastifyInstance } from "fastify";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { sensors, ingestBuffer } from "../db/schema.js";

const ingestSingleSchema = z.object({
  values: z.record(z.union([z.number(), z.string(), z.boolean()])),
  unit: z.string().default(""),
  timestamp: z.number().optional(), // epoch ms, defaults to now
});

const ingestBatchSchema = z.object({
  data: z.array(ingestSingleSchema).min(1).max(1000),
});

export async function ingestRoutes(app: FastifyInstance) {
  // POST /api/ingest/:sensorId — Single data point
  app.post("/api/ingest/:sensorId", async (request, reply) => {
    const { sensorId } = request.params as { sensorId: string };
    const apiKey = request.headers["x-api-key"] as string;

    if (!apiKey) {
      reply.status(401);
      return { success: false, error: "Missing API key (x-api-key header)" };
    }

    try {
      // Verify sensor exists and API key matches
      const [sensor] = await db
        .select()
        .from(sensors)
        .where(eq(sensors.id, sensorId))
        .limit(1);

      if (!sensor) {
        reply.status(404);
        return { success: false, error: "Sensor not found" };
      }

      if (sensor.apiKey !== apiKey) {
        reply.status(403);
        return { success: false, error: "Invalid API key" };
      }

      if (sensor.status !== "active") {
        reply.status(400);
        return { success: false, error: "Sensor is not active" };
      }

      const body = ingestSingleSchema.parse(request.body);

      const [inserted] = await db
        .insert(ingestBuffer)
        .values({
          sensorId,
          timestamp: new Date(body.timestamp || Date.now()),
          values: body.values,
          unit: body.unit,
        })
        .returning();

      return {
        success: true,
        data: { id: inserted.id, buffered: true },
        message: "Data point buffered for batch upload to Shelby",
      };
    } catch (err) {
      if (err instanceof z.ZodError) {
        reply.status(400);
        return { success: false, error: err.errors };
      }
      console.error("[Ingest] Error:", err);
      reply.status(500);
      return { success: false, error: "Failed to ingest data" };
    }
  });

  // POST /api/ingest/:sensorId/batch — Multiple data points
  app.post("/api/ingest/:sensorId/batch", async (request, reply) => {
    const { sensorId } = request.params as { sensorId: string };
    const apiKey = request.headers["x-api-key"] as string;

    if (!apiKey) {
      reply.status(401);
      return { success: false, error: "Missing API key" };
    }

    try {
      const [sensor] = await db
        .select()
        .from(sensors)
        .where(eq(sensors.id, sensorId))
        .limit(1);

      if (!sensor || sensor.apiKey !== apiKey) {
        reply.status(403);
        return { success: false, error: "Invalid sensor or API key" };
      }

      const body = ingestBatchSchema.parse(request.body);

      const values = body.data.map((d) => ({
        sensorId,
        timestamp: new Date(d.timestamp || Date.now()),
        values: d.values,
        unit: d.unit,
      }));

      await db.insert(ingestBuffer).values(values);

      return {
        success: true,
        data: { count: values.length, buffered: true },
        message: `${values.length} data points buffered for batch upload`,
      };
    } catch (err) {
      if (err instanceof z.ZodError) {
        reply.status(400);
        return { success: false, error: err.errors };
      }
      console.error("[Ingest] Batch error:", err);
      reply.status(500);
      return { success: false, error: "Failed to ingest batch data" };
    }
  });
}
