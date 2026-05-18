import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { healthRouter } from './routes/health';
import { authRouter } from './routes/auth';
import { proposalsRouter } from './routes/proposals';
import { commentsRouter } from './routes/comments';
import { verdictsRouter } from './routes/verdicts';
import { adminRouter } from './routes/admin';
import { guidelinesRouter } from './routes/guidelines';

const app = express();

// Global middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(requestLogger);

// Health check (outside API base path for load balancer)
app.use('/health', healthRouter);

// API routes
const api = express.Router();
api.use('/auth', authRouter);
api.use('/proposals', proposalsRouter);
api.use('/comments', commentsRouter);
api.use('/verdicts', verdictsRouter);
api.use('/admin', adminRouter);
api.use('/guidelines', guidelinesRouter);

app.use(config.apiBasePath, api);

// Error handling
app.use(errorHandler);

export default app;
