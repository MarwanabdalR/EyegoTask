# Kubernetes Deployment Guide

This guide explains how to deploy the EyegoTask microservices to a Kubernetes cluster.

## Prerequisites

- Kubernetes cluster (minikube, kind, GKE, EKS, AKS, etc.)
- kubectl configured to access your cluster
- Docker images built and available (or use image registry)

## Quick Start

### 1. Build Docker Images

First, build the Docker images for both services:

```bash
# Build Producer image
docker build -t eyego-producer:latest ./producer

# Build Consumer image
docker build -t eyego-consumer:latest ./consumer
```

**For Minikube**: Load images into minikube:

```bash
minikube image load eyego-producer:latest
minikube image load eyego-consumer:latest
```

### 2. Deploy to Kubernetes

Apply all manifests in order:

```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Create ConfigMaps and Secrets
kubectl apply -f k8s/configmaps/
kubectl apply -f k8s/secrets/

# Deploy infrastructure (MongoDB, Kafka)
kubectl apply -f k8s/deployments/mongodb-statefulset.yaml
kubectl apply -f k8s/deployments/kafka-statefulset.yaml

# Wait for infrastructure to be ready
kubectl wait --for=condition=ready pod -l app=mongodb -n eyego-task --timeout=300s
kubectl wait --for=condition=ready pod -l app=kafka -n eyego-task --timeout=300s

# Deploy application services
kubectl apply -f k8s/deployments/producer-deployment.yaml
kubectl apply -f k8s/deployments/consumer-deployment.yaml

# Create services
kubectl apply -f k8s/services/

# (Optional) Create Ingress
kubectl apply -f k8s/ingress/
```

**Or apply everything at once**:

```bash
kubectl apply -f k8s/ --recursive
```

### 3. Verify Deployment

Check all pods are running:

```bash
kubectl get pods -n eyego-task
```

Expected output:

```
NAME                        READY   STATUS    RESTARTS   AGE
producer-xxxxxxxxxx-xxxxx   1/1     Running   0          2m
producer-xxxxxxxxxx-xxxxx   1/1     Running   0          2m
consumer-xxxxxxxxxx-xxxxx   1/1     Running   0          2m
consumer-xxxxxxxxxx-xxxxx   1/1     Running   0          2m
mongodb-0                   1/1     Running   0          5m
kafka-0                     1/1     Running   0          5m
zookeeper-0                 1/1     Running   0          5m
```

Check services:

```bash
kubectl get svc -n eyego-task
```

### 4. Access the Services

**Using NodePort** (for local clusters):

```bash
# Get Minikube IP (if using minikube)
minikube ip

# Access Producer
curl http://<MINIKUBE_IP>:30000/api/health

# Access Consumer
curl http://<MINIKUBE_IP>:30001/api/health
```

**Using Port Forwarding**:

```bash
# Forward Producer port
kubectl port-forward -n eyego-task svc/producer-service 3000:3000

# In another terminal, forward Consumer port
kubectl port-forward -n eyego-task svc/consumer-service 3001:3001

# Test
curl http://localhost:3000/api/health
curl http://localhost:3001/api/health
```

## Detailed Configuration

### Environment Variables

**Producer**:

- `PORT`: HTTP server port (default: 3000)
- `KAFKA_BROKERS`: Kafka broker addresses
- `NODE_ENV`: Environment (production/development)

**Consumer**:

- `PORT`: HTTP server port (default: 3001)
- `KAFKA_BROKERS`: Kafka broker addresses
- `MONGO_URI`: MongoDB connection string
- `NODE_ENV`: Environment

### Secrets

Secrets are base64 encoded. To create new secrets:

```bash
# Encode a value
echo -n "your-value" | base64

# Decode a value
echo "eW91ci12YWx1ZQ==" | base64 -d
```

Update `k8s/secrets/app-secrets.yaml` with new values.

### Resource Limits

**Producer/Consumer**:

- Requests: 100m CPU, 128Mi memory
- Limits: 500m CPU, 512Mi memory

**MongoDB**:

- Requests: 200m CPU, 256Mi memory
- Limits: 1000m CPU, 1Gi memory

**Kafka**:

- Requests: 200m CPU, 512Mi memory
- Limits: 1000m CPU, 2Gi memory

Adjust these in the deployment manifests based on your needs.

## Scaling

### Scale Deployments

```bash
# Scale Producer to 3 replicas
kubectl scale deployment producer -n eyego-task --replicas=3

# Scale Consumer to 5 replicas
kubectl scale deployment consumer -n eyego-task --replicas=5

# Check scaling
kubectl get pods -n eyego-task -l app=producer
```

### Horizontal Pod Autoscaler (HPA)

Create HPA for automatic scaling:

```bash
# Autoscale Producer based on CPU
kubectl autoscale deployment producer -n eyego-task \
  --cpu-percent=70 \
  --min=2 \
  --max=10

# Autoscale Consumer
kubectl autoscale deployment consumer -n eyego-task \
  --cpu-percent=70 \
  --min=2 \
  --max=10

# Check HPA status
kubectl get hpa -n eyego-task
```

