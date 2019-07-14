import render from 'nano_spa/render'

export default () => {
  return render`
    <Box
      grid
      padding='3rem'
      grid-gap='1rem'
    >
      <h3 style='justify-self: center;'>This page is Left empty.</h3>
      <p>navigate to /handler-name</p>
      <p style='line-height: 1.5rem;'>
        where "handler-name" is the same as handler name but in lowercase
        and replace '@' with '-'<br />
        Example: <Router::link href='/router-link'><a>/router-link</a><//>
      </p>
    <//>
  `
}
