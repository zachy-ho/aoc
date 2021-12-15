/** 
* Advent of Code 2021
* Day 13
* Author: zachy-ho (https://github.com/zachy-ho)
* */

import run from "aocrunner";

/* Types */
// [x, y]. Whenever we index the grid, we have to do grid[y][x], since x is the column and y is the row.
type Coordinates = [number, number];
type Instruction = [string, number]
type Paper = {
  grid: string[][] | undefined,
  fold: (instruction: Instruction) => string[][] | undefined,
  countDots: () => number
}

/* Classes */

/* Ad-hoc objects */
const paper: Paper = {
  grid: undefined,
  fold: (instruction: Instruction): string[][] | undefined => {
    if (paper.grid === undefined) return undefined;
    
    switch (instruction[0]) {
      // Fold along x (folding line is vertical)
      case 'x':
        const maxX = paper.grid[0].length;
        let col = instruction[1] + 1;
        while(col < maxX) {
          const colToBeStacked = instruction[1] - (col - instruction[1]);
          for (let row = 0; row < paper.grid.length; row++) {
            if (!isDotted(paper.grid[row][col])) continue;
            paper.grid[row][colToBeStacked] = paper.grid[row][col];
          }
          col++;
        }

        paper.grid.map((_row, index) => paper.grid![index] = paper.grid![index].slice(0, instruction[1]))
        break;

      // Fold along y (folding line is horizontal)
      case 'y':
        const maxY = paper.grid.length;
        let row = instruction[1] + 1;
        while(row < maxY) {
          const rowToBeStacked = instruction[1] - (row - instruction[1]);
          for (let col = 0; col < paper.grid[rowToBeStacked].length; col++) {
            if (!isDotted(paper.grid[row][col])) continue;
            paper.grid[rowToBeStacked][col] = paper.grid[row][col];
          }
          row++;
        }

        paper.grid = paper.grid.slice(0, instruction[1]);
        break;
    }
  },
  countDots: (): number => {
    let dots = 0;
    for (let row = 0; row < paper.grid!.length; row++) {
      for (let col = 0; col < paper.grid![row].length; col++) {
        dots = isDotted(paper.grid![row][col]) ? dots + 1 : dots;
      }
    }
    return dots;
  }
}

/* Functions */
const parseInput = (rawInput: string) => {
  const [coordsRaw, instructionsRaw] = rawInput.split('\n\n');
  let maxX = 0, maxY = 0;
  const coordinates: Coordinates[]= coordsRaw.split('\n')
    .map((i) => i.split(',').map((j, index) => { 
    if (index === 0) maxX = Math.max(maxX, parseInt(j));
    if (index === 1) maxY = Math.max(maxY, parseInt(j));
    return parseInt(j)
      }
  ) as Coordinates);

  const instructions = instructionsRaw.split('\n')
    .map((line) => line.split(' ').slice(2)[0].split('=').map((i, index) => {
      if (index === 1) return parseInt(i);
      return i
    }) as Instruction)
  ;

  return {
    maxX, 
    maxY,
    coordinates,
    instructions
  }
};

const isDotted = (s: string): boolean => {
  return s === '#';
}

/* Part 1: 1x fold on transparent paper */
const part1 = (rawInput: string) => {
  const { maxX, maxY, coordinates, instructions} = parseInput(rawInput);
  paper.grid = Array(maxY + 1).fill([]).map((_i) => Array(maxX + 1).fill('.'));
  coordinates.forEach(([x, y]) => {
    paper.grid![y][x] = '#'
  })

  paper.fold(instructions[0]);
  const dots = paper.countDots();
  
  return dots;
};

/* Part 2: Description */
const part2 = (rawInput: string) => {
  const { maxX, maxY, coordinates, instructions} = parseInput(rawInput);
  paper.grid = Array(maxY + 1).fill([]).map((_i) => Array(maxX + 1).fill('.'));
  coordinates.forEach(([x, y]) => {
    paper.grid![y][x] = '#'
  })

  instructions.forEach((instruction) => paper.fold(instruction));

  // Result (8 capital letters) is manually assessed 
  console.table(paper.grid);
};

/* Testing & running */
const testInput = `
6,10
0,14
9,10
0,3
10,4
4,11
6,0
6,12
4,1
0,13
10,12
3,4
3,0
8,4
1,10
2,14
8,10
9,0

fold along y=7
fold along x=5
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 17,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: "",
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
