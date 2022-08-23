#!/usr/bin/env node
const fs = require('fs');
const PNG = require('pngjs').PNG;
const puppeteer = require('puppeteer');
const pixelmatch = require('pixelmatch');
const {log, hash, paths} = require('./util');

if (!fs.existsSync(paths.configFile)) {
    console.log('Config file does not exist! Please run npm run \x1b[32mvrt init\x1b[0m command');
    return;
}

// Load VRT config
const config = require(paths.configFile);

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log(`Testing scenarios: \x1b[32m${config.scenarios.length}\x1b[0m`);

    for (const scenario in config.scenarios) {
        try {
            const {name, sourceUrl, testUrl, onPage} = config.scenarios[scenario];
            const sourceFile = `${paths.source}/${hash(name)}.png`;
            const testFile = `${paths.test}/${hash(name)}.png`;
            const diffFile = `${paths.diff}/${hash(name)}.png`;

            // Visit test URL
            await page.goto(testUrl, {waitUntil: "domcontentloaded"});

            if (onPage) {
                await onPage(page);
            }

            // Make screenshot
            await page.screenshot({path: testFile, fullPage: true});

            const source_scenario = PNG.sync.read(fs.readFileSync(sourceFile));
            const test_scenario = PNG.sync.read(fs.readFileSync(testFile));
            const {width, height} = source_scenario;
            const diff = new PNG({width, height});

            try {
                const match = pixelmatch(
                    source_scenario.data,
                    test_scenario.data,
                    diff.data,
                    width,
                    height,
                    {
                        threshold: 0.1,
                    },
                );

                if (match) {
                    fs.writeFileSync(diffFile, PNG.sync.write(diff));

                    const reportsFile = `${paths.reports}/${hash(name)}.html`;

                    // Copy reports template
                    fs.copyFileSync(`${__dirname}/template/report.html`, reportsFile);

                    const content = fs.readFileSync(reportsFile)
                        .toString()
                        .replace('{{NAME}}', name)
                        .replace('{{DIFF_FILE}}', diffFile)
                        .replace('{{SOURCE_URL}}', sourceUrl)
                        .replace('{{SOURCE_FILE}}', sourceFile)
                        .replace('{{TEST_URL}}', testUrl)
                        .replace('{{TEST_FILE}}', testFile);

                    fs.writeFileSync(reportsFile, content);

                    log.failed(name);
                    log(`file://${reportsFile}`);
                } else {
                    log.ok(name);
                }
            } catch (error) {
                log.failed(name);
                log.error(error);
                log(`Source: file://${sourceFile}`);
                log(`Test: file://${testFile}`);
            }

        } catch (error) {
            log.error(error);
        }
    }

    await browser.close();
})();