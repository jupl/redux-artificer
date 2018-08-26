import * as Value from '../value'

/** Flag type generator options */
export interface Options extends Value.Options<boolean> {
  initialState: boolean
}

/** Flag type reducers */
// tslint:disable-next-line:interface-over-type-literal
export type Reducers = Value.Reducers<boolean> & {
  toggle(state: boolean, payload: undefined): boolean
}

/** Flag type selectors */
export type Selectors = Value.Selectors<boolean>

/** Flag type declaration */
export interface Type extends Value.Type<boolean> {
  reducers: Reducers
  selectors: Selectors
}

/** Default flag type options */
export const DEFAULT_OPTIONS: Readonly<Options> = {
  ...Value.DEFAULT_OPTIONS,
  initialState: false,
}

/**
 * Build a flag type declaration
 * @param options Flag type options
 * @return Flag type declaration
 */
export function New(options?: Partial<Options>): Type {
  const type = Value.New({...DEFAULT_OPTIONS, ...options})
  return {
    ...type,
    reducers: {
      ...type.reducers,
      toggle: state => !state,
    },
  }
}
