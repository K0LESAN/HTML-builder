const fs = require('fs');
const path = require('path');

const styles = path.join(__dirname, 'styles');
const dist = path.join(__dirname, 'project-dist');
const bundleCSS = path.join(dist, 'bundle.css');

const writeStream = fs.createWriteStream(bundleCSS);

writeStream.write('', (error) => {
  if (error) {
    process.stdout.write(error);
    return;
  }

  fs.readdir(styles, async (error, files) => {
    if (error) {
      process.stdout.write(error);
      return;
    }

    for await (const file of files) {
      const pathToStyleFile = path.join(styles, file);

      fs.stat(pathToStyleFile, (error, stats) => {
        if (error) {
          process.stdout.write(error);
          return;
        }

        if (!stats.isFile() || path.parse(file).ext !== '.css') {
          return;
        }

        const readStream = fs.createReadStream(path.join(styles, file), {
          encoding: 'utf-8',
        });

        readStream.on('data', (data) => {
          writeStream.write(data, (error) => {
            if (error) {
              process.stdout.write(error);
              return;
            }
          });
        });
      });
    }
  });
});
