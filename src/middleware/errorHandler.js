import { isCelebrateError } from 'celebrate';

export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (isCelebrateError(err)) {
    const validationError = Array.from(err.details.values())[0];
    return res.status(400).json({ message: validationError.message });
  }

  res
    .status(err.status || 500)
    .json({ message: err.message || 'Internal Server Error' });
};
