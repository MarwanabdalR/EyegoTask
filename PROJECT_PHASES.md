# Project Phases - Event-Driven Microservice

## Overview
This document outlines the complete project phases for developing a scalable event-driven microservice using Node.js, Express, and Kafka for real-time processing of user activity logs.

---

## Phase 1: Project Setup & Architecture Design

### Objectives
- Initialize project structure following DDD principles
- Set up development environment
- Design system architecture
- Create technical documentation

### Tasks
- [x] Initialize Node.js project with TypeScript
- [x] Set up project structure based on DDD (Domain-Driven Design)
  - Domain layer (entities, value objects, domain services)
  - Application layer (use cases, DTOs)
  - Infrastructure layer (repositories, external services)
  - Presentation layer (REST API controllers)
- [x] Configure ESLint, Prettier, and TypeScript
- [x] Set up Git repository and initialize .gitignore
- [x] Create initial README.md structure
- [x] Design database schema for user activity logs
- [x] Design Kafka topics structure

### Deliverables
- Project folder structure
- TypeScript configuration
- Initial README.md

### Estimated Time
2-3 hours

---

## Phase 2: Domain Layer Implementation (DDD)

### Objectives
- Implement domain entities and value objects
- Define domain services and business logic
- Set up domain events

### Tasks
- [ ] Define UserActivityLog entity
  - Properties: userId, activityType, timestamp, metadata, etc.
  - Business rules and validations
- [ ] Create value objects (ActivityType, Timestamp, etc.)
- [ ] Implement domain services (if needed)
- [ ] Define domain events
- [ ] Write unit tests for domain logic

### Deliverables
- Domain entities
- Value objects
- Domain services
- Domain events
- Unit tests

### Estimated Time
3-4 hours

---

## Phase 3: Infrastructure Layer - MongoDB Integration

### Objectives
- Implement MongoDB connection and repository pattern
- Create indexes for optimal query performance
- Implement data access layer

### Tasks
- [ ] Set up MongoDB connection using Mongoose or native driver
- [ ] Create MongoDB schema/model for UserActivityLog
- [ ] Implement repository interface (domain layer)
- [ ] Implement MongoDB repository (infrastructure layer)
- [ ] Create indexes:
  - userId index
  - timestamp index
  - activityType index
  - Compound indexes for common queries
- [ ] Implement connection pooling and error handling
- [ ] Write integration tests for repository

### Deliverables
- MongoDB connection module
- UserActivityLog model/schema
- Repository implementation
- Index definitions
- Integration tests

### Estimated Time
4-5 hours

---

## Phase 4: Infrastructure Layer - Kafka Integration

### Objectives
- Implement Kafka producer for publishing logs
- Implement Kafka consumer for processing logs
- Handle message serialization/deserialization
- Implement error handling and retry logic

### Tasks
- [ ] Set up Kafka client library (kafkajs)
- [ ] Configure Kafka producer
  - Connection settings
  - Topic configuration
  - Serialization (JSON/Avro)
  - Error handling and retries
- [ ] Configure Kafka consumer
  - Consumer group configuration
  - Topic subscription
  - Message processing
  - Error handling and dead letter queue (optional)
  - Commit strategies
- [ ] Implement message schema validation
- [ ] Create Kafka utility modules
- [ ] Write unit tests for Kafka integration

### Deliverables
- Kafka producer module
- Kafka consumer module
- Message schemas
- Error handling logic
- Unit tests

### Estimated Time
5-6 hours

---

## Phase 5: Application Layer Implementation

### Objectives
- Implement use cases/application services
- Create DTOs for data transfer
- Orchestrate domain and infrastructure layers

### Tasks
- [ ] Create use cases:
  - PublishUserActivityLogUseCase
  - ProcessUserActivityLogUseCase
  - GetUserActivityLogsUseCase
  - GetUserActivityLogByIdUseCase
