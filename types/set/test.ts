import * as Set from '.'
import {Builders} from '../..'

describe('Set type', () => {
  const {
    initialState,
    actions,
    reducer,
  } = Builders.build(Set.New({initialState: [1]}))

  it('should include initial state as expected', () => {
    expect(initialState).toEqual([1])
  })

  it('should build reducer as expected', () => {
    expect(reducer(undefined!, {type: ''})).toEqual([1])
    expect(reducer([1], actions.insert(0))).toEqual([1, 0])
    expect(reducer([1], actions.insert(1))).toEqual([1])
  })
})
