/** 
* Advent of Code 2021
* Day 15
* Author: zachy-ho (https://github.com/zachy-ho)
* */

import run from "aocrunner";

/* Types */
type Coordinates = [number, number];

/* Classes */
class Cavern {
  graph: Node[];
  source: Node;
  riskTotal: Map<string, number>;
  prev: Map<string, Node>;

  constructor(source: Node, graph: Node[]) {
    this.source = source;
    this.graph = graph;
    this.riskTotal = new Map();
    this.prev = new Map();
  }

  findPathWithLowestRisk() {
    const { source, graph, riskTotal, prev } = this;
    dijkstras({ graph, source, riskTotal, prev });
    console.log(prev);
  }
}

class Node {
  row: number;
  col: number;
  risk: number;
  neighbors: Node[];

  constructor({ row, col, risk } : { row: number, col: number, risk: number }) {
    this.row = row;
    this.col = col;
    this.risk = risk;
    this.neighbors = [];
  }

  get id() {
    return `${this.row},${this.col}`
  }

  // compare(other: Node): number {
    // if (this.risk > other.risk) return 1;
    // if (this.risk < other.risk) return -1;
    // return 0;
  // }
}

// TODO: Continue implementing PriorityQueue
class PriorityQueue {
  _heap: [Node, number][];
  _comparator: (a: number, b: number) => number;

  // heap, comparator
  constructor() {
    this._heap = [];
    this._comparator = (a: number, b: number) => a < b ? 1 : -1;
  }

  size() {
    return this._heap.length;
  }

  // Add a new node at the last position (leaf node)
  push(item: [Node, number]) {
    this._heap.push(item);
    this._bubbleUp();
  }

  // pop
  pop() {
    const popped = this._heap[0];
    if (this._heap.length > 0) {
      this._swap(0, this._heap.length - 1);
    }
    this._heap.pop();
    this._bubbleDown();
    return popped;
  }

  _bubbleUp() {
    let nodeIndex = this.size() - 1;
    let [_node, riskSoFar] = this._heap[nodeIndex];
    let parentIndex = parent(nodeIndex);
    while (nodeIndex > 0 && this._comparator(this._heap[parentIndex][1], riskSoFar) === -1) {
      this._swap(nodeIndex, parentIndex);
      nodeIndex = parentIndex;
      [_node, riskSoFar] = this._heap[nodeIndex];
      parentIndex = parent(nodeIndex);
    }
  }

  _bubbleDown() {
    let curr = 0;
    let next;
    let [_node, riskSoFar] = this._heap[curr];
    while ((left(curr) < this._heap.length && this._comparator(riskSoFar, this._heap[left(curr)][1]) === -1)
      || (right(curr) < this._heap.length && this._comparator(riskSoFar, this._heap[right(curr)][1]))) {
      next = this._heap[left(curr)][1] < this._heap[right(curr)][1] ? left(curr) : right(curr);
      this._swap(curr, next);
      curr = next;
    }
  }

  _swap(a: number, b: number): void {
    [this._heap[a], this._heap[b]] = [this._heap[b], this._heap[a]];
  }
}

/* Ad-hoc objects */

/* Functions */
const parseInput = (rawInput: string) => rawInput.split('\n');

// i -> 2i + 1, 2i + 2
const parent = (i: number): number => {
  // Left child
  if (i % 2 === 1) return (i - 1)/2;

  // Right child
  return (i - 2)/2;
}

const left = (i: number): number=> {
  return 2*i + 1;
}

const right = (i: number): number=> {
  return 2*i + 2;
}

const dijkstras = ({ graph, source, riskTotal, prev } : { graph: Node[], source: Node, riskTotal: Map<string, number>, prev: Map<string, Node | undefined> }) => {
  riskTotal.set(source.id, 0);

  // Create priority queue
  const pQueue = new PriorityQueue();
  pQueue.push([source, source.risk]);

  graph.forEach((node) => {
    if (node.id === source.id) return; 
    riskTotal.set(node.id, Infinity);
    prev.set(node.id, undefined);
  })

  let newRiskTotal: number;
  while (pQueue.size() > 0) {
    let [node, riskSoFar] = pQueue.pop();
    node.neighbors.forEach((neighbor) => {
      newRiskTotal = riskTotal.get(node.id)! + neighbor.risk;
      if (newRiskTotal < riskTotal.get(neighbor.id)!) {
        riskTotal.set(neighbor.id, newRiskTotal);
        prev.set(neighbor.id, node);
        pQueue.push([neighbor, riskSoFar]);
      }
    })
  }
}

const getNeighborIndices = ({ row, col, lines } : { row: number, col: number, lines: string[] }): Coordinates[] => {
  const maxRow = lines.length;
  const maxCol = lines[0].length;
  return [
    // Top
    [row - 1, col],
    // Left
    [row, col - 1],
    // Right
    [row, col + 1],
    // Bottom
    [row + 1, col]
  ].filter(([a, b]) => (a >= 0 && a < maxRow) && (b >= 0 && b < maxCol)) as Coordinates[];
}

const formulateGraph = (lines: string[]): Map<string, Node> => {
  const graph: Map<string, Node> = new Map();
  lines.forEach((line, row) => {
    for (let col = 0; col < line.length; col++) {
      graph.set(`${row},${col}`, new Node({ row, col, risk: parseInt(line.charAt(col)) }));
    }
  })
  let indices = [];
  let row, col;
  [...graph.entries()].forEach(([_id, node]) => {
    ({ row, col } = node); 
    indices = getNeighborIndices({ row, col, lines });
    node.neighbors = indices.map(([r, c]) => graph.get(`${r},${c}`)!);
  })
  return graph;
}

/* Part 1: Path with lowest total risk (Dijkstra's) */
const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  // Need graph, distance map, previous map
  const graph = formulateGraph(lines);
  const cavern = new Cavern(graph.get('0,0')!, [...graph.values()]);

  cavern.findPathWithLowestRisk();

  // return path.map((node) => node.risk).reduce((prev, curr) => prev + curr);
};

/* Part 2: Description */
const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return;
};

/* Testing & running */
const testInput = `
1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581
`;

run({
  part1: {
    tests: [
      {
        input: testInput,
        expected: 40,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      // {
      //   input: ``,
      //   expected: "",
      // },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: true,
});
