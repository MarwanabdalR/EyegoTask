# Kubernetes Deployment Guide

Quick guide for deploying Eyego Task microservices to Kubernetes.

---

## Prerequisites

- Kubernetes cluster (Minikube, Docker Desktop, or cloud provider)
- `kubectl` installed and configured
- Docker images built

---

## Quick Deployment

```bash
# 1. Create namespace
kubectl apply -f k8s/namespace.yaml

# 2. Deploy infrastructure
kubectl apply -f k8s/deployments/mongodb-statefulset.yaml
kubectl apply -f k8s/deployments/zookeeper-statefulset.yaml
kubectl apply -f k8s/deployments/kafka-statefulset.yaml

# 3. Deploy services
kubectl apply -f k8s/services/

# 4. Deploy secrets and configs
kubectl apply -f k8s/secrets/app-secrets.yaml
kubectl apply -f k8s/configmaps/

# 5. Deploy applications
kubectl apply -f k8s/deployments/producer-deployment.yaml
kubectl apply -f k8s/deployments/consumer-deployment.yaml

# 6. Verify
kubectl get pods -n eyego-task
```

---

## Services

| Service | Type | Port | NodePort |
|---------|------|------|----------|
| Producer | NodePort | 3000 | 30000 |
| Consumer | NodePort | 3001 | 30001 |
| MongoDB | ClusterIP | 27017 | - |
| Kafka | ClusterIP | 9092 | - |
| Zookeeper | ClusterIP | 2181 | - |

**Access URLs** (NodePort):

- Producer: <http://localhost:30000>
- Consumer: <http://localhost:30001>

---

## Common Commands

### Deployment

```bash
# Apply all manifests
kubectl apply -f k8s/

# Delete all resources
kubectl delete -f k8s/

# Update deployment
kubectl rollout restart deployment producer -n eyego-task
```

### Monitoring

```bash
# Get all resources
kubectl get all -n eyego-task

# Check pods
kubectl get pods -n eyego-task

# View logs
kubectl logs -n eyego-task -l app=producer -f
kubectl logs -n eyego-task -l app=consumer -f

# Describe pod
kubectl describe pod <pod-name> -n eyego-task
```

### Scaling

```bash
# Scale deployment
kubectl scale deployment producer -n eyego-task --replicas=3

# Auto-scale
kubectl autoscale deployment producer -n eyego-task --min=2 --max=5 --cpu-percent=80
```

---

## Configuration

### Secrets (k8s/secrets/app-secrets.yaml)

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: eyego-task
type: Opaque
data:
  MONGO_USERNAME: YWRtaW4=          # admin
  MONGO_PASSWORD: YWRtaW4xMjM=      # admin123
```

### ConfigMaps

**Producer** (k8s/configmaps/producer-config.yaml):

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: producer-config
  namespace: eyego-task
data:
  PORT: "3000"
  KAFKA_BROKERS: "kafka-0.kafka-service.eyego-task.svc.cluster.local:9092"
  NODE_ENV: "production"
```

**Consumer** (k8s/configmaps/consumer-config.yaml):

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: consumer-config
  namespace: eyego-task
data:
  PORT: "3001"
  KAFKA_BROKERS: "kafka-0.kafka-service.eyego-task.svc.cluster.local:9092"
  KAFKA_GROUP_ID: "consumer-service-group"
  MONGODB_URI: "mongodb://admin:admin123@mongodb-service:27017/eyego?authSource=admin"
  NODE_ENV: "production"
```

---

## Testing

```bash
# Health checks
curl http://localhost:30000/api/health
curl http://localhost:30001/api/health

# Publish log
curl -X POST http://localhost:30000/api/logs \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-123","activityType":"LOGIN","metadata":{"device":"mobile"}}'

# Query logs
curl http://localhost:30001/api/logs?userId=user-123
```

---

## Troubleshooting

### Pods not starting

```bash
# Check pod status
kubectl get pods -n eyego-task

# View pod logs
kubectl logs <pod-name> -n eyego-task

# Describe pod for events
kubectl describe pod <pod-name> -n eyego-task

# Check previous logs (if crashed)
kubectl logs <pod-name> -n eyego-task --previous
```

### Connection issues

```bash
# Check services
kubectl get svc -n eyego-task

# Test DNS resolution
kubectl run -it --rm debug --image=busybox --restart=Never -n eyego-task -- nslookup kafka-service

# Check endpoints
kubectl get endpoints -n eyego-task
```

### Configuration issues

```bash
# View ConfigMap
kubectl get configmap producer-config -n eyego-task -o yaml

# View Secret
kubectl get secret app-secrets -n eyego-task -o yaml

# Edit ConfigMap
kubectl edit configmap producer-config -n eyego-task
```

---

## Updating Deployments

```bash
# Update image
kubectl set image deployment/producer producer=eyego-producer:v2 -n eyego-task

# Rollout status
kubectl rollout status deployment/producer -n eyego-task

# Rollback
kubectl rollout undo deployment/producer -n eyego-task

# Restart deployment
kubectl rollout restart deployment/producer -n eyego-task
```

---

## Resource Management

### View Resources

```bash
# CPU and Memory usage
kubectl top pods -n eyego-task
kubectl top nodes

# Resource requests/limits
kubectl describe deployment producer -n eyego-task
```

### Set Resource Limits

Add to deployment spec:

```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

---

## Cleanup

```bash
# Delete all resources
kubectl delete namespace eyego-task

# Or delete individually
kubectl delete -f k8s/deployments/
kubectl delete -f k8s/services/
kubectl delete -f k8s/configmaps/
kubectl delete -f k8s/secrets/
kubectl delete -f k8s/namespace.yaml
```

---

## Production Checklist

- [ ] Use LoadBalancer or Ingress instead of NodePort
- [ ] Configure resource limits
- [ ] Set up persistent volumes for MongoDB
- [ ] Enable TLS/SSL
- [ ] Configure network policies
- [ ] Set up monitoring (Prometheus/Grafana)
- [ ] Configure log aggregation
- [ ] Implement auto-scaling (HPA)
- [ ] Use namespaces for isolation
- [ ] Regular backups
