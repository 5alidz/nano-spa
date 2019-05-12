export default (() => {
  const dom = document.getElementsByTagName('head')[0]
  const _clean = maybe_arr => Array.isArray(maybe_arr) ? maybe_arr : [maybe_arr].filter(_ => _)
  const append = arr => arr.map(node => dom.appendChild(node))
  let _head = []
  return {
    set: (arr) => {
      const clean = _clean(arr)
      _head.map(el => dom.removeChild(el))
      append(clean)
      _head = clean
    },
    default: (arr) => { append(_clean(arr)) }
  }
})()
