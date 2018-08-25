import * as Base from '../base'

/** Value type reducers */
export type Reducers<S> = { // tslint:disable-line:interface-over-type-literal
  reset(state: S, payload: undefined): S
  set(state: S, payload: S): S
}

/** Value type selectors */
export type Selectors<S> = { // tslint:disable-line:interface-over-type-literal
  get(state: S, options: undefined): S
}

/** Value type declaration */
export interface Type<S> extends Base.Type<S> {
  reducers: Reducers<S>
  selectors: Selectors<S>
}

/** Value type generator options */
export interface Options<T> {
  initialState: T
}

/**
 * Build a value type declaration
 * @param options Value type options
 * @return Value type declaration
 */
export function New<S>({initialState}: Options<S>): Type<S> {
  return {
    initialState,
    reducers: {
      reset: () => initialState,
      set: (_, payload) => payload,
    },
    selectors: {
      get: state => state,
    },
  }
}
