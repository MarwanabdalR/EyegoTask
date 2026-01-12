# Docker Compose Infrastructure - Technical Documentation

## 📋 Quick Start

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v
```

## 🔌 Access Points

- **MongoDB:** `mongodb://admin:admin123@localhost:27017`
- **Kafka (from host):** `localhost:9092`
- **Kafka (from containers):** `kafka:9093`
- **Kafka UI:** <http://localhost:8080>
- **Zookeeper:** `localhost:2181`

---

## 🌐 Kafka Networking Explained

### Why Two Listeners?

Kafka requires **dual listeners** to handle connections from two different network contexts:

#### 1. **PLAINTEXT_HOST (localhost:9092)** - External Access

- **Purpose:** For your Node.js apps running on your **host machine** (outside Docker).
- **Use Case:** When you run `npm run dev` locally, your producer/consumer connects to `localhost:9092`.
- **Network:** Bridges Docker's internal network to your host machine.

#### 2. **PLAINTEXT (kafka:9093)** - Internal Access

- **Purpose:** For services running **inside Docker containers** (e.g., Kafka UI, future containerized apps).
- **Use Case:** The Kafka UI container connects to `kafka:9093` using Docker's internal DNS.
- **Network:** Uses Docker's bridge network (`eyego-network`).

### Configuration Breakdown

```yaml
KAFKA_ADVERTISED_LISTENERS: PLAINTEXT://kafka:9093,PLAINTEXT_HOST://localhost:9092
```

- **`PLAINTEXT://kafka:9093`**: Advertises the internal hostname `kafka` on port `9093`.
- **`PLAINTEXT_HOST://localhost:9092`**: Advertises `localhost` on port `9092` for host access.

```yaml
KAFKA_LISTENERS: PLAINTEXT://0.0.0.0:9093,PLAINTEXT_HOST://0.0.0.0:9092
```

- Binds to all network interfaces (`0.0.0.0`) on both ports.

```yaml
KAFKA_INTER_BROKER_LISTENER_NAME: PLAINTEXT
```

- Kafka brokers communicate internally using the `PLAINTEXT` listener (port `9093`).

### Connection Examples

**From Host Machine (Node.js app):**

```javascript
const kafka = new Kafka({
  clientId: 'producer-service',
  brokers: ['localhost:9092']  // ✅ Use PLAINTEXT_HOST
});
```

**From Docker Container:**

```javascript
const kafka = new Kafka({
  clientId: 'consumer-service',
  brokers: ['kafka:9093']  // ✅ Use PLAINTEXT
});
```

---

## 💾 MongoDB Volume Explained

### What is `mongodb_data:/data/db`?

```yaml
volumes:
  - mongodb_data:/data/db
```

#### Purpose: **Data Persistence**

- **Without Volume:** MongoDB stores data inside the container's filesystem. When you run `docker-compose down`, all data is **lost**.
- **With Volume:** Data is stored in a Docker-managed volume on your host machine, **surviving container restarts**.

#### How It Works

1. **Named Volume:** `mongodb_data` is a Docker-managed volume (stored in Docker's internal storage).
2. **Mount Point:** `/data/db` is MongoDB's default data directory inside the container.
3. **Persistence:** Even if you delete the container, the volume persists until you explicitly remove it with `docker-compose down -v`.

#### Volume Location

To find where Docker stores the volume on your host:

```bash
docker volume inspect eyegotask_mongodb_data
```

---

## 🛠️ Environment Variables

### MongoDB

- `MONGO_INITDB_ROOT_USERNAME`: Admin username (change in production).
- `MONGO_INITDB_ROOT_PASSWORD`: Admin password (change in production).

### Kafka

- `KAFKA_BROKER_ID`: Unique broker identifier (1 for single-broker setup).
- `KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR`: Set to 1 for single-broker (would be 3+ in production).
- `KAFKA_AUTO_CREATE_TOPICS_ENABLE`: Automatically creates topics when producers publish.

---

## 🔍 Troubleshooting

### Kafka Connection Refused

**Problem:** Node.js app can't connect to Kafka.

**Solution:**

```bash
# Check if Kafka is running
docker-compose ps

# View Kafka logs
docker-compose logs kafka

# Ensure you're using localhost:9092 (not kafka:9093)
```

### MongoDB Authentication Failed

**Problem:** Can't connect to MongoDB.

**Solution:**

```javascript
// Correct connection string
const uri = 'mongodb://admin:admin123@localhost:27017';
```

### Data Lost After Restart

**Problem:** MongoDB data disappears.

**Solution:**

```bash
# Don't use -v flag (it removes volumes)
docker-compose down  # ✅ Keeps data
docker-compose down -v  # ❌ Deletes data
```

---

## 📊 Monitoring

### Kafka UI Features

- **Topics:** View all topics and their configurations.
- **Messages:** Browse messages in topics.
- **Consumer Groups:** Monitor consumer lag.
- **Brokers:** Check broker health.

Access at: <http://localhost:8080>

---

## 🚀 Production Considerations

This setup is for **local development only**. For production:

1. **Kafka:**
   - Use multiple brokers (3+ for fault tolerance).
   - Increase replication factors.
   - Enable authentication (SASL/SSL).
   - Use managed services (Confluent Cloud, AWS MSK).

2. **MongoDB:**
   - Use replica sets.
   - Enable authentication and authorization.
   - Use managed services (MongoDB Atlas).
   - Implement backup strategies.

3. **Networking:**
   - Use proper DNS and load balancers.
   - Implement TLS/SSL encryption.
   - Configure firewall rules.
