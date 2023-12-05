const fs = require('fs');

const input = fs.readFileSync('./input-5.txt', 'utf8');

const lines = input.split('\n');

let data = {
  converters: [],
  seeds: [],
};

let currentConverter = null;
for (const line of lines) {
  //console.log(`Parsing line: ${line}`);

  if (line.startsWith("seeds: ")) {
    const [_, seeds] = line.split(': ');
    const seedValues = seeds.split(' ');

    for (let i = 0; i < seedValues.length; i += 2) {
      const length = parseInt(seedValues[i + 1]);
      const start = parseInt(seedValues[i]);
      const end = start + length - 1;

      data.seeds.push({
        start,
        end,
      });
    }

    continue;
  }

  const matches = line.match(/^([a-z]+)-to-([a-z]+) map:$/)
  if (matches !== null) {
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
    length = parseInt(length);

    srcStart = parseInt(srcStart);
    srcEnd = srcStart + length - 1;

    destStart = parseInt(destStart);
    destEnd = destStart + length - 1;

    currentConverter.ranges.push({
      src: {
        start: srcStart,
        end: srcEnd,
      },
      dest: {
        start: destStart,
        end: destEnd,
      },
      modifier: destStart - srcStart,
      length,
    });
  }
}

const stateRanges = [];
for (const seed of data.seeds) {
  const startState = "seed";

  stateRanges.push({
    state: startState,
    range: seed,
  });
}

for (const stateRange of stateRanges) {

  const converter = data.converters.find(converter => converter.from === stateRange.state);
  if (converter === undefined) {
    console.error(`No converter found for state ${stateRange.state}`);
    break;
  }

  let currentRange = stateRange.range;
  const nextRanges = [];

  console.log(`FROM ${converter.from} TO ${converter.to}`, currentRange);
  console.log("");

  // Apply all converter ranges.
  for (const converterRange of converter.ranges) {
    console.log("");
    console.log("CURRENT    ", currentRange);
    console.log("CONVERTER  ", converterRange.src);

    if (converterRange.src.start > currentRange.end) {
      console.log(`> No intersection: Converter start is after currentRange end`);
      continue;
    }

    if (converterRange.src.end < currentRange.start) {
      console.log(`> No intersection: Converter end is before currentRange start`);
      continue;
    }

    if (converterRange.src.start <= currentRange.start && converterRange.src.end >= currentRange.end) {
      const convertedRange = {
        start: currentRange.start + converterRange.modifier,
        end: currentRange.end + converterRange.modifier,
      };

      nextRanges.push({
        state: converter.to,
        range: convertedRange
      });

      console.log(`CONVERTED  `, convertedRange, "    ", converterRange.modifier);
      console.log(`Converter wholly encloses currentRange`);

      // Entire range was converted.
      currentRange = null;
      break;
    }

    if (converterRange.src.start <= currentRange.start && converterRange.src.end >= currentRange.start) {
      const convertedRange = {
        start: currentRange.start + converterRange.modifier,
        end: converterRange.src.end + converterRange.modifier,
      };

      nextRanges.push({
        state: converter.to,
        range: convertedRange
      });

      currentRange = {
        start: converterRange.src.end + 1,
        end: currentRange.end,
      };


      console.log(`CONVERTED  `, convertedRange, "    ", converterRange.modifier);
      console.log(`Converter encloses currentRange start`);
      continue;
    }

    if (converterRange.src.start <= currentRange.end && converterRange.src.end >= currentRange.end) {
      const convertedRange = {
        start: converterRange.src.start + converterRange.modifier,
        end: currentRange.end + converterRange.modifier,
      };

      nextRanges.push({
        state: converter.to,
        range: convertedRange
      });

      currentRange = {
        start: currentRange.start,
        end: converterRange.src.start - 1,
      };

      console.log(`CONVERTED  `, convertedRange, "    ", converterRange.modifier);
      console.log(`Converter encloses currentRange end`);
      continue;
    }

    console.log(`> TODO`);
  }

  if (currentRange !== null) {
    console.log(`Remainder of the range being pushed.`, currentRange);
    nextRanges.push({
      state: converter.to,
      range: currentRange,
    });
  }

  stateRanges.push(...nextRanges);
  console.log("---");
}


console.log("Closest location:");
console.dir(
  stateRanges.filter((stateRange) => stateRange.state === "location").sort((a, b) => a.range.start - b.range.start)[0].range.start,
);

