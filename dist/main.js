const program = require('commander');
const install = require('../bin/install.js');
program.command('install').description('install template').alias('i').action(() => {
  console.log('action');
  install();
});