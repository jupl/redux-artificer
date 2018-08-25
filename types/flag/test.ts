import * as Flag from '.'
import {Builders} from '../..'

describe('Flag type', () => {
  const {
    initialState,
    actions,
    reducer,
  } = Builders.build(Flag.New())
  const custom = Builders.build(Flag.New({initialState: true}))

  it('should include initial state as expected', () => {
    expect(initialState).toBe(false)
    expect(custom.initialState).toBe(true)
  })

  it('should build reducer as expected', () => {
    expect(reducer(true, {type: ''})).toBe(true)
    expect(reducer(true, actions.toggle())).toBe(false)
  })
})
