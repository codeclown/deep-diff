import test from 'tape'
import deepDiff from '.'

test('deepDiff', t => {
  const expected = {
    foo: 'test',
    items: ['maybe', 'yes'],
    meta: 'foobar'
  }

  const actual = {
    foo: 'test...',
    items: ['maybe', { testing: true }],
    meta: []
  }

  t.deepEqual([
    {
      path: ['foo'],
      expected: { value: 'test' },
      actual: { value: 'test...' }
    },
    {
      path: ['items', 1],
      expected: { type: 'String' },
      actual: { type: 'Object' }
    },
    {
      path: ['meta'],
      expected: { type: 'String' },
      actual: { type: 'Array' }
    }
  ], deepDiff(actual, expected))

  t.deepEqual([
    {
      path: ['foo'],
      expected: { value: 'test' },
      actual: { value: 'test...' }
    },
    {
      path: ['items', 1],
      expected: { type: 'String' },
      actual: { type: 'Object' }
    }
  ], deepDiff(actual, expected, { ignore: ['meta'] }))

  t.deepEqual([
    {
      path: [1],
      expected: { type: 'String' },
      actual: { type: 'Object' }
    }
  ], deepDiff(actual.items, expected.items))

  t.deepEqual([
    {
      path: [],
      expected: { value: 'first' },
      actual: { value: 'second' }
    }
  ], deepDiff('second', 'first'))

  t.deepEqual([], deepDiff('nice', 'nice'))

  t.end()
})
