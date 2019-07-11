#!/usr/bin/env node
const [,, command, ...args] = process.argv

const args_obj = (() => {
  const aliases = {'-p': 'port'}
  const a_array = []
  for(let i = 0; i < args.length; i += 2) {
    a_array.push([args[i], args[i+1]])
  }
  const transform = (acc, curr) => {
    if(aliases[curr[0]]) {acc[aliases[curr[0]]] = curr[1]}
    return acc
  }
  return a_array.reduce(transform, {})
})()

if(command == 'start') {
  require('../cli/start.js')(args_obj)
} else if(command == 'build') {
  require('../cli/build.js')(args_obj)
}

