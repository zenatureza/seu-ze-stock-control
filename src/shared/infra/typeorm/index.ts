// import Notification from '@modules/notifications/infra/typeorm/schemas/Notification.schema';
import {
  ConnectionOptions,
  createConnection,
  getConnectionManager,
} from 'typeorm';

// const config: ConnectionOptions = {
//   type: 'mongodb',
//   host: 'mongo-db',
//   // name: 'mongo',
//   port: 27017,
//   username: 'root',
//   password: 'root',
//   database: 'seuzestockcontrol',
//   useUnifiedTopology: true,
//   entities: [
//     __dirname + '../../modules/**/infra/typeorm/schemas/*.schema.{js,ts}',
//   ],
//   // entities: ['src/modules/**/infra/typeorm/schemas/*.schema{.ts, .js}'],
//   // entities: [Notification],
// };

// console.log(__dirname);

// createConnection(config)
//   .then(res => {
//     console.log('mongodb connection created');
//   })
//   .catch(err => console.log(err));

createConnection();
