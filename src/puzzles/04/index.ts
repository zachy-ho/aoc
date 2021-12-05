/** 
* Advent of Code 2021
* Day 4
* Author: zachy-ho (https://github.com/zachy-ho)
* NOTE: Parts of the code are unnecessary and lots of stuff can be done more efficiently.
* It's pretty messy but hopefully code for subsequent days will be cleaner, more scalable and readable,
* even if it means finishing slower.
* */

import { readFileSync } from 'fs';
/** Part 1: Bingo with squid */
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
        console.log(`won ${this.boardsWon}`);
        console.log(`boards ${this.boards.length}`);
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

function runPart1() {
  const text = readFileSync('./input.txt', 'utf-8');
  const sections = text.split('\n\n');
  const draw = getDrawnNumbers(sections[0]);
  const boards = sections.slice(1).map((boardGrid) => new Board(boardGrid));
  const game = new BingoGame({ boards, draw });
  const winningBoard = game.getFirstWinningBoard()!;
  // Calculate
  const sum = winningBoard.getScore();

  // FINALLY
  console.log(sum * game.finalDraw!);
}

function runPart2() {
  const text = readFileSync('./input.txt', 'utf-8');
  const sections = text.split('\n\n');
  const draw = getDrawnNumbers(sections[0]);
  const boards = sections.slice(1).map((boardGrid) => new Board(boardGrid));
  const game = new BingoGame({ boards, draw });
  const finalWinner = game.getLastWinningBoard();

  // Calculate
  const sum = finalWinner!.getScore();
  console.log(sum * game.finalDraw!);
}

// runPart1();
runPart2();
