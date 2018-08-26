import {arrayify} from '../../util'
import * as Value from '../value'

/** List type generator options */
export interface Options<T> extends Value.Options<T[]> {
  itemEquals(a: T, b: T): boolean
}

/** List type reducers */
// tslint:disable-next-line:interface-over-type-literal
export type Reducers<T> = Value.Reducers<T[]> & {
  clear(state: T[], payload: undefined): T[]
  insert(state: T[], payload: T | T[]): T[]
  remove(state: T[], payload: T | T[]): T[]
  removeAll(state: T[], payload: T | T[]): T[]
}

/** List type selectors */
// tslint:disable-next-line:interface-over-type-literal
export type Selectors<T> = Value.Selectors<T[]> & {
  contains(state: T[], item: T): boolean
}

/** List type declaration */
export interface Type<T> extends Value.Type<T[]> {
  reducers: Reducers<T>
  selectors: Selectors<T>
}

/** Default list type options */
// tslint:disable-next-line:no-any
export const DEFAULT_OPTIONS: Readonly<Options<any>> = {
  ...Value.DEFAULT_OPTIONS,
  initialState: [],
  itemEquals: (a, b) => a === b,
}

/**
 * Build a list type declaration
 * @param options List type options
 * @return List type declaration
 */
export function New<T>(options?: Partial<Options<T>>): Type<T> {
  const {itemEquals, ...newOptions}: Options<T> = {
    ...DEFAULT_OPTIONS,
    ...options,
  }
  const type = Value.New(newOptions)
  return {
    ...type,
    reducers: {
      ...type.reducers,
      clear: state => state.length > 0 ? [] : state,
      insert: (state, payload) => {
        const items = arrayify(payload)
        return items.length > 0 ? [...state, ...items] : state
      },
      remove: (state, payload) => arrayify(payload).reduce((s, item) => {
        const itemToRemove = s.find(i => itemEquals(i, item))
        if(itemToRemove === undefined) {
          return s
        }
        const index = s.indexOf(item)
        return s.filter((_, i) => i !== index)
      }, state),
      removeAll: (state, payload) => {
        const items = arrayify(payload)
        const newState = state
          .filter(item => items.every(i => !itemEquals(i, item)))
        return newState.length !== state.length ? newState : state
      },
    },
    selectors: {
      ...type.selectors,
      contains: (state, item) => state.some(i => itemEquals(i, item)),
    },
  }
}
