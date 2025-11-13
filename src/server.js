import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { connectMongoDB } from './db/connectMongoDB.js';
import notesRouter from './routes/notesRoutes.js';
import authRouter from './routes/authRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { errors } from 'celebrate';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/notes', notesRouter);
app.use('/auth', authRouter);

app.use(errors());

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

connectMongoDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
