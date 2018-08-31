import {EMPTY_LIST, Omit, PartialExcept, arrayify} from '../../util'
import * as List from '../list'
import * as Value from '../value'

/** Records type generator options */
export interface Options<T, I> extends List.Options<T> {
  getId(item: T): I
  idEquals(a: I, b: I): boolean
  update(newItem: T, oldItem: T): T
}

/** Records type reducers */
// tslint:disable-next-line:interface-over-type-literal
export type Reducers<T, I> = Omit<List.Reducers<T>, IgnoreKeys> & {
  update(state: T[], payload: T | T[]): T[]
  upsert(state: T[], payload: T | T[]): T[]
  remove(state: T[], payload: I | I[]): T[]
}
type IgnoreKeys = 'remove' | 'removeOnce'

/** Records type selectors */
// tslint:disable-next-line:interface-over-type-literal
export type Selectors<T, I> = List.Selectors<T> & {
  getById(state: T[], option: I): T | undefined
}

type DefaultOptions<T, I> = PartialExcept<Options<T, I>, 'getId'>

/** Records type declaration */
export interface Type<T, I> extends Value.Type<T[]> {
  reducers: Reducers<T, I>
  selectors: Selectors<T, I>
}

/** Default records type options */
// tslint:disable-next-line:no-any
export const DEFAULT_OPTIONS: Readonly<Omit<Options<any, any>, 'getId'>> = {
  ...List.DEFAULT_OPTIONS,
  idEquals: (a, b) => a === b,
  update: newItem => newItem,
}

/**
 * Build a records type declaration
 * @param options Records type options
 * @return Records type declaration
 */
export function New<T, I>(options: DefaultOptions<T, I>): Type<T, I> {
  const newOptions: Options<T, I> = {...DEFAULT_OPTIONS, ...options}
  const {
    reducers: {removeOnce: _, ...reducers},
    ...type
  } = List.New(newOptions)
  const {equals, listEquals: createListEquals, idEquals, getId} = newOptions
  const listEquals = createListEquals(equals)
  return {
    ...type,
    reducers: {
      ...reducers,
      insert: (state, payload) => {
        const ids = state.map(getId)
        const items = arrayify(payload)
          .filter(item => ids.every(id => !idEquals(id, getId(item))))
        return listEquals(items, EMPTY_LIST) ? state : [...state, ...items]
      },
      remove: (state, payload) => {
        const ids = arrayify(payload)
        const newState = state
          .filter(item => ids.every(id => !idEquals(id, getId(item))))
        return newState.length !== state.length ? newState : state
      },
      update: buildUpdate(newOptions),
      upsert: buildUpsert(newOptions),
    },
    selectors: {
      ...type.selectors,
      getById: (state, id) => state.find(item => idEquals(id, getId(item))),
    },
  }
}

function buildUpdate<T, I>({
  getId,
  idEquals,
  equals,
  update,
}: Options<T, I>): Type<T, I>['reducers']['update'] {
  return (state, payload) => arrayify(payload).reduce((aState, newItem) => {
    let didUpdate = false
    const itemId = getId(newItem)
    const newState = aState.map(item => {
      const matches = idEquals(itemId, getId(item))
        && !equals(item, newItem)
      didUpdate = didUpdate || matches
      return matches ? update(newItem, item) : item
    })
    return didUpdate ? newState : aState
  }, state)
}

function buildUpsert<T, I>({
  getId,
  idEquals,
  equals,
  update,
}: Options<T, I>): Type<T, I>['reducers']['upsert'] {
  return (state, payload) => arrayify(payload).reduce((aState, newItem) => {
    let didUpdate = false
    let isNew = true
    const itemId = getId(newItem)
    const newState = aState.map(item => {
      const matches = idEquals(itemId, getId(item))
      const shouldUpdate = matches && !equals(item, newItem)
      isNew = isNew && !matches
      didUpdate = didUpdate || shouldUpdate
      return shouldUpdate ? update(newItem, item) : item
    })
    return didUpdate
      ? newState
      : isNew
        ? [...aState, newItem]
        : aState
  }, state)
}
