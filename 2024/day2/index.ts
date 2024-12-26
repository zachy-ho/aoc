/* Part 1 */
import * as fs from 'fs';

const isSafe = (report: number[]) => {
  if (report.length < 2) {
    return true;
  }
  const increasing = report[0] - report[1] > 0 ? false : true;

  for (let i = 0; i < report.length - 1; i++) {
    const diff = Math.abs(report[i] - report[i + 1]);
    if (diff > 3 || diff < 1) {
      return false;
    }

    if (increasing && report[i] > report[i + 1]) {
      return false;
    }

    if (!increasing && report[i] < report[i + 1]) {
      return false;
    }
  }
  return true;
};

const part1 = () => {
  let numSafeReports = 0;
  const input = fs.readFileSync('./input.txt', 'utf8');
  input.split('\n').forEach((report, _) => {
    if (report.trim() === '') {
      return;
    }

    const levels = report.split(' ').map((level) => Number(level));
    if (isSafe(levels)) {
      numSafeReports++;
    }
  });
  return numSafeReports;
};

const isSomewhatSafe = (levels: number[]) => {
  for (let i = 0; i < levels.length; i++) {
    const reduced = [...levels];
    reduced.splice(i, 1);
    if (isSafe(reduced)) {
      return true;
    }
  }
  return false;
};

/* Part 2 */
const part2 = () => {
  let numSafeReports = 0;
  const input = fs.readFileSync('./input.txt', 'utf8');
  input.split('\n').forEach((report, _) => {
    if (report.trim() === '') {
      return;
    }

    const levels = report.split(' ').map((level) => Number(level));
    if (isSafe(levels) || isSomewhatSafe(levels)) {
      numSafeReports++;
    }
  });
  return numSafeReports;
};

console.log(part2());
