const fs = require('fs');

const input = fs.readFileSync('./input-4.txt', 'utf8');

const lines = input.split('\n');


let cardNum = 1;
const cards = [];

for (const line of lines) {
  if (line === '') {
    break;
  }

  const [_, cardInfo] = line.split(':');
  const [winningNumbersStr, ourNumbersStr] = cardInfo.split(' | ');

  const winningNumbers = winningNumbersStr.trim().split(/ +/).map(numStr => parseInt(numStr, 10));
  const ourNumbers = ourNumbersStr.trim().split(/ +/).map(numStr => parseInt(numStr, 10));

  const ourWinningNumbers = ourNumbers.filter(num => winningNumbers.includes(num));

  const score = ourWinningNumbers.length === 0 ?
    0 :
    Math.pow(2, ourWinningNumbers.length - 1);

  cards.push({
    line,
    cardNum,
    winningNumbers,
    ourNumbers,
    ourWinningNumbers,
    score
  });

  cardNum += 1;
}

console.dir(cards, { depth: null });
console.log(`Total score: ${cards.reduce((acc, card) => acc + card.score, 0)}`)
