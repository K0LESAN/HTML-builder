const fs = require('fs');
const path = require('path');

const fullpath = path.join(__dirname, 'files');
const copyPath = path.join(__dirname, 'files-copy');

async function copyDir() {
  fs.readdir(fullpath, async (error, files) => {
    if (error) {
      process.stdout.write(error);
      return;
    }

    for await (const filename of files) {
      const src = path.join(fullpath, filename);
      const dest = path.join(copyPath, filename);

      fs.copyFile(src, dest, (error) => {
        if (error) {
          process.stdout.write(error);
          return;
        }
      });
    }
  });
}

fs.readdir(__dirname, (error, files) => {
  if (error) {
    process.stdin.write(error);
    return;
  }

  if (files.includes('files-copy')) {
    fs.rm(copyPath, { recursive: true }, (error) => {
      if (error) {
        process.stdout.write(error);
        return;
      }

      fs.mkdir(copyPath, async (error) => {
        if (error) {
          process.stdout.write(error);
          return;
        }

        await copyDir();
      });
    });
  }

  if (!files.includes('files-copy')) {
    fs.mkdir(copyPath, async (error) => {
      if (error) {
        process.stdout.write(error);
        return;
      }

      await copyDir();
    });
  }
});
