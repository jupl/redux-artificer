import {Builders} from '..'
import * as Value from './value'

describe('Value type', () => {
  const {
    initialState,
    actions,
    reducer,
    selectors,
  } = Builders.build(Value.New({initialState: 1}))

  it('should include initial state as expected', () => {
    expect(initialState).toBe(1)
  })

  it('should build reducer as expected', () => {
    expect(reducer(1, {type: ''})).toBe(1)
    expect(reducer(0, actions.reset())).toBe(1)
    expect(reducer(1, actions.set(0))).toBe(0)
  })

  it('should build selectors as expected', () => {
    expect(selectors.get(0)).toBe(0)
  })
})
