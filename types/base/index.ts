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

/**
 * Check if builder matches base type
 * @param type Unknown type
 * @return If true, then it is of a base type
 */
export function isType<S>(type: Type<S> | any): type is Type<S> {
  if(type == undefined || type.reducers == undefined) {
    return false
  }
  const reducers = Object.values(type.reducers)
  return reducers.length > 0 && reducers.every(r => typeof r === 'function')
}
