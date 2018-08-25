// tslint:disable:no-any

/** Base type definition */
export interface Type<S = any> {
  initialState: S
  reducers: {
    [key: string]: (state: S, payload: any) => S
  }
  selectors: {
    [key: string]: (state: S, options: any) => any
  }
}
