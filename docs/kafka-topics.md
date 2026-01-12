# Kafka Topics Structure Design

## Overview

This document outlines the Kafka topics structure for the Eyego Task event-driven microservice. The design focuses on reliable message processing, scalability, and fault tolerance for user activity log events.

## Topics Design

### 1. Main Topic: `user-activity-logs`

#### Purpose
Primary topic for publishing user activity log events from the REST API producer.

#### Configuration
- **Partitions**: 3 (start; scale as needed)
- **Replication Factor**: 1 (single-broker local demo)
- **Retention**: 7 days (configurable)
- **Cleanup Policy**: delete

#### Dev vs. Prod
- For this local demo we use **Replication Factor = 1** and **JSON** (stringified JSON) as the serialization format.
- In production we would use **Replication Factor = 3** and **Avro** with a Schema Registry (for schema enforcement and evolution).

#### Message Structure
```json
{
  "key": "user123",           // Partition key (userId for ordering)
  "value": {
    "userId": "user123",
    "activityType": "login",
    "timestamp": "2024-01-12T10:30:00.000Z",
    "metadata": {
      "ipAddress": "192.168.1.1",
      "userAgent": "Mozilla/5.0...",
      "sessionId": "sess_abc123"
    },
    "eventId": "evt_1234567890",  // Unique event identifier
    "version": "1.0"              // Schema version
  },
  "headers": {
    "source": "api",
    "timestamp": "2024-01-12T10:30:00.000Z"
  }
}
```

#### Partitioning Strategy
- **Key**: `userId` (string)
- **Rationale**: Ensures all events for a user are processed in order by the same consumer partition, enabling session tracking and sequential processing.

#### Consumer Groups
- **Main Consumer**: `user-activity-processor`
  - Processes logs and stores in MongoDB
  - Single consumer per partition for ordering

### 2. Dead Letter Queue Topic: `user-activity-logs-dlq`

#### Purpose
Handles messages that fail processing after retries, preventing poison pill scenarios.

#### Configuration
- **Partitions**: 3
- **Replication Factor**: 1 (single-broker local demo)
- **Retention**: 30 days
- **Cleanup Policy**: delete

#### Dev vs. Prod
- For this local demo we use **Replication Factor = 1** and **JSON** as the serialization format.
- In production we would use **Replication Factor = 3** and **Avro** with a Schema Registry.

#### Message Structure
Same as main topic, plus error information:
```json
{
  "key": "user123",
  "value": {
    // Original message
    "userId": "user123",
    "activityType": "login",
    "timestamp": "2024-01-12T10:30:00.000Z",
    "metadata": { ... },
    "eventId": "evt_1234567890",
    "version": "1.0",
    // Error details
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Invalid activity type",
      "timestamp": "2024-01-12T10:30:05.000Z",
      "retryCount": 3
    }
  },
  "headers": {
    "source": "api",
    "originalTopic": "user-activity-logs",
    "originalPartition": 0,
    "originalOffset": 12345
  }
}
```

### 3. Optional: Analytics Topic: `user-activity-analytics`

#### Purpose
Filtered stream for analytics and monitoring (if needed for real-time dashboards).

#### Configuration
- **Partitions**: 3
- **Replication Factor**: 1 (single-broker local demo)
- **Retention**: 24 hours
- **Cleanup Policy**: delete

#### Dev vs. Prod
- For this local demo we use **Replication Factor = 1** and **JSON** as the serialization format.
- In production we would use **Replication Factor = 3** and **Avro** with a Schema Registry.

#### Use Case
- Real-time user activity monitoring
- Alerting on suspicious activities
- Analytics pipeline input

## Message Schema and Evolution

### Serialization Format (local demo)
- Messages are serialized as **JSON** (stringified JSON) for the local Docker single-broker setup. This reduces setup complexity (no Schema Registry) and speeds up development.

### Versioning Strategy
- Include a `version` field in the message value.
- Use semantic versioning (major.minor.patch).
- Maintain backward compatibility within major versions when possible.

