// import ICacheProvider from '../models/ICacheProvider';

import ICacheProvider from '../interfaces/ICacheProvider';

interface ICacheData {
  [key: string]: string;
}

export default class RedisCacheProviderMock implements ICacheProvider {
  private cache: ICacheData = {};

  constructor(cache?: ICacheData) {
    // this.cache = cache;
    if (cache) {
      this.cache = cache;
    }
  }

  public async save(key: string, value: any): Promise<void> {
    this.cache[key] = JSON.stringify(value);
  }

  public async recover<T>(key: string): Promise<T | null> {
    const data = this.cache[key];

    if (!data) {
      return null;
    }

    const parsedData = JSON.parse(data) as T;

    return parsedData;
  }

  public async recoverAll(keys: string[]): Promise<Map<string, string> | null> {
    let values: string[] = [];

    keys.forEach(key => {
      values.push(this.cache[key] ?? '10');
    });

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
    delete this.cache[key];
  }

  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = Object.keys(this.cache).filter(key =>
      key.startsWith(`${prefix}:`),
    );

    keys.forEach(key => {
      delete this.cache[key];
    });
  }
}
