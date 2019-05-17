import lib from '../../src/index.js'
const { render } = lib

export function NotFound() {
  return render`
    <h1 style='text-align: center; color: red;'>404</h1>
  `
}

export const defaultHead = () => render`
  <meta name='author' content='5alidz' />
  <meta name='author' content='5alidz' />
`