### Production (recommended)
- In production, prefer **Avro** (or another binary schema format) with a **Schema Registry** to ensure type safety and controlled schema evolution.
- The local demo uses JSON; production should use Avro + Schema Registry and stricter schema enforcement.

## Producer Configuration

### Main Producer Settings (local demo)
```javascript
const producerConfig = {
  clientId: 'eyego-activity-producer',
  brokers: ['localhost:9092'], // single-broker demo
  retry: {
    initialRetryTime: 100,
    retries: 8
  },
  // For local single-broker demos keep configuration simple. In production,
  // use idempotent/transactional settings when brokers and replication support it.
};
```

Serialization: send `JSON.stringify(value)` as message value; include a `version` field in the payload.
### Message Publishing Strategy
- **Idempotent Producer**: Ensures exactly-once semantics
- **Transactional Producer**: For atomic multi-message publishes
- **Compression**: Use `gzip` or `snappy` for efficiency

## Consumer Configuration

### Main Consumer Settings (local demo)
```javascript
const consumerConfig = {
  groupId: 'user-activity-processor',
  clientId: 'eyego-activity-consumer',
  brokers: ['localhost:9092'], // single-broker demo
  sessionTimeout: 30000,
  heartbeatInterval: 3000,
  retry: {
    initialRetryTime: 100,
    retries: 8
  },
  autoCommit: false,  // Manual commit recommended
  autoCommitInterval: 5000,
  autoCommitThreshold: 100
};
```

Note: Use PLAINTEXT for local Docker networking. In production, enable TLS and authentication (SASL/mTLS).
### Processing Strategy
- **Manual Commits**: Commit after successful MongoDB write
- **Error Handling**: Retry with exponential backoff, then DLQ
- **Rebalancing**: Handle partition reassignments gracefully

## Error Handling and Resilience

### Retry Policy
1. **Immediate Retry**: 3 attempts with 100ms delay
2. **Exponential Backoff**: Up to 5 minutes
3. **Dead Letter Queue**: After max retries

### Monitoring
- **Metrics**: Message throughput, lag, error rates
- **Alerts**: High lag, failed message processing
- **Logging**: Structured logs for troubleshooting

## Scalability Considerations

### Partition Scaling
- Start with 3 partitions
- Scale up based on throughput (>10k msgs/sec per partition)
- Use Kafka's partition reassignment tools

### Consumer Scaling
- Increase consumer instances for higher throughput
- Ensure partition count >= consumer count for parallel processing
- Use consumer groups for load balancing

### Cluster Sizing
- **Brokers**: 3+ for HA
- **Zookeeper**: 3 or 5 nodes
- **Replication**: 3x for fault tolerance

## Security

### Authentication (local vs production)
- **Local demo**: Use **PLAINTEXT** on the internal Docker network.
- **Production**: Use **TLS** and **SASL** (SCRAM or mTLS) for broker authentication and encryption.
- Apply ACLs for topic-level access control in production environments.

### Encryption
- TLS for data in transit (production)
- Encrypt sensitive metadata fields if needed

### Authorization
- Producer: Write access to `user-activity-logs`
- Consumer: Read access to `user-activity-logs`, write to DLQ

Note: PLAINTEXT is acceptable for isolated local demos only. Never use PLAINTEXT in public or multi-tenant environments.

## Operational Considerations

### Topic Management
```bash
# Create topics
kafka-topics --create --topic user-activity-logs --partitions 3 --replication-factor 1 --bootstrap-server localhost:9092

# Describe topics
kafka-topics --describe --topic user-activity-logs --bootstrap-server localhost:9092

# Increase partitions
kafka-topics --alter --topic user-activity-logs --partitions 6 --bootstrap-server localhost:9092
```

### Monitoring Commands
```bash
# Consumer lag
kafka-consumer-groups --describe --group user-activity-processor --bootstrap-server localhost:9092

# Topic details
kafka-topics --describe --topic user-activity-logs --bootstrap-server localhost:9092
```

### Backup and Recovery
- Mirror topics to disaster recovery cluster
- Use Kafka's backup tools for metadata
- Document recovery procedures

This topics structure provides a robust foundation for the event-driven architecture, ensuring reliable, scalable, and maintainable message processing.