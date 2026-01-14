import { KafkaProducer } from '../../infrastructure/kafka/KafkaProducer';
import { CreateUserActivityLogDTO, CreateUserActivityLogSchema } from '../dtos/CreateUserActivityLogDTO';
import { v4 as uuidv4 } from 'uuid';

export class PublishUserActivityLogUseCase {
    private kafkaProducer: KafkaProducer;

    constructor() {
        this.kafkaProducer = KafkaProducer.getInstance();
    }

    public async execute(dto: CreateUserActivityLogDTO): Promise<void> {
        // 1. Validate Input
        const validationResult = CreateUserActivityLogSchema.safeParse(dto);
        if (!validationResult.success) {
            throw new Error(`Validation Error: ${JSON.stringify(validationResult.error.format())}`);
        }

        const validData = validationResult.data;

        // 2. Transform to Message Format (matching infrastructure schema)
        // Ensure timestamp is present and valid
        const timestamp = validData.timestamp ? new Date(validData.timestamp) : new Date();

        const message = {
            eventId: uuidv4(), // Generate unique event ID at application edge
            userId: validData.userId,
            activityType: validData.activityType,
            timestamp: timestamp,
            metadata: validData.metadata || {}
        };

        // 3. Publish via Infrastructure Service
        await this.kafkaProducer.send(message);
    }
}
