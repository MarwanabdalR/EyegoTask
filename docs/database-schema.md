# Database Schema Design - User Activity Logs

## Overview

This document outlines the MongoDB schema design for storing user activity logs in the Eyego Task microservice. The schema is designed for efficient querying, indexing, and scalability.

## Collection: `user_activity_logs`

### Document Structure

```json
{
  "_id": ObjectId,           // MongoDB auto-generated
  "userId": String,          // Required: User identifier
  "activityType": String,    // Required: Type of activity (e.g., "login", "view_page", "purchase")
  "timestamp": Date,         // Required: When the activity occurred (ISO 8601)
  "metadata": Object,        // Optional: Additional activity-specific data
  "sessionId": String,       // Optional: Session identifier for grouping related activities
  "ipAddress": String,       // Optional: Client IP address
  "userAgent": String,       // Optional: Browser/client user agent
  "createdAt": Date,         // Auto-generated: Document creation timestamp
  "updatedAt": Date          // Auto-generated: Document update timestamp
}
```

### Field Descriptions

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `_id` | ObjectId | Auto | MongoDB document ID | `507f1f77bcf86cd799439011` |
| `userId` | String | Yes | Unique identifier for the user | `"user123"` |
| `activityType` | String | Yes | Type of user activity | `"login"`, `"page_view"`, `"purchase"` |
| `timestamp` | Date | Yes | Activity timestamp in UTC | `"2024-01-12T10:30:00.000Z"` |
| `metadata` | Object | No | Flexible object for activity-specific data | `{"productId": "prod123", "amount": 99.99}` |
| `sessionId` | String | No | Session identifier for grouping activities | `"sess_abc123"` |
| `ipAddress` | String | No | Client IP address | `"192.168.1.1"` |
| `userAgent` | String | No | Browser/client user agent string | `"Mozilla/5.0..."` |
| `createdAt` | Date | Auto | Document creation timestamp | `"2024-01-12T10:30:00.000Z"` |
| `updatedAt` | Date | Auto | Document update timestamp | `"2024-01-12T10:30:00.000Z"` |

### Validation Rules

#### Schema Validation (MongoDB)

```javascript
db.createCollection("user_activity_logs", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userId", "activityType", "timestamp"],
      properties: {
        userId: {
          bsonType: "string",
          description: "User identifier is required and must be a string"
        },
        activityType: {
          bsonType: "string",
          description: "Activity type is required and must be a string"
        },
        timestamp: {
          bsonType: "date",
          description: "Timestamp is required and must be a valid date"
        },
        metadata: {
          bsonType: "object",
          description: "Metadata must be an object if provided"
        },
        sessionId: {
          bsonType: "string",
          description: "Session ID must be a string if provided"
        },
        ipAddress: {
          bsonType: "string",
          description: "IP address must be a string if provided"
        },
        userAgent: {
          bsonType: "string",
          description: "User agent must be a string if provided"
        }
      }
    }
  }
});
```

#### Mongoose Schema (TypeScript)

```typescript
import mongoose, { Schema, Document } from 'mongoose';

export interface IUserActivityLog extends Document {
  userId: string;
  activityType: string;
  timestamp: Date;
  metadata?: Record<string, any>;
  sessionId?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserActivityLogSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true
  },
  activityType: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    required: true
  },
  metadata: {
    type: Schema.Types.Mixed,
    default: {}
  },
  sessionId: {
    type: String,
    index: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true, // Adds createdAt and updatedAt
  collection: 'user_activity_logs'
});

// Indexes
// Compound indexes are preferred to avoid redundant single-field indexes.
UserActivityLogSchema.index({ userId: 1, timestamp: -1 }); // Compound index for user queries (covers userId + timestamp)
UserActivityLogSchema.index({ activityType: 1, timestamp: -1 }); // Compound index for activity type queries
UserActivityLogSchema.index({ userId: 1, activityType: 1, timestamp: -1 }); // Composite index for complex filters
// TTL index for data retention: documents older than 30 days will be removed automatically
UserActivityLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 }); // 30 days TTL
UserActivityLogSchema.index({ sessionId: 1 }); // Index for session-based queries

export const UserActivityLogModel = mongoose.model<IUserActivityLog>('UserActivityLog', UserActivityLogSchema);
```

