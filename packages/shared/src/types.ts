// Fluxora Shared Types
// Sensor, Blob, Marketplace types used across apps

export interface Sensor {
  id: string;
  name: string;
  description: string;
  type: SensorType;
  location: {
    lat: number;
    lng: number;
    label: string;
  };
  ownerId: string;
  ownerAddress: string;
  apiKey: string;
  status: "active" | "inactive" | "maintenance";
  pricing: PricingConfig;
  metadata: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
}

export type SensorType =
  | "temperature"
  | "humidity"
  | "air_quality"
  | "soil_moisture"
  | "traffic"
  | "weather"
  | "energy"
  | "water_quality"
  | "noise"
  | "radiation"
  | "custom";

export interface PricingConfig {
  perRead: number; // USDC
  hourly: number;
  daily: number;
  monthly: number;
  currency: "USDC" | "APT";
}

export interface SensorDataPoint {
  sensorId: string;
  timestamp: number;
  values: Record<string, number | string | boolean>;
  unit: string;
}

export interface DataBlob {
  id: string;
  sensorId: string;
  blobName: string;
  merkleRoot: string;
  startTime: number;
  endTime: number;
  dataPoints: number;
  sizeBytes: number;
  storageDuration: number; // epochs
  createdAt: Date;
}

export interface Subscription {
  id: string;
  buyerAddress: string;
  sensorId: string;
  plan: "per_read" | "hourly" | "daily" | "monthly";
  startTime: Date;
  endTime: Date;
  status: "active" | "expired" | "cancelled";
  txHash: string;
}

export interface MarketplaceListing {
  sensor: Sensor;
  totalDataPoints: number;
  totalBlobs: number;
  lastUpdated: Date;
  subscribers: number;
  rating: number;
  previewData?: SensorDataPoint[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
  };
}
