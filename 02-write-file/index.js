const fs = require('fs');
const path = require('path');
const readline = require('readline');

const fullpath = path.join(__dirname, 'text.txt');
const writeStream = fs.createWriteStream(fullpath, { flags: 'a' });
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

writeStream.write('');

process.stdout.write('Enter text:\n');

rl.on('line', (line) => {
  if (line === 'exit') {
    rl.close();
    return;
  }

  writeStream.write(line);
});

rl.on('SIGINT', () => {
  rl.close();
});

rl.on('close', () => {
  process.stdout.write('Program execution has stopped!');
});
