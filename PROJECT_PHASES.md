# Project Phases - Event-Driven Microservices Architecture

## Overview

This document outlines the complete project phases for developing a scalable event-driven microservices system using Node.js, Express, and Kafka for real-time processing of user activity logs.

**Architecture:** Microservices with two distinct services:

- **Producer Service:** API Gateway (Express.js) for ingesting logs and publishing to Kafka
- **Consumer Service:** Domain logic, MongoDB persistence, and query API for reading logs

---

## Phase 1: Project Setup & Architecture Design

### Objectives

- Initialize microservices project structure
- Set up development environment
- Design system architecture
- Create technical documentation

### Tasks

- [x] Initialize Node.js project with TypeScript
- [x] Set up microservices structure with `producer` and `consumer` services
- [x] Configure ESLint, Prettier, and TypeScript
- [x] Set up Git repository and initialize .gitignore
- [x] Create initial README.md structure
- [x] Design database schema for user activity logs
- [x] Design Kafka topics structure

### Deliverables

- Microservices folder structure
- TypeScript configuration
- Initial README.md

### Estimated Time

2-3 hours

---

## Phase 2: Domain Layer Implementation (Consumer Service)

### Objectives

- Implement domain entities and value objects in the **consumer service**
- Define domain services and business logic
- Set up domain events

### Path

`consumer/src/domain/`

### Tasks

- [x] Define UserActivityLog entity
  - Properties: userId, activityType, timestamp, metadata, etc.
  - Business rules and validations
- [x] Write unit tests for domain logic

### Deliverables

- Domain entities in `consumer/src/domain/entities/`
- Unit tests

### Estimated Time

3-4 hours

---

## Phase 3: Infrastructure Layer - MongoDB Integration (Consumer Service)

### Objectives

- Implement MongoDB connection and repository pattern in the **consumer service**
- Create indexes for optimal query performance
- Implement data access layer

### Path

`consumer/src/infrastructure/database/`

### Tasks

- [x] Set up MongoDB connection using Mongoose or native driver
- [x] Create MongoDB schema/model for UserActivityLog
- [x] Implement repository interface (domain layer)
- [x] Implement MongoDB repository (infrastructure layer)
- [x] Create indexes:
  - userId index
  - timestamp index
  - activityType index
  - Compound indexes for common queries
- [x] Implement connection pooling and error handling
- [x] Write integration tests for repository

### Deliverables

- MongoDB connection module in `consumer/src/infrastructure/database/`
- UserActivityLog model/schema
- Repository implementation
- Index definitions
- Integration tests

### Estimated Time

4-5 hours

---

## Phase 4: Infrastructure Layer - Kafka Integration (Both Services)

### Objectives

- Implement Kafka producer in the **producer service**
- Implement Kafka consumer in the **consumer service**
- Handle message serialization/deserialization
- Implement error handling and retry logic

### Part A: Producer Service - Kafka Producer

#### Path

`producer/src/infrastructure/kafka/`

#### Tasks

- [x] Set up Kafka client library (kafkajs) in producer service
- [x] Configure Kafka producer:
  - Connection settings
  - Topic configuration
  - Serialization (JSON)
  - Error handling and retries
- [x] Implement message schema validation
- [x] Create Kafka producer utility modules
- [x] Write integration tests for Kafka producer

#### Deliverables

- Kafka producer module in `producer/src/infrastructure/kafka/`
- Message schemas
- Error handling logic
- Unit tests

### Part B: Consumer Service - Kafka Consumer

#### Path

`consumer/src/infrastructure/kafka/`

#### Tasks

- [x] Set up Kafka client library (kafkajs) in consumer service
- [x] Configure Kafka consumer:
  - Consumer group configuration
  - Topic subscription
  - Message processing and domain logic integration
  - Error handling and dead letter queue (optional)
  - Commit strategies
- [x] Implement message deserialization
- [x] Connect consumer to domain layer (trigger use cases)
- [x] Write unit tests for Kafka consumer

#### Deliverables

- Kafka consumer module in `consumer/src/infrastructure/kafka/`
- Message processing logic
- Domain integration
- Unit tests

### Estimated Time

6-8 hours (both parts)

---

## Phase 5: Application Layer Implementation (Both Services)

### Objectives

- Implement use cases/application services in both services
- Create DTOs for data transfer
- Orchestrate domain and infrastructure layers

### Part A: Producer Service - Application Layer

#### Path

`producer/src/application/`

#### Tasks

- [x] Create use cases:
  - PublishUserActivityLogUseCase
- [x] Implement DTOs (Data Transfer Objects) for incoming requests
- [x] Add input validation (Zod or class-validator)
- [x] Implement error handling and mapping
- [x] Write unit tests for use cases

#### Deliverables

- Use case implementations in `producer/src/application/use-cases/`
- DTOs in `producer/src/application/dtos/`
- Validation logic
- Unit tests

