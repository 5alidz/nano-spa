import render from 'nano_spa/render'

export default () => {
  return render`
    <div style='padding: 3rem; text-align: center;'>
      <h3>This page is Left empty.</h3>
      <p>navigate to /(any handler name but in lower case)</p>
    </div>
  `
}
