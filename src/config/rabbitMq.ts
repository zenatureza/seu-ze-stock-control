interface IRabbitMqConfig {
  username: string;
  password: string;
  hostname: string;
  port: number;
}

export default {
  username: process.env.RABBITMQ_USERNAME || 'guest',
  password: process.env.RABBITMQ_PASSWORD || 'guest',
  hostname: process.env.RABBITMQ_HOST || 'rabbitmq',
  port: process.env.RABBITMQ_PORT || 5672,
} as IRabbitMqConfig;
