# 🌊 Fluxora

**Demo-ready decentralized IoT data marketplace built on [Shelby Protocol](https://docs.shelby.xyz)**

Fluxora lets sensor operators publish machine telemetry, batch it into Shelby-backed blobs, expose premium access plans, and demo quote → settle → preview access flows through a polished marketplace UI.

## Current Status

**Hackathon / showcase status:** ready

- Phase 1, Foundation: complete
- Phase 2, Wallet integration: complete for demo
- Phase 3, On-chain + Shelby integration: complete for demo
- Phase 4, Polish + demo readiness: complete for demo

This repo is currently optimized for **demo, judging, and presentation flow**.
It is **not yet a full production mainnet release**.

## Core Demo Flow

1. Seed demo data from the dashboard
2. Connect wallet
3. Browse marketplace listings
4. Request payment quote
5. Settle access flow
6. View receipt + Shelby-backed preview rows
7. Explore the signal atlas view

## Architecture

```text
IoT Sensors → Fluxora API → Batch → Shelby Blob Storage
                                  → Aptos-style settlement flow
                                  → PostgreSQL metadata/indexing

Buyers → Fluxora Web → Browse → Quote → Settle → Preview data
```

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 16, TailwindCSS |
| Backend | Fastify, Drizzle ORM |
| Storage | Shelby Protocol integration scaffolding + blob manifests |
| Blockchain | Aptos-style quote / settlement flow |
| Wallet | Aptos wallet adapter + challenge / verify session flow |
| Database | PostgreSQL |

## Implemented Demo Features

### Product Surface
- Landing page with premium editorial redesign + motion
- Marketplace with inline access flow
- Sensor detail page with quote, settle, receipt, and preview
- Dashboard with demo seed controls
- Explore page with geospatial signal atlas presentation

### Backend
- Sensor CRUD
- Ingestion endpoints
- Batch processing service
- Shelby manifest / preview / verify scaffolding
- Auth challenge + verify flow
- On-chain quote + settle endpoints
- Demo seeding endpoint

### Wallet + Access Flow
- Wallet session bootstrapping
- Challenge / verify auth flow
- Quote generation
- Settlement recording
- Access receipt generation
- Preview payload access after settlement

## Quick Start

### Prerequisites
- Node.js v22+
- Docker (for PostgreSQL)
- npm v10+

### Setup

```bash
git clone https://github.com/wisezhi/fluxora.git
cd fluxora
npm install

# Start database
docker compose up -d

# Copy env files
cp apps/api/.env.example apps/api/.env

# Run migrations
npm run db:generate
npm run db:migrate

# Start development
npm run dev
```

### Services

| Service | URL |
|---|---|
| Web | http://localhost:3000 |
| API | http://localhost:3001 |
| Health | http://localhost:3001/health |

## Project Structure

```text
fluxora/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Fastify backend
├── packages/
│   └── shared/       # Shared constants, types, on-chain models
├── contracts/        # Reserved for Aptos Move contracts
└── docker-compose.yml
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/sensors | List sensors |
| GET | /api/sensors/:id | Get sensor detail |
| POST | /api/sensors | Register sensor |
| POST | /api/ingest/:sensorId | Ingest single point |
| POST | /api/ingest/:sensorId/batch | Ingest batch |
| GET | /api/marketplace | Browse listings |
| POST | /api/marketplace/subscribe | Subscribe to sensor |
| GET | /api/marketplace/:sensorId/data | Access sensor preview data |
| POST | /api/auth/challenge | Create wallet auth challenge |
| POST | /api/auth/verify | Verify wallet session |
| POST | /api/onchain/quote | Build demo payment quote |
| POST | /api/onchain/settle | Record demo settlement |
| POST | /api/demo/seed | Seed demo sensors + Shelby blobs |

## Demo Walkthrough

### Fast walkthrough
1. Open `/dashboard`
2. Click **Seed demo data**
3. Open `/marketplace`
4. Connect Petra wallet
5. Click **Request quote** on a stream
6. Click **Settle + fetch**
7. Show receipt and preview rows
8. Open `/sensor/sensor-001` for detail view
9. Open `/explore` to show the signal atlas

### Recommended showcase narrative
- Fluxora turns machine telemetry into monetizable, verifiable digital assets
- Producers stream data into Shelby-backed storage
- Buyers discover streams, request access quotes, and unlock preview data
- The app demonstrates wallet onboarding, settlement scaffolding, and integrity-aware access in one polished flow

## Deployment Notes

- Web is structured for Vercel-style deployment
- API is structured for Railway-style deployment
- Use `apps/api/.env.example` as the backend env template
- Demo mode can be primed with `POST /api/demo/seed`
- `apps/web/.env.example` exists locally for frontend env reference if needed in deployment setup

## Revenue Model

```text
Producer sets pricing per sensor:
├── Per-Read: $0.001 per blob read
├── Hourly:   $0.50 / hour
├── Daily:    $5.00 / day
└── Monthly:  $50.00 / month

Revenue Split:
├── 95% → Producer
├── 3%  → Fluxora platform
└── 2%  → Shelby storage
```

## What Is Still Not Production-Final

- Real multi-chain signature verification
- Full Shelby SDK binding to live network storage
- Real Aptos contract deployment and transaction verification
- Production-grade persistence and operational hardening

## License

MIT

---

Built with 🌊 for demo, judging, and showcase flow on Shelby-inspired infrastructure.
