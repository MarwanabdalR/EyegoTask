# Eyego Task - Event-Driven Microservices Platform

A scalable, event-driven microservices architecture for real-time processing of user activity logs using Node.js, TypeScript, Kafka, and MongoDB.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Local Development Setup](#local-development-setup)
- [Docker Setup](#docker-setup)
- [Kubernetes Deployment](#kubernetes-deployment)
- [API Documentation](#api-documentation)
- [Environment Variables](#environment-variables)
- [Testing](#testing)
- [Monitoring](#monitoring)
- [Deployment](#deployment)

---

## 🎯 Project Overview

This project implements a distributed microservices architecture for capturing, processing, and querying user activity logs in real-time. It demonstrates modern software engineering practices including:

- **Event-Driven Architecture**: Asynchronous communication via Apache Kafka
- **Domain-Driven Design**: Clean architecture with clear separation of concerns
- **Containerization**: Docker and Docker Compose for consistent environments
- **Orchestration**: Kubernetes manifests for production deployment
- **Type Safety**: Full TypeScript implementation with strict typing
- **Testing**: Comprehensive unit and integration tests

### Use Cases

- User activity tracking and analytics
- Real-time event processing
- Audit logging and compliance
- Behavioral analysis and monitoring

---

## 🏗️ Architecture

### Microservices Overview

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Client    │─────▶│  Producer   │─────▶│    Kafka    │
│ Application │      │  Service    │      │   Cluster   │
└─────────────┘      └─────────────┘      └──────┬──────┘
                                                  │
                                                  ▼
                     ┌─────────────┐      ┌─────────────┐
                     │  Consumer   │◀─────│   Kafka     │
                     │  Service    │      │   Topics    │
                     └──────┬──────┘      └─────────────┘
                            │
                            ▼
                     ┌─────────────┐
                     │   MongoDB   │
                     │  Database   │
                     └─────────────┘
```

### Service Responsibilities

#### **Producer Service** (Port 3000)

- Receives user activity log requests via REST API
- Validates incoming data using Zod schemas
- Publishes events to Kafka topics
- Provides health check endpoints

#### **Consumer Service** (Port 3001)

- Subscribes to Kafka topics for activity logs
- Processes and persists events to MongoDB
- Provides REST API for querying logs
- Supports pagination and filtering

#### **Infrastructure Services**

- **Apache Kafka**: Message broker for event streaming
- **Zookeeper**: Kafka cluster coordination
- **MongoDB**: NoSQL database for log persistence
- **Kafka UI**: Web interface for Kafka monitoring (optional)

---

## 🛠️ Technology Stack

### Core Technologies

| Category | Technology | Version | Purpose |
|----------|-----------|---------|---------|
| **Runtime** | Node.js | 18.x | JavaScript runtime |
| **Language** | TypeScript | 5.x | Type-safe development |
| **Framework** | Express.js | 5.x | REST API framework |
| **Message Broker** | Apache Kafka | 7.4.0 | Event streaming |
| **Database** | MongoDB | Latest | Document storage |
| **Containerization** | Docker | Latest | Application packaging |
| **Orchestration** | Kubernetes | 1.28+ | Container orchestration |

### Key Libraries

- **kafkajs**: Kafka client for Node.js
- **mongoose**: MongoDB ODM
- **zod**: Schema validation
- **helmet**: Security headers
- **morgan**: HTTP request logging
- **cors**: Cross-origin resource sharing

---

## ✅ Prerequisites

### Required Software

- **Node.js**: v18.x or higher ([Download](https://nodejs.org/))
- **npm**: v9.x or higher (comes with Node.js)
- **Docker**: Latest version ([Download](https://www.docker.com/))
- **Docker Compose**: v2.x or higher
- **Git**: Latest version

### Optional (for Kubernetes)

- **kubectl**: Kubernetes CLI ([Install Guide](https://kubernetes.io/docs/tasks/tools/))
- **Minikube** or **Docker Desktop** with Kubernetes enabled

### System Requirements

- **RAM**: Minimum 8GB (16GB recommended)
- **Disk Space**: 10GB free space
- **OS**: Windows 10/11, macOS, or Linux

---

## 🚀 Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/EyegoTask.git
cd EyegoTask
```

### 2. Install Dependencies

#### Producer Service

```bash
cd producer
npm install
cd ..
```

#### Consumer Service

```bash
cd consumer
npm install
cd ..
```

### 3. Set Up Environment Variables

#### Producer (.env - optional for local development)

```bash
# Producer runs without .env file by default
# All configuration is in docker-compose.yml
```

#### Consumer (.env)

```bash
cd consumer
cat > .env << 'EOF'
PORT=3001
KAFKA_BROKERS=localhost:9092
KAFKA_GROUP_ID=consumer-service-group
KAFKA_TOPIC=user-activity-logs
MONGODB_URI=mongodb://admin:admin123@localhost:27017/eyego?authSource=admin
NODE_ENV=development
EOF
cd ..
```

### 4. Start Infrastructure Services

```bash
# Start MongoDB, Kafka, and Zookeeper
docker-compose up -d mongodb kafka zookeeper
```

### 5. Run Services Locally

#### Terminal 1 - Producer

```bash
cd producer
npm run dev
```

#### Terminal 2 - Consumer

```bash
cd consumer
npm run dev
```

### 6. Verify Services

```bash
# Test Producer
curl http://localhost:3000/api/health

# Test Consumer
curl http://localhost:3001/api/health
```

---

## 🐳 Docker Setup

### Quick Start (Recommended)

```bash
# Build and start all services
docker-compose up --build -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Individual Service Commands

```bash
# Start specific service
docker-compose up -d producer

# Restart service
docker-compose restart consumer

# View service logs
docker-compose logs -f producer

# Rebuild specific service
docker-compose up --build -d consumer
```

### Docker Compose Services

| Service | Container Name | Port | Description |
|---------|---------------|------|-------------|
| Producer | eyego-producer | 3000 | REST API for publishing logs |
| Consumer | eyego-consumer | 3001 | REST API for querying logs |
| MongoDB | eyego-mongodb | 27017 | Database |
| Kafka | eyego-kafka | 9092-9093 | Message broker |
| Zookeeper | eyego-zookeeper | 2181 | Kafka coordination |
| Kafka UI | eyego-kafka-ui | 8080 | Kafka web interface |

### Access Services

- **Producer API**: <http://localhost:3000>
- **Consumer API**: <http://localhost:3001>
- **Kafka UI**: <http://localhost:8080>
- **MongoDB**: mongodb://admin:admin123@localhost:27017

---

## ☸️ Kubernetes Deployment

### Prerequisites

- Kubernetes cluster running (Minikube, Docker Desktop, or cloud provider)
- `kubectl` configured and connected to your cluster

### Deployment Steps

#### 1. Create Namespace

```bash
kubectl apply -f k8s/namespace.yaml
```

#### 2. Deploy Infrastructure

```bash
# MongoDB
kubectl apply -f k8s/deployments/mongodb-statefulset.yaml
kubectl apply -f k8s/services/mongodb-service.yaml

# Zookeeper
kubectl apply -f k8s/deployments/zookeeper-statefulset.yaml
kubectl apply -f k8s/services/zookeeper-service.yaml

# Kafka
kubectl apply -f k8s/deployments/kafka-statefulset.yaml
kubectl apply -f k8s/services/kafka-service.yaml
```

#### 3. Deploy Application Secrets and ConfigMaps

```bash
kubectl apply -f k8s/secrets/app-secrets.yaml
kubectl apply -f k8s/configmaps/producer-config.yaml
kubectl apply -f k8s/configmaps/consumer-config.yaml
```

#### 4. Deploy Microservices

```bash
# Producer
kubectl apply -f k8s/deployments/producer-deployment.yaml
kubectl apply -f k8s/services/producer-service.yaml

# Consumer
kubectl apply -f k8s/deployments/consumer-deployment.yaml
kubectl apply -f k8s/services/consumer-service.yaml
```

#### 5. Verify Deployment

```bash
# Check all pods
kubectl get pods -n eyego-task

# Check services
kubectl get svc -n eyego-task

# View logs
kubectl logs -n eyego-task -l app=producer
kubectl logs -n eyego-task -l app=consumer
```

### Access Services (NodePort)

```bash
# Get NodePort URLs
kubectl get svc -n eyego-task

# Access Producer (NodePort 30000)
curl http://localhost:30000/api/health

# Access Consumer (NodePort 30001)
curl http://localhost:30001/api/health
```

### Scaling

```bash
# Scale Producer
kubectl scale deployment producer -n eyego-task --replicas=3

# Scale Consumer
kubectl scale deployment consumer -n eyego-task --replicas=2
```

---

## 📚 API Documentation

### Producer Service (Port 3000)

#### Health Check

```http
GET /api/health
```

**Response:**

```json
{
  "status": "ok",
  "service": "producer"
}
```

#### Publish User Activity Log

```http
POST /api/logs
Content-Type: application/json
```

**Request Body:**

```json
{
  "userId": "user-123",
  "activityType": "LOGIN",
  "metadata": {
    "device": "mobile",
    "ip": "192.168.1.1",
    "location": "New York"
  }
}
```

**Activity Types:**

- `LOGIN`
- `LOGOUT`
- `PAGE_VIEW`
- `BUTTON_CLICK`
- `FORM_SUBMIT`
- `API_CALL`
- `ERROR`

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Activity log published successfully",
  "eventId": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Consumer Service (Port 3001)

#### Health Check

```http
GET /api/health
```

**Response:**

```json
{
  "status": "ok",
  "service": "consumer"
}
```

#### Get Activity Logs (Paginated)

```http
GET /api/logs?page=1&limit=10&userId=user-123&activityType=LOGIN
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)
- `userId` (optional): Filter by user ID
- `activityType` (optional): Filter by activity type

**Response (200 OK):**

```json
{
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "eventId": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "user-123",
      "activityType": "LOGIN",
      "metadata": {
        "device": "mobile",
        "ip": "192.168.1.1"
      },
      "timestamp": "2026-01-15T02:30:00.000Z",
      "createdAt": "2026-01-15T02:30:01.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```

#### Get Single Activity Log

```http
GET /api/logs/:id
```

**Response (200 OK):**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user-123",
  "activityType": "LOGIN",
  "metadata": {
    "device": "mobile"
  },
  "timestamp": "2026-01-15T02:30:00.000Z",
  "createdAt": "2026-01-15T02:30:01.000Z"
}
```

### Error Responses

**400 Bad Request:**

```json
{
  "error": "Validation failed",
  "details": [
    {
      "field": "userId",
      "message": "Required"
    }
  ]
}
```

**404 Not Found:**

```json
{
  "error": "Activity log not found"
}
```

**500 Internal Server Error:**

```json
{
  "error": "Internal server error",
  "message": "Error description"
}
```

---

## 🔐 Environment Variables

### Producer Service

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP server port |
| `KAFKA_BROKERS` | `kafka:9093` | Kafka broker addresses |
| `KAFKA_TOPIC` | `user-activity-logs` | Kafka topic name |
| `NODE_ENV` | `production` | Environment mode |

### Consumer Service

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | HTTP server port |
| `KAFKA_BROKERS` | `kafka:9093` | Kafka broker addresses |
| `KAFKA_GROUP_ID` | `consumer-service-group` | Kafka consumer group |
| `KAFKA_TOPIC` | `user-activity-logs` | Kafka topic name |
| `MONGODB_URI` | `mongodb://admin:admin123@mongodb:27017/eyego?authSource=admin` | MongoDB connection string |
| `NODE_ENV` | `production` | Environment mode |

### MongoDB Credentials (Kubernetes Secrets)

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGO_INITDB_ROOT_USERNAME` | `admin` | MongoDB admin username |
| `MONGO_INITDB_ROOT_PASSWORD` | `admin123` | MongoDB admin password |

---

## 🧪 Testing

### Run Unit Tests

```bash
# Producer tests
cd producer
npm test

# Consumer tests
cd consumer
npm test
```

### Run Tests with Coverage

```bash
# Producer
cd producer
npm run test:cov

# Consumer
cd consumer
npm run test:cov
```

### Manual API Testing

#### Using cURL

```bash
# Publish a log
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "activityType": "LOGIN",
    "metadata": {"device": "web"}
  }'

# Wait a moment for processing
sleep 2

# Query logs
curl "http://localhost:3001/api/logs?userId=test-user&limit=5"
```

#### Using PowerShell

```powershell
# Publish a log
Invoke-RestMethod -Method POST -Uri http://localhost:3000/api/logs `
  -ContentType "application/json" `
  -Body '{"userId":"test-user","activityType":"LOGIN","metadata":{"device":"web"}}'

# Query logs
Invoke-RestMethod -Uri "http://localhost:3001/api/logs?userId=test-user&limit=5"
```

### Load Testing

```bash
# Install Apache Bench (if not installed)
# Ubuntu/Debian: sudo apt-get install apache2-utils
# macOS: brew install ab

# Run load test (1000 requests, 10 concurrent)
ab -n 1000 -c 10 -p test-payload.json -T application/json http://localhost:3000/api/logs
```

---

## 📊 Monitoring

### Docker Logs

```bash
# View all logs
docker-compose logs -f

# View specific service
docker-compose logs -f producer

# View last 100 lines
docker-compose logs --tail=100 consumer
```

### Kubernetes Logs

```bash
# View pod logs
kubectl logs -n eyego-task -l app=producer -f

# View previous pod logs (if crashed)
kubectl logs -n eyego-task -l app=consumer --previous
```

### Kafka UI

Access Kafka UI at <http://localhost:8080> to monitor:

- Topics and partitions
- Consumer groups
- Message throughput
- Broker health

### Health Checks

```bash
# Check all services
curl http://localhost:3000/api/health
curl http://localhost:3001/api/health
```

---

## 🚢 Deployment

### AWS EC2 Deployment

See [AWS Deployment Guide](./docs/AWS_DEPLOYMENT_GUIDE.md) for detailed instructions on deploying to AWS EC2.

**Quick Start:**

1. Run `./aws-setup.ps1` to prepare SSH keys
2. Connect to EC2 instance
3. Install Docker and Docker Compose
4. Clone repository
5. Run `docker-compose up -d`

### Production Considerations

- **Security**: Use environment-specific secrets, enable TLS/SSL
- **Scaling**: Use Kubernetes HPA for auto-scaling
- **Monitoring**: Integrate with Prometheus, Grafana, or CloudWatch
- **Logging**: Centralize logs with ELK stack or CloudWatch
- **Backups**: Regular MongoDB backups, snapshot volumes
- **CI/CD**: Automate deployments with GitHub Actions or Jenkins

---

## 📁 Project Structure

```
EyegoTask/
├── producer/                 # Producer microservice
│   ├── src/
│   │   ├── application/     # Use cases and DTOs
│   │   ├── domain/          # Domain entities
│   │   ├── infrastructure/  # Kafka, external services
│   │   └── presentation/    # HTTP controllers, routes
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── consumer/                 # Consumer microservice
│   ├── src/
│   │   ├── application/     # Use cases and DTOs
│   │   ├── domain/          # Domain entities, repositories
│   │   ├── infrastructure/  # MongoDB, Kafka
│   │   └── presentation/    # HTTP controllers, routes
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── k8s/                      # Kubernetes manifests
│   ├── namespace.yaml
│   ├── deployments/
│   ├── services/
│   ├── configmaps/
│   └── secrets/
├── docs/                     # Documentation
├── docker-compose.yml        # Docker Compose configuration
└── README.md                 # This file
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License.

---

## 📧 Contact

For questions or support, please open an issue on GitHub.

---

## 🙏 Acknowledgments

- Apache Kafka for event streaming
- MongoDB for flexible data storage
- Node.js and TypeScript communities
- Docker and Kubernetes projects
