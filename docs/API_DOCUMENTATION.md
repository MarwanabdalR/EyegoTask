# API Documentation

Complete API reference for Producer and Consumer services.

---

## Getting Started

### Start All Services

```bash
# Using Docker Compose (Recommended)
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f producer
docker-compose logs -f consumer
```

**Service URLs**:

- Producer: <http://localhost:3000>
- Consumer: <http://localhost:3001>

---

## Producer Service API

**Base URL**: `http://localhost:3000`

### Health Check

Check if the Producer service is running.

**Endpoint**: `GET /api/health`

**Response** (200 OK):

```json
{
  "status": "ok",
  "service": "producer"
}
```

**Example**:

```bash
curl http://localhost:3000/api/health
```

---

### Publish Activity Log

Publish a new user activity log event to Kafka.

**Endpoint**: `POST /api/logs`

**Headers**:

- `Content-Type: application/json`

**Request Body**:

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

**Activity Types** (Enum):

- `LOGIN` - User login event
- `LOGOUT` - User logout event
- `PAGE_VIEW` - Page view tracking
- `BUTTON_CLICK` - Button interaction
- `FORM_SUBMIT` - Form submission
- `API_CALL` - API request made
- `ERROR` - Error event

**Success Response** (201 Created):

```json
{
  "status": "success",
  "message": "Activity log published successfully"
}
```

**Error Response** (400 Bad Request):

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


## Consumer Service API

**Base URL**: `http://localhost:3001`

### Health Check

Check if the Consumer service is running.

**Endpoint**: `GET /api/health`

**Response** (200 OK):

```json
{
  "status": "ok",
  "service": "consumer"
}
```



### Get Activity Logs

Retrieve a paginated list of activity logs with optional filtering.

**Endpoint**: `GET /api/logs`

**Query Parameters**:

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `page` | number | No | 1 | Page number |
| `limit` | number | No | 10 | Items per page (max: 100) |
| `userId` | string | No | - | Filter by user ID |
| `activityType` | string | No | - | Filter by activity type |



**Examples**:

```bash
# Get all logs (first page)
curl http://localhost:3001/api/logs

# Get logs for specific user
curl http://localhost:3001/api/logs?userId=user-123

# Get LOGIN activities
curl http://localhost:3001/api/logs?activityType=LOGIN

# Pagination
curl http://localhost:3001/api/logs?page=2&limit=20

# Combined filters
curl "http://localhost:3001/api/logs?userId=user-123&activityType=LOGIN&page=1&limit=5"
```

---

**Success Response** (200 OK):

```json
{
  "status": "success",
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
      "timestamp": "2026-01-15T03:00:00.000Z",
      "createdAt": "2026-01-15T03:00:01.234Z",
      "updatedAt": "2026-01-15T03:00:01.234Z"
    }
  ],
  "meta": {
    "total": 42,
    "page": 1,
    "limit": 10,
    "totalPages": 5
  }
}
```

### Get Log by ID

Retrieve a single activity log by its MongoDB document ID.

**Endpoint**: `GET /api/logs/:id`

**Path Parameters**:

- `id` - MongoDB document ID (ObjectId or eventId)

**Success Response** (200 OK):

```json
{
  "status": "success",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "eventId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user-123",
    "activityType": "LOGIN",
    "metadata": {
      "device": "mobile"
    },
    "timestamp": "2026-01-15T03:00:00.000Z",
    "createdAt": "2026-01-15T03:00:01.234Z",
    "updatedAt": "2026-01-15T03:00:01.234Z"
  }
}
```

**Error Response** (404 Not Found):

```json
{
  "status": "fail",
  "message": "Activity log not found"
}
```

**Example**:

```bash
curl http://localhost:3001/api/logs/507f1f77bcf86cd799439011
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request

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

### 404 Not Found

```json
{
  "status": "fail",
  "message": "Activity log not found"
}
```

### 500 Internal Server Error

```json
{
  "error": "Internal server error",
  "message": "Error description"
}
```

## Additional Resources

- **README**: Complete project documentation
- **Database Schema**: MongoDB schema reference
- **Kafka Topics**: Kafka configuration details
- **Docker Setup**: Docker deployment guide
- **Kubernetes Setup**: K8s deployment guide