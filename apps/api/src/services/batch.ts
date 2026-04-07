// Fluxora Batch Service
// Batches incoming sensor data and uploads to Shelby periodically

import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { ingestBuffer, dataBlobs, sensors } from "../db/schema.js";
import { getShelbyService } from "./shelby.js";
import { SHELBY_DEFAULTS } from "@fluxora/shared";

export class BatchService {
  private intervalId: ReturnType<typeof setInterval> | null = null;

  /**
   * Start the batch processing loop
   */
  start() {
    console.log(
      `[Batch] Starting batch processor (interval: ${SHELBY_DEFAULTS.BATCH_INTERVAL_MS / 1000}s)`
    );
    this.intervalId = setInterval(
      () => this.processBatches(),
      SHELBY_DEFAULTS.BATCH_INTERVAL_MS
    );

    // Also run immediately on start
    this.processBatches();
  }

  /**
   * Stop the batch processing loop
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
      console.log("[Batch] Stopped batch processor");
    }
  }

  /**
   * Process all unprocessed data in the ingest buffer
   * Groups by sensor, serializes, uploads to Shelby
   */
  async processBatches() {
    try {
      // Get all unprocessed data grouped by sensor
      const unprocessed = await db
        .select()
        .from(ingestBuffer)
        .where(eq(ingestBuffer.processed, false))
        .limit(SHELBY_DEFAULTS.MAX_BATCH_SIZE);

      if (unprocessed.length === 0) return;

      // Group by sensor
      const bySensor = new Map<string, typeof unprocessed>();
      for (const row of unprocessed) {
        const existing = bySensor.get(row.sensorId) || [];
        existing.push(row);
        bySensor.set(row.sensorId, existing);
      }

      const shelby = getShelbyService();

      for (const [sensorId, rows] of bySensor) {
        try {
          const data = rows.map((r) => ({
            timestamp: r.timestamp.getTime(),
            values: r.values,
            unit: r.unit,
          }));

          const startTime = Math.min(
            ...rows.map((r) => r.timestamp.getTime())
          );
          const endTime = Math.max(...rows.map((r) => r.timestamp.getTime()));

          // Upload to Shelby
          const result = await shelby.uploadBlob(
            sensorId,
            data,
            startTime,
            endTime
          );

          // Record the blob in our database
          await db.insert(dataBlobs).values({
            sensorId,
            blobName: result.blobName,
            merkleRoot: result.merkleRoot,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
            dataPoints: data.length,
            sizeBytes: result.sizeBytes,
            storageDuration: SHELBY_DEFAULTS.STORAGE_DURATION_EPOCHS,
          });

          // Mark as processed
          const ids = rows.map((r) => r.id);
          for (const id of ids) {
            await db
              .update(ingestBuffer)
              .set({ processed: true })
              .where(eq(ingestBuffer.id, id));
          }

          console.log(
            `[Batch] Uploaded ${data.length} points for sensor ${sensorId} → ${result.blobName}`
          );
        } catch (err) {
          console.error(
            `[Batch] Failed to process sensor ${sensorId}:`,
            err
          );
        }
      }
    } catch (err) {
      console.error("[Batch] Error processing batches:", err);
    }
  }
}

// Singleton
let batchService: BatchService | null = null;

export function getBatchService(): BatchService {
  if (!batchService) {
    batchService = new BatchService();
  }
  return batchService;
}
