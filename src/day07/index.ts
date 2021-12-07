/** 
* Advent of Code 2021
* Day 07
* Author: zachy-ho (https://github.com/zachy-ho)
* */

import run from "aocrunner";

function divergentSeries(start: number, end: number): number {
  const distance = Math.abs(start - end);
  return (distance * (distance + 1))/2;
}

function getMean(numbers: number[]): number {
  const sum = numbers.reduce((prev, curr) => prev + curr, 0);
  return sum/numbers.length;
}

function getTriangularSum(numbers: number[], mean: number) {
  return numbers.reduce((prev, curr) => prev + divergentSeries(curr, mean), 0);
}

const parseInput = (rawInput: string) => rawInput.split(',').map((i) => parseInt(i));

/** Part 1: Fuel used by crab submarines */
const part1 = (rawInput: string) => {
  let input = parseInput(rawInput);
  input = input.sort((a, b) => a - b);
  const median = input.length % 2 === 1
  ? (input[(input.length + 1)/2] + input[(input.length - 1)/2])/2
  : input[input.length/2];
  const fuelUsed = input.reduce((prev, curr) => {
    return prev + Math.abs(curr - median);
  }, 0);
  return fuelUsed;
};

/** Part 2: MORE fuel used by crab submarines */
// I'm gonna try with using the mean
// See https://www.reddit.com/r/adventofcode/comments/rar7ty/comment/hnk6gz0/?utm_source=share&utm_medium=web2x&context=3
const part2 = (rawInput: string) => {
  let input = parseInput(rawInput);
  input = input.sort((a, b) => a - b);
  const mean = getMean(input);
  const fuelUsed = Math.min(getTriangularSum(input, Math.ceil(mean)), getTriangularSum(input, Math.floor(mean)));
  return fuelUsed;
};

const testInput = `16,1,2,0,4,2,7,1,2,14`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 37,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 168,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
