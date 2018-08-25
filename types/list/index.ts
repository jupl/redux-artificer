import * as Value from '../value'

/** Default list type options */
// tslint:disable-next-line:no-any
export const DEFAULT_OPTIONS: Readonly<Options<any, any>> = {
  getId: item => item,
  idMatches: (a, b) => a === b,
  initialState: [],
}

/** List type reducers */
// tslint:disable-next-line:interface-over-type-literal
export type Reducers<T, I> = Value.Reducers<T[]> & {
  clear(state: T[], payload: undefined): T[]
  insert(state: T[], payload: T | T[]): T[]
  remove(state: T[], payload: I | I[]): T[]
  removeAll(state: T[], payload: I | I[]): T[]
}

/** List type selectors */
// tslint:disable-next-line:interface-over-type-literal
export type Selectors<T, I> = Value.Selectors<T[]> & {
  getAt(state: T[], id: I): T | undefined
  contains(state: T[], id: I): boolean
}

/** List type declaration */
export interface Type<T, I> extends Value.Type<T[]> {
  reducers: Reducers<T, I>
  selectors: Selectors<T, I>
}

/** List type generator options */
export interface Options<T, I> extends Value.Options<T[]> {
  getId(item: T): I
  idMatches(id: I, anId: I): boolean
}

/**
 * Build a list type declaration
 * @param options List type options
 * @return List type declaration
 */
export function New<T, I = T>(options?: Partial<Options<T, I>>): Type<T, I> {
  const newOptions: Options<T, I> = {
    ...DEFAULT_OPTIONS,
    ...options,
  }
  const type = Value.New(newOptions)
  const {getId, idMatches} = newOptions
  return {
    ...type,
    reducers: {
      ...type.reducers,
      clear: state => state.length > 0 ? [] : state,
      insert: (state, payload) => {
        const items = arrayify(payload)
        return items.length > 0 ? [...state, ...items] : state
      },
      remove: (state, payload) => arrayify(payload).reduce((s, id) => {
        const item = s.find(i => idMatches(id, getId(i)))
        if(item === undefined) {
          return s
        }
        const index = s.indexOf(item)
        return s.filter((_, i) => i !== index)
      }, state),
      removeAll: (state, payload) => {
        const ids = arrayify(payload)
        const newState = state
          .filter(item => ids.every(id => !idMatches(id, getId(item))))
        return newState.length !== state.length ? newState : state
      },
    },
    selectors: {
      ...type.selectors,
      contains: (state, id) => state.some(item => idMatches(id, getId(item))),
      getAt: (state, id) => state.find(item => idMatches(id, getId(item))),
    },
  }
}

function arrayify<T>(item: T | T[]): T[] {
  return !Array.isArray(item) ? [item] : item
}
