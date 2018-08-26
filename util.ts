/**
 * Given an item or array of items, ensure we get back an array
 * @param item Item or list of items
 * @return List of items
 */
export function arrayify<T>(item: T | T[]): T[] {
  return !Array.isArray(item) ? [item] : item
}
