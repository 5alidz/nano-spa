import lib from '../../src/index.js'
const { render } = lib

export function HomeHead() {
    return render`
      <title>Home</title>
      <meta name='description' content='our home page'/>
    `
}
async function test_async({ timer }) {
  const msg = await new Promise((resolve) => {
    setTimeout(() => {
      resolve('hello')
    }, timer)
  })
  const say_hi = () => console.log('hi')
  return render`
    <div onload=${say_hi}>${msg}</div>
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

export function Home({ content }) {
  return () => render`
    <div id='home'>
      <h1>Home</h1>
      <p>${content}</p>
      <${todo} id=1 />
      <${todo} id=2 />
      <${todo} id=3 />
      <${test_async}
        timer=${500}
        placeholder=${() => render`<${spinner} />`} />
      <Link href='/about'>
        <a>read more...</a>
      </Link>
      <Link href'/posts'>
        <a>--POSTS</a>
      </Link>
    </div>
  `
}
