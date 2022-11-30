/** 
* Advent of Code 2021
* Day 01
* Author: zachy-ho (https://github.com/zachy-ho)
* */

import run from "aocrunner";

const parseInput = (rawInput: string) => rawInput.split("\n").map((str) => parseInt(str)); ;

function getIncreasingOccurrences(records: number[] | undefined) {
  if (!records) return;
  let curr = records[0];
  let occurrences = 0;
  records.forEach((record) => {
    if (record > curr) occurrences += 1;
    curr = record;
  })
  return occurrences;
}

function getIncreasingWindows(sums: number[]) {
  const sumArr = [];
  for (let i = 0; i < sums.length - 2; i++) {
    sumArr[i] = sums[i] + sums[i + 1] + sums[i + 2]
  }
  return sumArr;
}

/** Part 1: Depth value increases */
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  return getIncreasingOccurrences(input);
};

/** Part 2: Sliding window increases */
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const sumArr = getIncreasingWindows(input);
  return getIncreasingOccurrences(sumArr);
};

run({
  part1: {
    tests: [{ 
      input: `
      199
      200
      208
      210
      200
      207
      240
      269
      260
      263
      `,
    expected: 7
      }],
    solution: part1,
  },
  part2: {
    tests: [
{ 
      input: `
      199
      200
      208
      210
      200
      207
      240
      269
      260
      263
      `,
    expected: 5
      }
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
