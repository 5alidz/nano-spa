import lib from './src/index.js'

const { render, router } = lib

router(document.getElementById('app'), {
  '/': () => render`<${Home} content='Hello World'/>`,
  '/about': () => render`<${About} />`,
  '/contact': () => render`<${Contact} />`,
  '/post': ({ query }) => render`<${Post} query=${query}/>`,
  '/posts': () => render`<${Posts} />`,
  '*': () => render`<${NotFound} />`,
  _config: {
    head: {
      '/': () => render`
        <title>Home</title>
        <meta name='description' content='our home page'/>
      `,
      '/about': () => render`<title>About</title>`,
      '/post': ({ query }) => render`<title>${query.name}</title>`,
    },
    plugins: [{name: 'my-plugin'}]
  }
})

function Post({ query }) {
  return render`
    <div>
      <p>Post by <strong>${query.name}</strong></p>
      <h1>${query.age}</h1>
    </div>
  `
}
function Posts() {
  return render`
    <div>
      all the posts you want
    </div>
  `
}
function Home({ content }) {
  return () => render`
    <div>
      <h1>Home</h1>
      <p>${content}</p>
      <Link href='/posts'>
        <a>all posts</a>
      </Link>
      <br />
      <Link href='/post?name=khaled&age=42' as='/posts/khaled'>
        <a>Post</a>
      </Link>
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
