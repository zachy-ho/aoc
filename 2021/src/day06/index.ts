/** 
* Advent of Code 2021
* Day 06
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
  while(days > 0) {
    const breedingNext = fishes.get(0)!;
    fishes.forEach((_freq, key) => {
      if (key < 8) fishes.set(key, fishes.get(key + 1)!);
      if (key === 6) fishes.set(key, fishes.get(key)! + breedingNext);
      if (key === 8) fishes.set(key, breedingNext);
    })
    days--;
  }
}

function countFishes(fishMap: FishMap): number {
  return [...fishMap.values()].reduce((prev, curr) => prev + curr, 0);
}

const parseInput = (rawInput: string) => rawInput.split(',').map((i) => parseInt(i.replace(/\n+/, '')));
;

/** Part 1: Exponential growth of lantern fish */
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const fishMap = createFrequencyMap(input);
  breedFish({ fishes: fishMap, days: 80 });
  return countFishes(fishMap);
};

/** Part 2: Description */
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const fishMap = createFrequencyMap(input);
  breedFish({ fishes: fishMap, days: 256 });
  return countFishes(fishMap);
};

const testInput = `
  3,4,3,1,2
`

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 5934,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 26984457539,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
