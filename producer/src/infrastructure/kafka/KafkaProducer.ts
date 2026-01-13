import { Kafka, Producer, ProducerRecord } from 'kafkajs';
import { UserActivityLogSchema, UserActivityLog } from './MessageSchema';

export class KafkaProducer {
    private static instance: KafkaProducer;
    private producer: Producer;
    private isConnected: boolean = false;

    private constructor() {
        const kafka = new Kafka({
            clientId: 'producer-service-local',
            brokers: (process.env.KAFKA_BROKERS || '127.0.0.1:9092').split(','),
            connectionTimeout: 10000,
            retry: {
                initialRetryTime: 300,
                retries: 10
            }
        });
        this.producer = kafka.producer();
    }

    public static getInstance(): KafkaProducer {
        if (!KafkaProducer.instance) {
            KafkaProducer.instance = new KafkaProducer();
        }
        return KafkaProducer.instance;
    }

    public async connect(): Promise<void> {
        if (this.isConnected) return;

        try {
            await this.producer.connect();
            this.isConnected = true;
            console.log('Kafka Producer connected');
        } catch (error) {
            console.error('Error connecting to Kafka:', error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        if (!this.isConnected) return;

        try {
            await this.producer.disconnect();
            this.isConnected = false;
            console.log('Kafka Producer disconnected');
        } catch (error) {
            console.error('Error disconnecting from Kafka:', error);
            throw error;
        }
    }

    public async send(message: UserActivityLog): Promise<void> {
        // 1. Validate with Zod
        const validationResult = UserActivityLogSchema.safeParse(message);

        if (!validationResult.success) {
            const errorMsg = `Invalid message format: ${JSON.stringify(validationResult.error.issues)}`;
            console.error(errorMsg);
            throw new Error(errorMsg);
        }

        if (!this.isConnected) {
            await this.connect();
        }

        try {
            const record: ProducerRecord = {
                topic: 'user-activity-logs',
                messages: [
                    {
                        key: message.userId,
                        value: JSON.stringify(message),
                    },
                ],
            };

            await this.producer.send(record);
            console.log(`Message sent to topic 'user-activity-logs':`, message);
        } catch (error) {
            console.error('Error sending message to Kafka:', error);
            throw error;
        }
    }
}
