#!/usr/bin/env node

const [,, ...args] = process.argv
const path = require('path')

if(args[0] == 'start') {
  console.log(path.resolve('../../'))
}
