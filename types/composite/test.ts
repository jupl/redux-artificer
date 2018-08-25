import * as Types from '..'
import * as Builders from '../../builders'

// tslint:disable:no-null-keyword no-unbound-method

describe('Composite type', () => {
  const {initialState, actions, reducer, selectors} = Builders.build({
    combo: {
      nested: {
        flag: Types.Flag.New(),
      },
      optional: Types.Optional.New<number>(),
    },
    list: Types.List.New<number>(),
    value: Types.Value.New({initialState: 1}),
  }, {actionType: '@remix'})

  it('should include initial state as expected', () => {
    expect(initialState).toEqual({
      combo: {
        nested: {
          flag: false,
        },
        optional: null,
      },
      list: [],
      value: 1,
    })
  })

  it('should build actions as expected', () => {
    expect(`${actions.combo.optional.unset}`)
      .toEqual('@remix.combo.optional.unset')
    expect(actions.value.set(1)).toEqual({
      payload: 1,
      type: '@remix.value.set',
    })
  })

  it('should build reducer as expected', () => {
    const state = {
      combo: {
        nested: {
          flag: false,
        },
        optional: null,
      },
      list: [1],
      value: 0,
    }
    expect(reducer(state, {type: ''})).toBe(state)
    expect(reducer(state, actions.list.insert(0))).toEqual({
      combo: {
        nested: {
          flag: false,
        },
        optional: null,
      },
      list: [1, 0],
      value: 0,
    })
    expect(reducer(state, actions.value.reset())).toEqual({
      combo: {
        nested: {
          flag: false,
        },
        optional: null,
      },
      list: [1],
      value: 1,
    })
    expect(reducer(state, actions.combo.nested.flag.toggle())).toEqual({
      combo: {
        nested: {
          flag: true,
        },
        optional: null,
      },
      list: [1],
      value: 0,
    })
  })

  it('should build selectors as expected', () => {
    const state = {
      combo: {
        nested: {
          flag: true,
        },
        optional: null,
      },
      list: [1],
      value: 0,
    }
    expect(selectors.list.getAt(state, 0)).toBe(undefined)
    expect(selectors.value.get(state)).toBe(0)
    expect(selectors.combo.nested.flag.get(state)).toBe(true)
  })
})
