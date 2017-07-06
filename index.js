import {
  __,
  addIndex,
  append,
  complement,
  compose,
  cond,
  contains,
  equals,
  evolve,
  flatten,
  isNil,
  keys,
  map,
  nthArg,
  path as pathDeep,
  pipe,
  prop,
  props,
  reject,
  type
} from 'ramda'

const mapWithIndex = addIndex(map)
const bothEqual = ([a, b]) => a === b
const toTypeObject = value => ({ type: type(value) })
const toValueObject = value => ({ value })
const rejectNil = reject(isNil)

const typesDiffer = pipe(
  props(['expected', 'actual']),
  map(type),
  complement(bothEqual)
)

const evolveToTypeObjects = evolve({
  expected: toTypeObject,
  actual: toTypeObject
})

const isArray = pipe(
  prop('actual'),
  type,
  equals('Array')
)

const processArray = recursive => ({ actual, path }) => mapWithIndex(pipe(
  nthArg(1),
  append(__, path),
  recursive
), actual)

const isObject = pipe(
  prop('actual'),
  type,
  equals('Object')
)

const processObject = (recursive, ignore) => pipe(
  evolve({
    actual: pipe(
      keys,
      reject(contains(__, ignore))
    )
  }),
  ({ actual, path }) => map(pipe(
    append(__, path),
    recursive
  ), actual)
)

const valuesDontEqual = pipe(
  props(['expected', 'actual']),
  complement(bothEqual)
)

const evolveToValueObjects = evolve({
  expected: toValueObject,
  actual: toValueObject
})

export default (actual, expected, options = { ignore: [] }) => {
  const recursive = path => compose(
    ensureArray,
    cond(conditions),
    extractFromPath
  )(path)

  const ensureArray = thing => ([thing])

  const conditions = [
    [typesDiffer, evolveToTypeObjects],
    [isArray, processArray(recursive)],
    [isObject, processObject(recursive, options.ignore)],
    [valuesDontEqual, evolveToValueObjects]
  ]

  const extractFromPath = path => ({
    path,
    expected: pathDeep(path, expected),
    actual: pathDeep(path, actual)
  })

  const initialPath = []

  return compose(
    rejectNil,
    flatten,
    recursive
  )(initialPath)
}
