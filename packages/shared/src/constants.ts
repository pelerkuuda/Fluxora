// Fluxora Constants

export const FLUXORA_VERSION = "0.1.0";

// Shelby Config
export const SHELBY_DEFAULTS = {
  NETWORK: "testnet",
  STORAGE_DURATION_EPOCHS: 100,
  BATCH_INTERVAL_MS: 5 * 60 * 1000, // 5 minutes
  MAX_BATCH_SIZE: 1000, // max data points per blob
  BLOB_PREFIX: "fluxora",
} as const;

// Pricing Defaults (USDC)
export const DEFAULT_PRICING = {
  PER_READ: 0.001,
  HOURLY: 0.5,
  DAILY: 5,
  MONTHLY: 50,
} as const;

// Revenue Split (basis points, 10000 = 100%)
export const REVENUE_SPLIT = {
  PRODUCER: 9500, // 95%
  PLATFORM: 300, // 3%
  STORAGE: 200, // 2%
} as const;

// Sensor Types with labels and icons
export const SENSOR_TYPE_CONFIG = {
  temperature: { label: "Temperature", icon: "🌡️", unit: "°C" },
  humidity: { label: "Humidity", icon: "💧", unit: "%" },
  air_quality: { label: "Air Quality", icon: "🌫️", unit: "AQI" },
  soil_moisture: { label: "Soil Moisture", icon: "🌱", unit: "%" },
  traffic: { label: "Traffic", icon: "🚗", unit: "vehicles/h" },
  weather: { label: "Weather Station", icon: "⛅", unit: "multi" },
  energy: { label: "Energy", icon: "⚡", unit: "kWh" },
  water_quality: { label: "Water Quality", icon: "🌊", unit: "pH" },
  noise: { label: "Noise Level", icon: "🔊", unit: "dB" },
  radiation: { label: "Radiation", icon: "☢️", unit: "μSv/h" },
  custom: { label: "Custom", icon: "📡", unit: "custom" },
} as const;

// API Routes
export const API_ROUTES = {
  SENSORS: "/api/sensors",
  INGEST: "/api/ingest",
  MARKETPLACE: "/api/marketplace",
  ACCESS: "/api/access",
  SUBSCRIPTIONS: "/api/subscriptions",
  ANALYTICS: "/api/analytics",
} as const;
