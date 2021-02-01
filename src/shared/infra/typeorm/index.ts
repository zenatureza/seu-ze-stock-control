// import Notification from '@modules/notifications/infra/typeorm/schemas/Notification.schema';
import {
  ConnectionOptions,
  createConnection,
  getConnectionManager,
} from 'typeorm';

const config: ConnectionOptions = {
  type: 'mongodb',
  host: process.env.MONGODB_HOST,
  port: parseInt(process.env.MONGODB_PORT ?? '27017'),
  database: process.env.MONGODB_DATABASE,
  useUnifiedTopology: true,
  entities: ['src/modules/**/infra/typeorm/schemas/*.schema.{ts, js}'],
  // username: 'root',
  // password: 'root',
  // entities: [
  //   __dirname + '../../modules/**/infra/typeorm/schemas/*.schema.{js,ts}',
  // ],
  // entities: [Notification],
};

// console.log(__dirname);

// createConnection(config)
//   .then(res => {
//     console.log('mongodb connection created');
//   })
//   .catch(err => console.log(err));

createConnection(config);
