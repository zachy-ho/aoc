/* Part 1 */
import * as fs from 'fs';

const input = fs.readFileSync('./input.txt', 'utf8');

function parseSections(input: string) {
  return input.split('\n\n').filter((r) => r.length > 0);
}

function isOrdered(update: string[], sorter: (a: string, b: string) => number) {
  const sorted = [...update].sort(sorter);
  return sorted.join(',') === update.join(',');
}

function constructRules(input: string) {
  const lessThan = new Map<string, Set<string>>();
  input.split('\n').forEach((row) => {
    const [a, b] = row.split('|');
    if (!lessThan.has(a)) {
      lessThan.set(a, new Set());
    }
    lessThan.get(a)!.add(b);
  })
  return lessThan;
}

function parseUpdates(input: string) {
  const updates = input
    .split('\n')
    .filter((row) => row.length > 0)
    .map((row) => row.split(','));
  return updates;
}

const part1 = () => {
  const [rawRules, rawUpdates] = parseSections(input);
  const lessThan = constructRules(rawRules);
  const updates = parseUpdates(rawUpdates);
  const sorter = (a: string, b: string) => {
    if (lessThan.get(a)?.has(b)) {
      return -1;
    }
    if (lessThan.get(b)?.has(a)) {
      return 1;
    }
    return 0;
  };
  const sum = updates.reduce((a, b) => {
    if (isOrdered(b, sorter)) {
      // convert string to number
      return a + parseInt(b[Math.trunc(b.length / 2)]);
    }
    return a;
  }, 0);
  return sum;
};


/* Part 2 */
const part2 = () => {
  const [rawRules, rawUpdates] = parseSections(input);
  const lessThan = constructRules(rawRules);
  const updates = parseUpdates(rawUpdates);
  const sorter = (a: string, b: string) => {
    if (lessThan.get(a)?.has(b)) {
      return -1;
    }
    if (lessThan.get(b)?.has(a)) {
      return 1;
    }
    return 0;
  };

  const unordered = updates.filter((update) => !isOrdered(update, sorter));
  const reordered = unordered.map((update) => update.sort(sorter));
  const sum = reordered.reduce((a, b) => {
    return a + parseInt(b[Math.trunc(b.length / 2)]);
  }, 0);
  return sum;
};

console.log(part2());
