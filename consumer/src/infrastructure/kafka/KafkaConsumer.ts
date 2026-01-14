import { Kafka, Consumer } from 'kafkajs';
import { UserActivityLogRepository } from '../../domain/repositories/UserActivityLogRepository';
import { MongoUserActivityLogRepository } from '../database/repositories/MongoUserActivityLogRepository';
import { UserActivityLog } from '../../domain/entities/UserActivityLog';
import { ActivityType } from '../../domain/value-objects/ActivityType';
import { UserId } from '../../domain/value-objects/UserId';
import { LogTimestamp } from '../../domain/value-objects/LogTimestamp';
import { Metadata } from '../../domain/value-objects/Metadata';

export class KafkaConsumer {
    private static instance: KafkaConsumer;
    private consumer: Consumer;
    private repository: UserActivityLogRepository;
    private isConnected: boolean = false;

    private constructor() {
        const kafka = new Kafka({
            clientId: 'consumer-service',
            brokers: (process.env.KAFKA_BROKERS || '127.0.0.1:9092').split(','),
            connectionTimeout: 10000,
            retry: {
                initialRetryTime: 300,
                retries: 10
            }
        });

        this.consumer = kafka.consumer({ groupId: 'consumer-service-group' });
        this.repository = new MongoUserActivityLogRepository();
    }

    public static getInstance(): KafkaConsumer {
        if (!KafkaConsumer.instance) {
            KafkaConsumer.instance = new KafkaConsumer();
        }
        return KafkaConsumer.instance;
    }

    public async connect(): Promise<void> {
        if (this.isConnected) return;

        try {
            await this.consumer.connect();
            this.isConnected = true;
            console.log('Kafka Consumer connected');
        } catch (error) {
            console.error('Error connecting to Kafka:', error);
            throw error;
        }
    }

    public async subscribe(): Promise<void> {
        try {
            await this.consumer.subscribe({ topic: 'user-activity-logs', fromBeginning: true });
            console.log('Subscribed to topic: user-activity-logs');
        } catch (error) {
            console.error('Error subscribing to topic:', error);
            throw error;
        }
    }

    public async run(): Promise<void> {
        try {
            await this.consumer.run({
                eachMessage: async ({ topic, partition, message }) => {
                    if (!message.value) return;

                    try {
                        const payload = JSON.parse(message.value.toString());
                        console.log(`Received message on ${topic}:`, payload);

                        const log = new UserActivityLog({
                            userId: new UserId(payload.userId),
                            activityType: new ActivityType(payload.activityType),
                            metadata: new Metadata(payload.metadata),
                            timestamp: new LogTimestamp(new Date(payload.timestamp))
                        });

                        await this.repository.save(log);
                        console.log('Processed and saved log:', log.eventId.toString());

                    } catch (error) {
                        console.error('Error processing message:', error);
                        // In a production app, we might want to send this to a DLQ
                    }
                },
            });
        } catch (error) {
            console.error('Error running consumer:', error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        if (!this.isConnected) return;

        try {
            await this.consumer.disconnect();
            this.isConnected = false;
            console.log('Kafka Consumer disconnected');
        } catch (error) {
            console.error('Error disconnecting from Kafka:', error);
        }
    }
}
