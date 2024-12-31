/* Part 1 */
import * as fs from 'fs';

const input = fs.readFileSync('./input.txt', 'utf8');

function parseInput(input: string) {
  return input.split('\n').filter((r) => r.length > 0);
}

type Direction =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

const movement: Record<Direction, [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
  'top-left': [-1, -1],
  'top-right': [1, -1],
  'bottom-left': [-1, 1],
  'bottom-right': [1, 1],
};

const collection: [number, number][][] = [];
function isXmas(rows: string[], start: [number, number], direction: Direction) {
  const word = 'XMAS';
  const move = movement[direction];
  let coord = start;
  const maybe = [start];
  for (let step = 0; step < 4; step++) {
    if (!inBounds(coord, rows)) {
      return false;
    }
    maybe.push(coord);
    const x = coord[0];
    const y = coord[1];
    if (rows[y][x] !== word[step]) {
      return false;
    }
    const next = nextCoord(coord, move);
    coord = next;
  }
  if (start[0] === 3 && start[1] === 9 && direction === 'top-left') {
    console.log('will return true');
  }
  collection.push(maybe);
  return true;
}

function inBounds(coord: [number, number], input: string[]) {
  return (
    coord[0] > -1 &&
    coord[0] < input[0].length &&
    coord[1] > -1 &&
    coord[1] < input.length
  );
}

function nextCoord(
  coord: [number, number],
  move: [number, number],
): [number, number] {
  return [coord[0] + move[0], coord[1] + move[1]];
}

const part1 = () => {
  const rows = parseInput(input);

  let count = 0;
  // iterate through each character
  // DFS through all 8 corners
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      (Object.keys(movement) as Direction[]).forEach((movement) => {
        const verified = isXmas(rows, [x, y], movement);
        if (x === 3 && y === 9) {
          console.log('movement', movement);
          console.log('isXmas', verified);
        }
        if (verified) {
          count++;
        }
      });
    }
  }
  console.log(collection);
  return count;
};

const opposites: Record<string, string> = {
  M: 'S',
  S: 'M',
};

function isXmas2(rows: string[], center: [number, number]) {
  if (rows[center[1]][center[0]] !== 'A') {
    return false;
  }
  const diags = getDiagCoords(center);
  const safe = diags.every((diag) => {
    return diag.every((point) => {
      return inBounds(point, rows);
    });
  });
  if (!safe) {
    return false;
  }
  return diags.every((diag) => isMasOrSam(rows, diag));
}

function isMasOrSam(rows: string[], diag: [number, number][]) {
  const c1 = diag[0];
  const c2 = diag[1];
  const first = rows[c1[1]][c1[0]];
  const second = rows[c2[1]][c2[0]];
  if (
    !Object.keys(opposites).includes(first) ||
    !Object.keys(opposites).includes(second)
  ) {
    return false;
  }
  return second === opposites[first];
}

function getDiagCoords(center: [number, number]): [number, number][][] {
  const x = center[0],
    y = center[1];
  return [
    [
      [x - 1, y - 1],
      [x + 1, y + 1],
    ],
    [
      [x + 1, y - 1],
      [x - 1, y + 1],
    ],
  ];
}

/* Part 2 */
const part2 = () => {
  const rows = parseInput(input);
  // 1. find As
  // 2. get top left
  // 3. check if M/S
  // 4. check bottom right is S/M
  // 5. repeat for top right & bottom left
  // check if out of bounds every time

  let count = 0;

  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      if (isXmas2(rows, [x, y])) {
        count++;
      }
    }
  }
  return count;
};

console.log(part2());
