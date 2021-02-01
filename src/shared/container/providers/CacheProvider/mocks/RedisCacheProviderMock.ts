// import ICacheProvider from '../models/ICacheProvider';

import ICacheProvider from '../interfaces/ICacheProvider';
import { getCacheKey } from '../utils/getCacheKey';

interface ICacheData {
  [key: string]: string;
}

export default class RedisCacheProviderMock implements ICacheProvider {
  private cache: ICacheData = {};

  constructor(cache?: ICacheData) {
    // this.cache = cache;
    if (cache) {
      for (let key in cache) {
        let value = cache[key];

        this.cache[getCacheKey(key)] = value;
        // Use `key` and `value`
      }
      // this.cache = cache;
    }
  }

  public async save(key: string, value: any): Promise<void> {
    this.cache[getCacheKey(key)] = JSON.stringify(value);
  }

  public async exists(key: string): Promise<boolean> {
    return !!this.cache[getCacheKey(key)];
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = this.cache[getCacheKey(key)];

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async recoverAll(keys: string[]): Promise<Map<string, string> | null> {
    let values: string[] = [];

    keys.forEach(key => {
      if (this.cache[getCacheKey(key)]) {
        values.push(this.cache[getCacheKey(key)] ?? '10');
      }
    });

    if (!values) {
      return null;
    }

    let result: Map<string, string> = new Map<string, string>();
    keys.forEach((key, index) => {
      const value: string = values[index] ?? '';
      if (typeof value === 'string' && this.cache[getCacheKey(key)]) {
        result.set(getCacheKey(key), value);
      }
    });

    return result;
  }

  // ForTestingPurposes
  public async setCacheData(data: ICacheData) {
    this.cache = data;
  }
}
