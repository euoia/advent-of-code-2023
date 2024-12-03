const fs = require('fs');

const input = fs.readFileSync('./input-6.txt', 'utf8');

const lines = input.split('\n');
const time = lines[0].split(':')[1].replace(/\s+/g, '');
const distances = lines[1].split(':')[1].replace(/\s+/g, '');

let scores = [
  {
    time: parseInt(time),
    distance: parseInt(distances),
  }
];

for (const score of scores) {
  let numRecordBeaten = 0;
  for (let chargeTime = 0; chargeTime < score.time; chargeTime++) {
    const speed = chargeTime;
    const remainingTime = score.time - chargeTime;
    const distance = speed * remainingTime;

    if (distance >= score.distance) {
      numRecordBeaten++;
    }
  }

  score.numRecordBeaten = numRecordBeaten;
}

console.dir(scores);
