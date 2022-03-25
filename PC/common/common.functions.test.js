import { f, uniq } from './common.functions.js'

describe('uniq', () => {
  it('should remove duplicates from an array', () => {
    const dupArr = [0, 1, 0, 2, { a: 'a' }, 1, 'a', 'a', 10, 12, 'ab', 'b']

    expect(uniq(dupArr)).toEqual([0, 1, 2, { a: 'a' }, 'a', 10, 12, 'ab', 'b'])
  })
})
