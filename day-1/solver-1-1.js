const fs = require('fs');

const input = fs.readFileSync('./input-1.txt', 'utf8');

const lines = input.split('\n');

const numbers = [];

let charPos, char, num1, num2;
for (const line of lines) {
  console.log(`Processing line: ${line}`);
  if (line === '') {
    continue;
  }

  // Search forward.
  charPos = 0;
  char = line.charAt(charPos);

  while (char.match(/[0-9]/) === null) {
    charPos++;
    char = line.charAt(charPos);
  }

  num1 = parseInt(char);
  if (isNaN(num1)) {
    throw new Error(`Could not parse number from char: ${char}`);
  }

  // Search backward.
  charPos = line.length - 1;
  char = line[charPos];

  while (char.match(/[0-9]/) === null) {
    charPos--;
    char = line.charAt(charPos);
  }

  num2 = parseInt(char);

  const numAsString = `${num1}${num2}`;
  numbers.push(parseInt(numAsString));
}


console.log(numbers);
console.log(numbers.length);
const sum = numbers.reduce((acc, curr) => acc + curr, 0);
console.log(sum);

