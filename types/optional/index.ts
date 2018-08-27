import {Omit} from '../../util'
import * as Base from '../base'
import * as Value from '../value'

// tslint:disable:no-null-keyword

/** Optional value generator options */
export interface Options<T> {
  initialState: T
  equals(a?: T, b?: T): boolean
}

/** Optional value reducers */
// tslint:disable-next-line:interface-over-type-literal
export type Reducers<S> = Omit<Value.Reducers<S | null>, 'set'> & {
  set(state: S | null, payload: S): S | null
  unset(state: S | null, payload: undefined): S | null
}

/** Optional value selectors */
// tslint:disable-next-line:interface-over-type-literal
export type Selectors<S> = {
  get(state: S | null, options: undefined): S | undefined
  isSet(state: S | null, options: undefined): boolean
}

/** Optional value declaration */
export interface Type<S> extends Base.Type<S | null> {
  reducers: Reducers<S>
  selectors: Selectors<S>
}

/** Default optional value options */
// tslint:disable-next-line:no-any
export const DEFAULT_OPTIONS: Readonly<Options<any>> = {
  equals: (a, b) => a === b,
  initialState: null,
}

/**
 * Build a optional value type declaration
 * @param options Optional value type options
 * @return Optional value type declaration
 */
export function New<T>(options?: Partial<Options<T>>): Type<T> {
  const {equals, ...newOptions}: Options<T> = {...DEFAULT_OPTIONS, ...options}
  const type = Value.New<T | null>({
    ...newOptions,
    equals: (a, b) => {
      const newA = a !== null ? a : undefined
      const newB = b !== null ? b : undefined
      return equals(newA, newB)
    },
  })
  return {
    ...type,
    reducers: {
      ...type.reducers,
      unset: () => null,
    },
    selectors: {
      ...type.selectors,
      get: state => state !== null ? state : undefined,
      isSet: state => state !== null,
    },
  }
}
