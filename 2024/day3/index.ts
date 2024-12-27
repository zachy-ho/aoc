/* Part 1 */
import * as fs from 'fs';

const input = fs.readFileSync('./input.txt', 'utf8');

function parseInput(input: string) {
  // Produce array of number tuples
  // 1. find 'mul('
  // 2. find next ')'
  // 3. if more than 7 characters between `mul(` and `)`, go back to step 1 from index immediately after `mul(`
  // 4. if not, verify valid by checking it's a 1-3 digit number followed by a comma, followed by another 1-3 digit number
  // 5. if valid, insert into array
  // 6. if not, go back to step 1 from index immediately after ')'

  const pattern = /mul\((\d{1,3}),(\d{1,3})\)/g;
  const matches = [...input.matchAll(pattern)];
  return matches.map((m) => [parseInt(m[1]), parseInt(m[2]), m.index]);
}

function getIgnoreRanges(input: string) {
  const doPattern = /do\(\)/g;
  const dontPattern = /don't\(\)/g;
  const doMatches = [...input.matchAll(doPattern)].map(m => m.index);
  doMatches.unshift(-1);
  const dontMatches = [...input.matchAll(dontPattern)].map(m => m.index);
  const ranges: [number, number][] = [];
  console.log(doMatches);
  console.log(dontMatches);
  dontMatches.forEach((m) => {
    // find the index of the first do() that comes after this don't()
    for (let i = 0; i < doMatches.length - 1; i++) {
      const lower = doMatches[i];
      const upper = doMatches[i + 1];
      if (within(m, lower, upper)) {
        ranges.push([m, upper]);
      }
    }
  });
  // console.log(ranges);
  return ranges;
}

function within(target: number, lower: number, upper: number) {
  return target > lower && target < upper;
}

const part1 = () => {
  const entries = parseInput(input);
  return entries.reduce((acc, curr) => acc + curr[0] * curr[1], 0);
};

/* Part 2 */
const part2 = () => {
  // get all indices of do() & don't()
  // filter out all mul()s that come between indices of don't() & the immediately following do()
  const entries = parseInput(input);
  const ignoreRanges = getIgnoreRanges(input);
  return entries.reduce((acc, curr) => {
    if (
      ignoreRanges.some((range) => {
        const lower = range[0];
        const upper = range[1];
        return within(curr[2], lower, upper);
      })
    ) {
      return acc;
    }
    return acc + curr[0] * curr[1];
  }, 0);
};

console.log(part1());
console.log(part2());
