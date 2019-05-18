import lib from '../../src/index.js'
const { render } = lib

export function Post({ matches }) {
  return render`
    <div>
      i'm a Post!! ${JSON.stringify(matches)}
    </div>
  `
}

