import {Builders} from '..'
import * as List from './list'

interface Custom {
  id: number
  value: string
}

describe('List type', () => {
  const {
    initialState,
    actions,
    reducer,
    selectors,
  } = Builders.build(List.New<number>())
  const custom = Builders.build(List.New<Custom, number>({
    getId: ({id}) => id,
    initialState: [{id: 1, value: '1'}],
  }))

  it('should include initial state as expected', () => {
    expect(initialState).toEqual([])
    expect(custom.initialState).toEqual([{id: 1, value: '1'}])
  })

  it('should build reducer as expected', () => {
    const empty: number[] = []
    expect(reducer([1], {type: ''})).toEqual([1])
    expect(reducer([1], actions.clear())).toEqual(empty)
    expect(reducer(empty, actions.clear())).toEqual(empty)
    expect(reducer([1], actions.insert([]))).toEqual([1])
    expect(reducer([1], actions.insert([0, 1]))).toEqual([1, 0, 1])
    expect(reducer([1], actions.remove(0))).toEqual([1])
    expect(reducer([1, 1, 0, 0], actions.remove([0, 1]))).toEqual([1, 0])
    expect(reducer([1, 1, 0, 0], actions.removeAll(-1))).toEqual([1, 1, 0, 0])
    expect(reducer([1, 1, 0, 0], actions.removeAll([0, 1]))).toEqual(empty)
  })

  it('should build selectors as expected', () => {
    expect(selectors.getAt([1], 1)).toBe(1)
    expect(selectors.contains([1], 0)).toBe(false)
  })
})
