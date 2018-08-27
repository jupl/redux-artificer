import {EMPTY_LIST, Omit, arrayify} from '../../util'
import * as Value from '../value'

/** List type generator options */
export interface Options<T> extends Omit<Value.Options<T[]>, 'equals'> {
  equals(a: T, b: T): boolean
  listEquals(equals: (a: T, b: T) => boolean): (a: T[], b: T[]) => boolean
}

/** List type reducers */
// tslint:disable-next-line:interface-over-type-literal
export type Reducers<T> = Value.Reducers<T[]> & {
  clear(state: T[], payload: undefined): T[]
  insert(state: T[], payload: T | T[]): T[]
  remove(state: T[], payload: T | T[]): T[]
  removeOnce(state: T[], payload: T | T[]): T[]
}

/** List type selectors */
// tslint:disable-next-line:interface-over-type-literal
export type Selectors<T> = Value.Selectors<T[]> & {
  contains(state: T[], item: T): boolean
  empty(state: T[], options: undefined): boolean
}

/** List type declaration */
export interface Type<T> extends Value.Type<T[]> {
  reducers: Reducers<T>
  selectors: Selectors<T>
}

/** Default list type options */
// tslint:disable-next-line:no-any
export const DEFAULT_OPTIONS: Readonly<Options<any>> = {
  equals: Value.DEFAULT_OPTIONS.equals,
  initialState: EMPTY_LIST,
  listEquals: equals => (a, b) => {
    if(a === b) {
      return true
    }
    if(a.length !== b.length) {
      return false
    }
    return a.every((item, index) => equals(item, b[index]))
  },
}

/**
 * Build a list type declaration
 * @param options List type options
 * @return List type declaration
 */
export function New<T>(options?: Partial<Options<T>>): Type<T> {
  const {equals, listEquals: createListEquals, ...newOptions}: Options<T> = {
    ...DEFAULT_OPTIONS,
    ...options,
  }
  const listEquals = createListEquals(equals)
  const type = Value.New<T[]>({...newOptions, equals: listEquals})
  return {
    ...type,
    reducers: {
      ...type.reducers,
      clear: state => listEquals(state, EMPTY_LIST) ? state : EMPTY_LIST,
      insert: (state, payload) => {
        const items = arrayify(payload)
        return listEquals(items, EMPTY_LIST) ? state :  [...state, ...items]
      },
      remove: (state, payload) => {
        const items = arrayify(payload)
        const newState = state
          .filter(item => items.every(i => !equals(i, item)))
        return newState.length !== state.length ? newState : state
      },
      removeOnce: (state, payload) => arrayify(payload).reduce((s, item) => {
        const itemToRemove = s.find(i => equals(i, item))
        if(itemToRemove === undefined) {
          return s
        }
        const index = s.indexOf(item)
        return s.filter((_, i) => i !== index)
      }, state),
    },
    selectors: {
      ...type.selectors,
      contains: (state, item) => state.some(i => equals(i, item)),
      empty: ({length}) => length === 0,
    },
  }
}
