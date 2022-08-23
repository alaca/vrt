#!/usr/bin/env node
const crypto = require('crypto');

const paths = {
    appRoot: process.env.PWD,
    root: `${process.env.PWD}/.vrt`,
    reports: `${process.env.PWD}/.vrt/reports`,
    source: `${process.env.PWD}/.vrt/images/source`,
    test: `${process.env.PWD}/.vrt/images/test`,
    diff: `${process.env.PWD}/.vrt/images/diff`,
    configFile: `${process.env.PWD}/vrt.config.js`,
};

const log = message => console.log(message);
log.success = message => console.log(`\x1b[32m${message}\x1b[0m`);
log.error = message => console.log(`\x1b[31m${message}\x1b[0m`);
log.ok = message => console.log(`\x1b[32m✔\x1b[0m ${message}`);
log.failed = message => console.log(`\x1b[31m✖\x1b[0m ${message}`);

const hash = (name) => crypto.createHash('md5').update(name).digest('hex');

module.exports = {
    log,
    hash,
    paths,
};