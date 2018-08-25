import * as Base from './base'
import * as Value from './value'

// tslint:disable:no-null-keyword

/** Default optional value options */
// tslint:disable-next-line:no-any
export const DEFAULT_OPTIONS: Readonly<Options<any>> = {}

/** Optional value reducers */
// tslint:disable-next-line:interface-over-type-literal
export type Reducers<S> = Value.Reducers<S | null> & {
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

/** Optional value generator options */
export interface Options<T> {
  initialState?: T
}

/**
 * Build a optional value type declaration
 * @param options Optional value type options
 * @return Optional value type declaration
 */
export function New<T>(options?: Partial<Options<T>>): Type<T> {
  const newOptions: Options<T> = {...DEFAULT_OPTIONS, ...options}
  const {initialState = null} = newOptions
  const type = Value.New({
    ...DEFAULT_OPTIONS,
    ...options,
    initialState,
  })
  return {
    ...type,
    reducers: {
      ...type.reducers,
      unset: () => null,
    },
    selectors: {
      get: state => state !== null ? state : undefined,
      isSet: state => state !== null,
    },
  }
}
