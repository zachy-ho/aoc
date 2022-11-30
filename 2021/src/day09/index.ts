/** 
* Advent of Code 2021
* Day 09
* Author: zachy-ho (https://github.com/zachy-ho)
* */

import run from "aocrunner";

type HeightMap = Point[][];

class Cave {
  heightMap: HeightMap;
  basins: Point[][];

  constructor(heightMap: HeightMap) {
    this.heightMap = heightMap;
    this.basins = [];
  }

  get numberOfPoints(): number {
    return this.heightMap.length * this.heightMap[0].length;
  }

  get points(): string[] {
    const pointsInId: string[] = [];
    this.heightMap.forEach((row) => {
      row.forEach((point) => {
        pointsInId.push(point.id);
      })
    })
    return pointsInId;
  }

  getLargestBasins(count: number) {
    return this.basins.sort((a, b) => (b.length - a.length)).slice(0, count);
  }
}

class Point {
  height: number;
  row: number;
  col: number;

  constructor({ height, row, col }: { height: number, row: number, col: number }) {
    this.height = height;
    this.row = row;
    this.col = col;
  }

  get id() {
    return `${this.row}|${this.col}`;
  }

  isLowestNeighbor(neighbors: Point[]) {
    return neighbors.every((neighbor) => neighbor.height > this.height)

  }

  getNeighbors(heightMap: HeightMap): Point[] {
    const neighborIndices = [
      // Top
      [this.row - 1, this.col],
      // Left
      [this.row, this.col - 1],
      // Right
      [this.row, this.col + 1],
      // Bottom
      [this.row + 1, this.col],
    ].filter((neighbor) => (neighbor[0] >= 0 && neighbor[0] < heightMap.length) && (neighbor[1] >= 0 && neighbor[1] < heightMap[0].length));
    return neighborIndices.map(([row, col]) => heightMap[row][col]);
  }
}

const parseInput = (rawInput: string): Cave => {
  const lines = rawInput.split('\n');
  const heightMap = [];
  for (let row = 0; row < lines.length; row++) {
    const pointsInRow = [];
    const line = lines[row].split('');
    for (let col = 0; col < line.length; col++) {
      pointsInRow.push(new Point({ height: parseInt(lines[row][col]), row, col}));
    }
    heightMap.push(pointsInRow);
  }
  return new Cave(heightMap);
};

function getHeightsOfLowestPoints(heightMap: HeightMap): number[] {
  const heights: number[] = [];
  heightMap.forEach((row) => {
    row.forEach((point) => {
      if (point.isLowestNeighbor(point.getNeighbors(heightMap))) {
        heights.push(point.height);
      }
    })
  })
  return heights;
}

/** Part 1: Find sum of risk levels of lowest points */
const part1 = (rawInput: string) => {
  const cave = parseInput(rawInput);
  const heights = getHeightsOfLowestPoints(cave.heightMap).map((height) => height + 1);

  return heights.reduce((prev, curr) => prev + curr);
};

/** Part 2: Find sum of points in three largest basins */
const part2 = (rawInput: string) => {
  const cave = parseInput(rawInput);

  // Data structures:
  const processed: Set<string> = new Set();
  const queue: Point[] = [];
  const toBeProcessed: Set<string> = new Set();
  let notProcessed = new Set(cave.points);

  // Steps:
  queue.push(cave.heightMap[0][0]);
  toBeProcessed.add(cave.heightMap[0][0].id)
  while (processed.size < cave.numberOfPoints) {
    const basin = [];
    while (queue.length > 0) {
      const currPoint = queue.shift()!;
      toBeProcessed.delete(currPoint.id);
      if (!processed.has(currPoint.id)) {
        processed.add(currPoint.id);
        notProcessed.delete(currPoint.id);
      }
      if (currPoint.height === 9) continue;
      currPoint.getNeighbors(cave.heightMap).forEach((neighbor) => {
        if (!processed.has(neighbor.id) && !toBeProcessed.has(neighbor.id)) {
          queue.push(neighbor);
          toBeProcessed.add(neighbor.id);
        }
      });
      basin.push(currPoint);
    }
    if (basin.length > 0) {
      cave.basins.push(basin);
    }
    if (notProcessed.size > 0) {
      const row = parseInt([...notProcessed.values()][0].split('|')[0]);
      const col = parseInt([...notProcessed.values()][0].split('|')[1]);
      queue.push(cave.heightMap[row][col]);
      toBeProcessed.add(cave.heightMap[row][col].id);
    }
  }

  const threeLargestBasins = cave.getLargestBasins(3);
  const basinSizes = threeLargestBasins.map((basin) => basin.length)

  return basinSizes.reduce((prev, curr) => prev * curr);
}

const testInput = `
2199943210
3987894921
9856789892
8767896789
9899965678
`

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 15,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 1134,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
