/** 
* Advent of Code 2021
* Day xx
* Author: zachy-ho (https://github.com/zachy-ho)
* */

import run from "aocrunner";

type FishMap = Map<number, number>

function createFrequencyMap(array: number[]): FishMap {
  const map = new Map([...Array(9).keys()].map((key) => [key, 0]));
  array.forEach((i) => {
    map.set(i, map.get(i)! + 1);
  })

  return map;
}

function breedFish({ fishes, days } : { fishes: FishMap, days: number }) {

}

const parseInput = (rawInput: string) => rawInput.split(',').map((i) => parseInt(i.replace(/\n+/, '')));
;

/** Part 1: Exponential growth of lantern fish */
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const fishMap = createFrequencyMap(input);
  return breedFish({ fishes: fishMap, days: 80 });
  return;
};

/** Part 2: Description */
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

run({
  part1: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
