import * as Base from '../base'

/** Value type generator options */
export interface Options<T> {
  initialState: T
  equals(a: T, b: T): boolean
}

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

/** Default list type options */
// tslint:disable-next-line:no-any
export const DEFAULT_OPTIONS: Readonly<Pick<Options<any>, 'equals'>> = {
  equals: (a, b) => a === b,
}

interface NewOptions<T> {
  initialState: T
  equals?(a: T, b: T): boolean
}

/**
 * Build a value type declaration
 * @param options Value type options
 * @return Value type declaration
 */
export function New<S>(options: NewOptions<S>): Type<S> {
  const {initialState, equals}: Options<S> = {...DEFAULT_OPTIONS, ...options}
  return {
    initialState,
    reducers: {
      reset: state => equals(state, initialState) ? state : initialState,
      set: (state, payload) => equals(state, payload) ? state : payload,
    },
    selectors: {
      get: state => state,
    },
  }
}
