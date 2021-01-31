import 'reflect-metadata';

import RedisCacheProviderMock from '@shared/container/providers/CacheProvider/mocks/RedisCacheProviderMock';
import { Message } from 'amqplib';
import UpdateProductInStockService from './UpdateProductInStockService';

let cacheProviderMock: RedisCacheProviderMock;
let updateProductStockService: UpdateProductInStockService;
let stockControlServiceMessage: Message;

let kiwiCurrentQuantity = 0;

describe('UpdateProductInStockService', () => {
  beforeEach(() => {
    cacheProviderMock = new RedisCacheProviderMock({
      Kiwi: kiwiCurrentQuantity.toString(),
    });

    updateProductStockService = new UpdateProductInStockService(
      cacheProviderMock,
    );

    stockControlServiceMessage = {
      content: Buffer.from('Kiwi'),
      fields: {
        deliveryTag: 0,
        redelivered: true,
        exchange: '',
        routingKey: '',
      },
      properties: {
        contentType: undefined,
        contentEncoding: undefined,
        headers: { a: 10 },
        deliveryMode: undefined,
        priority: undefined,
        correlationId: undefined,
        replyTo: undefined,
        expiration: undefined,
        messageId: undefined,
        timestamp: undefined,
        type: undefined,
        userId: undefined,
        appId: undefined,
        clusterId: undefined,
      },
    };
  });

  it('should increment product quantity', async () => {
    const operation = 'increment';
    stockControlServiceMessage.fields.routingKey = 'incremented';

    const updatedQuantity = await updateProductStockService.execute(
      stockControlServiceMessage,
      operation,
    );

    expect(updatedQuantity).toBe(kiwiCurrentQuantity + 1);
  });

  it('should decrement product quantity', async () => {
    const operation = 'decrement';
    stockControlServiceMessage.fields.routingKey = 'decremented';
    kiwiCurrentQuantity = 1;

    const updatedQuantity = await updateProductStockService.execute(
      stockControlServiceMessage,
      operation,
    );

    expect(updatedQuantity).toBe(kiwiCurrentQuantity - 1);
  });

  it('should not decrement product quantity when its already 0', async () => {
    const operation = 'decrement';
    stockControlServiceMessage.fields.routingKey = 'decremented';
    // kiwiCurrentQuantity = 1;

    const updatedQuantity = await updateProductStockService.execute(
      stockControlServiceMessage,
      operation,
    );

    expect(updatedQuantity).toBe(0);
  });

  it('should log when receives invalid message from rabbitmq server', async () => {
    stockControlServiceMessage.content = undefined as any;

    const returnValue = await updateProductStockService.execute(
      stockControlServiceMessage,
      'increment',
    );

    expect(returnValue).toBeLessThan(0);
  });

  it('should save product quantity in cache when its not found and its an increment request', async () => {
    stockControlServiceMessage.content = Buffer.from('Garlic');

    const quantity = await updateProductStockService.execute(
      stockControlServiceMessage,
      'increment',
    );

    expect(quantity).toBe(1);
  });

  it('should save product quantity as zero in cache when its not found and its a decrement request', async () => {
    stockControlServiceMessage.content = Buffer.from('Garlic');

    const quantity = await updateProductStockService.execute(
      stockControlServiceMessage,
      'decrement',
    );

    expect(quantity).toBe(0);
  });

  it('should save quantity as zero in cache when its a negative value and its a decrement request', async () => {
    await cacheProviderMock.save('Kiwi', -1);
    stockControlServiceMessage.content = Buffer.from('Kiwi');

    const quantity = await updateProductStockService.execute(
      stockControlServiceMessage,
      'decrement',
    );

    expect(quantity).toBe(0);
  });

  // TODO: ensures logged
  it('should log when an unexpected error has occurred', async () => {
    cacheProviderMock = null as any;

    let logFn = jest.fn();

    // await expect(
    //   updateProductStockService.execute(stockControlServiceMessage, 'increment')
    // ).rejects.tocall
  });
});
