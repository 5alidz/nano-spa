import lib from '../../src/index.js'
import { posts_data } from './posts.js'
const { render } = lib

export function Post({ matches }) {
  const { title, id } = posts_data[matches[0]]
  return render`
    <div>
      <h1>${id} -- ${title}</h1>
    </div>
  `
}

export function PostHead(matches) {
  const { title } = posts_data[matches[0]]
  return render`
    <title>${title}</title>
  `
}
