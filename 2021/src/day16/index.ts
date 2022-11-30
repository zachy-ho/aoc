/** 
* Advent of Code 2021
* Day 16
* Author: zachy-ho (https://github.com/zachy-ho)
* */

import run from "aocrunner";

/* Types */
type Packet = Literal | Operator;

type Base = {
  version: number,
  typeId: number
}

type Literal = Base & {
  type: 'literal',
  literalValue: string
}

type Operator = Base & {
  type: 'operator'
  lengthTypeId: string
  children: Packet[]
}

type ParseResult = {
  packet: Packet,
  bitsParsed: number
}

/* Classes */
/* Ad-hoc objects */
/* Functions */
const parseInput = (rawInput: string) => { 
  const bin = hex2bin(rawInput);
  const remainder = bin.length % 4;
  const finalLength = remainder > 0 ? bin.length + 4 - (bin.length % 4) : bin.length;

  return bin.padStart(finalLength, '0');
};

const parseHeader = (headerBin: string): { version: number, typeId: number } => {
  return {
    version: bin2dec(headerBin.slice(0, 3)),
    typeId: bin2dec(headerBin.slice(3)),
  }
}

const parseBin = (bin: string): ParseResult => {
  const { typeId } = parseHeader(bin.slice(0, 6));
  if (isLiteral(typeId)) {
    return parseLiteral(bin);
  }
  return parseOperator(bin);
}

const parseLiteral = (bin: string): ParseResult => {
  const { typeId, version } = parseHeader(bin.slice(0, 6));
  let bitsParsed = 6;
  let nextSection;
  let literalValue = '';
  while (true) {
    nextSection = parseNextLiteralSection(bin.slice(bitsParsed));
    bitsParsed += nextSection.length;
    literalValue = literalValue.concat(nextSection.slice(1));
    if (isFinalLiteralSection(nextSection)) break;
  }

  return {
    packet : {
      type: 'literal',
      version,
      typeId,
      literalValue
    },
    bitsParsed
  }
}

const parseOperator = (bin: string): ParseResult => {
  const { version, typeId } = parseHeader(bin.slice(0, 6));
  let bitsParsed = 6;
  const children = [];
  const lengthTypeId = bin.slice(bitsParsed, bitsParsed + 1);
  bitsParsed++;

  if (lengthTypeId === '0') {
    const subpacketLength = parseSubpacketLength(bin.slice(bitsParsed));
    bitsParsed += 15;

    let subpacketBitsParsed = 0;
    while (subpacketBitsParsed < subpacketLength) {
      const res = parseBin(bin.slice(bitsParsed));
      children.push(res.packet);
      subpacketBitsParsed += res.bitsParsed;
      bitsParsed += res.bitsParsed;
    }
  } else {
    const numSubpackets = parseNumSubpackets(bin.slice(bitsParsed));
    bitsParsed += 11;
    while (children.length < numSubpackets) {
      const res = parseBin(bin.slice(bitsParsed));
      children.push(res.packet);
      bitsParsed += res.bitsParsed;
    }
  }

  return {
    packet: {
    type: 'operator',
    version,
    typeId,
    lengthTypeId,
    children
  },
    bitsParsed
  }
}

const parseNumSubpackets = (bin: string): number => {
  return bin2dec(bin.slice(0, 11));
}

const parseSubpacketLength = (bin: string): number => {
  return bin2dec(bin.slice(0, 15));
}

const isFinalLiteralSection = (section: string): boolean => {
  return section[0] === '0';
}

const parseNextLiteralSection = (bin: string): string => {
  return bin.slice(0, 5);
}

const isLiteral = (typeId: number): boolean => {
  return typeId === 4;
}

const hex2bin = (hex: string): string => {
  return hex.split('').map((char) => parseInt(char, 16).toString(2).padStart(4, '0')).join('');
}

const bin2dec = (bin: string) : number => {
  return parseInt(bin, 2);
}

const sumVersionNumbers = (packet: Packet) => {
  if (packet.type === 'literal') return packet.version;
  let versionNumber = packet.version;
  packet.children.forEach((child) => versionNumber += sumVersionNumbers(child))
  return versionNumber
}

const calcPacketValue = (packet: Packet): number => {
  let res: number = 0;
  switch (packet.type) {
    case 'literal':
      return bin2dec(packet.literalValue);
    case 'operator':
      const childrenValues = packet.children.map((child) => calcPacketValue(child));
      switch (packet.typeId) {
        case 0:
          return childrenValues.reduce((prev, curr) => prev + curr);
        case 1:
          return childrenValues.reduce((prev, curr) => prev * curr);
        case 2:
          return Math.min(...childrenValues);
        case 3:
          return Math.max(...childrenValues);
        case 5:
          return childrenValues[0] > childrenValues[1] ?  1 : 0;
        case 6:
          return childrenValues[1] > childrenValues[0] ?  1 : 0;
        case 7:
          return childrenValues[1] === childrenValues[0] ?  1 : 0;
      }
  }

  return res;
}

/* Part 1: Sum of all version numbers */
const part1 = (rawInput: string) => {
  const bin = parseInput(rawInput);
  const res = parseBin(bin);

  const sum = sumVersionNumbers(res!.packet);
  return sum;
};

/* Part 2: With operators */
const part2 = (rawInput: string) => {
  const bin = parseInput(rawInput);
  const { packet } = parseBin(bin);

  const res = calcPacketValue(packet);
  return res;
};

/* Testing & running */
run({
  part1: {
    tests: [
      {
        input: `D2FE28`,
        expected: 6,
      },
      {
        input: `38006F45291200`,
        expected: 0,
      },
      {
        input: `EE00D40C823060`,
        expected: 14,
      },
      {
        input: `8A004A801A8002F478`,
        expected: 16,
      },
      {
        input: `620080001611562C8802118E34`,
        expected: 12,
      },
      {
        input: `C0015000016115A2E0802F182340`,
        expected: 23,
      },
      {
        input: `A0016C880162017C3686B18A3D4780`,
        expected: 31,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: `C200B40A82`,
        expected: 3,
      },
      {
        input: `04005AC33890`,
        expected: 54,
      },
      {
        input: `880086C3E88112`,
        expected: 7,
      },
      {
        input: `CE00C43D881120`,
        expected: 9,
      },
      {
        input: `D8005AC2A8F0`,
        expected: 1,
      },
      {
        input: `F600BC2D8F`,
        expected: 0,
      },
      {
        input: `9C005AC2F8F0`,
        expected: 0,
      },
      {
        input: `9C0141080250320F1802104A08`,
        expected: 1,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  onlyTests: false,
});
