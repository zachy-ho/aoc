/** 
* Advent of Code 2021
* Day 12
* Author: zachy-ho (https://github.com/zachy-ho)
* */

import run from "aocrunner";

/* Types */
type Size = 'big' | 'smol';

/* Classes */
class Cave {
  name: string;
  neighbors: string[];
  traversed: boolean;

  constructor(name: string) {
    this.name = name;
    this.neighbors = [];
    this.traversed = false;
  }

  get size(): Size {
    return this.name.charAt(0) === this.name.charAt(0).toUpperCase() 
      ? 'big' 
      : 'smol';
  }
}

/* Ad-hoc objects */

/* Functions */
const parseInput = (rawInput: string) => rawInput.split('\n');

const createCaves = (lines: string[]): Map<string, Cave> => {
  const caveSet: Set<string> = new Set<string>();
  const caveMap: Map<string, Cave> = new Map<string, Cave>();
  lines.forEach((line) => { 
    const caves = line.split('-');
    caves.forEach((caveName) => {
      if (caveSet.has(caveName)) return 
      caveMap.set(caveName, new Cave(caveName));
      caveSet.add(caveName);
    })
    // Add each other as neighbors;
    caves.forEach((caveName, index) => {
      const curr = caveMap.get(caveName)!;
      const other = index === 0 ? caveMap.get(caves[index + 1])! : caveMap.get(caves[index - 1])!;
      if (curr.neighbors.includes(other.name)) return;
      curr.neighbors.push(other.name);
      other.neighbors.push(curr.name);
    })
  })

  return caveMap;
}

const traverse = ({
  caveMap,
  pathSoFar,
  uniquePaths
}
: {
  caveMap: Map<string, Cave>,
  pathSoFar: string[],
  uniquePaths: Cave[][]
}) => {
  const cave = caveMap.get(pathSoFar[pathSoFar.length - 1])!;

  // Unique path found!
  if (cave.name === 'end') {
    uniquePaths.push(pathSoFar.map((i) => caveMap.get(i)!));
    return;
  }

  cave.neighbors.forEach((neighborName) => {
    const next = caveMap.get(neighborName)!;

    // If it's a smol cave that's already been traversed, ignore
    if (next.name === 'start' || (next.size === 'smol' && pathSoFar.includes(next.name))) return;
    pathSoFar.push(neighborName);
    traverse({ caveMap, uniquePaths, pathSoFar });
    pathSoFar.pop();
  })

  return;
}

let specialSmolCave = '';

const traverse2 = ({
  caveMap,
  pathSoFar,
  uniquePaths
}
: {
  caveMap: Map<string, Cave>,
  pathSoFar: string[],
  uniquePaths: Cave[][]
}) => {
  const cave = caveMap.get(pathSoFar[pathSoFar.length - 1])!;

  // console.log(`TOP thisCave: ${cave.name}, pathSoFar: ${pathSoFar}`)
  // Unique path found!
  if (cave.name === 'end') {
    uniquePaths.push(pathSoFar.map((i) => caveMap.get(i)!));
    return;
  }

  cave.neighbors.forEach((neighborName) => {
    const next = caveMap.get(neighborName)!;

    // If it's a smol cave that's already been traversed, ignore
    if (neighborName === 'start' 
      || (next.size === 'smol' 
        && specialSmolCave !== ''
        && pathSoFar.includes(neighborName))) {
      return;
    }
    if (next.size === 'smol' && pathSoFar.includes(neighborName)) {
      specialSmolCave = neighborName;
    }
    pathSoFar.push(neighborName);
    // console.log(`neighborName: ${neighborName}, pathSoFar: ${pathSoFar}`)
    traverse2({ caveMap, uniquePaths, pathSoFar });
    const previousBacktracked = pathSoFar.pop();
    if (previousBacktracked === specialSmolCave) specialSmolCave = '';
  })

  return;
}

/* Part 1: Number of unique paths */
const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  // We need to keep track of:
  // - Unique paths (Cave[][])
  // - Start cave, end cave

  // Think of 'caves' as nodes in a graph
  // From input, build 'caves' for each unique string.
  // Each cave needs to have a list of other caves that it's immendiately connected to (direct neighbor)
  // Starting from the 'start' cave, go through each neighboring cave with a recursive DFS approach

  // if we hit the 'end' cave, we record the names of caves that got travelled to in uniquePaths
  // then we go back one node and visit the next neighbor.

  // if we hit a non-'end' cave and can't go anywhere anymore, simply traverse back and visit the next neighbor
  
  // Do this until all of 'start' cave's direct neighbors have been exhausted.

  // At the end, we return the length of uniquePaths
  const caveMap = createCaves(lines);
  const startingCave = caveMap.get('start')!;
  const uniquePaths: Cave[][] = [];
  startingCave.neighbors.forEach((neighbor) => {
    const pathSoFar = [startingCave.name];
    pathSoFar.push(neighbor)
    traverse({ caveMap, uniquePaths, pathSoFar });
  })

  return uniquePaths.length;
};

/* Part 2: 1x small cave can be travelled twice */
const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);
  const caveMap = createCaves(lines);
  const startingCave = caveMap.get('start')!;
  const uniquePaths: Cave[][] = [];
  startingCave.neighbors.forEach((neighbor) => {
    const pathSoFar = [startingCave.name];
    pathSoFar.push(neighbor)
    traverse2({ caveMap, uniquePaths, pathSoFar });
  })

  return uniquePaths.length;
};

/* Testing & running */
const testInputs = {
  testInput1: `
  start-A
  start-b
  A-c
  A-b
  b-d
  A-end
  b-end
  `,
  testInput2: `
  dc-end
  HN-start
  start-kj
  dc-start
  dc-HN
  LN-dc
  HN-end
  kj-sa
  kj-HN
  kj-dc
  `,
  testInput3: `
  fs-end
  he-DX
  fs-he
  start-DX
  pj-DX
  end-zg
  zg-sl
  zg-pj
  pj-he
  RW-he
  fs-DX
  pj-RW
  zg-RW
  start-pj
  he-WI
  zg-he
  pj-fs
  start-RW
  `
}

run({
  part1: {
    tests: [
      {
        input: testInputs.testInput1,
        expected: 10,
      },
      {
        input: testInputs.testInput2,
        expected: 19,
      },
      {
        input: testInputs.testInput3,
        expected: 226,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInputs.testInput1,
        expected: 36,
      },
      {
        input: testInputs.testInput2,
        expected: 103,
      },
      {
        input: testInputs.testInput3,
        expected: 3509,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
