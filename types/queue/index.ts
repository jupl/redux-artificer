import * as Stack from '../stack'

/** Queue type generator options */
export type Options<T> = Stack.Options<T>

/** Queue type reducers */
export type Reducers<T> = Stack.Reducers<T>

/** Queue type selectors */
export type Selectors<T> = Stack.Selectors<T>

/** Queue type declaration */
export interface Type<T> extends Stack.Type<T> {
  reducers: Reducers<T>
  selectors: Selectors<T>
}

/** Default queue type options */
// tslint:disable-next-line:no-any
export const DEFAULT_OPTIONS: Readonly<Options<any>> = {
  ...Stack.DEFAULT_OPTIONS,
}

/**
 * Build a queue type declaration
 * @param options Queue type options
 * @return Queue type declaration
 */
export function New<T>(options?: Partial<Options<T>>): Type<T> {
  const type = Stack.New({
    ...DEFAULT_OPTIONS,
    ...options,
  })
  return {
    ...type,
    reducers: {
      ...type.reducers,
      insert: (state, payload) => {
        const items = !Array.isArray(payload) ? [payload] : payload
        return items.length > 0 ? [...state, ...items] : state
      },
    },
  }
}
