import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import routes from './routes';
import AppError from '@shared/errors/AppError';
import { errors } from 'celebrate';

import '@shared/infra/typeorm';
import '@shared/container';
import '@shared/container/providers/QueueProvider/implementations/RabbitMqProvider';

const app = express();

app.use(express.json());
app.use(routes);

app.get('/test', (request, response) => response.json({ message: '👨‍💻 test' }));

app.use(errors());

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    const { statusCode, message } = err;

    return response.status(statusCode).json({
      status: 'error',
      message,
    });
  }

  console.log(err);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  });
});

app.listen(3000, () => {
  console.log('🌴 starting again node server on port 3000...');
});
