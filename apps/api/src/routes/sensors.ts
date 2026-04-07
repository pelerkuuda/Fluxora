// Fluxora Sensor Routes
// CRUD operations for sensor management

import { FastifyInstance } from "fastify";
import { z } from "zod";
import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { sensors } from "../db/schema.js";
import { getRequestUser } from "../lib/auth.js";

const createSensorSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).default(""),
  type: z.enum([
    "temperature", "humidity", "air_quality", "soil_moisture",
    "traffic", "weather", "energy", "water_quality",
    "noise", "radiation", "custom",
  ]),
  location: z.object({
    lat: z.number().min(-90).max(90),
    lng: z.number().min(-180).max(180),
    label: z.string().max(200).default(""),
  }),
  pricing: z.object({
    perRead: z.number().min(0).default(0.001),
    hourly: z.number().min(0).default(0.5),
    daily: z.number().min(0).default(5),
    monthly: z.number().min(0).default(50),
  }).optional(),
  metadata: z.record(z.string()).optional(),
});

export async function sensorRoutes(app: FastifyInstance) {
  // GET /api/sensors — List all sensors (marketplace)
  app.get("/api/sensors", async (request, reply) => {
    const { type, status, owner = "all", page = 1, limit = 20 } = request.query as {
      type?: string;
      status?: string;
      owner?: string;
      page?: number;
      limit?: number;
    };

    try {
      const requestUser = await getRequestUser(request);
      const filters = [];

      if (type) filters.push(eq(sensors.type, type));
      if (status) filters.push(eq(sensors.status, status));
      if (owner === "me") {
        if (!requestUser) {
          reply.status(401);
          return { success: false, error: "Missing wallet session" };
        }
        filters.push(eq(sensors.ownerId, requestUser.id));
      }

      let query = db.select().from(sensors).$dynamic();

      if (filters.length > 0) {
        query = query.where(filters.length === 1 ? filters[0] : and(...filters));
      }

      const results = await query.limit(Number(limit)).offset((Number(page) - 1) * Number(limit));

      return {
        success: true,
        data: results,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: results.length,
          hasMore: results.length === Number(limit),
        },
      };
    } catch (err) {
      reply.status(500);
      return { success: false, error: "Failed to fetch sensors" };
    }
  });

  // GET /api/sensors/:id — Get sensor detail
  app.get("/api/sensors/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const sensor = await db.select().from(sensors).where(eq(sensors.id, id)).limit(1);

      if (sensor.length === 0) {
        reply.status(404);
        return { success: false, error: "Sensor not found" };
      }

      return { success: true, data: sensor[0] };
    } catch (err) {
      reply.status(500);
      return { success: false, error: "Failed to fetch sensor" };
    }
  });

  // POST /api/sensors — Register new sensor
  app.post("/api/sensors", async (request, reply) => {
    try {
      const body = createSensorSchema.parse(request.body);

      const requestUser = await getRequestUser(request);

      if (!requestUser) {
        reply.status(401);
        return { success: false, error: "Connect wallet first" };
      }

      const [sensor] = await db
        .insert(sensors)
        .values({
          name: body.name,
          description: body.description,
          type: body.type,
          ownerId: requestUser.id,
          locationLat: body.location.lat,
          locationLng: body.location.lng,
          locationLabel: body.location.label,
          pricingPerRead: body.pricing?.perRead ?? 0.001,
          pricingHourly: body.pricing?.hourly ?? 0.5,
          pricingDaily: body.pricing?.daily ?? 5,
          pricingMonthly: body.pricing?.monthly ?? 50,
          metadata: body.metadata ?? {},
        })
        .returning();

      reply.status(201);
      return {
        success: true,
        data: sensor,
        message: `Sensor registered! API Key: ${sensor.apiKey}`,
      };
    } catch (err) {
      if (err instanceof z.ZodError) {
        reply.status(400);
        return { success: false, error: err.errors };
      }
      reply.status(500);
      return { success: false, error: "Failed to create sensor" };
    }
  });

  // PATCH /api/sensors/:id — Update sensor
  app.patch("/api/sensors/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const body = request.body as Record<string, unknown>;
      const requestUser = await getRequestUser(request);

      if (!requestUser) {
        reply.status(401);
        return { success: false, error: "Connect wallet first" };
      }

      const [existing] = await db.select().from(sensors).where(eq(sensors.id, id)).limit(1);

      if (!existing) {
        reply.status(404);
        return { success: false, error: "Sensor not found" };
      }

      if (existing.ownerId !== requestUser.id) {
        reply.status(403);
        return { success: false, error: "Only the owner can update this sensor" };
      }

      const [updated] = await db
        .update(sensors)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(sensors.id, id))
        .returning();

      if (!updated) {
        reply.status(404);
        return { success: false, error: "Sensor not found" };
      }

      return { success: true, data: updated };
    } catch (err) {
      reply.status(500);
      return { success: false, error: "Failed to update sensor" };
    }
  });

  // DELETE /api/sensors/:id — Deactivate sensor
  app.delete("/api/sensors/:id", async (request, reply) => {
    const { id } = request.params as { id: string };

    try {
      const requestUser = await getRequestUser(request);

      if (!requestUser) {
        reply.status(401);
        return { success: false, error: "Connect wallet first" };
      }

      const [existing] = await db.select().from(sensors).where(eq(sensors.id, id)).limit(1);

      if (!existing) {
        reply.status(404);
        return { success: false, error: "Sensor not found" };
      }

      if (existing.ownerId !== requestUser.id) {
        reply.status(403);
        return { success: false, error: "Only the owner can deactivate this sensor" };
      }

      const [updated] = await db
        .update(sensors)
        .set({ status: "inactive", updatedAt: new Date() })
        .where(eq(sensors.id, id))
        .returning();

      if (!updated) {
        reply.status(404);
        return { success: false, error: "Sensor not found" };
      }

      return { success: true, data: updated, message: "Sensor deactivated" };
    } catch (err) {
      reply.status(500);
      return { success: false, error: "Failed to deactivate sensor" };
    }
  });
}
