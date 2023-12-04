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

const filteredGames = games.filter(game =>
  game.actions.every(action =>
    action.colours.every(colour => {
      if (colour.amount > maxValues[colour.colour]) {
        console.log(`Game ${game.gameId} failed on action ${action.action} because ${colour.colour} was ${colour.amount} but should be ${maxValues[colour.colour]} or fewer`)
        return false;
      }

      return true;
    })
  )
);

console.log('Filtered games:');
console.dir(filteredGames, { depth: null });


const sumOfGameIds = filteredGames.reduce((acc, game) => acc + game.gameId, 0);
console.log(`Sum of gameIds: ${sumOfGameIds}`);
