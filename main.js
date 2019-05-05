import lib from './src/index.js'

const { render, router } = lib

router(document.getElementById('app'), {
  '/': () => render`<${Home} content='Hello World'/>`,
  '/about': () => render`<${About} />`,
  '/contact': () => render`<${Contact} />`,
  '*': () => render`<${NotFound} />`,
  _config: {
    head: {
      '/': () => render`
        <title>Home</title>
        <meta name='description' content='our home page'/>
      `,
      '/about': () => render`<title>About</title>`,
    },
    plugins: [{name: 'my-plugin'}]
  }
})

function Home({ content }) {
  return () => render`
    <div>
      <h1>Home</h1>
      <p>${content}</p>
    </div>
  `
}
function About() {
  return () => render`
    <div>
      <h1>About</h1>
    </div>
  `
}
function Contact() {
  return () => render`
    <div>
      <h1>Contact</h1>
    </div>
  `
}
function NotFound() {
  return render`
    <h1 style='margin: 0 auto;'>404</h1>
  `
}
