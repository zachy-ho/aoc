/** 
* Advent of Code 2021
* Day 6
* Author: zachy-ho (https://github.com/zachy-ho)
* */

import { readFileSync } from 'fs';

type FishMap = Map<number, number>

/** Part 1: Exponential growth of lantern fish */
function createFrequencyMap(array: number[]): FishMap {
  const map = new FishMap([...Array(9).keys()].map((key) => [key, 0]));
  array.forEach((i) => {
    map.set(i, map.get(i)! + 1);
  })

  return map;
}

function breedFish({ fishes, days } : { fishes: FishMap, days: number }) {

}

export function answerPart1({ file, days }: { file: string, days: number }) {
  const text = readFileSync(file, 'utf-8');
  const startingFishes = text.split(',').map((i) => parseInt(i.replace(/\n+/, '')));
  const fishMap = createFrequencyMap(startingFishes);
  return breedFish({ fishes: fishMap, days });
}

/** Part 2: Description */

answerPart1({ file: './sample.txt', days: 18 });
