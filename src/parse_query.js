export default function(path) {
  const arr = path.split('?')
  const q = arr[1] ? arr[1].split('&') : undefined
  return q
    ? q.map(str => str.split('=')).reduce((acc, [key, value]) => {
        Object.defineProperty(acc, key, { value })
        return acc
      }, {})
    : undefined
}
