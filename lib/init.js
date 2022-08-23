const fs = require('fs');
// Copy settings template to the app root dir
fs.copyFile('./template/vrt.config.js', `${process.env.PWD}/vrt.config.js`, (err) => {
    if (err)
        throw err;

    console.log('vrt.config.js file created. Please update the file before using vrt');
});