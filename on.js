import _global from './internal.global.js'

export default function on(string, cb) {
  const single = (_string, _cb) => _global.handlers[_string] = _cb
  return Array.isArray(string)
    ? string.forEach(([_s, _c]) => single(_s, _c))
    : single(string, cb)
}
