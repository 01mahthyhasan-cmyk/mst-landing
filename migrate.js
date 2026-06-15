const fs = require('fs');
const path = require('path');

const BACKUP_DIR = path.join(__dirname, '_backup');
const SRC_APP_DIR = path.join(__dirname, 'src', 'app');

// Ensure target app directory exists
if (!fs.existsSync(SRC_APP_DIR)) {
  fs.mkdirSync(SRC_APP_DIR, { recursive: true });
}

// Read all HTML files in backup
const files = fs.readdirSync(BACKUP_DIR).filter(file => file.endsWith('.html'));

files.forEach(file => {
  const filePath = path.join(BACKUP_DIR, file);
  const content = fs.readFileSync(filePath, 'utf-8');

  // 1. Extract Page Title
  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Pluxes - Medical & Healthcare';

  // 2. Extract Main Content (between Header End and Footer Start)
  let mainContent = '';
  const headerEndIndex = content.indexOf('<!-- Header End -->');
  const footerStartIndex = content.indexOf('<!-- Main Footer Start -->');

  if (headerEndIndex !== -1 && footerStartIndex !== -1) {
    mainContent = content.substring(headerEndIndex + '<!-- Header End -->'.length, footerStartIndex).trim();
  } else {
    // Fallbacks if comments are missing
    const bodyStartIndex = content.indexOf('<body>');
    const bodyEndIndex = content.indexOf('</body>');
    mainContent = content.substring(
      bodyStartIndex !== -1 ? bodyStartIndex + 6 : 0,
      bodyEndIndex !== -1 ? bodyEndIndex : content.length
    ).trim();
  }

  // 3. Clean up Preloader and Header if they leaked into the content
  const preloaderEndIndex = mainContent.indexOf('<!-- Preloader End -->');
  if (preloaderEndIndex !== -1) {
    mainContent = mainContent.substring(preloaderEndIndex + '<!-- Preloader End -->'.length).trim();
  }
  const headerRealEndIndex = mainContent.indexOf('<!-- Header End -->');
  if (headerRealEndIndex !== -1) {
    mainContent = mainContent.substring(headerRealEndIndex + '<!-- Header End -->'.length).trim();
  }

  // 4. Rewrite link paths (e.g. index.html -> /, about.html -> /about)
  mainContent = mainContent.replace(/href="([^"]+)\.html"/g, (match, p1) => {
    if (p1 === 'index') {
      return 'href="/"';
    }
    return `href="/${p1}"`;
  });

  // Rewrite standard image paths to start with a absolute slash / for Next.js static asset routing
  mainContent = mainContent.replace(/src="images\//g, 'src="/images/');
  mainContent = mainContent.replace(/src='images\//g, "src='/images/");

  // Escape backticks and dollar signs for template literal safety
  const safeHtml = mainContent
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\$/g, '\\$');

  // Determine Next.js route path
  const baseName = path.basename(file, '.html');
  let targetFolder, targetFile;

  if (baseName === 'index') {
    targetFolder = SRC_APP_DIR;
    targetFile = path.join(targetFolder, 'page.jsx');
  } else if (baseName === '404') {
    targetFolder = SRC_APP_DIR;
    targetFile = path.join(targetFolder, 'not-found.jsx');
  } else {
    targetFolder = path.join(SRC_APP_DIR, baseName);
    if (!fs.existsSync(targetFolder)) {
      fs.mkdirSync(targetFolder, { recursive: true });
    }
    targetFile = path.join(targetFolder, 'page.jsx');
  }

  // Generate page content
  const pageCode = `export const metadata = {
  title: "${title.replace(/"/g, '\\"')}",
};

export default function Page() {
  return (
    <div dangerouslySetInnerHTML={{ __html: \`${safeHtml}\` }} />
  );
}
`;

  fs.writeFileSync(targetFile, pageCode, 'utf-8');
  console.log(`Migrated ${file} -> ${path.relative(__dirname, targetFile)}`);
});

console.log('Migration completed successfully!');
