import R from 'ramda'

const mapWithIndex = R.addIndex(R.map)
const bothEqual = ([a, b]) => a === b
const toTypeObject = value => ({ type: R.type(value) })
const toValueObject = value => ({ value })
const rejectNil = R.reject(R.isNil)

const typesDiffer = R.pipe(
  R.props(['expected', 'actual']),
  R.map(R.type),
  R.complement(bothEqual)
)

const evolveToTypeObjects = R.evolve({
  expected: toTypeObject,
  actual: toTypeObject
})

const isArray = R.pipe(
  R.prop('actual'),
  R.type,
  R.equals('Array')
)

const processArray = recursive => ({ actual, path }) => mapWithIndex(R.pipe(
  R.nthArg(1),
  R.append(R.__, path),
  recursive
), actual)

const isObject = R.pipe(
  R.prop('actual'),
  R.type,
  R.equals('Object')
)

const processObject = (recursive, ignore) => R.pipe(
  R.evolve({
    actual: R.pipe(
      R.keys,
      R.reject(R.contains(R.__, ignore))
    )
  }),
  ({ actual, path }) => R.map(R.pipe(
    R.append(R.__, path),
    recursive
  ), actual)
)

const valuesDontEqual = R.pipe(
  R.props(['expected', 'actual']),
  R.complement(bothEqual)
)

const evolveToValueObjects = R.evolve({
  expected: toValueObject,
  actual: toValueObject
})

export default (actual, expected, options = { ignore: [] }) => {
  const recursive = path => R.compose(
    ensureArray,
    R.cond(conditions),
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
    expected: R.path(path, expected),
    actual: R.path(path, actual)
  })

  const initialPath = []

  return R.compose(
    rejectNil,
    R.flatten,
    recursive
  )(initialPath)
}
