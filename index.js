const fs = require('fs');
const PNG = require('pngjs').PNG;
const puppeteer = require('puppeteer');
const pixelmatch = require('pixelmatch');
const {log, hash} = require('./util');
// VRT config file
const configFile = `${process.env.PWD}/vrt.config.js`;

if (!fs.existsSync(configFile)) {
    console.log('Config file does not exist! Please run npm run vrt:init command');
    return;
}

// Load VRT config
const config = require(configFile);

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    console.log(`Testing scenarios: \x1b[32m${config.scenarios.length}\x1b[0m`);

    for (const scenario in config.scenarios) {
        try {
            const {name, sourceUrl, testUrl, onPage} = config.scenarios[scenario];
            const sourceFile = `${process.env.PWD}/images/source/${hash(name)}.png`;
            const testFile = `${process.env.PWD}/images/test/${hash(name)}.png`;
            const diffFile = `${process.env.PWD}/images/diff/${hash(name)}.png`;

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

                    const reportsFile = `${process.env.PWD}/reports/${hash(name)}.html`;

                    // Copy reports template
                    fs.copyFile('./template/report.html', reportsFile, (err) => {
                        if (err)
                            throw err;

                        let content = fs.readFileSync(reportsFile);

                        content = content
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
                    });
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