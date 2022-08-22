const fs = require('fs');

// Get report files
const reports = fs.readdirSync('./reports/')
    .filter(filename => filename.endsWith('.html'))
    .map(filename => {
        const file = `${process.env.PWD}/reports/${filename}`;

        return {
          file,
          date: fs.statSync(`${file}`)['mtime'].toUTCString(),
          timestamp: fs.statSync(`${file}`)['mtime'].getTime(),
        };
    })
    .sort((a, b) => (b.timestamp - a.timestamp));

console.log(`Reports: \x1b[32m${reports.length}\x1b[0m`);

reports.forEach(({file, date}) => {
    console.log(`[${date}] file://${file}`);
});

