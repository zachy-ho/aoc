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

/** Part 2: Description */
const part2 = (rawInput: string) => {
  const cave = parseInput(rawInput);

  // Data structures:
  // Have an empty array to keep track of processed points (processed)
  // Store each point as strings of their coordinates (i.e. '1|5' for row = 1, col 5)
  const processed: string[] = [];
  // Have an array to act as a queue
  const queue: Point[] = [];
  const queueInId: string[] = [];
  // Have an array to store basins found (use cave.basins)

  // Have an array that's updated every time a basin is formed to record points that are left to be processed
  let notProcessed = [...cave.points];

  // Steps:
  queue.push(cave.heightMap[0][0]);
  // Start with a queue containing only the first point in points
  queueInId.push(cave.heightMap[0][0].id)
  let someBool = 0;
  // While (processed.length < total number of points)
  while (processed.length < cave.numberOfPoints) {
    // New group []
    const basin = [];
    // While (queue is not empty)
    while (queue.length > 0) {
      const currPoint = queue.shift()!;
      queueInId.shift();
      // Whenever a point is processed (skipped or fully processed), put it in processed
      if (!processed.includes(currPoint.id)) {
        processed.push(currPoint.id);
      }
      // If currPoint has a value of 9, skip it
      if (currPoint.height === 9) continue;
      // Go through each neighbor (top, left, right, bottom) for each point in the queue and put them in the queue 
      // (if they exist,
      // , i.e. if they are within the boundaries of the map)
      // and if they aren't processed yet
      // if (currPoint.row === 2 && currPoint.col === 9) {
        // console.log(`this: ${JSON.stringify(currPoint, null, 4)}`);
        // someBool++;
      // }
      currPoint.getNeighbors(cave.heightMap).forEach((neighbor) => {
        if (!processed.includes(neighbor.id) && !queueInId.includes(neighbor.id)) {
          // if (currPoint.row === 2 && currPoint.col === 9) {
            // console.log(`neighbor: ${JSON.stringify(neighbor,null,4)}`);
            // someBool++;
          // }
          queue.push(neighbor);
          queueInId.push(neighbor.id);
        }
      });
      // Add it to the current basin
      basin.push(currPoint);
    }
    // Classify this group of points as its own basin
    if (basin.length > 0) {
      cave.basins.push(basin);
    }
    notProcessed = [...cave.points.filter((point) => !processed.includes(point))].sort();
    if (notProcessed.length > 0) {
      const row = parseInt(notProcessed[0].split('|')[0]);
      const col = parseInt(notProcessed[0].split('|')[1]);
      queue.push(cave.heightMap[row][col]);
      queueInId.push(cave.heightMap[row][col].id);
    }
  }

  // console.log(cave.basins);

  const threeLargestBasins = cave.getLargestBasins(3);
  const basinSizes = threeLargestBasins.map((basin) => basin.length)
  // console.log(threeLargestBasins);

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
