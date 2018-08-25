import * as Base from '../base'

/** Composite type definition */
export interface Type {
  readonly [key: string]: Type | Base.Type
}

/**
 * Check if builder matches base type
 * @param type Unknown type
 * @return If true, then it is of a base type
 */
// tslint:disable-next-line:no-any
export function isType(type: any): type is Type {
  if(type == undefined) {
    return false
  }
  const values = Object.values(type)
  return values.length > 0
    && values.every(s => Base.isType(s) || isType(s))
}
