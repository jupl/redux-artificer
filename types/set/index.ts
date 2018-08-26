import {arrayify} from '../../util'
import * as List from '../List'

/** Set type generator options */
export type Options<T> = List.Options<T>

/** Set type reducers */
export type Reducers<T> = List.Reducers<T>

/** Set type selectors */
export type Selectors<T> = List.Selectors<T>

/** Set type declaration */
export interface Type<T> extends List.Type<T> {
  reducers: Reducers<T>
  selectors: Selectors<T>
}

/** Default set type options */
// tslint:disable-next-line:no-any
const DEFAULT_OPTIONS: Readonly<Options<any>> = {
  ...List.DEFAULT_OPTIONS,
}

/**
 * Build a set type declaration
 * @param options Set type options
 * @return Set type declaration
 */
export function New<T>(options?: Partial<Options<T>>): Type<T> {
  const newOptions: Options<T> = {
    ...DEFAULT_OPTIONS,
    ...options,
  }
  const type = List.New(newOptions)
  const {itemEquals} = newOptions
  return {
    ...type,
    reducers: {
      ...type.reducers,
      insert: (state, payload) => {
        const items = arrayify(payload)
          .filter(item => state.every(i => !itemEquals(i, item)))
        return items.length > 0 ? [...state, ...items] : state
      },
    },
  }
}
