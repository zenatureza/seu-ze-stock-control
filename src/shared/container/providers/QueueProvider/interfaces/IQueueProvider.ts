import { ConsumeMessage, Replies } from 'amqplib';

export default interface IQueueProvider {
  start(): Promise<void>;
  publishInQueue(queue: string, message: string): Promise<boolean>;
  publishInExchange(
    exchange: string,
    routingKey: string,
    message: string,
  ): Promise<boolean>;
  consume(
    queue: string,
    callback: (message: ConsumeMessage) => void,
  ): Promise<Replies.Consume>;
}