## Monitoring

### View Logs

```bash
# Producer logs
kubectl logs -n eyego-task -l app=producer -f

# Consumer logs
kubectl logs -n eyego-task -l app=consumer -f

# MongoDB logs
kubectl logs -n eyego-task mongodb-0 -f

# Kafka logs
kubectl logs -n eyego-task kafka-0 -f
```

### Describe Resources

```bash
# Describe a pod
kubectl describe pod <pod-name> -n eyego-task

# Describe deployment
kubectl describe deployment producer -n eyego-task
```

### Events

```bash
# View events in namespace
kubectl get events -n eyego-task --sort-by='.lastTimestamp'
```

## Troubleshooting

### Pods Not Starting

1. Check pod status:

```bash
kubectl get pods -n eyego-task
kubectl describe pod <pod-name> -n eyego-task
```

1. Check logs:

```bash
kubectl logs <pod-name> -n eyego-task
```

1. Common issues:
   - **ImagePullBackOff**: Image not available. Ensure images are built and loaded.
   - **CrashLoopBackOff**: Application crashing. Check logs for errors.
   - **Pending**: Insufficient resources. Check node capacity.

### Service Connection Issues

1. Verify services:

```bash
kubectl get svc -n eyego-task
kubectl describe svc producer-service -n eyego-task
```

1. Test service connectivity from within cluster:

```bash
kubectl run -it --rm debug --image=busybox --restart=Never -n eyego-task -- sh
# Inside the pod:
wget -O- http://producer-service:3000/api/health
```

### Kafka Connection Issues

1. Check Kafka and Zookeeper are running:

```bash
kubectl get pods -n eyego-task -l app=kafka
kubectl get pods -n eyego-task -l app=zookeeper
```

1. Verify Kafka service:

```bash
kubectl get svc kafka-service -n eyego-task
```

1. Check Producer/Consumer logs for connection errors

### MongoDB Connection Issues

1. Check MongoDB is running:

```bash
kubectl get pods -n eyego-task -l app=mongodb
```

1. Verify credentials in secrets:

```bash
kubectl get secret app-secrets -n eyego-task -o yaml
```

1. Test MongoDB connection:

```bash
kubectl exec -it mongodb-0 -n eyego-task -- mongosh -u admin -p admin123
```

## Cleanup

### Delete All Resources

```bash
# Delete all resources in namespace
kubectl delete namespace eyego-task
```

### Delete Specific Resources

```bash
# Delete deployments
kubectl delete deployment producer consumer -n eyego-task

# Delete StatefulSets (this also deletes PVCs)
kubectl delete statefulset mongodb kafka zookeeper -n eyego-task

# Delete PVCs manually if needed
kubectl delete pvc -n eyego-task --all
```

## Production Considerations

1. **Image Registry**: Push images to a registry (Docker Hub, GCR, ECR, etc.)

   ```bash
   docker tag eyego-producer:latest your-registry/eyego-producer:v1.0.0
   docker push your-registry/eyego-producer:v1.0.0
   ```

2. **Secrets Management**: Use external secrets management (Vault, AWS Secrets Manager, etc.)

3. **Persistent Volumes**: Configure appropriate storage classes for production

4. **Monitoring**: Set up Prometheus + Grafana for metrics

5. **Logging**: Use ELK stack or cloud-native logging solutions

6. **Ingress**: Configure proper Ingress with TLS certificates

7. **Network Policies**: Implement network policies for security

8. **Resource Quotas**: Set namespace resource quotas

9. **Pod Disruption Budgets**: Ensure high availability during updates

10. **Backup**: Regular backups of MongoDB data

## Architecture

```
┌─────────────────────────────────────────────────┐
│              Kubernetes Cluster                  │
│                                                  │
│  ┌──────────────────────────────────────────┐  │
│  │         Namespace: eyego-task            │  │
│  │                                          │  │
│  │  ┌──────────┐      ┌──────────┐        │  │
│  │  │ Producer │      │ Consumer │        │  │
│  │  │ (x2)     │      │ (x2)     │        │  │
│  │  └────┬─────┘      └────┬─────┘        │  │
│  │       │                 │               │  │
│  │       ▼                 ▼               │  │
│  │  ┌─────────────────────────┐           │  │
│  │  │    Kafka (StatefulSet)  │           │  │
│  │  └───────────┬─────────────┘           │  │
│  │              │                          │  │
│  │              ▼                          │  │
│  │  ┌─────────────────────────┐           │  │
│  │  │  MongoDB (StatefulSet)  │           │  │
│  │  └─────────────────────────┘           │  │
│  │                                          │  │
│  └──────────────────────────────────────────┘  │
│                                                  │
└─────────────────────────────────────────────────┘
```

## Next Steps

- Set up CI/CD pipeline for automated deployments
- Configure monitoring and alerting
- Implement backup and disaster recovery
- Set up multi-environment deployments (dev, staging, prod)
