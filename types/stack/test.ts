import * as Stack from '.'
import {Builders} from '../..'

describe('Stack type', () => {
  const {
    initialState,
    actions,
    reducer,
    selectors,
  } = Builders.build(Stack.New<number>())
  const custom = Builders.build(Stack.New({initialState: [0, 1]}))

  it('should include initial state as expected', () => {
    expect(initialState).toEqual([])
    expect(custom.initialState).toEqual([0, 1])
  })

  it('should build reducer as expected', () => {
    expect(reducer([1], {type: ''})).toEqual([1])
    expect(reducer([1], actions.insert([]))).toEqual([1])
    expect(reducer([1], actions.insert(0))).toEqual([0, 1])
    expect(reducer([1], actions.insert([1, 0]))).toEqual([0, 1, 1])
    expect(reducer([1], actions.pop())).toEqual([])
    expect(reducer([], actions.pop())).toEqual([])
    expect(reducer([1], actions.reset())).toEqual([])
    expect(reducer([1], actions.set([0]))).toEqual([0])
    expect(reducer([1], actions.clear())).toEqual([])
    expect(reducer([], actions.clear())).toEqual([])
  })

  it('should build selectors as expected', () => {
    expect(selectors.peek([1, 0], 1)).toEqual([1])
    expect(selectors.peekOne([1, 0])).toBe(1)
  })
})
