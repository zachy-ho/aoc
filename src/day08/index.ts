/** 
* Advent of Code 2021
* Day 08
* Author: zachy-ho (https://github.com/zachy-ho)
* */

import run from "aocrunner";

type StandardSegment = 
'A'|
'B'|
'C'|
'D'|
'E'|
'F'|
'G';

type NonStandardSegment = 
'a'|
'b'|
'c'|
'd'|
'e'|
'f'|
'g';

type StandardisedMap = Map<NonStandardSegment, StandardSegment>;

class Entry {
  patterns: string[];
  output: string[];
  standardisedMap: StandardisedMap | undefined;

  constructor({ patterns, output } : { patterns: string[], output: string[] }) {
    this.patterns = patterns;
    this.output = output;
  }
}

const digitSegmentsMap: Map<number, number> = 
new Map([
  [0, 6],
  [1, 2],
  [2, 5],
  [3, 5],
  [4, 4],
  [5, 5],
  [6, 6],
  [7, 3],
  [8, 7],
  [9, 6],
])

const standardisedCombos: Map<string, number> =
  new Map([
    ['ABCEFG', 0],
    ['CF', 1],
    ['ACDEG', 2],
    ['ACDFG', 3],
    ['BCDF', 4],
    ['ABDFG', 5],
    ['ABDEFG', 6],
    ['ACF', 7],
    ['ABCDEFG', 8],
    ['ABCDFG', 9],
])

// const standardisedMap: StandardisedMap = 
// new Map([
  // ['A', ''],
  // ['B', ''],
  // ['C', ''],
  // ['D', ''],
  // ['E', ''],
  // ['F', ''],
  // ['G', ''],
// ]);

function getDigitLettersFor1(patterns: string[]) {
  return patterns.find((i) => i.length === 2)!.split('');
}
function getDigitLettersFor4(patterns: string[]) {
  return patterns.find((i) => i.length === 4)!.split('');
}
function getDigitLettersFor7(patterns: string[]) {
  return patterns.find((i) => i.length === 3)!.split('');
}
function getDigitLettersFor8(patterns: string[]) {
  return patterns.find((i) => i.length === 7)!.split('');
}
function getDigitLettersFor0(patterns: string[]) {

}
function getDigitLettersFor2(patterns: string[]) {

}
function getDigitLettersFor3(patterns: string[]) {

}
function getDigitLettersFor5(patterns: string[]) {

}
function getDigitLettersFor6(patterns: string[]) {
}
function getDigitLettersFor9(patterns: string[]) {

}
function getBNonStandard({
  sixSegments,
  digitLettersFor1,
  digitLettersFor4
} : {
  sixSegments: string[][],
  digitLettersFor1: string[],
  digitLettersFor4: string[] 
}) {
  const bAndF = sixSegments.reduce((prev, curr) => {
    return curr!.filter((i) => prev!.includes(i));
  }, digitLettersFor4);
  return {
    bAndF,
    bNonStandard: bAndF!.filter((i) => !digitLettersFor1.includes(i)).join('')
  }
}

function getFNonStandard({ 
  bAndF,
  b 
} : {
  bAndF: string[],
  b: string
}) {
  const fNonStandard = bAndF!.filter((i) => ![b].includes(i)).join('');
  return fNonStandard;
}

function getCNonStandard({ 
  fNonStandard,
  digitLettersFor1
} : {
  fNonStandard: string,
  digitLettersFor1: string[]
}) {
  return digitLettersFor1.filter((i) => i !== fNonStandard).join('');
}

function getEAndG({
  fiveSegments,
  standardisedMap 
} : {
  fiveSegments: string[][],
  standardisedMap: StandardisedMap
}) {
  const unknownLetters = fiveSegments.map((digit) => (
    digit.filter((i) => ![...standardisedMap.keys()].includes(i as NonStandardSegment))
  ));
  const remainingFor2 = unknownLetters.find((digit) => digit.length === 2);
  const g = unknownLetters.find((digit) => digit.length === 1)!.join('');
  const e = remainingFor2!.filter((i) => i !== g).join('');
  return {
    eNonStandard: e,
    gNonStandard: g
  }
}

function getDNonStandard({
  digitLettersFor4,
  standardisedMap
} : {
  digitLettersFor4: string[],
  standardisedMap: StandardisedMap
}) {
  const entries = [...standardisedMap.entries()];
  const b = entries.filter((entry) => entry[1] === 'B')[0][0];
  const c = entries.filter((entry) => entry[1] === 'C')[0][0];
  const f = entries.filter((entry) => entry[1] === 'F')[0][0];
  return digitLettersFor4.filter((i) => ![b, c, f].includes(i as NonStandardSegment)).join('');
}

