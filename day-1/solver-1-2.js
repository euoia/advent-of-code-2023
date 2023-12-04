// Be aware of sneaky inputs like this one:
// 6oneighthlf
//
// We need to reverse the string (and the patterns!) to deal with this.
const fs = require('fs');

const input = fs.readFileSync('./input-1.txt', 'utf8');

const lines = input.split('\n');

const numbers = [];

const values = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9
};

const patterns = Object.keys(values);
const patternStr = patterns.join('|');
const backwardsPatternStr = patternStr.split('').reverse().join('');

const forwardRegexp = new RegExp(patternStr, 'g');
const backwardsRegexp = new RegExp(backwardsPatternStr, 'g');

for (const line of lines) {
  console.log(`Processing line: ${line}`);
  if (line === '') {
    continue;
  }

  const forwardMatches = line.matchAll(forwardRegexp);
  const forwardMatch = Array.from(forwardMatches)[0].toString();

  const backwardsMatches = line.split('').reverse().join('').matchAll(backwardsRegexp);
  const backwardsMatch = Array.from(backwardsMatches)[0].toString();

  console.log(`Forward match: ${forwardMatch}`);
  console.log(`Backwards match: ${backwardsMatch}`);

  const num1 = values[forwardMatch];
  const num2 = values[backwardsMatch.split('').reverse().join('')];
  const numberValue = parseInt(`${num1}${num2}`, 10);
  numbers.push({
    line,
    value: numberValue
  });
}

console.log(numbers);
console.log(numbers.length);
const sum = numbers.reduce((acc, curr) => acc + curr.value, 0);
console.log(sum);


const lastTen = numbers.slice(numbers.length - 10);
const sumLastTen = lastTen.reduce((acc, curr) => acc + curr.value, 0);
console.log(lastTen);
console.log(sumLastTen);
