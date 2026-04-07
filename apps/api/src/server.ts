// Fluxora API Server
// Main entry point for Fastify backend

import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import { sensorRoutes } from "./routes/sensors.js";
import { ingestRoutes } from "./routes/ingest.js";
import { marketplaceRoutes } from "./routes/marketplace.js";
import { authRoutes } from "./routes/auth.js";
import { getBatchService } from "./services/batch.js";

const PORT = Number(process.env.PORT) || 3001;
const HOST = process.env.HOST || "0.0.0.0";

async function main() {
  const app = Fastify({
    logger: {
      level: "info",
      transport: {
        target: "pino-pretty",
        options: { colorize: true },
      },
    },
  });

  // Plugins
  await app.register(cors, {
    origin: process.env.NODE_ENV === "production"
      ? ["https://fluxora.xyz"]
      : true,
    credentials: true,
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  // Health check
  app.get("/health", async () => ({
    status: "ok",
    service: "fluxora-api",
    version: "0.1.0",
    timestamp: new Date().toISOString(),
  }));

  // Routes
  await app.register(authRoutes);
  await app.register(sensorRoutes);
  await app.register(ingestRoutes);
  await app.register(marketplaceRoutes);

  // Start batch processor
  const batchService = getBatchService();

  try {
    await app.listen({ port: PORT, host: HOST });

    console.log(`
    ╔═══════════════════════════════════════╗
    ║                                       ║
    ║   🌊 FLUXORA API v0.1.0              ║
    ║   IoT Data Marketplace on Shelby      ║
    ║                                       ║
    ║   Server:  http://${HOST}:${PORT}        ║
    ║   Health:  http://${HOST}:${PORT}/health  ║
    ║                                       ║
    ╚═══════════════════════════════════════╝
    `);

    // Start batch processing after server is up
    batchService.start();
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  // Graceful shutdown
  const shutdown = async () => {
    console.log("\n[Server] Shutting down gracefully...");
    batchService.stop();
    await app.close();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main();
