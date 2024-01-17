const fs = require('fs');
const path = require('path');

const fullpath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(fullpath, { encoding: 'utf-8' });

function outputData(data) {
  process.stdout.write(data);
}

readStream.on('data', outputData);
