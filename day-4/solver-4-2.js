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

  cards.push({
    line,
    cardNum,
    winningNumbers,
    ourNumbers,
    ourWinningNumbers,
  });

  cardNum += 1;
}

const winningCards = cards;
console.dir(winningCards, { depth: null });

// Note that this is a pretty slow way to calculate this!
for (let cardIdx = 0; cardIdx < winningCards.length; cardIdx++) {
  // console.log(`There are now ${winningCards.length} winning cards`);

  const winningCard = winningCards[cardIdx];

  //if (cardIdx > 10) {
  //  break;
  //}

  // console.log(`[${winningCard.cardNum}] Adding ${winningCard.ourWinningNumbers.length} cards to the stack`);

  for (let i = 1; i <= winningCard.ourWinningNumbers.length; i++) {
    const newWinningCardNum = winningCard.cardNum + i;
    const newWinningCard = cards.find(card => card.cardNum === newWinningCardNum);

    // console.log(`Adding ${newWinningCard.cardNum} to the stack`);
    winningCards.push(newWinningCard)
  }
}

//console.dir(cards, { depth: null });
console.log(winningCards.length);
