import { container } from 'tsyringe';

// import '@modules/users/providers';
import './providers';

// TODO:

// import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
// import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

// import IUsersRepository from '@modules/users/repositories/IUsersRepository';
// import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

// import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
// import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import IOrdersRepository from '@modules/orders/repositories/IOrdersRepository';
import OrdersRepository from '@modules/orders/infra/typeorm/repositories/OrdersRepository';
import INotificationsRepository from '@modules/notifications/infra/repositories/INotificationsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';

// container.registerSingleton<IAppointmentsRepository>(
//   'AppointmentsRepository',
//   AppointmentsRepository,
// );

// container.registerSingleton<IUsersRepository>(
//   'UsersRepository',
//   UsersRepository,
// );

// container.registerSingleton<IUserTokensRepository>(
//   'UserTokensRepository',
//   UserTokensRepository,
// );

container.registerSingleton<IOrdersRepository>(
  'OrdersRepository',
  OrdersRepository,
);

container.registerSingleton<INotificationsRepository>(
  'NotificationsRepository',
  NotificationsRepository,
);
