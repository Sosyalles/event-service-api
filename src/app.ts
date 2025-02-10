import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import eventRoutes from './routes/event.routes';
import categoryRoutes from './routes/category.routes';
import healthRoutes from './routes/health.routes';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import { setupSwagger } from './config/swagger';
import { Config } from './config/config';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: Config.CORS_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route should be before any middleware
app.use('/', healthRoutes);

// Rate limiting
const limiter = rateLimit({
  windowMs: Config.RATE_LIMIT_WINDOW_MS,
  max: Config.RATE_LIMIT_MAX_REQUESTS,
  message: 'Too many requests from this IP, please try again later',
});

app.use(limiter);

// Setup Swagger
if (!Config.isProduction()) {
  setupSwagger(app);
}

// Routes
app.use('/api/categories', categoryRoutes);
app.use('/api/events', eventRoutes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;