const { readdir, stat, readFile, writeFile } = require('fs/promises');
const path = require('path');

async function main() {
  const styles = path.join(__dirname, 'styles');
  const dist = path.join(__dirname, 'project-dist');
  const bundleCSS = path.join(dist, 'bundle.css');
  const files = await readdir(styles);

  await writeFile(bundleCSS, '');

  for (const file of files) {
    const pathToStyleFile = path.join(styles, file);
    const stats = await stat(pathToStyleFile);

    if (!stats.isFile() || path.parse(file).ext !== '.css') {
      continue;
    }

    const dataStyle = await readFile(pathToStyleFile, { encoding: 'utf-8' });

    await writeFile(bundleCSS, dataStyle, { flag: 'a' });
  }
}

main();
