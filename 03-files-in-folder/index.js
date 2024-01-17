const fs = require('fs');
const path = require('path');

const fullpath = path.join(__dirname, 'secret-folder');

function getInfo(pathToFile) {
  fs.stat(pathToFile, (error, stats) => {
    if (error) {
      process.stdin.write(error);
      return;
    }

    if (!stats.isFile()) {
      return;
    }

    const fileInfo = path.parse(pathToFile);

    const fileName = fileInfo.name;
    const fileExtension = fileInfo.ext.slice(1);
    const fileSize = (stats.size / 1024).toFixed(3);

    process.stdout.write(`${fileName} - ${fileExtension} - ${fileSize}kb\n`);
  });
}

fs.readdir(fullpath, async (error, files) => {
  if (error) {
    process.stdin.write(error);
    return;
  }

  for await (const file of files) {
    getInfo(path.join(fullpath, file));
  }
});
