const fs = require('fs');
const puppeteer = require('puppeteer');
const {log, hash} = require('./util');
// VRT config file
const configPath = `${process.env.PWD}/vrt.config.js`;

if (!fs.existsSync(configPath)) {
    console.log('VRT config file does not exist! Please run `npm run vrt:init` command');
    return;
}

// Load VRT config
const config = require(configPath);

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log(`Testing scenarios: \x1b[32m${config.scenarios.length}\x1b[0m`);

    for (const scenario in config.scenarios) {
        try {
            const {name, sourceUrl, onPage} = config.scenarios[scenario];
            const sourceFile = `./images/source/${hash(name)}.png`;
            // Go to page
            await page.goto(sourceUrl, {waitUntil: 'domcontentloaded'});
            // Handle scenario extra stuff
            if (onPage) {
                await onPage(page);
            }
            // Save screenshot
            await page.screenshot({path: sourceFile, fullPage: true});

            log.ok(name);
        } catch (error) {
            log.error(error);
        }
    }

    await browser.close();
})();