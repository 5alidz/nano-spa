const chalk = require('chalk')
const cli_spinners = require('cli-spinners')
const ora = require('ora')
const fs = require('fs')
const path = require('path')
const clear = require('clear')

const c = m => `[ ${m} ]`
const create_title = color => title => c(chalk[color].bold(title.toUpperCase()))

const red = create_title('red')
const green = create_title('green')
const yellow = create_title('yellow')
const white = create_title('white')

const create_spinner = (msg) => {
  const spinner = ora({
    spinner: cli_spinners.dots7,
    text: msg,
    color: 'cyan'
  })
  return spinner
}

exports.utils = {
  red, green, yellow, white,
  normal_blue: tx => chalk.blue.bold(tx)
}

exports.log = (err, stats) => {
  clear()
  const _log = console.log
  const s = create_spinner('building...')
  s.start()
  // check for custom handlers dir [critical for compilation] used by import()
  if(!fs.existsSync(path.resolve('.', 'handlers'))) {
    s.stop()
    _log(red('error'), 'handlers directory is required.')
    return
  }
  // check for fatal webpack errors. should not happend, EVER!
  if(err) {
    _log(red('error'), err.stack || err)
    if(err.details) {
      _log(red('error'), 'compilation error')
      _log(white('info'), `\t ${err.details}`)
    }
    return s.stop()
  } else {
    const info = stats.toJson()
    if(stats.hasErrors()) {
      _log(red('error'), ...info.errors)
    }
    if(stats.hasWarnings()) {
      _log(yellow('warning'), ...info.warnings)
    }
    s.stop()
    _log(green('done'), `built in ${info.time}ms`)
  }
}
