#!/usr/bin/env node
const fs = require('fs');
const {paths} = require('./util');

[
    '/reports',
    '/images/source',
    '/images/test',
    '/images/diff',
].forEach(dir => {
    fs.mkdirSync(paths.root + dir, {recursive: true});
});

fs.copyFileSync(`${__dirname}/template/vrt.config.js`, `${paths.appRoot}/vrt.config.js`);