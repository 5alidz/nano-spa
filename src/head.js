export default (() => {
  const dom = document.getElementsByTagName('head')[0]
  const _clean = maybe_arr => Array.isArray(maybe_arr) ? maybe_arr : [maybe_arr].filter(_ => _)
  const append = arr => arr.map(node => dom.appendChild(node))
  let _head = []
  return {
    set: (arr, presis) => {
      const clean = _clean(arr)
      if(!presis) {
        _head.map(el => dom.removeChild(el))
        _head = clean
      }
      append(clean)
    }
  }
})()
