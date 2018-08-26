import * as List from '../list'

/** Stack type generator options */
export type Options<T> = List.Options<T>

/** Stack type reducers */
// tslint:disable-line:interface-over-type-literal
export type Reducers<T> = List.Reducers<T> & {
  pop(state: T[], payload?: number): T[]
}

/** Stack type selectors */
// tslint:disable-line:interface-over-type-literal
export type Selectors<T> = List.Selectors<T> & {
  peek(state: T[], options: number): T[]
  peekOne(state: T[], options: undefined): T | undefined
}

/** Stack type declaration */
export interface Type<T> extends List.Type<T> {
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
  const type = List.New({...DEFAULT_OPTIONS, ...options})
  return {
    ...type,
    reducers: {
      ...type.reducers,
      insert: (state, payload) => {
        const items = Array.isArray(payload)
          ? [...payload].reverse()
          : [payload]
        return items.length > 0 ? [...items, ...state] : state
      },
      pop: (state, count = 1) => {
        const newState = state.slice(count)
        return state.length !== newState.length ? newState : state
      },
    },
    selectors: {
      ...type.selectors,
      peek: (state, count) => state.slice(0, count),
      peekOne: ([top]) => top,
    },
  }
}
