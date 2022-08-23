# Visual Regression Testing Tool

## Install

```npm i vrt-tool```

## Setup VRT

Add VRT scripts to your project `package.json` file

```json
{
  "scripts": {
    "vrt-init": "vrt-tool init",
    "vrt-setup": "vrt-tool setup",
    "vrt-test": "vrt-tool test",
    "vrt-reports": "vrt-tool reports"
  }
}
```

Then run

```npm run vrt-init```

This will create `vrt.config.js` file and `.vrt` directory in your project root.

Open the `vrt.config.js` file and add testing scenarios.

Example:

```javascript
module.exports = {
    scenarios: [
        {
            name: 'Homepage',
            sourceUrl: 'http://localhost:10008/home',
            testUrl: 'http://localhost:10008/home',
            onPage: async page => {
                await page.waitForTimeout(3000);
            },
        },
    ],
};
```

`onPage` callback will receive the `page` argument which is the
Puppeteer's [Page class](https://pptr.dev/api/puppeteer.page) instance.

## Running tests

- Run ```npm run vrt-setup```
 
  _This command will take a screenshot of `sourceUrl` for each defined scenario._

- Make changes to `sourceUrl` page (edit html, etc. )

- Run ```npm run vrt-test```

  _This will take a screenshot of `testUrl` and compare it with `sourceUrl` screenshot._ 

If `sourceUrl` and `testUrl` screenshots don't match, a report will be generated. 


## Reports

Report will be generated each time when `sourceUrl` and `testUrl` screenshots don't match.

You can list all reports by running `npm run vrt-reports`