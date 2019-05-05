const { isEqual } = window._

export default function test(condition) {
  const title_css = color => `background-color: ${color}; color: white;`
  const desc_css = color => `background-color: ${color == 'green' ? 'rgba(0, 255, 0, 0.1)' : 'rgba(255, 0, 0, 0.1)'}; color: ${color};`
  let t0 = performance.now()
  function expect(expr) {
    let t1 = performance.now()
    return {
      to_return: _val => {
        const message = flag => {
          console.log(`%c ${flag} %c\t${(t1 - t0).toFixed(2)}ms\t${condition}`,
              title_css(flag === 'PASS' ? 'green' : 'red'),
              desc_css(flag === 'PASS' ? 'green' : 'red')
          )
        }
        return isEqual(expr, _val) ? message('PASS') : message('FAIL')
      },
      expect: expect
    }
  }
  return {
    expect
  }
}
