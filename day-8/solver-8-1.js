const fs = require("fs");
const input = fs.readFileSync("./input-8.txt", "utf8");
//const input = fs.readFileSync("./test-input-8.txt", "utf8");
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

let step = 0;
let currentKey = "AAA";
while (true) {
  if (currentKey === "ZZZ") {
    break;
  }

  const instruction = instructions[step % instructions.length];
  const current = keys[currentKey];
  //console.dir({ currentKey, current, step, instruction });

  currentKey = current[lr[instruction]];
  step += 1;
}

console.log(`Finished after ${step} steps`);
