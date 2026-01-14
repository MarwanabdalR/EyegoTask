import { PublishUserActivityLogUseCase } from './PublishUserActivityLogUseCase';
import { KafkaProducer } from '../../infrastructure/kafka/KafkaProducer';
import { ActivityTypeEnum } from '../dtos/CreateUserActivityLogDTO';

// Mock KafkaProducer
jest.mock('../../infrastructure/kafka/KafkaProducer');

describe('PublishUserActivityLogUseCase', () => {
    let useCase: PublishUserActivityLogUseCase;
    let mockKafkaProducer: jest.Mocked<KafkaProducer>;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();

        // Setup mock instance
        mockKafkaProducer = {
            send: jest.fn().mockResolvedValue(undefined),
            connect: jest.fn(),
            disconnect: jest.fn(),
        } as unknown as jest.Mocked<KafkaProducer>;

        (KafkaProducer.getInstance as jest.Mock).mockReturnValue(mockKafkaProducer);

        useCase = new PublishUserActivityLogUseCase();
    });

    it('should validate input and publish message to KafkaProducer', async () => {
        const dto = {
            userId: 'user-123',
            activityType: ActivityTypeEnum.LOGIN,
            metadata: { browser: 'chrome' }
        };

        await useCase.execute(dto);

        expect(mockKafkaProducer.send).toHaveBeenCalledTimes(1);
        const sentMessage = mockKafkaProducer.send.mock.calls[0][0];
        expect(sentMessage).toMatchObject({
            userId: dto.userId,
            activityType: dto.activityType,
            metadata: dto.metadata
        });
        expect(sentMessage.eventId).toBeDefined(); // UUID generated
        expect(sentMessage.timestamp).toBeInstanceOf(Date);
    });

    it('should throw error/validation failure for invalid input', async () => {
        const invalidDto = {
            userId: '', // Invalid empty ID
            activityType: 'INVALID_TYPE' as any
        };

        await expect(useCase.execute(invalidDto)).rejects.toThrow(/Validation Error/);
        expect(mockKafkaProducer.send).not.toHaveBeenCalled();
    });
});
