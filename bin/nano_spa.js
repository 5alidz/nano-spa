#!/usr/bin/env node
const [,, command, ...args] = process.argv
/*
const project_dir = path.resolve('.')
const handlers_path = path.join(project_dir, 'src/handlers')
*/

if(command == 'start') {
  require('../cli/start.js')(args)
} else if(command == 'build') {
  require('../cli/build.js')(args)
}

