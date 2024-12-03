const fs = require('fs');

const input = fs.readFileSync('./input-6.txt', 'utf8');

const lines = input.split('\n');
const times = lines[0].split(':')[1].trim().split(/\s+/g);
const distances = lines[1].split(':')[1].trim().split(/\s+/g);

let scores = [];
for (let i = 0; i < times.length; i++) {
  scores[i] = {
    time: parseInt(times[i]),
    distance: parseInt(distances[i]),
  };
}

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
console.log(
  scores.reduce((acc, score) => acc * score.numRecordBeaten, 1)
)
