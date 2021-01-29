// import ICreateNotificationDTO from '../dtos/ICreateNotificationDTO';
import Notification from '../typeorm/schemas/Notification.schema';

export default interface INotificationsRepository {
  create(data: string): Promise<Notification>;
}
