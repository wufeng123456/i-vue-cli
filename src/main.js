const program = require('commander')
const install = require('../bin/install.js')
const list = require('../bin/list.js')
program.command('install')
        .description('install template')
        .alias('i')
        .action(() => {
          install()
        })

program.command('list')
        .description('list template')
        .alias('l')
        .action(() => {
          list()
        })
 
program.parse(process.argv)
