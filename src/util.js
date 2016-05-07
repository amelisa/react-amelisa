const isBrowser = typeof document !== 'undefined'
const isServer =
  !isBrowser &&
  typeof process !== 'undefined' &&
  process.title !== 'browser'

function deepClone (object) {
  if (object == null || typeof object !== 'object') return object

  return JSON.parse(JSON.stringify(object))
}

function fastEqual (object1, object2) {
  return JSON.stringify(object1) === JSON.stringify(object2)
}

export default {
  deepClone,
  fastEqual,
  isBrowser,
  isServer
}
