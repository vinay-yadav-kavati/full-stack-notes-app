import express from 'express';
import cors from 'cors';
import apiRouter from './routes/index.js';
import { getHealth } from './controllers/health.controller.js';
import { errorMiddleware } from './middleware/error.middleware.js';
import { config } from './config/index.js';

const app = express();

app.use(cors({ origin: config.corsOrigin }));
app.use(express.json());

// Legacy/Root Health Check endpoint (Requirement 6)
app.get('/api/health', getHealth);

// API Version 1 routes (/api/v1)
app.use(config.apiPrefix, apiRouter);

// Error Handling Middleware
app.use(errorMiddleware);

export default app;
