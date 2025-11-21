import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectMongoDB } from './db/connectMongoDB.js';
import notesRouter from './routes/notesRoutes.js';
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { errors } from 'celebrate';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(logger);

app.use(notesRouter);
app.use(authRouter);
app.use(userRouter);

app.use(notFoundHandler);
app.use(errors());
app.use(errorHandler);

const PORT = process.env.PORT || 3030;

connectMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
