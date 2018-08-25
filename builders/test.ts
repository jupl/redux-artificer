import {build} from '.'

test('Builder should fail if an unknown type is passed', () => {
  expect(() => build(undefined!)).toThrow('Unmatched type')
  expect(() => build({})).toThrow('Unmatched type')
})
