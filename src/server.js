import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import notesRouter from './routes/notesRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { connectMongoDB } from './db/connectMongoDB.js';

dotenv.config();

const app = express();

app.use(logger);
app.use(cors());
app.use(express.json());

app.use(notesRouter);

app.use(notFoundHandler);

app.use(errorHandler);

const { MONGO_URL, PORT = 3000 } = process.env;

async function startServer() {
  try {
    await connectMongoDB(MONGO_URL);

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
}

startServer();
