import * as Queue from '.'
import {Builders} from '../..'

describe('Queue type', () => {
  const {
    initialState,
    actions,
    reducer,
  } = Builders.build(Queue.New<number>())
  const custom = Builders.build(Queue.New({initialState: [0, 1]}))

  it('should include initial state as expected', () => {
    expect(initialState).toEqual([])
    expect(custom.initialState).toEqual([0, 1])
  })

  it('should build reducer as expected', () => {
    expect(reducer([1], {type: ''})).toEqual([1])
    expect(reducer([1], actions.insert([]))).toEqual([1])
    expect(reducer([1], actions.insert(0))).toEqual([1, 0])
    expect(reducer([1], actions.insert([1, 0]))).toEqual([1, 1, 0])
  })
})
