import { container } from 'tsyringe';
import IQueueProvider from './interfaces/IQueueProvider';

import RabbitMqProvider from './implementations/RabbitMqProvider';

const providers = {
  rabbitMq: RabbitMqProvider,
};

container.registerSingleton<IQueueProvider>(
  'QueueProvider',
  providers.rabbitMq,
);
