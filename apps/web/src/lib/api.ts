// Fluxora API Client
// Frontend utility for communicating with Fluxora API

import type { AuthResponse, WalletSession } from "@fluxora/shared";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; error?: string; message?: string }> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });
    return await res.json();
  } catch (err) {
    return { success: false, error: "Network error" };
  }
}

// Auth API
export const authApi = {
  connect: (data: {
    walletAddress: string;
    chainType?: "ethereum" | "solana" | "aptos";
    displayName?: string;
    role?: "user" | "producer" | "admin";
  }) => apiFetch<WalletSession>("/api/auth/connect", {
    method: "POST",
    body: JSON.stringify(data),
  }) as Promise<AuthResponse>,
  me: (walletAddress: string) => apiFetch<WalletSession>("/api/auth/me", {
    headers: { "x-wallet-address": walletAddress },
  }) as Promise<AuthResponse>,
};

// Sensor API
export const sensorsApi = {
  list: (params?: { type?: string; status?: string; owner?: string; page?: number; limit?: number }, walletAddress?: string) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiFetch(`/api/sensors${query ? `?${query}` : ""}`, {
      headers: walletAddress ? { "x-wallet-address": walletAddress } : undefined,
    });
  },
  get: (id: string) => apiFetch(`/api/sensors/${id}`),
  create: (data: Record<string, unknown>, walletAddress: string) =>
    apiFetch("/api/sensors", {
      method: "POST",
      headers: { "x-wallet-address": walletAddress },
      body: JSON.stringify(data),
    }),
  update: (id: string, data: Record<string, unknown>, walletAddress: string) =>
    apiFetch(`/api/sensors/${id}`, {
      method: "PATCH",
      headers: { "x-wallet-address": walletAddress },
      body: JSON.stringify(data),
    }),
  delete: (id: string, walletAddress: string) =>
    apiFetch(`/api/sensors/${id}`, {
      method: "DELETE",
      headers: { "x-wallet-address": walletAddress },
    }),
};

// Marketplace API
export const marketplaceApi = {
  browse: (params?: { type?: string; page?: number }) => {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    return apiFetch(`/api/marketplace${query ? `?${query}` : ""}`);
  },
  subscribe: (data: {
    sensorId: string;
    plan: string;
    txHash: string;
    buyerAddress: string;
  }) =>
    apiFetch("/api/marketplace/subscribe", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getData: (sensorId: string, walletAddress: string) =>
    apiFetch(`/api/marketplace/${sensorId}/data`, {
      headers: { "x-wallet-address": walletAddress },
    }),
};

// Ingest API (for demo/testing)
export const ingestApi = {
  send: (sensorId: string, apiKey: string, data: Record<string, unknown>) =>
    apiFetch(`/api/ingest/${sensorId}`, {
      method: "POST",
      headers: { "x-api-key": apiKey },
      body: JSON.stringify(data),
    }),
  sendBatch: (sensorId: string, apiKey: string, data: Record<string, unknown>[]) =>
    apiFetch(`/api/ingest/${sensorId}/batch`, {
      method: "POST",
      headers: { "x-api-key": apiKey },
      body: JSON.stringify({ data }),
    }),
};
