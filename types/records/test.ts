import * as Records from '.'
import {Builders} from '../..'

// tslint:disable:no-magic-numbers

interface Record {
  id: number
  value: string
}

describe('Records type', () => {
  const {
    initialState,
    actions,
    reducer,
    selectors,
  } = Builders.build(Records.New<Record, number>({
    equals: (a, b) => a.id === b.id && a.value === b.value,
    getId: ({id}) => id,
  }))

  it('should include initial state as expected', () => {
    expect(initialState).toEqual([])
  })

  it('should build reducer as expected', () => {
    const state = [
      {id: 1, value: 'Record 1'},
      {id: 2, value: 'Record 2'},
      {id: 3, value: 'Record 3'},
    ]
    expect(reducer(state, {type: ''})).toBe(state)
    expect(reducer(state, actions.insert({id: 1, value: ''}))).toBe(state)
    expect(reducer(state, actions.insert({id: 4, value: 'Record 4'})))
      .toEqual([...state, {id: 4, value: 'Record 4'}])
    expect(reducer(state, actions.remove([1, 2]))).toEqual([
      {id: 3, value: 'Record 3'},
    ])
    expect(reducer(state, actions.remove([3, 4]))).toEqual([
      {id: 1, value: 'Record 1'},
      {id: 2, value: 'Record 2'},
    ])
    expect(reducer(state, actions.remove([5, 6]))).toBe(state)
    expect(reducer(state, actions.update({
      id: 4,
      value: 'Record 4',
    }))).toBe(state)
    expect(reducer(state, actions.update([
      {id: 3, value: 'Record 3a'},
      {id: 4, value: 'Record 4'},
    ]))).toEqual([
      {id: 1, value: 'Record 1'},
      {id: 2, value: 'Record 2'},
      {id: 3, value: 'Record 3a'},
    ])
    expect(reducer(state, actions.upsert([
      {id: 1, value: 'Record 1'},
      {id: 3, value: 'Record 3a'},
    ]))).toEqual([
      {id: 1, value: 'Record 1'},
      {id: 2, value: 'Record 2'},
      {id: 3, value: 'Record 3a'},
    ])
    expect(reducer(state, actions.upsert({
      id: 3,
      value: 'Record 3a',
    }))).toEqual([
      {id: 1, value: 'Record 1'},
      {id: 2, value: 'Record 2'},
      {id: 3, value: 'Record 3a'},
    ])
    expect(reducer(state, actions.upsert({
      id: 4,
      value: 'Record 4',
    }))).toEqual([...state, {id: 4, value: 'Record 4'}])
    expect(reducer(state, actions.upsert([
      {id: 3, value: 'Record 3a'},
      {id: 4, value: 'Record 4'},
    ]))).toEqual([
      {id: 1, value: 'Record 1'},
      {id: 2, value: 'Record 2'},
      {id: 3, value: 'Record 3a'},
      {id: 4, value: 'Record 4'},
    ])
  })

  it('should build selectors as expected', () => {
    const state = [
      {id: 1, value: 'Record 1'},
      {id: 2, value: 'Record 2'},
      {id: 3, value: 'Record 3'},
    ]
    expect(selectors.getById(state, 1)).toEqual({id: 1, value: 'Record 1'})
    expect(selectors.getById(state, 0)).toEqual(undefined)
  })
})
