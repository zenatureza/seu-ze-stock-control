import { ConnectionOptions } from 'typeorm';

const config: ConnectionOptions = {
  type: 'mongodb',
  host: process.env.MONGODB_HOST,
  port: parseInt(process.env.MONGODB_PORT ?? '27017'),
  database: process.env.MONGODB_DATABASE,
  useUnifiedTopology: true,
  entities: ['src/modules/**/infra/typeorm/schemas/*.schema.{ts, js}'],
  username: process.env.MONGODB_USERNAME,
  password: process.env.MONGODB_PASSWORD,
  authSource: 'admin',
  ssl: false,
};

export default config;
