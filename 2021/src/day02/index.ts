/** 
* Advent of Code 2021
* Day 02
* Author: zachy-ho (https://github.com/zachy-ho)
* */

import run from "aocrunner";

const parseInput = (rawInput: string): [string, number][] => (
  rawInput.split('\n').map((i: string) => {
    const movement = i.split(' ');
    return [movement[0], parseInt(movement[1])];
  })
);

/** Part 1: Calculate product of horizontal and depth position */
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let horizontal = 0;
  let depth = 0;
  input.forEach((pair) => {
    switch(pair[0]) {
      case 'forward':
        horizontal += pair[1];
        break;
      case 'up':
        depth -= pair[1];
        break;
      case 'down':
        depth += pair[1];
        break;
    }
  })
  return horizontal * depth;
};

/** Part 2: Calculate product but this time with a new factor of 'aim' */
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  let horizontal = 0;
  let depth = 0;
  let aim = 0;
  input.forEach((pair) => {
    switch(pair[0]) {
      case 'forward':
        horizontal += pair[1];
        depth += pair[1] * aim;
        break;
      case 'up':
        aim -= pair[1];
        break;
      case 'down':
        aim += pair[1];
        break;
    }
  })

  return horizontal * depth;
};

const testInput = `
forward 5
down 5
forward 8
up 3
down 8
forward 2
`

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 150,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 900,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
