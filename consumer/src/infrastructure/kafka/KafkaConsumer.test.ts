import { KafkaConsumer } from './KafkaConsumer';
import { Kafka } from 'kafkajs';
import { DatabaseConnection } from '../database/DatabaseConnection';
import { UserActivityLogRepository } from '../../domain/repositories/UserActivityLogRepository';
import { MongoUserActivityLogRepository } from '../database/repositories/MongoUserActivityLogRepository';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

describe('KafkaConsumer Integration Test', () => {
    let consumer: KafkaConsumer;
    let kafka: Kafka;
    let repository: UserActivityLogRepository;

    beforeAll(async () => {
        // Fix for Node 17+ preferring IPv6 for localhost
        if (process.env.MONGO_URI && process.env.MONGO_URI.includes('localhost')) {
            process.env.MONGO_URI = process.env.MONGO_URI.replace('localhost', '127.0.0.1');
        }

        // Connect to MongoDB
        await DatabaseConnection.getInstance().connect();

        // Initialize Consumer
        consumer = KafkaConsumer.getInstance();
        kafka = new Kafka({
            clientId: 'test-producer',
            brokers: (process.env.KAFKA_BROKERS || '127.0.0.1:9092').split(','),
        });
        repository = new MongoUserActivityLogRepository();
    }, 20000);

    afterAll(async () => {
        await consumer.disconnect();
        await DatabaseConnection.getInstance().disconnect();
    });

    it('should consume and save a message from Kafka', async () => {
        // 1. Start Consumer
        await consumer.connect();
        await consumer.subscribe();
        await consumer.run();

        // 2. Publish a test message using a temporary producer
        const producer = kafka.producer();
        await producer.connect();

        const testMessage = {
            userId: 'test_user_consumer_1',
            activityType: 'LOGIN',
            timestamp: new Date().toISOString(),
            metadata: { source: 'consumer_integration_test' }
        };

        await producer.send({
            topic: 'user-activity-logs',
            messages: [{ value: JSON.stringify(testMessage) }],
        });

        await producer.disconnect();

        // 3. Wait for processing (polling)
        await new Promise(resolve => setTimeout(resolve, 5000));

        // 4. Verify message in Database
        const logs = await repository.findByUserId('test_user_consumer_1');
        expect(logs.length).toBeGreaterThan(0);
        expect(logs[0].activityType.toString()).toBe('LOGIN');
        expect(logs[0].metadata.toObject()).toEqual({ source: 'consumer_integration_test' });
    }, 20000);
});
