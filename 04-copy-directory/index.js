const { rm, mkdir, readdir, copyFile } = require('fs/promises');
const path = require('path');

async function main() {
  const fullpath = path.join(__dirname, 'files');
  const copyPath = path.join(__dirname, 'files-copy');

  await rm(copyPath, { recursive: true, force: true });
  await mkdir(copyPath);

  const files = await readdir(fullpath);

  for (const file of files) {
    const src = path.join(fullpath, file);
    const dest = path.join(copyPath, file);

    await copyFile(src, dest);
  }
}

main();
