# EyegoTask API Documentation

This document provides instructions on how to start the services and detailed references for the REST APIs exposed by the Producer and Consumer microservices.

## 🚀 Getting Started

### Prerequisites

1. **Node.js**: v18+ installed.
2. **Docker**: Ensure Docker Desktop is running (for Kafka and MongoDB).
3. **Environment Variables**:
    - Ensure `.env` files exist in both `producer` and `consumer` directories (or defaults will be used).

### 1. Start Infrastructure

Start MongoDB and Kafka using Docker Compose:

```bash
# In the root directory (where docker-compose.yml is)
docker-compose up -d
```

### 2. Start Producer Service

The Producer service creates activity logs and publishes them to Kafka.

```bash
cd producer
npm install
npm start
```

*Server runs on: `http://localhost:3000`*

### 3. Start Consumer Service

The Consumer service listens to Kafka, saves logs to MongoDB, and exposes them via an API.

```bash
cd consumer
npm install
npm start
```

*Server runs on: `http://localhost:3001`*

---

## 📡 Producer Service API

**Base URL**: `http://localhost:3000`

### 1. Health Check

Check if the service is running.

- **Endpoint**: `GET /api/health`
- **Response**:

  ```json
  {
    "status": "ok",
    "service": "producer-service"
  }
  ```

### 2. Publish Activity Log

Publish a new user activity log event.

- **Endpoint**: `POST /api/logs`
- **Headers**: `Content-Type: application/json`
- **Body**:

  ```json
  {
    "userId": "user-123",
    "activityType": "LOGIN", // Options: LOGIN, LOGOUT, VIEW_PAGE, PURCHASE
    "timestamp": "2023-10-27T10:00:00Z", // Optional, defaults to now
    "metadata": { // Optional
      "device": "mobile",
      "ip": "192.168.1.1"
    }
  }
  ```

- **Success Response (201 Created)**:

  ```json
  {
    "status": "success",
    "message": "Activity log published successfully"
  }
  ```

- **Error Response (400 Bad Request)**:

  ```json
  {
    "status": "error",
    "message": "Validation Error",
    "errors": [ ... ]
  }
  ```

---

## 📥 Consumer Service API

**Base URL**: `http://localhost:3001`

### 1. Health Check

Check if the service is running.

- **Endpoint**: `GET /api/health`
- **Response**:

  ```json
  {
    "status": "ok",
    "service": "consumer-service"
  }
  ```

### 2. Get Activity Logs

Retrieve a paginated list of activity logs with optional filtering.

- **Endpoint**: `GET /api/logs`
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `userId`: Filter by User ID
  - `activityType`: Filter by Activity Type (LOGIN, PURCHASE, etc.)
  - `startDate`: Filter logs after this date (ISO string)
  - `endDate`: Filter logs before this date (ISO string)

- **Example Request**:
  `GET /api/logs?userId=user-123&activityType=LOGIN&page=1&limit=5`

- **Success Response (200 OK)**:

  ```json
  {
    "status": "success",
    "data": [
      {
        "eventId": "uuid-string",
        "userId": "user-123",
        "activityType": "LOGIN",
        "timestamp": "2023-10-27T10:00:00.000Z",
        "metadata": { ... }
      },
      ...
    ],
    "meta": {
      "total": 50,
      "page": 1,
      "limit": 5,
      "totalPages": 10
    }
  }
  ```

### 3. Get Log by ID

Retrieve a single activity log by its Event ID.

- **Endpoint**: `GET /api/logs/:id`
- **Example Request**:
  `GET /api/logs/550e8400-e29b-41d4-a716-446655440000`

- **Success Response (200 OK)**:

  ```json
  {
    "status": "success",
    "data": {
      "eventId": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "user-123",
      ...
    }
  }
  ```

- **Error Response (404 Not Found)**:

  ```json
  {
    "status": "fail",
    "message": "Activity log not found"
  }
  ```
