const fs = require('fs');

const input = fs.readFileSync('./input-2.txt', 'utf8');
const lines = input.split('\n');

let gameId = 1;
const games = [];

const maxValues = {
  red: 12,
  green: 13,
  blue: 14
}

for (const line of lines) {
  if (line === '') {
    continue;
  }

  console.log(`Processing line: ${line}`);

  const actions = line.split(':')[1].split(';').map(action => action.trim()).map(action => {
    return {
      action,
      colours: action.split(',').map(amtColour => {
        const matches = amtColour.match('([0-9]+) ([a-z]+)');
        const amount = parseInt(matches[1], 10);
        const colour = matches[2];
        return {
          amount,
          colour
        };
      })
    }
  });

  const game = {
    gameId,
    actions
  };

  console.dir(game, { depth: null });
  games.push(game);

  gameId += 1;
}

const gamePowers = [];
for (const game of games) {
  const maxColours = {
    red: 0,
    green: 0,
    blue: 0
  }

  for (const action of game.actions) {
    for (const colour of action.colours) {
      if (colour.amount > maxColours[colour.colour]) {
        maxColours[colour.colour] = colour.amount;
      }
    }
  }

  gamePowers.push({
    game,
    maxColours,
    power: Object.values(maxColours).reduce((acc, val) => acc * val, 1)
  })
}

const powerSum = gamePowers.reduce((acc, gamePower) => acc + gamePower.power, 0);

console.dir(gamePowers, { depth: null });
console.log(powerSum);
