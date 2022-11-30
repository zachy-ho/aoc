/** 
* Advent of Code 2021
* Day 10
* Author: zachy-ho (https://github.com/zachy-ho)
* */

import run from "aocrunner";

/* Types */
type Gucci = {
  state: 'gucci'
}
type Error = {
  state: 'error',
  firstError: string
}
type Incomplete = {
  state: 'incomplete'
}

type LineState = 'gucci' | 'error' | 'incomplete';

type LineStateObject = Gucci | Error | Incomplete;

/* Ad-hoc objects */
const brackets = new Map([
  ['{', '}'],
  ['[', ']'],
  ['(', ')'],
  ['<', '>'],
])

const bracketErrorScores = new Map([
  [')', 3],
  [']', 57],
  ['}', 1197],
  ['>', 25137]
])

const bracketAutocompleteScores = new Map([
  [')', 1],
  [']', 2],
  ['}', 3],
  ['>', 4],
])

/* Functions */
const parseInput = (rawInput: string) => rawInput.split('\n');

function isOpening(bracket: string): boolean {
  return [...brackets.keys()].includes(bracket);
}

function getLineState(line: string) {
  const validationStack: string[] = [];
  let firstError: string | undefined = undefined;
  let state: LineState = 'gucci';
  for (let i = 0; i < line.length; i++) {
    const curr = line.charAt(i);
    if (isOpening(curr)) {
      validationStack.push(brackets.get(curr)!);
    } else {
      const last = validationStack[validationStack.length - 1];
      if (last === curr) {
        validationStack.pop();
      } else {
        state = 'error';
        firstError = curr;
        break;
      }
    }
  }
  if (state === 'error') {
    return {
      state,
      firstError: firstError!,
      validationStack
    }
  }
  if (validationStack.length > 0) {
    return {
      state: 'incomplete',
      validationStack
    }
  }
  return {
    state,
    validationStack
  }
}

function getSyntaxErrorScore(lineStates: Error[]) {
  let sum = 0;
  lineStates.forEach((i) => {
    sum = sum + bracketErrorScores.get(i.firstError)!
  })
  return sum;
}

function getAutocompleteScore(missingBrackets: string[]) {
  let next = missingBrackets.pop();
  let score = 0;
  while(next) {
    score = score * 5 + bracketAutocompleteScores.get(next)!;
    next = missingBrackets.pop();
  }
  return score;
}

/** Part 1: Syntax error score for the first wrong closing brackets */
const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  // For every opening bracket, insert its closing one in the stack.
  // For every closing bracket, pop off the last bracket in the array.
  // If matching, go on. If not, it's invalid.
  // Leave it if incomplete
  const lineStateObjects = lines.map((line) => getLineState(line))
  const score = getSyntaxErrorScore(lineStateObjects.filter((i) => i.state === 'error').map((j) => j as Error));
  return score;
}

/** Part 2: Finishing incomplete combos */
const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const lineStates = lines.map((line) => getLineState(line))
  const incompletes = lineStates.filter((i) => i.state === 'incomplete');
  const scoresOrdered = incompletes.map((i) => getAutocompleteScore(i.validationStack)).sort((a, b) => a - b);

  return scoresOrdered[(scoresOrdered.length - 1)/2];
}

const testInput = `
  [({(<(())[]>[[{[]{<()<>>
  [(()[<>])]({[<{<<[]>>(
  {([(<{}[<>[]}>{[]{[(<()>
  (((({<>}<{<{<>}{[]{[]{}
  [[<[([]))<([[{}[[()]]]
  [{[{({}]{}}([{[{{{}}([]
  {<[[]]>}<{[{[{[]{()[[[]
  [<(<(<(<{}))><([]([]()
  <{([([[(<>()){}]>(<<{{
  <{([{{}}[<[[[<>{}]]]>[]]
  `;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 26397,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 288957,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
