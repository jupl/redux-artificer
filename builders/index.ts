import * as Types from '../types'
import * as Base from './base'

const DEFAULT_OPTIONS: Options = {
  actionType: '@remix',
}

/** Remix build options */
export interface Options {
  actionType: string
}

/** Remix structure */
export type Remix<T extends Types.Base.Type> = Base.Remix<T>

/** Remix based Redux actions */
export type Actions<T extends Types.Base.Type> = Base.Actions<T>

/** Remix based Redux selectors */
export type Selectors<T extends Types.Base.Type> = Base.Selectors<T>

/** Remix based Redux state */
export type State<T extends Types.Base.Type> = Base.State<T>

/**
 * Construct Redux items from Remix definitions
 * @param type Dictionary definition
 * @param options Additional options
 * @return Actions, initial state, reducers, and selectors
 */
export function build<T extends Types.Base.Type>(
  type: T,
  options?: Partial<Options>,
): Remix<T> {
  return Base.build(type, {...DEFAULT_OPTIONS, ...options})
}
