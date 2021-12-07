/** 
* Advent of Code 2021
* Day 3
* Author: zachy-ho (https://github.com/zachy-ho)
* */
import { getLinesFromFile } from '../../utils';

/** Part 1: Get power consumption by Gamma * Epsilon */
function getBitsMap(lines: string[]): Map<number, {zeroes: number, ones: number}> {
    const bitsMap = new Map(lines[0].split('').map((_v, i) => [i, { zeroes: 0, ones: 0 }]));
    lines.forEach((line) => {
        for (let i = 0; i < line.length; i++) {
            if (line[i] === '0') {
                bitsMap.set(i, {
                    ...bitsMap.get(i)!,
                    zeroes: bitsMap.get(i)!.zeroes + 1
                })
            } else {
                bitsMap.set(i, {
                    ...bitsMap.get(i)!,
                    ones: bitsMap.get(i)!.ones + 1
                })
            }
        }
    })
    return bitsMap;
}

function getBinaries(bitsMap: Map<number, {zeroes: number, ones: number}>): { gamma: string, epsilon: string } {
    const gammaArr: string[] = [];
    const epsilonArr: string[] = [];
    bitsMap.forEach(({ zeroes, ones }, key) => {
        // Assuming there will never be an equal amount of occurrences for each bit
        // console.log(`zeroes: ${zeroes}, ones: ${ones}`)
        if (zeroes > ones) {
            gammaArr[key] = '0';
            epsilonArr[key] = '1';
        } else {
            gammaArr[key] = '1';
            epsilonArr[key] = '0';
        }
    })
    return {
        gamma: gammaArr.join(''),
        epsilon: epsilonArr.join(''),
    }
}

function answerPart1() {
    const lines = getLinesFromFile('./input.txt');
    const bitsMap = getBitsMap(lines);
    const { gamma, epsilon } = getBinaries(bitsMap);
    const gammaDeci = parseInt(gamma, 2);
    const epsilonDeci = parseInt(epsilon, 2);

    console.log(gammaDeci * epsilonDeci);
}

// answerPart1();

/** Part 2: Description */

/** 
* Recursively filter out binary numbers until the final binary number is found.
* Assumes we will always end up with a maximum of one final number when the value of 'digit'
* reaches the length of the binary numbers. For example, if the binary numbers have 3 digits
* (e.g. 010), we will always arrive with a result of just one final binary number once 'digit'
* is 2
*
* @param { Object } opts: Options for this recursive function
* @param { string[] } opts.values: Array of binary numbers in string format to be filtered each roun
* @param { number } opts.digit: Digit to use for comparing bits of the binary numbers in opts.values
* @param { comparator } opts.comparator: The criteria for deciding whether to filter by lowest or highest occurrences of bits
* 
* */
function getFinal({ values, digit, comparator } : { values: string[], digit: number, comparator: 'most' | 'least'}): string {
    // When we successfully filtered values until we only have one binary number left, we return the stringified version of it
    if (values.length === 1) return values.join();

    // Create a copy of the array of binary numbers to mutate when filtering
    let newValues = [...values];

    // Go through each binary number
    for (let i = 0; i < values.length; i++) {

        // If the bit at the given digit of the binary number in question is '1', we know that we've
        // reached a point where we can decide whether there are a higher number of zeroes or ones, all
        // because I've sorted these numbers before we even start filtering
        if (values[i][digit] === '1') {

            // If we are after the middle point of the array of numbers when we encounter a bit of '1'
            // we know there are a higher number of '0' bits than '1' bits.
            if (i > values.length/2) {
                // For Oxygen rating, we only want to keep numbers that have the '0' bit at the current digit
                // Inversely for CO2 rating, we only want to keep numbers that have the '1' bit at the current digi
                newValues = comparator === 'most'
                    ? newValues.slice(0, i)
                    : newValues.slice(i);
            } 
            // If we are at or before the middle point of the array of numbers when we encounter a bit of '1'
            // we know there are a higher number of '1' bits than '0' bits.
            else {
                // For Oxygen rating, we only want to keep numbers that have the '1' bit at the current digit
                // Inversely for CO2 rating, we only want to keep numbers that have the '0' bit at the current digi
                newValues = comparator === 'most'
                    ? newValues.slice(i)
                    : newValues.slice(0, i);
            }
            break;
        }
    }

    // Recursion
    return getFinal({ 
        values: newValues,
        digit: ++digit,
        comparator
    })
}

function answerPart2() {
    // Read lines of binary numbers from input file
    let lines = getLinesFromFile('./input.txt');

    // Sort the numbers in ascending order and filter out items that are not binary numbers (e.g.
    // there's an empty string in here for some reason)
    lines = lines.sort().filter((line) => line != '');

    // Use getFinal() to get the binary value for Oxygen
    const oxygenStr = getFinal({ 
        values: lines,
        digit: 0,
        comparator: 'most'
    });

    // Use getFinal() to get the binary value for CO2
    const co2Str = getFinal({ 
        values: lines,
        digit: 0,
        comparator: 'least'
    });

    // Convert the binary strings to decimal numbers
    const oxygen = parseInt(oxygenStr, 2);
    const co2 = parseInt(co2Str, 2);

    // Multiply them to get the final answer and print it out
    console.log(oxygen * co2);
}

answerPart2();
