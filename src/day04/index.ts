/** 
* Advent of Code 2021
* Day xx
* Author: zachy-ho (https://github.com/zachy-ho)
* */

import run from "aocrunner";


type Coordinates = {
  x: number,
  y: number
}

type NumbersMap = Map<number, { 
    row: Coordinates,
    col: Coordinates
    marked: boolean
  }> 

class BingoGame {
  draw: number[];
  boards: Board[];
  firstFound: boolean;
  lastFound: boolean;
  finalDraw: number | undefined;
  finalWinner: Board | undefined;
  boardsWon: number;
  
  constructor({ boards, draw }: { boards: Board[], draw: number[] }) {
    this.draw = draw;
    this.boards = boards;
    this.firstFound = false;
    this.lastFound = false;
    this.finalDraw = undefined;
    this.finalWinner = undefined;
    this.boardsWon = 0;
  }

  getFirstWinningBoard() {
    for (const num of this.draw) {
      for (const board of this.boards) {
        if (!board.numbers.has(num)) continue;
        this.markNumber(board, num)
        if (this.firstFound) {
          this.finalDraw = num;
          return board;
        }
      }
    }
    return null;
  }

  getLastWinningBoard() {
    this.play();
    if (this.finalWinner != null) return this.finalWinner;
    return null;
  }

  play() {
    const exhaustableDraw = [...this.draw];
    while(exhaustableDraw.length > 0) {
      const curr = exhaustableDraw.shift()!;
      for (const board of this.boards) {
        if (!board.numbers.has(curr)) continue;
        if (board.won) continue;
        this.markNumber(board, curr)
        if (this.boardsWon === this.boards.length) {
          this.finalDraw = curr;
          this.finalWinner = board;
          return;
        };
      }
    }
  }

  markNumber(board: Board, num: number) {
    const { row, col } = board.numbers.get(num)!;
    board.numbers.set(num, {
      ...board.numbers.get(num)!,
      marked: true
    })
    board.rows[row.x][row.y] = -1;
    if (board.rows[row.x].every((i) => i === -1)) {
      this.firstFound = true;
      if (!board.won) {
        this.boardsWon += 1;
        board.won = true;
      }
    }
    board.cols[col.x][col.y] = -1;
    if (board.cols[col.x].every((i) => i === -1)) { 
      this.firstFound = true;
      if (!board.won) {
        this.boardsWon += 1;
        board.won = true;
      }
    }
  }
}

class Board {
  rows: number[][];
  cols: number[][];
  numbers: NumbersMap;
  won: boolean;

  constructor(gridStr: string) {
    const rows = gridStr.split('\n')
      .map((row) => row.split(/\s+/)
      .filter((i) => i !== '')
      .map((i) => parseInt(i)))
      .filter((row) => row.length > 0);
    const cols: number[][] = [];
    const numbers = new Map();
    for (let i = 0; i < rows.length; i++) {
      if (!cols[i]) cols[i] = [];
      for (let j = 0; j < rows[i].length; j++) {
        cols[i].push(rows[j][i]);
        numbers.set(rows[i][j], {
          row: {
            x: i,
            y: j
          },
          col: {
            x: j,
            y: i
          }
        })
      }
    }
    this.rows = rows;
    this.cols = cols;
    this.numbers = numbers;
    this.won = false;
  }

  getScore() {
    let sum = 0;
    const nums = this.numbers.keys();
    let currNum = nums.next().value;
    while(currNum != null) {
      if (!this.numbers.get(currNum)?.marked) {
        sum += currNum;
      }
      currNum = nums.next().value;
    }

    return sum;
  }
}

function getDrawnNumbers(s: string): number[] {
  return s.split(',').map((i) => parseInt(i));
}

const parseInput = (rawInput: string) => rawInput.split('\n\n');

/** Part 1: Bingo with squid */
const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const draw = getDrawnNumbers(input[0]);
  const boards = input.slice(1).map((boardGrid) => new Board(boardGrid));
  const game = new BingoGame({ boards, draw });
  const winningBoard = game.getFirstWinningBoard()!;
  // Calculate
  const sum = winningBoard.getScore();

  return sum * game.finalDraw!;
};

/** Part 2: Description */
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);
  const draw = getDrawnNumbers(input[0]);
  const boards = input.slice(1).map((boardGrid) => new Board(boardGrid));
  const game = new BingoGame({ boards, draw });
  const finalWinner = game.getLastWinningBoard();

  return finalWinner!.getScore() * game.finalDraw!;
};

const testInput = `
7,4,9,5,11,17,23,2,0,14,21,24,10,16,13,6,15,25,12,22,18,20,8,19,3,26,1

22 13 17 11  0
 8  2 23  4 24
21  9 14 16  7
 6 10  3 18  5
 1 12 20 15 19

 3 15  0  2 22
 9 18 13 17  5
19  8  7 25 23
20 11 10 24  4
14 21 16 12  6

14 21 17 24  4
10 16 15  9 19
18  8 23 26 20
22 11 13  6  5
 2  0 12  3  7
`

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 4512,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: testInput,
        expected: 1924,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
