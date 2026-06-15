const fs = require('fs');
const content = fs.readFileSync('src/app/about/page.jsx', 'utf8');

// Find all HTTP/HTTPS links
const urls = content.match(/https?:\/\/[^\s"'`>]+/g) || [];
console.log('--- HTTP/HTTPS URLs ---');
console.log(urls);

// Find all href attributes
const hrefs = content.match(/href=["']([^"']*)["']/g) || [];
console.log('--- HREFs ---');
hrefs.forEach(h => console.log(h));
