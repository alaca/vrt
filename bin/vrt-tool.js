#!/usr/bin/env node
const {Command} = require('commander');

const program = new Command();

program.executableDir('../lib');

// Initialize
program.command('init', 'Initialize VRT', {executableFile: 'init'});
program.command('setup', 'Setup VRT', {executableFile: 'setup'});
program.command('reports', 'List VRT reports', {executableFile: 'reports'});
program.command('test', 'Run VRT', {executableFile: 'test'});
