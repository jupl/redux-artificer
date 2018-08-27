import * as List from '.'
import {Builders} from '../..'

describe('List type', () => {
  const {
    initialState,
    actions,
    reducer,
    selectors,
  } = Builders.build(List.New<number>())
  const custom = Builders.build(List.New({initialState: [1]}))

  it('should include initial state as expected', () => {
    expect(initialState).toEqual([])
    expect(custom.initialState).toEqual([1])
  })

  it('should build reducer as expected', () => {
    const empty: number[] = []
    expect(reducer(undefined!, {type: ''})).toEqual([])
    expect(reducer([1], actions.clear())).toEqual(empty)
    expect(reducer(empty, actions.clear())).toEqual(empty)
    expect(reducer(empty, actions.set(empty))).toEqual(empty)
    expect(reducer([1], actions.insert([]))).toEqual([1])
    expect(reducer([1], actions.insert([0, 1]))).toEqual([1, 0, 1])
    expect(reducer([1], actions.remove(0))).toEqual([1])
    expect(reducer([1, 1, 0, 0], actions.remove(-1))).toEqual([1, 1, 0, 0])
    expect(reducer([1, 1, 0, 0], actions.remove([0, 1]))).toEqual(empty)
    expect(reducer([1, 1, 0, 0], actions.removeOnce([-1, 0, 1])))
      .toEqual([1, 0])
  })

  it('should build selectors as expected', () => {
    expect(selectors.contains([1], 0)).toBe(false)
    expect(selectors.empty([])).toBe(true)
  })
})
