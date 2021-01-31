import 'reflect-metadata';

import RedisCacheProviderMock from '@shared/container/providers/CacheProvider/mocks/RedisCacheProviderMock';
import { Message } from 'amqplib';
import UpdateProductStockService from './UpdateProductInStockService';

let cacheProviderMock: RedisCacheProviderMock;
let updateProductStockService: UpdateProductStockService;
let stockControlServiceMessage: Message;

let kiwiCurrentQuantity = 0;

describe('UpdateProductInStockService', () => {
  beforeEach(() => {
    cacheProviderMock = new RedisCacheProviderMock({
      Kiwi: kiwiCurrentQuantity.toString(),
    });

    updateProductStockService = new UpdateProductStockService(
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
});
