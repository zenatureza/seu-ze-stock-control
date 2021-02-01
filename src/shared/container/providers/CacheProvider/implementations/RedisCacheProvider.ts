import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';
import ICacheProvider from '../interfaces/ICacheProvider';
import { getCacheKey, getCacheKeys } from '../utils/getCacheKey';

export default class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any): Promise<void> {
    try {
      await this.client.set(getCacheKey(key), JSON.stringify(value));
    } catch (error) {
      console.log('🐧 redis failed', error);
    }
  }

  public async exists(key: string): Promise<boolean> {
    return await !!+this.client.exists(getCacheKey(key));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = await this.client.get(getCacheKey(key));

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async recoverAll(keys: string[]): Promise<Map<string, string> | null> {
    const values = await this.client.mget(getCacheKeys(keys));

    if (!values) {
      return null;
    }

    let result: Map<string, string> = new Map<string, string>();
    keys.forEach((key, index) => {
      const value: string = values[index] ?? '';
      if (typeof value === 'string') {
        result.set(key, value);
      }
    });

    return result;
  }

  public async invalidate(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = await this.client.keys(`${prefix}:*`);

    const pipeline = this.client.pipeline();

    keys.forEach(key => {
      pipeline.del(key);
    });

    await pipeline.exec();
  }
}
