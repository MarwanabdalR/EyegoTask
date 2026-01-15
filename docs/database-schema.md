# MongoDB Database Schema

## Database Configuration

- **Database Name**: `eyego`
- **Collection**: `useractivitylogs`
- **Connection String**: `mongodb://admin:admin123@localhost:27017/eyego?authSource=admin`

---

## Schema Structure

### Document Format

```json
{
  "_id": "ObjectId",
  "eventId": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user-123",
  "activityType": "LOGIN",
  "metadata": {
    "device": "mobile",
    "ip": "192.168.1.1",
    "location": "New York"
  },
  "timestamp": "2026-01-15T03:00:00.000Z",
  "createdAt": "2026-01-15T03:00:01.234Z",
  "updatedAt": "2026-01-15T03:00:01.234Z"
}
```

### Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `_id` | ObjectId | Auto | MongoDB unique identifier |
| `eventId` | String (UUID) | Yes | Unique event identifier |
| `userId` | String | Yes | User identifier |
| `activityType` | Enum | Yes | Type of activity (see below) |
| `metadata` | Object | No | Additional context data |
| `timestamp` | Date | Yes | When activity occurred (ISO 8601) |
| `createdAt` | Date | Auto | Document creation time |
| `updatedAt` | Date | Auto | Document update time |

### Activity Types

- `LOGIN` - User login
- `LOGOUT` - User logout
- `PAGE_VIEW` - Page view
- `BUTTON_CLICK` - Button interaction
- `FORM_SUBMIT` - Form submission
- `API_CALL` - API request
- `ERROR` - Error event

---

## Mongoose Schema Configuration

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IUserActivityLog extends Document {
  eventId: string;
  userId: string;
  activityType: string;
  metadata?: Record<string, any>;
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserActivityLogSchema = new Schema({
  eventId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: String,
    required: true,
    index: true
  },
  activityType: {
    type: String,
    required: true,
    enum: ['LOGIN', 'LOGOUT', 'PAGE_VIEW', 'BUTTON_CLICK', 'FORM_SUBMIT', 'API_CALL', 'ERROR'],
    index: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    required: true,
    index: true
  }
}, {
  timestamps: true,
  collection: 'useractivitylogs'
});

// Compound indexes for efficient querying
UserActivityLogSchema.index({ userId: 1, timestamp: -1 });
UserActivityLogSchema.index({ activityType: 1, timestamp: -1 });

export const UserActivityLogModel = mongoose.model<IUserActivityLog>(
  'UserActivityLog',
  UserActivityLogSchema
);
```

---

## Index Configuration

### Required Indexes

```javascript
// Single field indexes
db.useractivitylogs.createIndex({ eventId: 1 }, { unique: true })
db.useractivitylogs.createIndex({ userId: 1 })
db.useractivitylogs.createIndex({ activityType: 1 })
db.useractivitylogs.createIndex({ timestamp: -1 })

// Compound indexes for common queries
db.useractivitylogs.createIndex({ userId: 1, timestamp: -1 })
db.useractivitylogs.createIndex({ activityType: 1, timestamp: -1 })
```

### Index Purpose

- **eventId**: Ensure uniqueness, fast lookup
- **userId**: User-specific queries
- **activityType**: Filter by activity type
- **timestamp**: Time-based sorting and filtering
- **Compound indexes**: Optimize common query patterns

---

## Database Connection Setup

### Environment Variables

```bash
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/eyego?authSource=admin
```

### Connection Code

```typescript
import mongoose from 'mongoose';

export async function connectDatabase(): Promise<void> {
  const uri = process.env.MONGODB_URI || 
    'mongodb://admin:admin123@localhost:27017/eyego?authSource=admin';
  
  await mongoose.connect(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  
  console.log('Connected to MongoDB');
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}
```

---

## Validation Rules

### Zod Schema (Application Layer)

```typescript
import { z } from 'zod';

export const ActivityTypeEnum = z.enum([
  'LOGIN',
  'LOGOUT',
  'PAGE_VIEW',
  'BUTTON_CLICK',
  'FORM_SUBMIT',
  'API_CALL',
  'ERROR'
]);

export const UserActivityLogSchema = z.object({
  eventId: z.string().uuid(),
  userId: z.string().min(1),
  activityType: ActivityTypeEnum,
  metadata: z.record(z.any()).optional(),
  timestamp: z.string().datetime()
});
```

---

## Accessing the Database

### MongoDB Compass (GUI)

1. Download: <https://www.mongodb.com/try/download/compass>
2. Connection string: `mongodb://admin:admin123@localhost:27017/eyego?authSource=admin`
3. Navigate to `eyego` → `useractivitylogs`

### MongoDB Shell

```bash
# Connect
mongosh "mongodb://admin:admin123@localhost:27017/eyego?authSource=admin"

# View data
use eyego
db.useractivitylogs.find().limit(10)
```

### Docker Exec

```bash
docker exec -it eyego-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin
```

---

## Common Queries

```javascript
// Find all logs for a user
db.useractivitylogs.find({ userId: "user-123" })

// Find LOGIN activities
db.useractivitylogs.find({ activityType: "LOGIN" })

// Find recent logs (sorted by timestamp)
db.useractivitylogs.find().sort({ timestamp: -1 }).limit(10)

// Count total logs
db.useractivitylogs.countDocuments()

// Find logs with pagination
db.useractivitylogs.find().skip(0).limit(10)
```

---

## Performance Considerations

- **Index Usage**: All indexes are automatically created by Mongoose on startup
- **Query Optimization**: Use compound indexes for multi-field queries
- **Document Size**: Keep metadata under 16MB (MongoDB limit)
- **Connection Pooling**: Configured with maxPoolSize: 10

---

## Backup Strategy

```bash
# Backup
docker exec eyego-mongodb mongodump \
  -u admin -p admin123 \
  --authenticationDatabase admin \
  --db eyego \
  --out /backup

# Restore
docker exec eyego-mongodb mongorestore \
  -u admin -p admin123 \
  --authenticationDatabase admin \
  --db eyego \
  /backup/eyego
```
