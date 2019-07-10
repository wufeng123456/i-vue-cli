const program = require('commander');
const install = require('../bin/install.js');
const list = require('../bin/list.js');
const init = require('../bin/init.js');

program.command('install').description('install template').alias('i').action(() => {
  install();
});

program.command('list').description('list template').alias('l').action(() => {
  list();
});

program.command('init').description('init template').alias('i').action(() => {
  init();
});

program.parse(process.argv);