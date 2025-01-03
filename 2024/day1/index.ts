import * as fs from 'fs';

const input = fs.readFileSync('./input.txt', 'utf8');

/* Part 1 */
const part1 = () => {
  const list1: number[] = [],
    list2: number[] = [];
  input.split('\n').forEach((line, _) => {
    if (line.trim() === '') {
      return;
    }
    const [first, second] = line.split('   ');
    list1.push(Number(first));
    list2.push(Number(second));
  });
  list1.sort();
  list2.sort();

  // getSum
  let total = 0;
  for (let i = 0; i < list1.length; i++) {
    total += Math.abs(list1[i] - list2[i]);
  }

  return total;
};

/* Part 2: Describe part 2 */
const part2 = () => {
  const list1: number[] = [],
    list2: number[] = [];
  input.split('\n').forEach((line, _) => {
    if (line.trim() === '') {
      return;
    }
    const [first, second] = line.split('   ');
    list1.push(Number(first));
    list2.push(Number(second));
  });
  list1.sort();
  list2.sort();

  const occurrences = new Map<number, number>();
  list2.forEach((num) => {
    occurrences.set(num, (occurrences.get(num) || 0) + 1);
  });

  let total = 0;
  list1.forEach((num) => {
    total += num * (occurrences.get(num) || 0);
  });
  return total;
};

console.log(part1());
console.log(part2());
