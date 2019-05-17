import lib from '../../src/index.js'
const { render } = lib

export function Contact() {
  return () => render`
    <div id='contact'>
      <h1>Contact</h1>
    </div>
  `
}


