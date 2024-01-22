const { readdir, stat } = require('fs/promises');
const path = require('path');

async function main() {
  const fullpath = path.join(__dirname, 'secret-folder');
  const files = await readdir(fullpath);

  for (const file of files) {
    const pathToFile = path.join(fullpath, file);
    const stats = await stat(pathToFile);

    if (!stats.isFile()) {
      continue;
    }

    const { name, ext } = path.parse(pathToFile);
    const fileSize = (stats.size / 1024).toFixed(3);

    process.stdout.write(`${name} - ${ext.slice(1)} - ${fileSize}kb\n`);
  }
}

main();
