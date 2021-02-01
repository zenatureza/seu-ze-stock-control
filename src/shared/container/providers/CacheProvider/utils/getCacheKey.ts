export function getCacheKey(key: string) {
  return key.toLowerCase().replace(/\s/g, '-');
}

export function getCacheKeys(keys: string[]) {
  return keys.map(key => getCacheKey(key));
}