### Part B: Consumer Service - Application Layer

#### Path

`consumer/src/application/`

#### Tasks

- [x] Create use cases:
  - ProcessUserActivityLogUseCase (triggered by Kafka consumer)
  - GetUserActivityLogsUseCase
  - GetUserActivityLogByIdUseCase
- [x] Implement DTOs (Data Transfer Objects)
- [x] Implement application services
- [x] Add input validation (Zod or class-validator)
- [x] Implement error handling and mapping
- [x] Write unit tests for use cases

#### Deliverables

- Use case implementations in `consumer/src/application/use-cases/`
- DTOs in `consumer/src/application/dtos/`
- Application services
- Validation logic
- Unit tests

### Estimated Time

5-6 hours (both parts)

---

## Phase 6: Presentation Layer - REST API (Both Services)

### Objectives

- Implement REST API in the **producer service** for ingesting logs
- Implement REST API in the **consumer service** for querying logs
- Add pagination and filtering to consumer API
- Implement proper error handling
- Add API documentation

### Part A: Producer Service - Ingest API

#### Path

`producer/src/presentation/`

#### Tasks

- [ ] Set up Express.js server in producer service
- [ ] Implement middleware:
  - Error handling middleware
  - Request validation middleware
  - Logging middleware
  - CORS configuration
- [ ] Create REST API endpoints:
  - POST /api/logs - Publish activity log (trigger Kafka producer)
  - GET /api/health - Health check endpoint
- [ ] Implement API response formatting
- [ ] Add Swagger/OpenAPI documentation (optional but recommended)
- [ ] Write integration tests

#### Deliverables

- Express.js server setup in producer service
- POST /api/logs endpoint
- Health check endpoint
- API documentation
- Integration tests

### Part B: Consumer Service - Query API

#### Path

`consumer/src/presentation/`

#### Tasks

- [ ] Set up Express.js server in consumer service
- [ ] Implement middleware:
  - Error handling middleware
  - Request validation middleware
  - Logging middleware
  - CORS configuration
- [ ] Create REST API endpoints:
  - GET /api/logs - Get logs with pagination and filtering
  - GET /api/logs/:id - Get log by ID
  - GET /api/health - Health check endpoint
- [ ] Implement pagination:
  - Query parameters: page, limit
  - Response metadata: total, page, limit, hasNext, hasPrev
- [ ] Implement filtering:
  - Filter by userId
  - Filter by activityType
  - Filter by date range (from, to)
  - Sort by timestamp (asc/desc)
- [ ] Add input validation for query parameters
- [ ] Implement API response formatting
- [ ] Add Swagger/OpenAPI documentation (optional but recommended)
- [ ] Write integration tests

#### Deliverables

- Express.js server setup in consumer service
- GET /api/logs and GET /api/logs/:id endpoints
- Pagination implementation
- Filtering implementation
- API documentation
- Integration tests

### Estimated Time

6-8 hours (both parts)

---

## Phase 7: Docker Configuration (Microservices)

### Objectives

- Containerize both microservices
- Set up Docker Compose for local development
- Configure multi-stage builds for optimization

### Tasks

- [ ] Create Dockerfile for **producer service**:
  - Multi-stage build (builder and production)
  - Optimize image size
  - Set up proper user permissions
  - Configure health checks
- [ ] Create Dockerfile for **consumer service**:
  - Multi-stage build (builder and production)
  - Optimize image size
  - Set up proper user permissions
  - Configure health checks
- [ ] Create .dockerignore files for both services
- [ ] Create docker-compose.yml for local development:
  - Producer service
  - Consumer service
  - MongoDB service
  - Kafka service (Zookeeper + Kafka brokers)
  - Network configuration
  - Volume mounts
  - Environment variables
- [ ] Test Docker builds locally for both services
- [ ] Test docker-compose setup (full system)
- [ ] Document Docker commands in README

### Deliverables

- `producer/Dockerfile`
- `consumer/Dockerfile`
- .dockerignore files
- docker-compose.yml (orchestrating all services)
- Docker documentation
- Tested containerized microservices

### Estimated Time

5-6 hours

---

## Phase 8: Kubernetes Configuration (Microservices)

### Objectives

- Create Kubernetes manifests for both services
- Set up deployments, services, and configmaps
- Configure secrets management
- Set up ingress (optional)

### Tasks

- [ ] Create Kubernetes namespace
- [ ] Create ConfigMaps for application configuration (producer and consumer)
- [ ] Create Secrets for sensitive data (MongoDB URI, Kafka configs)
- [ ] Create Deployment manifest for **producer service**:
  - Replica set configuration
  - Resource limits and requests
  - Health checks (liveness and readiness probes)
  - Environment variables
