import * as Optional from '.'
import {Builders} from '../..'

// tslint:disable:no-null-keyword

describe('Optional type', () => {
  const {
    initialState,
    actions,
    reducer,
    selectors,
  } = Builders.build(Optional.New<number>())
  const custom = Builders.build(Optional.New({initialState: 1}))

  it('should include initial state as expected', () => {
    expect(initialState).toBe(null)
    expect(custom.initialState).toBe(1)
  })

  it('should build reducer as expected', () => {
    expect(reducer(undefined!, {type: ''})).toBe(null)
    expect(reducer(1, actions.unset())).toBe(null)
    expect(reducer(null, actions.set(1))).toBe(1)
    expect(reducer(1, actions.reset())).toBe(null)
  })

  it('should build selectors as expected', () => {
    expect(selectors.get(1)).toBe(1)
    expect(selectors.get(null)).toBe(undefined)
    expect(selectors.isSet(1)).toBe(true)
    expect(selectors.isSet(null)).toBe(false)
  })
})
