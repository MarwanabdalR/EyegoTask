# Docker Setup Guide

Quick guide for running Eyego Task microservices with Docker.

---

## Quick Start

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## Services

| Service | Port | Description |
|---------|------|-------------|
| Producer | 3000 | Publish logs API |
| Consumer | 3001 | Query logs API |
| MongoDB | 27017 | Database |
| Kafka | 9092-9093 | Message broker |
| Zookeeper | 2181 | Kafka coordination |
| Kafka UI | 8080 | Kafka monitoring |

**Access URLs**:

- Producer: <http://localhost:3000>
- Consumer: <http://localhost:3001>
- Kafka UI: <http://localhost:8080>
- MongoDB: `mongodb://admin:admin123@localhost:27017`

---

## Docker Architecture

### Multi-Stage Build

Both services use multi-stage builds:

1. **Builder**: Compiles TypeScript → JavaScript
2. **Production**: Runs compiled JavaScript

**Benefits**: Smaller images, faster startup, no ts-node overhead

### Dockerfile Structure

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json ./
RUN npm ci
COPY . .
RUN npx tsc

# Stage 2: Production
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
RUN chown -R nodejs:nodejs /app
USER nodejs
EXPOSE 3000
CMD ["node", "dist/presentation/http/server.js"]
```

---

## Common Commands

```bash
# Start services
docker-compose up -d

# Rebuild and start
docker-compose up --build -d

# View logs
docker-compose logs -f producer
docker-compose logs -f consumer

# Restart service
docker-compose restart producer

# Stop all
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

---

## Environment Variables

### Producer

- `PORT`: 3000
- `KAFKA_BROKERS`: kafka:9093
- `NODE_ENV`: production

### Consumer

- `PORT`: 3001
- `KAFKA_BROKERS`: kafka:9093
- `KAFKA_GROUP_ID`: consumer-service-group
- `MONGODB_URI`: mongodb://admin:admin123@mongodb:27017/eyego?authSource=admin
- `NODE_ENV`: production

---

## Testing

```bash
# Health checks
curl http://localhost:3000/api/health
curl http://localhost:3001/api/health

# Publish log
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-123","activityType":"LOGIN","metadata":{"device":"mobile"}}'

# Query logs
curl http://localhost:3001/api/logs?userId=user-123
```

---

## Troubleshooting

### Services not starting

```bash
# Check logs
docker-compose logs producer

# Rebuild
docker-compose up --build -d
```

### Connection issues

```bash
# Check network
docker network inspect eyegotask_eyego-network

# Test connectivity
docker exec eyego-producer ping kafka
```

### Clean restart

```bash
docker-compose down -v
docker-compose up --build -d
```

---

## Backup MongoDB

```bash
# Backup
docker exec eyego-mongodb mongodump \
  -u admin -p admin123 \
  --authenticationDatabase admin \
  --db eyego --out /backup

# Restore
docker exec eyego-mongodb mongorestore \
  -u admin -p admin123 \
  --authenticationDatabase admin \
  --db eyego /backup/eyego
```