// Assuming every entry has a representation for each digit (0 - 9)
function createStandardisedMap(entry: Entry): StandardisedMap {
  const standardisedMap = new Map();
  // TODO How to determine what non-standardised letter is mapping to?
  const digitLettersFor1 = getDigitLettersFor1(entry.patterns);
  const digitLettersFor4 = getDigitLettersFor4(entry.patterns);
  const digitLettersFor7 = getDigitLettersFor7(entry.patterns);
  const digitLettersFor8 = getDigitLettersFor8(entry.patterns);
  const fiveSegments = entry.patterns.filter((i) => i.length === 5).map((i) => Array.from(i));
  const sixSegments = entry.patterns.filter((i) => i.length === 6).map((i) => Array.from(i));
  // Determine A : Compare 1 & [7] 
  standardisedMap.set(digitLettersFor7.filter((i) => !digitLettersFor1.includes(i)).join(''), 'A');

  // Determining B & F :
  // Determine B first by getting common letters among 0, (4, 6, 9) 6-segments, 
  // get difference between 1 and common letters among those segments
  const { bAndF, bNonStandard } = getBNonStandard({ sixSegments, digitLettersFor1, digitLettersFor4 });
  standardisedMap.set(bNonStandard, 'B');

  // Determine F
  const fNonStandard = getFNonStandard({ bAndF, b: bNonStandard });
  standardisedMap.set(fNonStandard, 'F');

  // Determine C : Can find from letters for 1 using fNonStandard
  const cNonStandard = getCNonStandard({ fNonStandard, digitLettersFor1 });
  standardisedMap.set(cNonStandard, 'C');

  // Determine D : I have b, c, and f now. Use those with digit letters for 4 to find D
  const dNonStandard = getDNonStandard({ digitLettersFor4, standardisedMap });
  standardisedMap.set(dNonStandard, 'D');

  // Determine E & G : Last ones
  const { eNonStandard, gNonStandard } = getEAndG({ fiveSegments, standardisedMap });
  standardisedMap.set(eNonStandard, 'E');
  standardisedMap.set(gNonStandard, 'G');

  return standardisedMap;
}

// abfg, ceea, befafg
// abfg -> FEDA -> 2938
function getOutputNumber({ 
  map,
  output 
} : {
  map: StandardisedMap,
  output: string[]
}): number {
  // TODO
  let number = 0;
  let numberStr = '';
  output.forEach((i) => {
    // Convert each letter to its standardised counterpart
    const standardisedCombo: string = Array.from(i).map((letter) => 
      map.get(letter as NonStandardSegment)!
    ).sort().join('');

    // From standardised combo, convert to number
    numberStr = numberStr.concat(standardisedCombos.get(standardisedCombo)!.toString());
  })
  return parseInt(numberStr);
}

function sortString(s: string): string {
  return Array.from(s).sort().join('');
}

const parseInput = (rawInput: string) => {
  const rawLines = rawInput.split('\n').map((line) => line.split(' | '));
  const entries = rawLines.map((line) => {
    const patterns = line[0].split(' ').map((i) => sortString(i));
    const output = line[1].split(' ').map((i) => sortString(i));
    return new Entry({ patterns, output });
  })
  return entries;
};

/** Part 1: How many times do the easy digits 1, 4, 7 and 8 appear? */
const part1 = (rawInput: string) => {
  const entries = parseInput(rawInput);
  const uniqueSegmentCounts = [1, 4, 7, 8].map((i) => digitSegmentsMap.get(i));
  console.log(uniqueSegmentCounts)
  let count = 0;
  entries.forEach((entry) => {
    entry.output.forEach((i) => {
      if (uniqueSegmentCounts.includes(i.length)) count++;
    })
  });

  return count;
};

/** Part 2: Sum of all output numbers */
const part2 = (rawInput: string) => {
  const entries = parseInput(rawInput);
  entries.forEach((entry) => {
    const map = createStandardisedMap(entry)
    entry.standardisedMap = map;
  });
  const sum = entries.reduce((prev, curr) => (
    prev + getOutputNumber({ map: curr.standardisedMap!, output: curr.output })
  ), 0);

  return sum;
};

const testInput = `
be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
`

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 26,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 61229,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
