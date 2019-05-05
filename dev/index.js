import lib from '../src/index.js'

const { render, router } = lib

router(document.getElementById('app'), {
  '/': () => render`<${Home} />`,
  '/about': () => render`<${About} />`,
  '/contact': () => render`<${Contact} />`,
  _config: {
    head: {
      '/': () => render`<title>Home</title>`,
      '/about': () => render`<title>About</title>`,
      '/contact': () => render`<title>Contact</title>`,
    },
    plugins: [{name: 'my-plugin'}]
  }
})

function Home() {return () => render`<div>Home</div>`}
function About() {return () => render`<div>About</div>`}
function Contact() {return () => render`<div>Contact</div>`}
