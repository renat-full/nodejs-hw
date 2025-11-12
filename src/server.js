import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pinoHttp from 'pino-http';

// Загружаем переменные из .env
dotenv.config();

const app = express();

// --- Middleware ---
app.use(cors()); // разрешаем запросы с других доменов
app.use(express.json()); // позволяет читать JSON из тела запроса
app.use(pinoHttp()); // логгер для всех запросов

// --- Основные маршруты ---
app.get('/notes', (req, res) => {
  res.status(200).json({ message: 'Retrieved all notes' });
});

app.get('/notes/:noteId', (req, res) => {
  const { noteId } = req.params;
  res.status(200).json({ message: `Retrieved note with ID: ${noteId}` });
});

// --- Тестовый маршрут для ошибки ---
app.get('/test-error', () => {
  throw new Error('Simulated server error');
});

// --- Middleware для 404 ---
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// --- Middleware для 500 ---
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ message: err.message });
});

// --- Запуск сервера ---
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
