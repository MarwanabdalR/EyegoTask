import { KafkaProducer } from './KafkaProducer';
import { UserActivityLog } from './MessageSchema';

describe('KafkaProducer Integration Test', () => {
    let producer: KafkaProducer;

    beforeAll(async () => {
        producer = KafkaProducer.getInstance();
        await producer.connect();
    }, 10000);

    afterAll(async () => {
        await producer.disconnect();
    });

    it('should send a valid message successfully', async () => {
        const validMessage: UserActivityLog = {
            userId: 'user_test_123',
            activityType: 'LOGIN',
            timestamp: new Date(),
            metadata: { source: 'integration_test' },
        };

        await expect(producer.send(validMessage)).resolves.not.toThrow();
    }, 10000);

    it('should fail when sending an invalid message', async () => {
        const invalidMessage: any = {
            userId: '', // Invalid: empty string
            activityType: 'INVALID_TYPE', // Invalid enum
            timestamp: 'not-a-date', // Invalid type
        };

        await expect(producer.send(invalidMessage)).rejects.toThrow();
    });
});
