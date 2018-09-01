import {AnyAction} from 'redux'
import {Options} from '..'
import {Type} from '../../types/base'

// tslint:disable:no-any

type Payload<R> = R extends (a1: any, a2: infer P) => unknown ? P : undefined
type Action<R> = Payload<R> extends undefined
  ? () => AnyAction
  : Payload<R> extends NonNullable<Payload<R>>
    ? (payload: Payload<R>) => AnyAction
    : (payload?: Payload<R>) => AnyAction
type Selector<F extends (arg1: any, arg2: any) => any, S> =
  Payload<F> extends undefined
    ? (state: S) => ReturnType<F>
    : Payload<F> extends NonNullable<Payload<F>>
      ? (state: S, options: Payload<F>) => ReturnType<F>
      : (state: S, options?: Payload<F>) => ReturnType<F>

/** Remix structure */
export interface Remix<T extends Type> {
  actions: Actions<T>
  initialState: State<T>
  selectors: Selectors<T>
  reducer(state: State<T> | undefined, action: AnyAction): State<T>
}

/** Remix based Redux actions */
export type Actions<T extends Type> = {
  [key in keyof T['reducers']]: Action<T['reducers'][key]>
}

/** Remix based Redux selectors */
export type Selectors<T extends Type, S = State<T>> = {
  [key in keyof T['selectors']]: Selector<T['selectors'][key], S>
}

/** Remix based Redux state */
export type State<T> = T extends Type<infer S> ? S : unknown

/**
 * Construct Redux items from Remix definitions
 * @param type Dictionary definition
 * @param options Additional options
 * @return Actions, initial state, reducers, and selectors
 */
export function build<T extends Type>(
  {initialState, reducers, selectors}: T,
  {actionType, parentKeys, subSelector}: Options,
): Remix<T> {
  return {
    initialState,
    actions: Object.keys(reducers).reduce<Actions<T>>((a, key) => {
      const type = `${actionType}.${key}`
      Object.assign(action, {toString: () => type})
      // @ts-ignore
      return {...a, [key]: action}

      function action(payload: any): AnyAction {
        return payload !== undefined ? {payload, type} : {type}
      }
    }, undefined!),
    reducer: (state = initialState, {type, payload}) => {
      const key = type.replace(`${actionType}.`, '')
      return type.startsWith(actionType) && key in reducers
        ? reducers[key](state, payload)
        : state
    },
    selectors: parentKeys.length > 0
      ? Object.entries(selectors).reduce((s, [key, selector]) => ({
        ...s,
        [key]: (state: any, opts: any) =>
          selector(subSelector(state, parentKeys), opts),
      }), {} as any)
      : selectors,
  }
}
