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
      '/post': ({query}) => render`<title>${query.title}-${query.num}</title>`,
    },
    plugins: []
  }
})

function Post({ query }) {
  return render`
    <div>
      <h3>${query.num}</h3>
      <p>${query.title}</p>
    </div>
  `
}
function Posts() {
  return render`
    <div>
      <h1>all the posts you want</h1>
      <Link href='/post?num=100&title=img' as='/posts/product'>
        <img src="https://via.placeholder.com/150" />
      </Link>
      ${[...Array(20).keys()].map(n => render`
        <div>
          <h3>i'm post number-${n}</h3>
          <Link href=${`/post?num=${n}&title=hiiiii`} as=${`/posts/${n}`}>
            <a>Read More</a>
          </Link>
        </div>
      `)}
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
