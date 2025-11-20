import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from 'morgan';
import mongoose from 'mongoose';

import notesRouter from './routes/notesRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();

app.use(logger('dev'));
app.use(cors());
app.use(express.json());

app.use(notesRouter);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use(errorHandler);

const { MONGO_URL, PORT = 3000 } = process.env;

async function startServer() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

startServer();
