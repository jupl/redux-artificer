import {AnyAction, ReducersMapObject, combineReducers} from 'redux'
import * as Builder from '..'
import {Type} from '../../types/composite'

/** Remix structure */
export interface Remix<T extends Type> {
  actions: Actions<T>
  initialState: State<T>
  selectors: Selectors<T>
  reducer(state: State<T> | undefined, action: AnyAction): State<T>
}

/** Remix based Redux actions */
export type Actions<T extends Type> = {
  [key in keyof T]: Builder.Actions<T[key]>
}

/** Remix based Redux selectors */
export type Selectors<T extends Type, S = State<T>> = {
  [key in keyof T]: Builder.Selectors<T[key], S>
}

/** Remix based Redux state */
export type State<T extends Type> = {
  [key in keyof T]: Builder.State<T[key]>
}

/**
 * Construct Redux items from Remix definitions
 * @param type Dictionary definition
 * @param options Additional options
 * @return Actions, reducers, and selectors
 */
export function build<T extends Type>(
  type: T,
  options: Builder.Options,
): Remix<T> {
  const [intermediateRemix, reducersMap] = Object
    .entries(type)
    .reduce<[Remix<T>, ReducersMapObject]>((
      [{actions, initialState, selectors, ...remix}, reducers],
      [key, aType],
    ) => {
      const actionType = `${options.actionType}.${key}`
      const {
        // @ts-ignore
        actions: subActions,
        initialState: subInitialState,
        reducer: subReducer,
        // @ts-ignore
        selectors: subSelectors,
      } = Builder.build(aType, {
        ...options,
        actionType,
        parentKeys: [...options.parentKeys, key],
      })
      return [
        {
          ...remix,
          // @ts-ignore
          actions: {...actions, [key]: subActions},
          // @ts-ignore
          initialState: {...initialState, [key]: subInitialState},
          // @ts-ignore
          selectors: {...selectors, [key]: subSelectors},
        },
        {
          ...reducers,
          // tslint:disable-next-line:no-any
          [key]: (state: any = subInitialState, action: any) =>
            action.type.startsWith(actionType)
              ? (subReducer as Function)(state, action)
              : state,
        },
      ]
    }, [
      {
        actions: {} as any, // tslint:disable-line:no-any
        initialState: {} as any, // tslint:disable-line:no-any
        reducer: undefined!,
        selectors: {} as any, // tslint:disable-line:no-any
      },
      {},
    ])
  return {...intermediateRemix, reducer: combineReducers(reducersMap)}
}
