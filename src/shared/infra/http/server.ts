import 'reflect-metadata';
import 'dotenv/config';

import express from 'express';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';
import '@shared/container/providers/QueueProvider/implementations/RabbitMqProvider';

const app = express();

app.use(express.json());
app.use(routes);

app.get('/test', (request, response) => response.json({ message: '👨‍💻 test' }));

app.listen(3000, () => {
  console.log('🌴 starting again node server on port 3000...');
});
