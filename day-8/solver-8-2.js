const fs = require("fs");
const input = fs.readFileSync("./input-8.txt", "utf8");
//const input = fs.readFileSync("./test-input-8-2.txt", "utf8");
const lines = input.split("\n");

const instructions = lines[0].split("");

const lr = {
  L: "left",
  R: "right",
};

const keys = {};
for (let i = 2; i < lines.length; i++) {
  const line = lines[i];
  // AAA = (BBB, BBB)

  const matches = line.match(/^(?<key>\w+) = \((?<left>\w+), (?<right>\w+)\)$/);
  if (matches) {
    keys[matches.groups.key] = {
      left: matches.groups.left,
      right: matches.groups.right,
    };
  }
}

console.dir({ instructions, keys });
console.log(`-------------`);

let currentPositions = Object.keys(keys).filter((key) => key.endsWith("A"));
const steps = [];
console.dir({ currentPositions });

for (position of currentPositions) {
  let currentPosition = position;
  let step = 0;
  console.log(`Evaulating ${currentPosition}...`);

  while (currentPosition.endsWith("Z") === false) {
    const instruction = instructions[step % instructions.length];
    const key = keys[currentPosition];

    //console.dir({ step, instruction, currentPosition, key });

    currentPosition = key[lr[instruction]];

    step += 1;
  }

  steps.push(step);
  console.log(`Finished ${currentPosition} after ${step} steps`);
}

// Now calculate Least Common Multiple of the intervals.
//
function gcd(a, b) {
  // Calculate the Greatest Common Divisor (GCD) using the Euclidean algorithm
  while (b !== 0) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a, b) {
  // Calculate the Least Common Multiple (LCM) using the formula: (a * b) / GCD(a, b)
  return Math.abs(a * b) / gcd(a, b);
}

function lcmArray(arr) {
  // Calculate the LCM of an array of numbers
  return arr.reduce((accumulator, currentValue) =>
    lcm(accumulator, currentValue),
  );
}

console.log(lcmArray(steps));
