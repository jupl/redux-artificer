import {AnyAction} from 'redux'
import {Options} from '.'
import {Type} from '../types/base'

// tslint:disable:no-any

type Payload<R> = R extends (a1: any, a2: infer P) => unknown ? P : undefined
type Action<R> = Payload<R> extends undefined
  ? () => AnyAction
  : (payload: Payload<R>) => AnyAction
type Selector<F extends (arg1: any, arg2: any) => any, S> =
  Payload<F> extends undefined ? (state: S) => ReturnType<F>
    : (state: S, options: Payload<F>) => ReturnType<F>

/** Remix structure */
export interface Remix<T extends Type> {
  actions: Actions<T>
  initialState: State<T>
  selectors: Selectors<T>
  reducer(state: State<T>, action: AnyAction): State<T>
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
  options: Options,
): Remix<T> {
  return Object
    .entries(reducers)
    .reduce<Remix<T>>(({actions, reducer, ...remix}, [key, aReducer]) => {
      const actionType = `${options.actionType}.${key}`
      return {
        ...remix,
        actions: {
          // @ts-ignore
          ...actions,
          [key]: buildAction({actionType}),
        },
        reducer: buildReducer({
          actionType,
          reducer,
          reducerForType: aReducer,
        }),
      }
    }, {
      initialState,
      actions: undefined!,
      reducer: state => state,
      selectors: selectors as any,
    })
}

/** Massage actions options */
export interface BuildActionOptions {
  actionType: string
}

/** Massage reducer options */
export interface BuildReducerOptions<T extends Type> {
  actionType: string
  reducer(state: State<T>, action: AnyAction): State<T>
  reducerForType(state: State<T>, action: AnyAction): State<T>
}

/** Massage reducer options */
export interface BuildSelectorsOptions<T extends Type> {
  selectors: Selectors<T>
}

/**
 * Construct message actions
 * @param options Generator options
 * @return Actions
 */
export function buildAction({actionType}: BuildActionOptions) {
  return (payload: any): AnyAction => payload !== undefined
    ? {payload, type: actionType}
    : {type: actionType}
}

/**
 * Construct reducer
 * @param options Generator options
 * @return Reducer function
 */
export function buildReducer<T extends Type>({
  actionType,
  reducer,
  reducerForType,
}: BuildReducerOptions<T>) {
  return (state: State<T>, action: AnyAction) => {
    const newState = reducer(state, action)
    return action.type === actionType
      ? reducerForType(newState, action.payload)
      : newState
  }
}