- [ ] Implement DTOs (Data Transfer Objects)
- [ ] Implement application services
- [ ] Add input validation (Zod or class-validator)
- [ ] Implement error handling and mapping
- [ ] Write unit tests for use cases

### Deliverables
- Use case implementations
- DTOs
- Application services
- Validation logic
- Unit tests

### Estimated Time
4-5 hours

---

## Phase 6: Presentation Layer - REST API

### Objectives
- Implement REST API endpoints
- Add pagination and filtering
- Implement proper error handling
- Add API documentation

### Tasks
- [ ] Set up Express.js server
- [ ] Implement middleware:
  - Error handling middleware
  - Request validation middleware
  - Logging middleware
  - CORS configuration
- [ ] Create REST API endpoints:
  - POST /api/logs - Publish activity log (trigger producer)
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

### Deliverables
- Express.js server setup
- REST API endpoints
- Pagination implementation
- Filtering implementation
- API documentation
- Integration tests

### Estimated Time
5-6 hours

---

## Phase 7: Docker Configuration

### Objectives
- Containerize the application
- Set up Docker Compose for local development
- Configure multi-stage builds for optimization

### Tasks
- [ ] Create Dockerfile:
  - Multi-stage build (builder and production)
  - Optimize image size
  - Set up proper user permissions
  - Configure health checks
- [ ] Create .dockerignore file
- [ ] Create docker-compose.yml for local development:
  - Node.js service
  - MongoDB service
  - Kafka service (Zookeeper + Kafka brokers)
  - Network configuration
  - Volume mounts
  - Environment variables
- [ ] Test Docker build locally
- [ ] Test docker-compose setup
- [ ] Document Docker commands in README

### Deliverables
- Dockerfile
- .dockerignore
- docker-compose.yml
- Docker documentation
- Tested containerized application

### Estimated Time
4-5 hours

---

## Phase 8: Kubernetes Configuration

### Objectives
- Create Kubernetes manifests
- Set up deployment, services, and configmaps
- Configure secrets management
- Set up ingress (optional)

### Tasks
- [ ] Create Kubernetes namespace
- [ ] Create ConfigMap for application configuration
- [ ] Create Secrets for sensitive data (MongoDB URI, Kafka configs)
- [ ] Create Deployment manifest:
  - Replica set configuration
  - Resource limits and requests
  - Health checks (liveness and readiness probes)
  - Environment variables
- [ ] Create Service manifest (ClusterIP/NodePort)
- [ ] Create MongoDB deployment (or use external MongoDB)
- [ ] Create Kafka deployment (or use managed Kafka service)
- [ ] Set up ingress (optional, for cloud deployment)
- [ ] Test deployment locally (minikube/kind) or on cloud

### Deliverables
- Kubernetes manifests (YAML files)
- ConfigMaps
- Secrets configuration
- Deployment documentation
- Tested K8s deployment

### Estimated Time
5-6 hours

---

## Phase 9: Cloud Deployment (GCP/AWS)

### Objectives
- Deploy application to cloud platform
- Set up managed services (MongoDB Atlas, managed Kafka if needed)
- Configure networking and security

### Tasks
- [ ] Choose cloud platform (GCP/AWS free tier)
- [ ] Set up cloud account and billing alerts
- [ ] Deploy MongoDB (MongoDB Atlas free tier or self-hosted)
- [ ] Set up Kafka (managed service or self-hosted)
- [ ] Create GKE cluster (GCP) or EKS cluster (AWS) - or use managed Kubernetes
- [ ] Configure kubectl for cloud cluster
- [ ] Deploy application using Kubernetes manifests
- [ ] Configure load balancer/ingress
- [ ] Set up monitoring and logging (optional)
- [ ] Test deployed application
- [ ] Document deployment process

### Deliverables
- Deployed application on cloud
- Cloud infrastructure setup
- Deployment documentation
- Access URLs and credentials (documented securely)

### Estimated Time
4-6 hours

---

## Phase 10: Testing & Quality Assurance

