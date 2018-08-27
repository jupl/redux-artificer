/** Inverse of pick */
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

/** Make properties partial except for certain ones */
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>

/** AYY */
export const EMPTY_LIST: never[] = []

/**
 * Given an item or array of items, ensure we get back an array
 * @param item Item or list of items
 * @return List of items
 */
export function arrayify<T>(item: T | T[]): T[] {
  return !Array.isArray(item) ? [item] : item
}
