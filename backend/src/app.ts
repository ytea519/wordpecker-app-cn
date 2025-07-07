import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { environment } from './config/environment';
import { errorHandler } from './middleware/errorHandler';
import { openaiRateLimiter } from './middleware/rateLimiter';
import { connectDB } from './config/mongodb';

// Import routes
import listRoutes from './routes/listRoutes';
import wordRoutes from './routes/wordRoutes';
import learnRoutes from './routes/learnRoutes';
import quizRoutes from './routes/quizRoutes';

const app = express();

// Global middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Apply rate limiter only to OpenAI-powered routes
app.use('/api/learn', openaiRateLimiter);
app.use('/api/quiz', openaiRateLimiter);

// Routes
app.use('/api/lists', listRoutes);
app.use('/api/lists', wordRoutes);
app.use('/api/learn', learnRoutes);
app.use('/api/quiz', quizRoutes);

// Error handling
app.use(errorHandler);

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  const PORT = environment.port;
  
  // Connect to MongoDB and start server
  connectDB().then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} in ${environment.nodeEnv} mode`);
    });
  });
}

export default app; 