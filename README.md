# 🌊 Fluxora

**Decentralized IoT Data Marketplace built on [Shelby Protocol](https://docs.shelby.xyz)**

Connect your sensors → Stream data to Shelby's decentralized storage → Sell access on the marketplace.

## Architecture

```
IoT Sensors → Fluxora API → Batch → Shelby Blob Storage
                                  → Aptos (merkle roots, payments)
                                  → PostgreSQL (metadata, indexing)

Buyers → Fluxora Web → Browse → Subscribe → Read from Shelby
```

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 15, TailwindCSS, shadcn/ui |
| Backend | Fastify, Drizzle ORM |
| Storage | Shelby Protocol (decentralized blob storage) |
| Blockchain | Aptos (Move smart contracts) |
| Wallet | Shelby DAA (Ethereum + Solana) |
| Database | PostgreSQL |

## Quick Start

### Prerequisites
- Node.js v22+
- Docker (for PostgreSQL)
- Shelby CLI + Aptos CLI

### Setup

```bash
# Clone & install
git clone https://github.com/wisezhi/fluxora.git
cd fluxora
npm install

# Start database
docker compose up -d

# Copy env files
cp apps/api/.env.example apps/api/.env
# Edit .env with your Shelby credentials

# Generate & run migrations
npm run db:generate
npm run db:migrate

# Start development
npm run dev
```

### Services

| Service | URL |
|---|---|
| Web (Frontend) | http://localhost:3000 |
| API (Backend) | http://localhost:3001 |
| API Health | http://localhost:3001/health |

## Project Structure

```
fluxora/
├── apps/
│   ├── web/          # Next.js frontend
│   └── api/          # Fastify backend
├── packages/
│   └── shared/       # Shared types & constants
├── contracts/        # Aptos Move smart contracts
└── docker-compose.yml
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | /api/sensors | List all sensors |
| GET | /api/sensors/:id | Get sensor detail |
| POST | /api/sensors | Register new sensor |
| POST | /api/ingest/:sensorId | Send single data point |
| POST | /api/ingest/:sensorId/batch | Send batch data |
| GET | /api/marketplace | Browse marketplace |
| POST | /api/marketplace/subscribe | Subscribe to sensor |
| GET | /api/marketplace/:sensorId/data | Access sensor data |
| POST | /api/auth/challenge | Create wallet auth challenge |
| POST | /api/auth/verify | Verify wallet session |
| POST | /api/onchain/quote | Build demo payment quote |
| POST | /api/onchain/settle | Record demo settlement |
| POST | /api/demo/seed | Seed demo sensors + Shelby blobs |

## Demo Walkthrough

1. Open `/dashboard` and click **Seed demo data**
2. Browse `/marketplace` and request a quote from any featured stream
3. Settle the access flow to generate a receipt
4. Open the sensor detail page to show Shelby preview rows and integrity metadata
5. Visit `/explore` for the geospatial signal atlas view

## Deployment Notes

- Web is structured for Vercel deployment
- API is structured for Railway or any Node host
- Use `apps/api/.env.example` and `apps/web/.env.example` as deployment env templates
- Demo mode can be primed with `POST /api/demo/seed`

## Revenue Model

```
Producer sets pricing per sensor:
├── Per-Read: $0.001 per blob read
├── Hourly:   $0.50 / hour
├── Daily:    $5.00 / day
└── Monthly:  $50.00 / month

Revenue Split:
├── 95% → Producer (sensor owner)
├── 3%  → Fluxora platform
└── 2%  → Shelby storage
```

## License

MIT

---

Built with 🌊 on [Shelby Protocol](https://shelby.xyz) • Powered by [Aptos](https://aptos.dev)
