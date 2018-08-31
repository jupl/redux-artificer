import {combineReducers} from 'redux'
import * as Types from '../types'
import * as Base from './base'
import * as Composite from './composite'

/** Remix build options */
export interface Options {
  actionType: string
  combineReducers: typeof combineReducers
  parentKeys: string[]
  combineState<S>(object: S | undefined, key: keyof S, value: S[typeof key]): S
}

/** Remix structure */
export type Remix<T> = T extends Types.Base.Type<infer S>
  ? Base.Remix<T>
  : T extends Types.Composite.Type
    ? Composite.Remix<T>
    : unknown

/** Remix based Redux actions */
export type Actions<T> = T extends Types.Base.Type<infer S>
  ? Base.Actions<T>
  : T extends Types.Composite.Type
    ? Composite.Actions<T>
    : unknown

/** Remix based Redux selectors */
export type Selectors<T, S = State<T>> = T extends Types.Base.Type<infer X>
  ? Base.Selectors<T, S>
  : T extends Types.Composite.Type
    ? Composite.Selectors<T, S>
    : unknown

/** Remix based Redux state */
export type State<T> = T extends Types.Base.Type<infer S>
  ? Base.State<T>
  : T extends Types.Composite.Type
    ? Composite.State<T>
    : unknown

/** Default builder options */
export const DEFAULT_OPTIONS: Readonly<Options> = {
  combineReducers,
  actionType: '@remix',
  // tslint:disable-next-line:no-any
  combineState: (object: any = {}, key, value) => ({...object, [key]: value}),
  parentKeys: [],
}

/**
 * Construct Redux items from Remix definitions
 * @param type Dictionary definition
 * @param options Additional options
 * @return Actions, reducers, and selectors
 */
export function build<T extends (Types.Base.Type | Types.Composite.Type)>(
  type: T,
  options?: Partial<Options>,
): Remix<T> {
  const newOptions: Options = {...DEFAULT_OPTIONS, ...options}
  if(Types.Base.isType(type)) {
    // @ts-ignore
    return Base.build(type, newOptions)
  }
  else if(Types.Composite.isType(type)) {
    // @ts-ignore
    return Composite.build(type, newOptions)
  }
  else {
    throw new Error('Unmatched type')
  }
}
