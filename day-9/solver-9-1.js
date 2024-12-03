const fs = require("fs");
const lines = fs.readFileSync("./input-9-1.txt", "utf8").split("\n");
//const lines = fs.readFileSync("./test-input-9.txt", "utf8").split("\n");

const solution = { lines: [] };

for (const line of lines) {
  if (line === "") {
    break;
  }

  let numbers = line.split(" ").map((s) => parseInt(s));
  console.dir(numbers);

  let solutionLine = {
    numbers,
    intervalSteps: [numbers],
  };

  while (numbers.every((s) => s === 0) === false) {
    let intervalStep = [];
    for (let i = 0; i < numbers.length - 1; i++) {
      intervalStep.push(numbers[i + 1] - numbers[i]);
    }

    solutionLine.intervalSteps.push(intervalStep);
    numbers = intervalStep;
  }

  for (let i = solutionLine.intervalSteps.length - 2; i >= 0; i--) {
    let currentIntervalStep = solutionLine.intervalSteps[i];
    let lastValue = currentIntervalStep[currentIntervalStep.length - 1];

    let nextIntervalStep = solutionLine.intervalSteps[i + 1];
    let nextIntervalStepLastValue =
      nextIntervalStep[nextIntervalStep.length - 1];

    solutionLine.intervalSteps[i].push(lastValue + nextIntervalStepLastValue);
  }

  solutionLine.addedNumber =
    solutionLine.intervalSteps[0][solutionLine.intervalSteps[0].length - 1];

  solution.lines.push(solutionLine);
}

const sumOfAddedNumbers = solution.lines.reduce(
  (acc, solutionLine) => acc + solutionLine.addedNumber,
  0,
);
console.log(sumOfAddedNumbers);
