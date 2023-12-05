const fs = require('fs');

const input = fs.readFileSync('./input-5.txt', 'utf8');

const lines = input.split('\n');

let data = {
  converters: [],

};

let currentConverter = null;
for (const line of lines) {
  console.log(`Parsing line: ${line}`);

  if (line.startsWith("seeds: ")) {
    const [_, seeds] = line.split(': ');
    data.seeds = seeds.split(" ");
    continue;
  }

  const matches = line.match(/^([a-z]+)-to-([a-z]+) map:$/)
  if (matches !== null) {
    console.log(matches);
    currentConverter = {
      from: matches[1],
      to: matches[2],
      ranges: [],
      //map: {}
    };

    data.converters.push(currentConverter);
  }

  if (line.match(/^[0-9]/) !== null) {
    let [destStart, srcStart, length] = line.split(" ");
    destStart = parseInt(destStart);
    srcStart = parseInt(srcStart);
    length = parseInt(length);

    currentConverter.ranges.push({
      destStart,
      srcStart,
      length,
    });

    // Nope, the real data is too big.
    // for (let i = 0; i < length; i++) {
    //   currentConverter.map[srcStart + i] = destStart + i;
    // }
  }
}

console.dir(data, { depth: null });

let closestLocation = Infinity;

for (const seed of data.seeds) {
  const startState = "seed";
  const endState = "location";

  let currentValue = seed;
  let currentState = startState;

  while (currentState !== endState) {
    const converter = data.converters.find(converter => converter.from === currentState);
    console.log(`[${seed}] val=${currentValue} from=${converter.from} to=${converter.to}`);

    for (const range of converter.ranges) {
      if (currentValue >= range.srcStart && currentValue < range.srcStart + range.length) {
        console.log(`[${seed}] val=${currentValue} from=${converter.from} to=${converter.to} in range ${range.srcStart} - ${range.srcStart + range.length}`);
        currentValue = range.destStart + (currentValue - range.srcStart);
        break;
      }
    }

    currentState = converter.to;
  }

  console.log("Final state of", seed, "is", currentValue);
  console.log("");

  if (currentValue < closestLocation) {
    closestLocation = currentValue;
  }
}

console.log("Closest location is", closestLocation);
