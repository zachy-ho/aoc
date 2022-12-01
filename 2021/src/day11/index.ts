/** 
* Advent of Code 2021
* Day 11
* Author: zachy-ho (https://github.com/zachy-ho)
* */

import run from "aocrunner";

/* Types */

/* Classes */
class Octopus {
  row: number;
  col: number;
  energy: number;
  justFlashed: boolean;

  constructor({ row, col, energy } : { row: number, col: number, energy: number}) {
    this.row = row;
    this.col = col;
    this.energy = energy;
    this.justFlashed = false;
  }

  get id(): string {
    return `${this.row},${this.col}`;
  }

  neighbors(grid: Octopus[][]): Octopus[] {
    const neighborIndices = [
      // Top-left
      [this.row - 1, this.col - 1],
      // Top-middle
      [this.row - 1, this.col],
      // Top-right
      [this.row - 1, this.col + 1],
      // Left
      [this.row, this.col - 1],
      // Right
      [this.row, this.col + 1],
      // Bottom-left
      [this.row + 1, this.col - 1],
      // Bottom-middle
      [this.row + 1, this.col],
      // Bottom-right
      [this.row + 1, this.col + 1],
    ].filter((i) => { 
      return (i[0] >= 0 && i[0] <= 9) && (i[1] >= 0 && i[1] <= 9)
    });
    const neighbors = neighborIndices.map((i) => grid[i[0]][i[1]]);
    
    return neighbors;
  }

  flash(grid: Octopus[][], flashStack: Octopus[]): number {
    let numFlashes = 1;
    this.energy = 0;
    this.justFlashed = true;
    flashStack.push(this);
    // Increase energy of neighbors
    this.neighbors(grid).forEach((neighbor) => {
      if (neighbor.justFlashed) return;
      neighbor.increaseEnergy();
      if (neighbor.energy === 10) {
        numFlashes += neighbor.flash(grid, flashStack);
      }
    })
    return numFlashes;
  }

  increaseEnergy() {
    this.energy++;
  }
}

/* Ad-hoc objects */

/* Functions */
const parseInput = (rawInput: string): Octopus[][] => {
  const rows = rawInput.split('\n');
  const grid: Octopus[][] = [];
  rows.forEach((row, rowIdx) => {
    const thisRow = [];
    for (let i = 0; i < row.length; i++ ) {
      const curr = parseInt(row.charAt(i));
      thisRow.push(new Octopus({
        row: rowIdx,
        col: i,
        energy: curr
      }));
    }
    grid.push(thisRow);
  })
  return grid;
};

/* Part 1: Dumbo jellyfish flashes */
const part1 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  let steps = 100;

  const flashStack: Octopus[] = [];
  let numFlashes = 0;

  while (steps > 0) {
    // Add 1 to every octopus
    grid.forEach((row) => {
      row.forEach((oct) => {
        if (!oct.justFlashed) {
          oct.increaseEnergy();
        }
        if (oct.energy === 10) {
          numFlashes += oct.flash(grid,flashStack);
        }
      })
    })
    flashStack.forEach((flashedOct) => {flashedOct.justFlashed = false});
    flashStack.splice(0, flashStack.length);

    steps--;
  }

  return numFlashes;
};

/* Part 2: Description */
const part2 = (rawInput: string) => {
  const grid = parseInput(rawInput);
  let steps = 0;

  const flashStack: Octopus[] = [];
  let firstSyncFlash = 0;

  while (true) {
    // Add 1 to every octopus
    grid.forEach((row) => {
      row.forEach((oct) => {
        if (!oct.justFlashed) {
          oct.increaseEnergy();
        }
        if (oct.energy === 10) {
          oct.flash(grid, flashStack);
        }
      })
    })
    if (flashStack.length === 100) {
      firstSyncFlash = steps + 1;
      break;
    };
    flashStack.forEach((flashedOct) => {flashedOct.justFlashed = false});
    flashStack.splice(0, flashStack.length);

    steps++;
  }

  return firstSyncFlash;
};

/* Testing & running */
const testInput = `
5483143223
2745854711
5264556173
6141336146
6357385478
4167524645
2176841721
6882881134
4846848554
5283751526
`;

const testInput2 = `
11111
19991
19191
19991
11111
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 1656,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 195,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
