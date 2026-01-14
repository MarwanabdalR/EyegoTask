import { UserActivityLog } from '../entities/UserActivityLog';

export interface UserActivityLogRepository {
    save(log: UserActivityLog): Promise<void>;
    findById(eventId: string): Promise<UserActivityLog | null>;
    findByUserId(userId: string): Promise<UserActivityLog[]>;
    findAll(filter: any, options: { page: number; limit: number; sort?: any }): Promise<{ logs: UserActivityLog[]; total: number }>;
}
