export type AsyncStorageValue = string | null;

export function getItem(key: string): Promise<AsyncStorageValue>;
export function setItem(key: string, value: string): Promise<void>;
export function removeItem(key: string): Promise<void>;
export function multiRemove(keys: string[]): Promise<void>;
export function getAllKeys(): Promise<string[]>;
export function clear(): Promise<void>;

export type AsyncStorageStatic = {
  getItem: typeof getItem;
  setItem: typeof setItem;
  removeItem: typeof removeItem;
  multiRemove: typeof multiRemove;
  getAllKeys: typeof getAllKeys;
  clear: typeof clear;
};

declare const AsyncStorage: AsyncStorageStatic;
export default AsyncStorage;
