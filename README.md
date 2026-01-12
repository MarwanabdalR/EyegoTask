# Eyego Task - Event-Driven Microservice

A scalable event-driven microservice built with Node.js, Express, and Kafka for real-time processing of user activity logs. The application follows Domain-Driven Design (DDD) principles and is designed for deployment on Docker and Kubernetes.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Local Setup](#local-setup)
- [Docker Setup](#docker-setup)
- [Kubernetes Deployment](#kubernetes-deployment)
- [Cloud Deployment](#cloud-deployment)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Overview

This microservice processes user activity logs in real-time using Apache Kafka as the message broker. Logs are stored in MongoDB with proper indexing for efficient querying. The service exposes a REST API for retrieving logs with pagination and filtering capabilities.

Key features:
- Real-time log processing via Kafka producer/consumer
- MongoDB storage with optimized indexes
- REST API with pagination and filtering
- DDD-based architecture
- Docker and Kubernetes deployment ready

## Architecture

The application follows Domain-Driven Design (DDD) principles with a layered architecture:

```
src/
├── domain/           # Domain layer (entities, value objects, services, events)
├── application/      # Application layer (use cases, DTOs, services)
├── infrastructure/   # Infrastructure layer (repositories, Kafka, config)
└── presentation/     # Presentation layer (controllers, middleware, routes)
```

### Data Flow
1. User activity logs are published to Kafka via REST API
2. Kafka consumer processes messages and stores in MongoDB
3. Logs can be retrieved via REST API with filtering and pagination

### Architecture Decisions
- **DDD**: Chosen for maintainability and scalability in complex business domains
- **Kafka**: Provides reliable message queuing for high-throughput log processing
- **MongoDB**: NoSQL database suitable for flexible log schemas and horizontal scaling
- **Express.js**: Lightweight framework for REST API implementation
- **TypeScript**: Ensures type safety and better developer experience

## Technology Stack

- **Runtime**: Node.js (v18+)
- **Language**: TypeScript
- **Framework**: Express.js
- **Message Broker**: Apache Kafka (kafkajs)
- **Database**: MongoDB (Mongoose)
- **Containerization**: Docker
- **Orchestration**: Kubernetes
- **Cloud**: GCP/AWS (free tier)
- **Testing**: Jest, Supertest
- **Validation**: Zod
- **Linting**: ESLint
- **Formatting**: Prettier

## Prerequisites

- Node.js v18 or higher
- npm or yarn
- Docker and Docker Compose
- kubectl (for Kubernetes deployment)
- MongoDB (local or Atlas)
- Kafka (local or managed service)

## Local Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd eyegotask
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   NODE_ENV=development
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/eyegotask
   KAFKA_BROKERS=localhost:9092
   KAFKA_CLIENT_ID=eyegotask
   KAFKA_GROUP_ID=eyegotask-group
   ```

4. **Start MongoDB and Kafka**
   - MongoDB: `mongod` or use Docker
   - Kafka: Use Docker Compose or local setup

5. **Build and run**
   ```bash
   npm run build
   npm start
   ```

6. **Development mode**
   ```bash
   npm run dev
   ```

## Docker Setup

1. **Build the image**
   ```bash
   docker build -t eyegotask .
   ```

2. **Run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Access the application**
   - API: http://localhost:3000
   - Health check: http://localhost:3000/api/health

## Kubernetes Deployment

1. **Apply manifests**
   ```bash
   kubectl apply -f k8s/
   ```

2. **Check deployment**
   ```bash
   kubectl get pods
   kubectl get services
   ```

3. **Access the service**
   ```bash
   kubectl port-forward svc/eyegotask-service 3000:3000
   ```

## Cloud Deployment

### GCP (Google Cloud Platform)

1. **Set up GKE cluster**
   ```bash
   gcloud container clusters create eyegotask-cluster --num-nodes=3
   ```

2. **Deploy MongoDB Atlas**
   - Create free tier cluster
   - Get connection string

3. **Deploy Kafka (Cloud Pub/Sub or self-hosted)**

4. **Deploy application**
   ```bash
   kubectl apply -f k8s/
   ```

### AWS

1. **Set up EKS cluster**
   ```bash
   eksctl create cluster --name eyegotask-cluster --nodes=3
   ```

2. **Deploy MongoDB Atlas or DocumentDB**

3. **Deploy MSK (Managed Streaming for Kafka)**

4. **Deploy application**
   ```bash
   kubectl apply -f k8s/
   ```

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Health Check
- **GET** `/health`
- Returns service health status

#### Publish Activity Log
- **POST** `/logs`
- Body:
  ```json
  {
    "userId": "string",
    "activityType": "string",
    "timestamp": "ISO 8601 string",
    "metadata": {}
  }
  ```

#### Get Activity Logs
- **GET** `/logs`
- Query parameters:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `userId`: Filter by user ID
  - `activityType`: Filter by activity type
  - `from`: Start date (ISO 8601)
  - `to`: End date (ISO 8601)
  - `sort`: Sort order (asc/desc, default: desc)

#### Get Activity Log by ID
- **GET** `/logs/:id`

### Response Format
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment | development |
| `PORT` | Server port | 3000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/eyegotask |
| `KAFKA_BROKERS` | Kafka broker addresses | localhost:9092 |
| `KAFKA_CLIENT_ID` | Kafka client ID | eyegotask |
| `KAFKA_GROUP_ID` | Kafka consumer group ID | eyegotask-group |

## Testing

1. **Run unit tests**
   ```bash
   npm test
   ```

2. **Run with coverage**
   ```bash
   npm run test:coverage
   ```

3. **Run integration tests**
   ```bash
   npm run test:integration
   ```

4. **Linting**
   ```bash
   npm run lint
   ```

5. **Formatting**
   ```bash
   npm run format
   ```

## Troubleshooting

### Common Issues

1. **MongoDB connection failed**
   - Check if MongoDB is running
   - Verify connection string
   - Check network connectivity

2. **Kafka connection failed**
   - Ensure Kafka brokers are running
   - Check broker addresses
   - Verify network configuration

3. **Port already in use**
   - Change PORT environment variable
   - Kill process using the port

4. **Build failures**
   - Clear node_modules: `rm -rf node_modules && npm install`
   - Check TypeScript errors: `npm run build`

### Logs
- Application logs: Check console output
- MongoDB logs: `docker logs mongodb`
- Kafka logs: `docker logs kafka`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes and add tests
4. Run linting and tests
5. Submit a pull request

## License

This project is licensed under the ISC License.