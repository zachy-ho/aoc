/** 
* Advent of Code 2021
* Day 14
* Author: zachy-ho (https://github.com/zachy-ho)
* */

import run from "aocrunner";

/* Types */

/* Classes */

/* Ad-hoc objects */

/* Functions */
const parseInput = (rawInput: string) => { 
  const [template, pairingsRaw] = rawInput.split('\n\n');
  const pairs = new Map();
  pairingsRaw.split('\n').map((line) => line.split(' -> ')).forEach((pair) => pairs.set(pair[0], pair[1]));
  return {
    template,
    pairs
  }
}


const parseInputSmart = (rawInput: string) => { 
  const [template, rulesRaw] = rawInput.split('\n\n');
  const rules = new Map();
  rulesRaw.split('\n').map((line) => line.split(' -> ')).forEach((pair) => 
    rules.set(pair[0], pair[1]));

  const pairCounts: Map<string, number> = new Map();
  const charCounts: Map<string, number> = new Map();

  for (let i = 0; i < template.length; i++) {
    if (i < template.length - 1) {
      const pair = template.slice(i, i + 2);
      increaseCount(pairCounts, pair, 1);
    }
    increaseCount(charCounts, template.charAt(i), 1);
  }


  return {
    template,
    rules,
    pairCounts,
    charCounts
  }
}

const increaseCount = (countMap: Map<string, number>, s: string, count: number) => {
  const prev = countMap.get(s) ?? 0;
  countMap.set(s, prev + count);
}

const decreaseCount = (countMap: Map<string, number>, s: string, count: number) => {
  const prev = countMap.get(s) ?? 1;
  countMap.set(s, prev - count);
}

const putSegmentInMap = (pairs: Map<string, string>, segment: string) => {
  if (pairs.has(segment)) return segment;
  let idx = 0;
  let keys = [...pairs.keys()];
  let interval = Math.min(keys[keys.length - 1].length, segment.slice(idx).length);
  let currSegment = segment.slice(idx, idx + interval);
  let replacement;
  let finalSegment = '';
  while (idx < segment.length - 1) {
    keys = [...pairs.keys()];
    interval = Math.min(keys[keys.length - 1].length, segment.slice(idx).length);
    currSegment = segment.slice(idx, idx + interval);
    while (!pairs.has(currSegment)) {
      currSegment = segment.slice(idx, idx + --interval);
    }
    replacement = pairs.get(currSegment)!;
    if (finalSegment.length === 0) {
      finalSegment = finalSegment.concat(replacement);
    } else {
      finalSegment = finalSegment.slice(0, finalSegment.length - 1).concat(replacement);
    }
    idx += interval - 1;
  }
  pairs.set(segment, finalSegment);
  return finalSegment;
}

const getPolymer = ({
  template,
  steps,
  pairs
} : {
  template: string,
  steps: number,
  pairs: Map<string, string>
}): string => {

  let polymer = template;
  while (steps > 0) {
    let newPolymer = '';
    for (let i = 0; i < polymer.length; i++) {
      newPolymer = newPolymer.concat(polymer.charAt(i));
      if (i === polymer.length - 1) break;
      const combo = polymer.charAt(i).concat(polymer.charAt(i + 1));
      newPolymer = pairs.get(combo) != null ? newPolymer.concat(pairs.get(combo)!) : newPolymer;
    }
    polymer = newPolymer;
    steps--;
  }
  return polymer;
}

const formulatePolymer = ({
  template,
  steps,
  rules,
  charCounts,
  pairCounts
} : {
  template: string,
  steps: number,
  rules: Map<string, string>,
  charCounts: Map<string, number>,
  pairCounts: Map<string, number>
}) => {
  while (steps > 0) {
    [...pairCounts.entries()].forEach(([pair, count]) => {
      const charToInsert = rules.get(pair)!;
      const leftPair = `${pair[0]}${charToInsert}`;
      const rightPair = `${charToInsert}${pair[1]}`;
      increaseCount(charCounts, charToInsert, count)
      decreaseCount(pairCounts, pair, count);
      increaseCount(pairCounts, leftPair, count);
      increaseCount(pairCounts, rightPair, count);
    })

    steps--;
  }
}

const getLetterFrequencyMap = (word: string): Map<string, number> => {
  const freqMap = new Map();
  for (let i = 0; i < word.length; i++) {
    const char = word.charAt(i);
    if (!freqMap.has(char)) {
      freqMap.set(char, 1);
      continue;
    }
    freqMap.set(char, freqMap.get(char) + 1);
  }
  return freqMap;
}

/* Part 1: Polymer template: Most common - least common */
const part1 = (rawInput: string) => {
  const { template, pairs } = parseInput(rawInput);

  const steps = 10;
  const polymer = getPolymer({ template, steps, pairs });

  const freqMap = getLetterFrequencyMap(polymer);
  const sortedFreq = [...freqMap.values()].sort((a, b) => a - b);

  return sortedFreq[sortedFreq.length - 1] - sortedFreq[0];
};

/* Part 2: Description */
const part2 = (rawInput: string) => {
  const { template, rules, charCounts, pairCounts } = parseInputSmart(rawInput);

  const steps = 40;
  formulatePolymer({ template, steps, rules, charCounts, pairCounts });

  const vals = [...charCounts.values()];
  vals.sort((a, b) => a - b);

  return vals[vals.length - 1] - vals[0];
};

/* Testing & running */
const testInput = `
NNCB

CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 1588,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 2188189693529,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
})
