import { EntityRepository, getMongoRepository, MongoRepository } from 'typeorm';

import INotificationsRepository from '@modules/notifications/infra/repositories/INotificationsRepository';
// import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

import Notification from '../schemas/notification.schema';

// @EntityRepository(Notification)
class NotificationsRepository implements INotificationsRepository {
  private ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository<Notification>(Notification);
  }

  public async create(content: string): Promise<Notification> {
    const notification = this.ormRepository.create({
      content,
    });

    await this.ormRepository.save(notification);

    return notification;
  }
}

export default NotificationsRepository;
