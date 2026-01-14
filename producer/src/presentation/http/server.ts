import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import logRoutes from './routes/v1/logRoutes';
import { errorHandler } from './middleware/errorHandler';
import dotenv from 'dotenv';
import { KafkaProducer } from '../../infrastructure/kafka/KafkaProducer';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/logs', logRoutes);

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'producer-service' });
});

// Error Handling
app.use(errorHandler);

// Start Server
const startServer = async () => {
    try {
        // Connect to Kafka on startup
        await KafkaProducer.getInstance().connect();

        app.listen(PORT, () => {
            console.log(`Producer Service running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
