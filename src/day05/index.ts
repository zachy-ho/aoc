/** 
* Advent of Code 2021
* Day 05
* Author: zachy-ho (https://github.com/zachy-ho)
* */

import run from "aocrunner";

type Coordinates = {
  x: number,
  y: number
}

class SeaDataManager {
  static maxWidth: number = 0;
  static maxHeight: number = 0;

  static unpackCoordinates(s: string): { x1: number, x2: number, y1: number, y2: number} {
    const points = s.split(' -> ');
    let [[x1Str, y1Str], [x2Str, y2Str]] = points.map((point) => point.split(','));
    const [x1, x2, y1, y2] = [x1Str, x2Str, y1Str, y2Str].map((i) => parseInt(i));

    this.updateMaxValues({x1, x2, y1, y2});

    return {
      x1,
      x2,
      y1,
      y2
    }
  }

  static updateMaxValues({
    x1,
    x2,
    y1,
    y2 
  }: {
      x1: number,
      x2: number,
      y1: number,
      y2: number,
    }) {
      if (x1 > this.maxWidth) this.maxWidth = x1;
      if (x2 > this.maxWidth) this.maxWidth = x2;
      if (y1 > this.maxWidth) this.maxHeight = y1;
      if (y2 > this.maxWidth) this.maxHeight = y2;
    }
}

class Grid {
  grid: number[][];
  overlappedPoints: Set<string>;

  constructor({ height, width } : { height: number, width: number }) {
    this.grid = Array.from(Array(height + 1), _x => Array.from(Array(width + 1), _x => 0));
    this.overlappedPoints = new Set<string>();
  }

  markLinesOnGrid(lines: Line[]) {
    lines.forEach((line) => {
      const points = line.getPointsOnLine();
      points.forEach((point) => {
        if (++this.grid[point.x][point.y] > 1) {
          this.overlappedPoints.add(`${point.x}|${point.y}`);
        }
      })
    })
  }
}

class Line {
  x1: number;
  x2: number;
  y1: number;
  y2: number;

  constructor(lineStr: string) {
    const { x1, x2, y1, y2 } = SeaDataManager.unpackCoordinates(lineStr);
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
  }

  isBasic() {
    return this.isHorizontal() || this.isVertical();
  }

  isDiagonal() {
  return !this.isBasic();
  }

  isHorizontal(): boolean {
    return this.y1 === this.y2;
  }

  isVertical(): boolean {
    return this.x1 === this.x2;
  }

  getPointsOnLine(): Coordinates[] {
    let points: Coordinates[] = [];
    if (this.isDiagonal()) {
      let numPoints = Math.abs(this.x1 - this.x2) + 1;
      let nextX = this.x1;
      let nextY = this.y1;
      while(numPoints > 0) {
        points.push({ x: nextX, y: nextY});
        numPoints--;
        nextX = nextX < this.x2 ? nextX + 1 : nextX - 1;
        nextY = nextY < this.y2 ? nextY + 1 : nextY - 1;
      }
      return points;
    }
    if (this.isHorizontal()) {
      const xVals: number[] = [...Array(Math.abs(this.x2 - this.x1) + 1).keys()]
        .map((_val, i) => i + Math.min(this.x1, this.x2))
      points = xVals.map((x) => ({ x, y: this.y1 }));
    } else {
      const yVals: number[] = [...Array(Math.abs(this.y2 - this.y1) + 1).keys()]
        .map((_val, i) => i + Math.min(this.y1, this.y2))
      points = yVals.map((y) => ({ x: this.x1, y }));
    }
    return points;
  }
}

const parseInput = (rawInput: string) => {
  const split = rawInput.split('\n');
  return split.filter((line) => line !== '').map((line) => new Line(line));
}

/** Part 1 & 2: Number of overlapping hydrothermal lines */
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);


  const { maxHeight, maxWidth } = SeaDataManager;
  const grid = new Grid({ height: maxHeight, width: maxWidth});
  grid.markLinesOnGrid(input.filter((line) => line.isBasic()));
  return grid.overlappedPoints.size;
};

/** Part 2: Description */
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const { maxHeight, maxWidth } = SeaDataManager;
  const grid = new Grid({ height: maxHeight, width: maxWidth});
  grid.markLinesOnGrid(input);
  return grid.overlappedPoints.size;
};

const testInput = `
0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2
`

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 5,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 12,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
