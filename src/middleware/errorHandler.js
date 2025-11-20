import { HttpError } from 'http-errors';

export function errorHandler(err, req, res) {
  let status = 500;
  let message = 'Internal Server Error';

  if (err instanceof HttpError) {
    status = err.status;
    message = err.message;
  }

  res.status(status).json({ message });
}
