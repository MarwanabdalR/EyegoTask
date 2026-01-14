# Docker Setup Guide

This guide explains how to build and run the EyegoTask microservices using Docker.

## Prerequisites

- Docker Desktop installed and running
- Docker Compose v2.0+

## Quick Start

### 1. Build and Start All Services

```bash
docker-compose up --build
```

This command will:

- Build Docker images for Producer and Consumer services
- Start MongoDB, Kafka (with Zookeeper), Producer, Consumer, and Kafka UI
- Create a shared network for all services

### 2. Verify Services

Check that all services are running:

```bash
docker-compose ps
```

You should see:

- `eyego-mongodb` (port 27017)
- `eyego-zookeeper` (port 2181)
- `eyego-kafka` (ports 9092, 9093)
- `eyego-producer` (port 3000)
- `eyego-consumer` (port 3001)
- `eyego-kafka-ui` (port 8080)

### 3. Test the Services

**Producer Health Check**:

```bash
curl http://localhost:3000/api/health
```

**Consumer Health Check**:

```bash
curl http://localhost:3001/api/health
```

**Publish a Log**:

```bash
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-123",
    "activityType": "LOGIN",
    "metadata": {"device": "mobile"}
  }'
```

**Retrieve Logs**:

```bash
curl http://localhost:3001/api/logs?page=1&limit=10
```

## Individual Service Commands

### Build Images

**Producer**:

```bash
docker build -t eyego-producer ./producer
```

**Consumer**:

```bash
docker build -t eyego-consumer ./consumer
```

### Run Individual Containers

**Producer** (requires Kafka running):

```bash
docker run -p 3000:3000 \
  -e KAFKA_BROKERS=kafka:9093 \
  --network eyego-network \
  eyego-producer
```

**Consumer** (requires Kafka and MongoDB running):

```bash
docker run -p 3001:3001 \
  -e KAFKA_BROKERS=kafka:9093 \
  -e MONGO_URI=mongodb://admin:admin123@mongodb:27017/eyego?authSource=admin \
  --network eyego-network \
  eyego-consumer
```

## Docker Compose Commands

### Start Services (Detached Mode)

```bash
docker-compose up -d
```

### Stop Services

```bash
docker-compose down
```

### Stop and Remove Volumes

```bash
docker-compose down -v
```

### View Logs

**All services**:

```bash
docker-compose logs -f
```

**Specific service**:

```bash
docker-compose logs -f producer
docker-compose logs -f consumer
```

### Rebuild Services

```bash
docker-compose up --build
```

### Scale Services

```bash
docker-compose up --scale consumer=3
```

## Environment Variables

### Producer Service

- `PORT`: HTTP server port (default: 3000)
- `KAFKA_BROKERS`: Kafka broker addresses (default: kafka:9093)
- `NODE_ENV`: Environment (production/development)

### Consumer Service

- `PORT`: HTTP server port (default: 3001)
- `KAFKA_BROKERS`: Kafka broker addresses (default: kafka:9093)
- `MONGO_URI`: MongoDB connection string
- `NODE_ENV`: Environment (production/development)

## Monitoring

### Kafka UI

Access Kafka UI at: <http://localhost:8080>

View:

- Topics
- Messages
- Consumer groups
- Broker status

### Health Checks

Docker automatically monitors service health using the configured health checks:

**Producer**: `GET http://localhost:3000/api/health`
**Consumer**: `GET http://localhost:3001/api/health`

View health status:

```bash
docker inspect eyego-producer | grep -A 5 Health
docker inspect eyego-consumer | grep -A 5 Health
```

## Troubleshooting

### Services Not Starting

1. Check logs:

```bash
docker-compose logs producer
docker-compose logs consumer
```

1. Verify network:

```bash
docker network ls
docker network inspect eyego-network
```

### Connection Issues

**Kafka connection errors**:

- Ensure Kafka is fully started before Producer/Consumer
- Check `KAFKA_BROKERS` environment variable
- Verify network connectivity: `docker-compose exec producer ping kafka`

**MongoDB connection errors**:

- Verify MongoDB credentials in `MONGO_URI`
- Check MongoDB is running: `docker-compose ps mongodb`

### Clean Restart

```bash
# Stop all services
docker-compose down

# Remove all containers, networks, and volumes
docker-compose down -v

# Rebuild and start
docker-compose up --build
```

## Production Considerations

1. **Environment Variables**: Use `.env` files or secrets management
2. **Volumes**: Persist data with named volumes (already configured for MongoDB)
3. **Resource Limits**: Add memory and CPU limits in docker-compose.yml
4. **Logging**: Configure log drivers for centralized logging
5. **Health Checks**: Already configured, monitor in production
6. **Security**: Use non-root users (already configured in Dockerfiles)

## Architecture

```
┌─────────────┐
│   Producer  │ :3000
└──────┬──────┘
       │
       ▼
┌─────────────┐
│    Kafka    │ :9092, :9093
└──────┬──────┘
       │
       ▼
┌─────────────┐     ┌─────────────┐
│  Consumer   │────▶│   MongoDB   │
│    :3001    │     │    :27017   │
└─────────────┘     └─────────────┘
```

All services communicate via the `eyego-network` Docker network.
