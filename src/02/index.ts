/** 
* Advent of Code 2021
* Day 2
* Author: zachy-ho (https://github.com/zachy-ho)
* */
import { getLinesFromFile } from '../../utils';

/** Part 1: Calculate product of horizontal and depth position */
function runPart1() {
  const linesArr = getLinesFromFile('./input.txt');
  const movementsArr: [string, number][]= linesArr.map((i: string) => {
    const movement = i.split(' ');
    return [movement[0], parseInt(movement[1])];
  })

  let horizontal = 0;
  let depth = 0;
  movementsArr.forEach((pair) => {
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

  console.log(`Part 1: ${horizontal * depth}`);
}

// runPart1();

/** Part 2: Calculate product but this time with a new factor of 'aim' */
function runPart2() {
  const linesArr = getLinesFromFile('./input.txt');
  const movementsArr: [string, number][]= linesArr.map((i: string) => {
    const movement = i.split(' ');
    return [movement[0], parseInt(movement[1])];
  })

  let horizontal = 0;
  let depth = 0;
  let aim = 0;
  movementsArr.forEach((pair) => {
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

  console.log(`Part2: ${horizontal * depth}`);
}

runPart2();