- [ ] Create Deployment manifest for **consumer service**:
  - Replica set configuration
  - Resource limits and requests
  - Health checks (liveness and readiness probes)
  - Environment variables
- [ ] Create Service manifests (ClusterIP/NodePort) for both services
- [ ] Create MongoDB deployment (or use external MongoDB)
- [ ] Create Kafka deployment (or use managed Kafka service)
- [ ] Set up ingress (optional, for cloud deployment)
- [ ] Test deployment locally (minikube/kind) or on cloud

### Deliverables

- Kubernetes manifests (YAML files) for both services
- ConfigMaps
- Secrets configuration
- Deployment documentation
- Tested K8s deployment

### Estimated Time

6-8 hours

---

## Phase 9: Cloud Deployment (GCP/AWS)

### Objectives

- Deploy both microservices to cloud platform
- Set up managed services (MongoDB Atlas, managed Kafka if needed)
- Configure networking and security

### Tasks

- [ ] Choose cloud platform (GCP/AWS free tier)
- [ ] Set up cloud account and billing alerts
- [ ] Deploy MongoDB (MongoDB Atlas free tier or self-hosted)
- [ ] Set up Kafka (managed service or self-hosted)
- [ ] Create GKE cluster (GCP) or EKS cluster (AWS) - or use managed Kubernetes
- [ ] Configure kubectl for cloud cluster
- [ ] Deploy producer service using Kubernetes manifests
- [ ] Deploy consumer service using Kubernetes manifests
- [ ] Configure load balancer/ingress for producer API
- [ ] Configure load balancer/ingress for consumer API (if needed)
- [ ] Set up monitoring and logging (optional)
- [ ] Test deployed microservices
- [ ] Document deployment process

### Deliverables

- Deployed microservices on cloud
- Cloud infrastructure setup
- Deployment documentation
- Access URLs and credentials (documented securely)

### Estimated Time

5-7 hours

---

## Phase 10: Testing & Quality Assurance

### Objectives

- Write comprehensive tests for both services
- Ensure code quality
- Test end-to-end functionality

### Tasks

- [ ] Unit tests for **producer service**:
  - Application layer tests
  - Infrastructure layer mocks (Kafka producer)
- [ ] Unit tests for **consumer service**:
  - Domain layer tests
  - Application layer tests
  - Infrastructure layer mocks
- [ ] Integration tests for **producer service**:
  - Kafka producer integration tests
  - API integration tests
- [ ] Integration tests for **consumer service**:
  - MongoDB integration tests
  - Kafka consumer integration tests
  - API integration tests
- [ ] End-to-end tests:
  - Full flow: Producer API → Kafka → Consumer → MongoDB → Consumer API
- [ ] Load testing (optional):
  - Test Kafka producer throughput
  - Test both APIs performance
- [ ] Code quality checks:
  - Linting
  - Type checking
  - Code coverage
- [ ] Fix bugs and issues

### Deliverables

- Test suite for both services
- Test coverage reports
- Bug fixes
- Performance test results (if applicable)

### Estimated Time

7-9 hours

---

## Phase 11: Documentation & README

### Objectives

- Create comprehensive README
- Document architecture decisions
- Provide setup instructions

### Tasks

- [ ] Write README.md with sections:
  - Project description
  - Microservices architecture overview
  - Technology stack
  - Prerequisites
  - Local setup instructions
  - Docker setup instructions
  - Kubernetes deployment instructions
  - Cloud deployment instructions
  - API documentation (both services)
  - Environment variables
  - Testing instructions
  - Troubleshooting
- [ ] Document architecture choices:
  - Why microservices architecture was chosen
  - Service boundaries and responsibilities
  - Kafka architecture decisions
  - Database schema design
  - API design decisions
  - Deployment strategy
- [ ] Add architecture diagrams (optional but recommended)
- [ ] Add code comments where necessary
- [ ] Create CHANGELOG.md (optional)

### Deliverables

- Complete README.md
- Architecture documentation
- Setup guides
- API documentation

### Estimated Time

4-5 hours

---

## Phase 12: Demo Video Recording

### Objectives

- Record end-to-end demonstration
- Showcase all features
- Explain architecture and implementation

### Tasks

- [ ] Prepare demo script:
  - Introduction
  - Microservices architecture overview
  - Local setup demonstration
  - Producer service demonstration (POST /api/logs)
  - Kafka message flow demonstration
  - Consumer service demonstration (Kafka consumption)
  - MongoDB data verification
  - Consumer REST API demonstration (GET /api/logs with pagination, filtering)
  - Docker demonstration (both services)
  - Kubernetes deployment demonstration
  - Cloud deployment (if applicable)
  - Conclusion
- [ ] Set up screen recording software
- [ ] Record demo with clear English voiceover
- [ ] Edit video (if needed)
- [ ] Upload to YouTube or cloud storage
- [ ] Get shareable link

