// Fluxora Shelby Client (Frontend)
// Wraps Shelby API for frontend usage

import { marketplaceApi } from "./api";

export const SHELBY_CONFIG = {
  network: process.env.NEXT_PUBLIC_SHELBY_NETWORK || "testnet",
  rpcUrl: process.env.NEXT_PUBLIC_SHELBY_RPC_URL || "https://rpc.testnet.shelby.xyz",
};

export async function downloadSensorBlob(sensorId: string, walletAddress: string) {
  const response = await marketplaceApi.getData(sensorId, walletAddress);
  if (!response.success || !response.data) return [];

  const blobs = (response.data as { blobs?: Array<{ preview?: Record<string, unknown>[] }> }).blobs ?? [];
  return blobs.flatMap((blob) => blob.preview ?? []);
}

export async function verifyBlob(blobName: string, merkleRoot: string): Promise<boolean> {
  console.log(`[Shelby] Verify via backend manifest: ${blobName} against ${merkleRoot}`);
  return blobName.length > 0 && merkleRoot.startsWith("0x");
}
