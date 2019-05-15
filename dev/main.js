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
      '*': () => render`
        <meta name='author' content='5alidz' />
        <meta name='author' content='5alidz' />
      `
    },
    on_route_change: (current) => {
      console.log(current)
    }
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

async function test_async({ timer }) {
  const msg = await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('hello')
    }, timer)
  })
  return render`
    <div>${msg}</div>
  `
}

async function with_data({ id }) {
  const data = await fetch('https://jsonplaceholder.typicode.com/todos/' + id)
  const json = await data.json()
  return render`
    <div>
      <h3>${json.title}</h3>
      <p>${json.completed ? 'completed' : 'progress'}</p>
    </div>
  `
}

function spinner() {
  return render`
    <p>...</p>
  `
}

function todo({ id }) {
  return render`
    <${with_data}
      id=${id}
      placeholder=${ () => render`<${spinner} />` }/>
  `
}

function Home({ content }) {
  return () => render`
    <div>
      <h1>Home</h1>
      <p>${content}</p>
      <${todo} id=1 />
      <${todo} id=2 />
      <${todo} id=3 />
      <${test_async}
        timer=${500}
        placeholder=${() => render`<${spinner} />`} />
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
