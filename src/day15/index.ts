/** 
* Advent of Code 2021
* Day 15
* Author: zachy-ho (https://github.com/zachy-ho)
* */

import run from "aocrunner";

/* Types */
type Coordinates = [number, number];
type QueueItem = [Node, number];

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
    const target = graph[graph.length - 1];
    let curr = target;
    if (!prev.get(curr.id) || curr.id === source.id) return [];
    const path = [];
    while (curr != null) {
      path.push(curr);
      curr = prev.get(curr.id)!;
    }
    return path;
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
  _heap: QueueItem[];
  _comparator: (a: QueueItem, b: QueueItem) => boolean;

  // heap, comparator
  constructor() {
    this._heap = [];
    this._comparator = (a: QueueItem, b: QueueItem) => a[1] < b[1] ? true : false;
  }

  size() {
    return this._heap.length;
  }

  has(node: Node) {
    return this._heap.find((i) => i[0].id === node.id) !== undefined;
  }

  // Add a new node at the last position (leaf node)
  push(item: [Node, number]) {
    this._heap.push(item);
    this._bubbleUp();
  }

  // pop
  pop() {
    const popped = this._heap[0];
    if (this.size() - 1 > 0) {
      this._swap(0, this.size() - 1);
    }
    this._heap.pop();
    this._bubbleDown();
    return popped;
  }

  _smaller(a: number, b: number) {
    return this._comparator(this._heap[a], this._heap[b]);
  }

  _bubbleUp() {
    let nodeIndex = this.size() - 1;
    let parentIndex = parent(nodeIndex);
    while (nodeIndex > 0 && this._smaller(nodeIndex, parentIndex)) {
      this._swap(nodeIndex, parentIndex);
      nodeIndex = parentIndex;
      parentIndex = parent(nodeIndex);
    }
  }

  _bubbleDown() {
    let curr = 0;
    let next;
    while ((left(curr) < this.size() && this._smaller(left(curr), curr))
      || (right(curr) < this.size() && this._smaller(right(curr), curr))) {
      next = right(curr) < this.size() && this._heap[right(curr)][1] < this._heap[left(curr)][1] ? right(curr) : left(curr);
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

const visualizePath = (path: Node[]): string[] => {
  const visualized = path.map((node) => node.id);
  return visualized;
}

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
    let [node, _riskSoFar] = pQueue.pop();
    node.neighbors.forEach((neighbor) => {
      newRiskTotal = riskTotal.get(node.id)! + neighbor.risk;
      if (newRiskTotal < riskTotal.get(neighbor.id)!) {
        riskTotal.set(neighbor.id, newRiskTotal);
        prev.set(neighbor.id, node);
        pQueue.push([neighbor, newRiskTotal]);
      }
    })
  }
}

const getNeighborIndices = ({ row, col, lines } : { row: number, col: number, lines: string[] | number[][] }): Coordinates[] => {
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

const formulateBigFuckingGraph = (lines: string[]): Map<string, Node> => {
  const graph: Map<string, Node> = new Map();

  const expanded: number[][] = Array(lines.length * 5).fill(0).map((_i) => Array(lines[0].length * 5).fill(0));
  let bigRowIndex = 0, bigColIndex = 0;
  lines.forEach((line, row) => {
    for (let col = 0; col < line.length; col++) {
      const expandedPoint = expandGraph(parseInt(line.charAt(col)));
      
      bigRowIndex = row;
      bigColIndex = col;
      expandedPoint.forEach((miniRow) => {
        miniRow.forEach((risk) => {
          expanded[bigRowIndex][bigColIndex] = risk
          bigColIndex += lines.length;
        })
        bigRowIndex += lines.length;
        bigColIndex = col;
      })
    }
  });

  expanded.forEach((line, row) => {
    line.forEach((risk, col) => {
      graph.set(`${row},${col}`, new Node({ row, col, risk }))
    })
  })
  let indices = [];
  let row, col;
  [...graph.entries()].forEach(([_id, node]) => {
    ({ row, col } = node); 
    indices = getNeighborIndices({ row, col, lines: expanded });
    node.neighbors = indices.map(([r, c]) => graph.get(`${r},${c}`)!);
  })
  return graph;
}

const expandGraph = (risk: number): number[][] => {
  const arr = [];
  for (let i = 0; i < 5; i++) {
    const row = [];
    for (let j = 0; j < 5; j++) {
      row.push(risk);
      risk = increaseRisk(risk);
    }
    arr.push(row);
    risk = increaseRisk(row[0]);
  }
  return arr;
}

const increaseRisk = (risk: number): number => {
  if (risk === 9) return 1;
  return risk + 1;
}

/* Part 1: Path with lowest total risk (Dijkstra's) */
const part1 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  // Need graph, distance map, previous map
  const graph = formulateGraph(lines);
  const cavern = new Cavern(graph.get('0,0')!, [...graph.values()]);

  const path = cavern.findPathWithLowestRisk();

  return path.map((node) => node.risk).reduce((prev, curr) => prev + curr) - graph.get('0,0')!.risk;
};

/* Part 2: Map just fucking exploded */
const part2 = (rawInput: string) => {
  const lines = parseInput(rawInput);

  // Need graph, distance map, previous map
  const graph = formulateBigFuckingGraph(lines);
  const cavern = new Cavern(graph.get('0,0')!, [...graph.values()]);

  const path = cavern.findPathWithLowestRisk();

  return path.map((node) => node.risk).reduce((prev, curr) => prev + curr) - graph.get('0,0')!.risk;
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
      {
        input: testInput,
        expected: 315,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
