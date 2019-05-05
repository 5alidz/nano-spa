import lib from './src/index.js'

const { render, router } = lib

router(document.getElementById('app'), {
  '/': () => render`<${Home} h1='Hello World'/>`,
  '/about': () => render`<${About} />`,
  '/contact': () => render`<${Contact} />`,
  '*': () => render`<${NotFound} />`,
  _config: {
    head: {
      '/': () => render`<title>Home</title>`,
      '/about': () => render`<title>About</title>`,
      '/contact': () => render`<title>Contact</title>`,
    },
    plugins: [{name: 'my-plugin'}]
  }
})

function Home(props) {return () => render`<div>Home<h1>-${props.h1}</h1></div>`}
function About() {return () => render`<div>About</div>`}
function Contact() {return () => render`<div>Contact</div>`}
function NotFound() {return () => render`<div>404</div>`}

