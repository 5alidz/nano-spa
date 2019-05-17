import lib from '../../src/index.js'
const { render } = lib

export function About() {
  return () => render`
    <div id='about'>
      <h1>About</h1>
    </div>
  `
}

export const AboutHead = () => render`<title>About</title>`
