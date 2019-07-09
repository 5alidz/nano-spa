#!/usr/bin/env node
const [,, command, ...args] = process.argv

if(command == 'start') {
  require('../cli/start.js')(args)
} else if(command == 'build') {
  require('../cli/build.js')(args)
}

