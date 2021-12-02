/** 
* Advent of Code 2021
* Day 1
* Author: zachy-ho (https://github.com/zachy-ho)
* */
import { getArrayOfStringsFromFile } from '../../utils';

/** Part 1: Depth value increases */
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

function runPart1() {
  const strArr = getArrayOfStringsFromFile('./input.txt');
  const depthValues = strArr.map((i: string) => parseInt(i));
  console.log(`Part 1: ${getIncreasingOccurrences((depthValues))}`)
}

runPart1();

/** Part 2: Sliding window increases */
function getIncreasingWindows(sums: number[]) {
  const sumArr = [];
  for (let i = 0; i < sums.length - 2; i++) {
    sumArr[i] = sums[i] + sums[i + 1] + sums[i + 2]
  }
  return sumArr;
}

function runPart2() {
  const strArr = getArrayOfStringsFromFile('./input.txt')
  const depthValues = strArr.map((i) => parseInt(i));
  const sumArr = getIncreasingWindows(depthValues);
  console.log(`Part 2: ${getIncreasingOccurrences(sumArr)}`);
}

runPart2()
