import {EMPTY_LIST, Omit} from '../../util'
import * as List from '../list'
import * as Value from '../value'

/** Stack type generator options */
export type Options<T> = List.Options<T>

/** Stack type reducers */
// tslint:disable-line:interface-over-type-literal
export type Reducers<T> = Omit<List.Reducers<T>, 'remove' | 'removeOnce'> & {
  remove(state: T[], payload?: number): T[]
}

/** Stack type selectors */
// tslint:disable-line:interface-over-type-literal
export type Selectors<T> = List.Selectors<T> & {
  peek(state: T[], options: undefined): T | undefined
}

/** Stack type declaration */
export interface Type<T> extends Value.Type<T[]> {
  reducers: Reducers<T>
  selectors: Selectors<T>
}

/** Default stack type options */
// tslint:disable-next-line:no-any
export const DEFAULT_OPTIONS: Readonly<Options<any>> = {
  ...List.DEFAULT_OPTIONS,
}

/**
 * Build a stack type declaration
 * @param options Stack type options
 * @return Stack type declaration
 */
export function New<T>(options?: Partial<Options<T>>): Type<T> {
  const {equals, listEquals: createListEquals, ...newOptions}: Options<T> = {
    ...DEFAULT_OPTIONS,
    ...options,
  }
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
        const items = Array.isArray(payload)
          ? [...payload].reverse()
          : [payload]
        return listEquals(items, EMPTY_LIST) ? state : [...items, ...state]
      },
      remove: (state, count = 1) => {
        const newState = state.slice(count)
        return state.length !== newState.length ? newState : state
      },
    },
    selectors: {
      ...type.selectors,
      peek: ([top]) => top,
    },
  }
}