### Objectives
- Write comprehensive tests
- Ensure code quality
- Test end-to-end functionality

### Tasks
- [ ] Unit tests:
  - Domain layer tests
  - Application layer tests
  - Infrastructure layer mocks
- [ ] Integration tests:
  - MongoDB integration tests
  - Kafka integration tests
  - API integration tests
- [ ] End-to-end tests:
  - Full flow: Producer → Kafka → Consumer → MongoDB → API
- [ ] Load testing (optional):
  - Test Kafka producer throughput
  - Test API performance
- [ ] Code quality checks:
  - Linting
  - Type checking
  - Code coverage
- [ ] Fix bugs and issues

### Deliverables
- Test suite
- Test coverage report
- Bug fixes
- Performance test results (if applicable)

### Estimated Time
6-8 hours

---

## Phase 11: Documentation & README

### Objectives
- Create comprehensive README
- Document architecture decisions
- Provide setup instructions

### Tasks
- [ ] Write README.md with sections:
  - Project description
  - Architecture overview
  - Technology stack
  - Prerequisites
  - Local setup instructions
  - Docker setup instructions
  - Kubernetes deployment instructions
  - Cloud deployment instructions
  - API documentation
  - Environment variables
  - Testing instructions
  - Troubleshooting
- [ ] Document architecture choices:
  - Why DDD was chosen
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
3-4 hours

---

## Phase 12: Demo Video Recording

### Objectives
- Record end-to-end demonstration
- Showcase all features
- Explain architecture and implementation

### Tasks
- [ ] Prepare demo script:
  - Introduction
  - Architecture overview
  - Local setup demonstration
  - Kafka producer demonstration
  - Kafka consumer demonstration
  - MongoDB data verification
  - REST API demonstration (pagination, filtering)
  - Docker demonstration
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
- [ ] Final code review
- [ ] Verify all requirements:
  - ✅ Kafka producer and consumer
  - ✅ MongoDB with indexing
  - ✅ Docker configuration
  - ✅ Kubernetes deployment
  - ✅ DDD principles
  - ✅ REST API with pagination and filtering
  - ✅ GitHub repo with README
  - ✅ Dockerfile
  - ✅ Demo video with voiceover
  - ✅ Architecture write-up
- [ ] Clean up code (remove console.logs, unused code)
- [ ] Ensure code is production-ready
- [ ] Push final code to GitHub
- [ ] Verify GitHub repo is public and accessible
- [ ] Submit via form: https://forms.gle/WNrJQkhP61RyjLu58

### Deliverables
- Clean, production-ready code
- All deliverables verified
- Project submission

### Estimated Time
2-3 hours

---

## Summary

### Total Estimated Time
50-70 hours (depending on experience level)

### Key Requirements Checklist
- [x] Node.js + Express microservice
- [x] Kafka producer and consumer
- [x] MongoDB with proper indexing
- [x] Docker configuration
- [x] Kubernetes deployment
- [x] DDD principles
- [x] REST API with pagination and filtering
- [x] GitHub repo with README
- [x] Dockerfile
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

### Project Structure (DDD-based)
```
src/
├── domain/           # Domain layer
│   ├── entities/
│   ├── value-objects/
│   ├── services/
│   └── events/
├── application/      # Application layer
│   ├── use-cases/
│   ├── dtos/
│   └── services/
├── infrastructure/   # Infrastructure layer
│   ├── database/
│   ├── kafka/
│   └── config/
└── presentation/     # Presentation layer
    ├── controllers/
    ├── middleware/
    └── routes/
```

---

## Notes

1. **Deadline:** Thursday, 15th Jan, 8 PM
2. **Submission Form:** https://forms.gle/WNrJQkhP61RyjLu58
3. **Video Requirement:** Must have clear English voiceover (videos without voice will be ignored)
4. **Focus Areas:**
   - Code quality and structure
   - DDD implementation
   - Scalability considerations
   - Error handling
   - Documentation clarity

Good luck with your project! 🚀

