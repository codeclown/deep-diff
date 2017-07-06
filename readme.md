# deepDiff

Diff deep objects and get an array of differences.

Needed for personal project. At this time is not suitable for general production usage.


## Signature

```
deepDiff(actual, expected, [options])
```


## Usage

```
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

const differences = deepDiff(actual, expected)
```

Differences would return:

```
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
```


### `options.ignore`

Use `options.ignore` to ignore diffing specific keys:

```
const expected = {
  foo: 'test',
  items: ['maybe', 'yes']
}

const actual = {
  foo: 'test...',
  items: ['maybe', { testing: true }],
}

const differences = deepDiff(actual, expected, { ignore: ['items'] })
```

Differences would return:

```
{
  path: ['foo'],
  expected: { value: 'test' },
  actual: { value: 'test...' }
}
```


## Testing

```
npm test
```


## License

MIT
