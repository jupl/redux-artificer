import {EMPTY_LIST, Omit, arrayify} from '../../util'
import * as List from '../list'
import * as Value from '../value'

/** Set type generator options */
export type Options<T> = List.Options<T>

/** Set type reducers */
export type Reducers<T> = Omit<List.Reducers<T>, 'removeOnce'>

/** Set type selectors */
export type Selectors<T> = List.Selectors<T>

/** Set type declaration */
export interface Type<T> extends Value.Type<T[]> {
  reducers: Reducers<T>
  selectors: Selectors<T>
}

/** Default set type options */
// tslint:disable-next-line:no-any
export const DEFAULT_OPTIONS: Readonly<Options<any>> = {
  ...List.DEFAULT_OPTIONS,
}

/**
 * Build a set type declaration
 * @param options Set type options
 * @return Set type declaration
 */
export function New<T>(options?: Partial<Options<T>>): Type<T> {
  const {
    equals,
    listEquals: createListEquals,
    ...newOptions
  }: Options<T> = {...DEFAULT_OPTIONS, ...options}
  const {reducers: {removeOnce: _, ...reducers}, ...type} = List.New({
    ...newOptions,
    equals,
    listEquals: createListEquals,
  })
  const listEquals = createListEquals(equals)
  return {
    ...type,
    reducers: {
      ...reducers,
      insert: (state, payload) => {
        const items = arrayify(payload)
          .filter(item => state.every(i => !equals(i, item)))
        return listEquals(items, EMPTY_LIST) ? state : [...state, ...items]
      },
    },
  }
}