### Deliverables

- Demo video (5-10 minutes)
- Video URL/link
- Clear English voiceover (mandatory)

### Estimated Time

2-3 hours

---

## Phase 13: Final Review & Submission

### Objectives

- Review all deliverables
- Ensure all requirements are met
- Submit project

### Tasks

- [ ] Final code review for both services
- [ ] Verify all requirements:
  - ✅ Kafka producer (producer service) and consumer (consumer service)
  - ✅ MongoDB with indexing (consumer service)
  - ✅ Docker configuration (both services)
  - ✅ Kubernetes deployment (both services)
  - ✅ DDD principles (consumer service domain layer)
  - ✅ REST API with pagination and filtering (consumer service)
  - ✅ REST API for ingestion (producer service)
  - ✅ GitHub repo with README
  - ✅ Dockerfiles (both services)
  - ✅ Demo video with voiceover
  - ✅ Architecture write-up
- [ ] Clean up code (remove console.logs, unused code)
- [ ] Ensure code is production-ready
- [ ] Push final code to GitHub
- [ ] Verify GitHub repo is public and accessible
- [ ] Submit via form: <https://forms.gle/WNrJQkhP61RyjLu58>

### Deliverables

- Clean, production-ready code
- All deliverables verified
- Project submission

### Estimated Time

2-3 hours

---

## Summary

### Total Estimated Time

55-75 hours (depending on experience level)

### Key Requirements Checklist

- [x] Node.js + Express microservices (producer & consumer)
- [x] Kafka producer and consumer (split across services)
- [x] MongoDB with proper indexing (consumer service)
- [x] Docker configuration (both services)
- [x] Kubernetes deployment (both services)
- [x] DDD principles (consumer service)
- [x] REST API with pagination and filtering (consumer service)
- [x] REST API for ingestion (producer service)
- [x] GitHub repo with README
- [x] Dockerfiles (both services)
- [x] Demo video with English voiceover
- [x] Architecture write-up

### Technology Stack

- **Runtime:** Node.js (v18+)
- **Language:** TypeScript
- **Framework:** Express.js
- **Message Broker:** Apache Kafka (kafkajs)
- **Database:** MongoDB (Mongoose)
- **Containerization:** Docker
- **Orchestration:** Kubernetes
- **Cloud:** GCP/AWS (free tier)
- **Testing:** Jest, Supertest
- **Validation:** Zod or class-validator

### Microservices Architecture

#### Producer Service Structure

```
producer/
├── src/
│   ├── application/      # Application layer
│   │   ├── use-cases/
│   │   └── dtos/
│   ├── infrastructure/   # Infrastructure layer
│   │   ├── kafka/        # Kafka producer
│   │   └── config/
│   └── presentation/     # Presentation layer (API)
│       ├── controllers/
│       ├── middleware/
│       └── routes/
├── Dockerfile
└── package.json
```

#### Consumer Service Structure

```
consumer/
├── src/
│   ├── domain/           # Domain layer (DDD)
│   │   ├── entities/
│   │   ├── value-objects/
│   │   ├── services/
│   │   └── events/
│   ├── application/      # Application layer
│   │   ├── use-cases/
│   │   ├── dtos/
│   │   └── services/
│   ├── infrastructure/   # Infrastructure layer
│   │   ├── database/     # MongoDB
│   │   ├── kafka/        # Kafka consumer
│   │   └── config/
│   └── presentation/     # Presentation layer (API)
│       ├── controllers/
│       ├── middleware/
│       └── routes/
├── Dockerfile
└── package.json
```

### Service Responsibilities

#### Producer Service (API Gateway)

- **Purpose:** Ingest user activity logs via REST API
- **Responsibilities:**
  - Receive POST requests at `/api/logs`
  - Validate incoming data (DTOs)
  - Publish messages to Kafka topic
  - Return acknowledgment to client
- **No Domain Logic:** This is a thin API layer

#### Consumer Service (Domain & Persistence)

- **Purpose:** Process events and manage data
- **Responsibilities:**
  - Consume messages from Kafka topic
  - Execute domain logic (DDD entities, value objects)
  - Persist data to MongoDB
  - Expose query API (GET `/api/logs`, GET `/api/logs/:id`)
  - Handle pagination and filtering
- **Contains Domain Logic:** Full DDD implementation

---

## Notes

1. **Deadline:** Thursday, 15th Jan, 8 PM
2. **Submission Form:** <https://forms.gle/WNrJQkhP61RyjLu58>
3. **Video Requirement:** Must have clear English voiceover (videos without voice will be ignored)
4. **Focus Areas:**
   - Code quality and structure
   - Microservices architecture implementation
   - Service boundaries and separation of concerns
   - DDD implementation (consumer service)
   - Scalability considerations
   - Error handling
   - Documentation clarity

Good luck with your project! 🚀
