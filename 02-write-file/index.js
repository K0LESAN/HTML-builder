const fs = require('fs');
const path = require('path');
const readline = require('readline');

const fullpath = path.join(__dirname, 'text.txt');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function writeFile(line) {
  fs.appendFile(fullpath, line, (error) => {
    if (error) {
      return error;
    }
  });
}

writeFile('');

process.stdout.write('Enter text:\n');

rl.on('line', (line) => {
  if (line === 'exit') {
    rl.close();
    return;
  }

  writeFile(line);
});

rl.on('SIGINT', () => {
  rl.close();
});

rl.on('close', () => {
  process.stdout.write('Program execution has stopped!');
});
