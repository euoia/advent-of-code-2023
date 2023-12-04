// It seems like the same part number can appear multiple times, and should be
// included multiple times.
//
const fs = require('fs');

const input = fs.readFileSync('./input-3.txt', 'utf8');
const lines = input.split('\n');

const partNumbers = [];

// Initially go through and note positions of all the numbers.
let lineIdx = 0;
let partId = 0;
for (const line of lines) {
  partNumbers[lineIdx] = {};

  // Match all numbers.
  const matches = line.matchAll(/[0-9]+/g);
  for (const match of matches) {
    const partNumberStr = match[0];
    const partNumber = parseInt(partNumberStr, 10);

    for (let i = 0; i < partNumberStr.length; i++) {
      partNumbers[lineIdx][match.index + i] = {
        partNumber,
        partId
      };
    }

    partId += 1;
  }

  lineIdx += 1;
}

console.dir(partNumbers, { depth: null });

const foundParts = [];

lineIdx = 0;
for (const line of lines) {

  let charIdx = 0;
  const chars = line.split('');
  for (const char of chars) {
    if (char !== "." && char.match(/[0-9]/) === null) {
      console.log(`Found char ${char} at line ${lineIdx} char ${charIdx}`);

      [
        // Above.
        partNumbers[lineIdx - 1][charIdx],

        // Above right.
        partNumbers[lineIdx - 1][charIdx + 1],

        // Right.
        partNumbers[lineIdx][charIdx + 1],

        // Below right.
        partNumbers[lineIdx + 1][charIdx + 1],

        // Below.
        partNumbers[lineIdx + 1][charIdx],

        // Below left.
        partNumbers[lineIdx + 1][charIdx - 1],

        // Left.
        partNumbers[lineIdx][charIdx - 1],

        // Above left.
        partNumbers[lineIdx - 1][charIdx - 1]
      ].forEach(part => {

        if (part !== undefined) {
          console.log(`Found part ${JSON.stringify(part)}`);

          const partAlreadyFound = foundParts.some(foundPart => foundPart.partId === part.partId);

          if (partAlreadyFound === false) {
            foundParts.push(part);
          }
        }
      });
    }

    charIdx += 1;
  }

  lineIdx += 1;
}

console.dir(foundParts, { depth: null, maxArrayLength: null });
console.log(foundParts.reduce((acc, part) => acc + part.partNumber, 0));