## Indexes

### Required Indexes

1. **Single Field Indexes**
   - `timestamp`: For time-based sorting and filtering (also used for TTL)
   - `sessionId`: For session-based grouping

   Note: Standalone single-field indexes for `userId` and `activityType` were intentionally removed because they are covered by compound indexes (e.g. `{ userId: 1, timestamp: -1 }`). This reduces index overhead while preserving query performance.
2. **Compound Indexes**
   - `{ userId: 1, timestamp: -1 }`: For user's activity history (sorted by time desc)
   - `{ activityType: 1, timestamp: -1 }`: For activity type analysis (sorted by time desc)
   - `{ userId: 1, activityType: 1, timestamp: -1 }`: For complex filtering

### Index Strategy Rationale

- **userId index**: Essential for user-specific queries
- **activityType index**: Needed for analytics and filtering by activity
- **timestamp index**: Required for time-based pagination and date range queries
- **Compound indexes**: Optimize common query patterns like "recent activities for user X" or "login activities in date range"

## Query Patterns

### Common Queries

1. **Get user's recent activities**
   ```javascript
   db.user_activity_logs.find({ userId: "user123" })
     .sort({ timestamp: -1 })
     .limit(10);
   ```

2. **Get activities by type and date range**
   ```javascript
   db.user_activity_logs.find({
     activityType: "login",
     timestamp: {
       $gte: new Date("2024-01-01"),
       $lt: new Date("2024-02-01")
     }
   });
   ```

3. **Get activities for a session**
   ```javascript
   db.user_activity_logs.find({ sessionId: "sess_abc123" })
     .sort({ timestamp: 1 });
   ```

4. **Analytics: Activity counts by type**
   ```javascript
   db.user_activity_logs.aggregate([
     {
       $group: {
         _id: "$activityType",
         count: { $sum: 1 }
       }
     }
   ]);
   ```

## Data Considerations

### Data Types and Constraints

- **userId**: Should be a consistent identifier (UUID, email, or internal ID)
- **activityType**: Use consistent naming convention (snake_case or camelCase)
- **timestamp**: Always store in UTC
- **metadata**: Keep flexible for extensibility, but consider sub-schema validation for critical fields

### Performance Considerations

- **Document Size**: Keep metadata reasonable (< 16MB MongoDB limit)
- **Index Usage**: Monitor slow queries and adjust indexes as needed
- **Sharding**: Consider sharding by `userId` for high-volume users
- **TTL Indexes**: For log retention, consider TTL index on `timestamp` for automatic cleanup

### Scalability

- **Partitioning**: Shard by `userId` for even distribution
- **Archiving**: Implement log archiving strategy for old data
- **Read Replicas**: Use for analytics queries to offload primary

## Migration Strategy

### Versioning

Include a `schemaVersion` field for future schema changes:

```json
{
  "schemaVersion": 1,
  // ... other fields
}
```

### Backward Compatibility

- New optional fields should not break existing queries
- Use migration scripts for required field additions
- Consider view layers for API backward compatibility

## Security Considerations

- **PII Data**: Avoid storing sensitive personal information in logs
- **Access Control**: Implement proper database access controls
- **Encryption**: Consider encrypting sensitive metadata fields
- **Audit Trail**: Logs themselves may need auditing for compliance

## Monitoring and Maintenance

### Index Maintenance
```javascript
db.user_activity_logs.reIndex();
```

### Statistics
```javascript
db.user_activity_logs.stats();
```

### Backup Strategy
- Regular backups of log data
- Point-in-time recovery capability
- Test restore procedures

This schema design provides a solid foundation for the user activity logging system, balancing flexibility, performance, and maintainability.