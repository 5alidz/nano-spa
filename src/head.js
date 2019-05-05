export default (() => {
  const dom = document.getElementsByTagName('head')[0]
  let _head = []
  return {
    set: (arr) => {
      const clean = Array.isArray(arr) ? arr : [arr].filter(_ => _)
      _head.map(el => dom.removeChild(el))
      clean.map(node => dom.appendChild(node))
      _head = clean
    }
  }
})()
