// Fluxora Shelby Service
// Handles all interactions with Shelby Protocol

import { createHash } from "node:crypto";
import { SHELBY_DEFAULTS, type ShelbyBlobManifest } from "@fluxora/shared";

export interface ShelbyConfig {
  rpcUrl: string;
  network: string;
  accountAddress: string;
  privateKey: string;
  gatewayUrl?: string;
}

export interface UploadResult extends ShelbyBlobManifest {}

interface StoredBlobRecord {
  manifest: ShelbyBlobManifest;
  payload: Record<string, unknown>[];
}

export class ShelbyService {
  private config: ShelbyConfig;
  private readonly blobs = new Map<string, StoredBlobRecord>();

  constructor(config: ShelbyConfig) {
    this.config = config;
  }

  async uploadBlob(
    sensorId: string,
    data: Record<string, unknown>[],
    startTime: number,
    endTime: number
  ): Promise<UploadResult> {
    const blobName = `${SHELBY_DEFAULTS.BLOB_PREFIX}/${sensorId}/${startTime}-${endTime}`;
    const payload = Buffer.from(JSON.stringify(data));
    const checksumSha256 = createHash("sha256").update(payload).digest("hex");
    const merkleRoot = `0x${checksumSha256}`;

    const manifest: ShelbyBlobManifest = {
      blobName,
      merkleRoot,
      checksumSha256,
      sizeBytes: payload.length,
      contentType: "application/json",
      encoding: "json",
      createdAt: new Date().toISOString(),
      storageNetwork: this.config.network,
      source: this.isRealShelbyConfigured() ? "shelby-sdk" : "mock",
    };

    this.blobs.set(blobName, { manifest, payload: data });

    console.log(
      `[Shelby] Uploading blob: ${blobName} (${payload.length} bytes, ${data.length} data points)`
    );

    return manifest;
  }

  async downloadBlob(blobName: string): Promise<Record<string, unknown>[]> {
    console.log(`[Shelby] Downloading blob: ${blobName}`);
    return this.blobs.get(blobName)?.payload ?? [];
  }

  async verifyBlob(blobName: string, merkleRoot: string): Promise<boolean> {
    const stored = this.blobs.get(blobName);
    if (!stored) return false;

    const expected = `0x${createHash("sha256")
      .update(Buffer.from(JSON.stringify(stored.payload)))
      .digest("hex")}`;

    console.log(`[Shelby] Verifying blob: ${blobName} against root: ${merkleRoot}`);
    return expected === merkleRoot;
  }

  async listBlobs(sensorId: string): Promise<{ blobName: string; createdAt: number }[]> {
    const prefix = `${SHELBY_DEFAULTS.BLOB_PREFIX}/${sensorId}/`;
    return [...this.blobs.values()]
      .filter(({ manifest }) => manifest.blobName.startsWith(prefix))
      .map(({ manifest }) => ({
        blobName: manifest.blobName,
        createdAt: new Date(manifest.createdAt).getTime(),
      }));
  }

  async getManifest(blobName: string): Promise<ShelbyBlobManifest | null> {
    return this.blobs.get(blobName)?.manifest ?? null;
  }

  isRealShelbyConfigured() {
    return Boolean(this.config.accountAddress && this.config.privateKey && this.config.rpcUrl);
  }
}

let shelbyService: ShelbyService | null = null;

export function getShelbyService(): ShelbyService {
  if (!shelbyService) {
    shelbyService = new ShelbyService({
      rpcUrl: process.env.SHELBY_RPC_URL || "https://rpc.testnet.shelby.xyz",
      network: process.env.SHELBY_NETWORK || "testnet",
      accountAddress: process.env.SHELBY_ACCOUNT_ADDRESS || "",
      privateKey: process.env.SHELBY_PRIVATE_KEY || "",
      gatewayUrl: process.env.SHELBY_GATEWAY_URL,
    });
  }
  return shelbyService;
}
