import mongoose, { Schema, Document } from 'mongoose';

export interface IUserActivityLogDocument extends Document {
    userId: string;
    activityType: string;
    timestamp: Date;
    metadata: Record<string, any>;
    sessionId?: string;
    ipAddress?: string;
    userAgent?: string;
    eventId: string;
}

const UserActivityLogSchema: Schema = new Schema({
    userId: { type: String, required: true, index: true },
    activityType: { type: String, required: true, index: true },
    timestamp: { type: Date, required: true, index: true }, // Descending index by default often preferred, but single field index works both ways
    metadata: { type: Schema.Types.Mixed, default: {} },
    sessionId: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    eventId: { type: String, required: true, unique: true },
}, {
    timestamps: true, // Adds createdAt and updatedAt
});

// Compound indexes for common queries
UserActivityLogSchema.index({ userId: 1, timestamp: -1 }); // Get user's logs sorted by time
UserActivityLogSchema.index({ activityType: 1, timestamp: -1 }); // Get specific activity logs sorted by time

export const UserActivityLogModel = mongoose.model<IUserActivityLogDocument>('UserActivityLog', UserActivityLogSchema);
