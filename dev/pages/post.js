import lib from '../../src/index.js'
const { render } = lib

export function Post({ matches }) {
  console.log(`i ${matches} executed!!`)
  return render`
    <div>
      i'm a Post!! ${JSON.stringify(matches)}
    </div>
  `
}

