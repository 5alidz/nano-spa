#!/usr/bin/env node

const fs = require('fs')
const [,, command, ...args] = process.argv
const path = require('path')

const commands = ['start', 'build', 'deploy']
const context = {}

const actions = {
  start(args) {
    console.log(path.resolve(__dirname, '..'))
  },
  build(args) {},
  deploy(args) {},
}

if(!actions[command]) {
  console.log('unknown arguments. --help to get more info')
} else {
  actions[command](args)
}
