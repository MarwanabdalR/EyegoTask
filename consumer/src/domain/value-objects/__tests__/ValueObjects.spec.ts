import { ActivityType } from '../ActivityType';
import { EventId } from '../EventId';
import { IpAddress } from '../IpAddress';
import { LogTimestamp } from '../LogTimestamp';
import { Metadata } from '../Metadata';
import { SessionId } from '../SessionId';
import { UserAgent } from '../UserAgent';
import { UserId } from '../UserId';

describe('Value Objects', () => {
    describe('ActivityType', () => {
        it('should create a valid activity type', () => {
            const type = new ActivityType('LOGIN');
            expect(type.value).toBe('LOGIN');
        });

        it('should handle lowercase input and convert to uppercase', () => {
            const type = new ActivityType('purchase');
            expect(type.value).toBe('PURCHASE');
        });

        it('should throw error for invalid activity type', () => {
            expect(() => new ActivityType('INVALID')).toThrow('Invalid activity type');
        });
    });

    describe('EventId', () => {
        it('should generate a valid UUID if none provided', () => {
            const eventId = new EventId();
            expect(eventId.value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
        });

        it('should create from valid UUID string', () => {
            const uuid = '123e4567-e89b-12d3-a456-426614174000';
            const eventId = new EventId(uuid);
            expect(eventId.value).toBe(uuid);
        });

        it('should throw error for invalid UUID', () => {
            expect(() => new EventId('invalid-uuid')).toThrow('Invalid event ID');
        });
    });

    describe('IpAddress', () => {
        it('should create from valid IPv4', () => {
            const ip = new IpAddress('192.168.1.1');
            expect(ip.value).toBe('192.168.1.1');
        });

        it('should throw error for invalid IP', () => {
            expect(() => new IpAddress('abc.def.ghi.jkl')).toThrow('Invalid IP address');
        });
    });

    describe('LogTimestamp', () => {
        it('should default to current date', () => {
            const before = new Date();
            const ts = new LogTimestamp();
            const after = new Date();
            expect(ts.value.getTime()).toBeGreaterThanOrEqual(before.getTime());
            expect(ts.value.getTime()).toBeLessThanOrEqual(after.getTime());
        });

        it('should create from provided date', () => {
            const date = new Date('2025-01-01');
            const ts = new LogTimestamp(date);
            expect(ts.value.toISOString()).toBe(date.toISOString());
        });
    });

    describe('Metadata', () => {
        it('should default to empty object', () => {
            const meta = new Metadata();
            expect(meta.toObject()).toEqual({});
        });

        it('should store provided metadata', () => {
            const data = { browser: 'Chrome', version: '120' };
            const meta = new Metadata(data);
            expect(meta.toObject()).toEqual(data);
        });
    });

    describe('SessionId', () => {
        it('should create valid session ID', () => {
            const id = new SessionId('session-123');
            expect(id.value).toBe('session-123');
        });

        it('should throw error for empty session ID', () => {
            expect(() => new SessionId('')).toThrow('Invalid session ID');
        });
    });

    describe('UserAgent', () => {
        it('should create valid user agent', () => {
            const ua = new UserAgent('Mozilla/5.0');
            expect(ua.value).toBe('Mozilla/5.0');
        });

        it('should throw error for empty user agent', () => {
            expect(() => new UserAgent('')).toThrow('User agent must be a non-empty string');
        });
    });

    describe('UserId', () => {
        it('should create valid user ID', () => {
            const id = new UserId('user-456');
            expect(id.value).toBe('user-456');
        });

        it('should throw error for empty user ID', () => {
            expect(() => new UserId('')).toThrow('Invalid user ID');
        });
    });
});
