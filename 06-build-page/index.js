const fs = require('fs');
const {
  readFile,
  readdir,
  rm,
  mkdir,
  stat,
  writeFile,
  copyFile,
} = require('fs/promises');
const path = require('path');

async function createBundleCSS(bundle) {
  const styles = path.join(__dirname, 'styles');
  const writeStreamBundle = fs.createWriteStream(bundle);

  const files = await readdir(styles);

  for (const file of files) {
    const readStream = fs.createReadStream(path.join(styles, file), {
      encoding: 'utf-8',
    });

    readStream.on('data', (data) => {
      writeStreamBundle.write(data, (error) => {
        if (error) {
          process.stdout.write(error);
          return;
        }
      });
    });
  }
}

async function createBundleHTML(bundle) {
  const components = path.join(__dirname, 'components');
  const templateHTML = path.join(__dirname, 'template.html');

  const files = await readdir(components);
  let templateContent = await readFile(templateHTML, { encoding: 'utf-8' });

  for (const file of files) {
    const componentContent = await readFile(path.join(components, file));
    const componentName = path.parse(file).name;

    templateContent = templateContent.replace(
      `{{${componentName}}}`,
      componentContent,
    );
  }

  await writeFile(bundle, templateContent);
}

async function createBundleAssets(bundle) {
  const stack = [path.join(__dirname, 'assets')];

  while (stack.length) {
    const assets = stack.pop();
    const files = await readdir(assets);

    for (const file of files) {
      const unionPath = path.join(assets, file);
      const stats = await stat(unionPath);

      if (stats.isDirectory()) {
        await mkdir(path.join(bundle, file), { recursive: true });
        stack.push(unionPath);
        continue;
      }

      const dest = path.join(
        path.join(bundle, path.parse(path.parse(unionPath).dir).base, file),
      );

      await copyFile(unionPath, dest);
    }
  }
}

async function main() {
  const dist = path.join(__dirname, 'project-dist');

  const bundleCSS = path.join(dist, 'style.css');
  const bundleHTML = path.join(dist, 'index.html');
  const bundleAssets = path.join(dist, 'assets');

  try {
    await rm(dist, { recursive: true, force: true });
    await mkdir(dist)
      .then(() => {
        createBundleCSS(bundleCSS);
      })
      .then(() => {
        createBundleHTML(bundleHTML);
      })
      .then(() => {
        createBundleAssets(bundleAssets);
      });
  } catch (error) {
    process.stdout.write(error);
  }
}

main();
