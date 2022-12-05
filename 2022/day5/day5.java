package day5;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;
import java.util.stream.IntStream;

class Day5 {
    private static int numColumns;
    // Ceebs making a flexible solution for these, so I just inspected my input :shrug:
    private static final int STARTING_MAX_STACK = 8;
    private static final int COLUMN_COUNT_ROW = 8;
    private static final int INSTRUCTIONS_START = 10;

    public static void main(String args[]) throws IOException {
        // make some magic!
        String input = Files.readString(Path.of("day5", "input.txt"));
        String[] rows = input.split("\n");

        // parse to get number of columns
        String columnCountRow = Arrays.stream(rows).toList().get(COLUMN_COUNT_ROW).replaceAll(" ", "");
        numColumns = Integer.parseInt(String.valueOf(columnCountRow.charAt(columnCountRow.length() - 1)));

        // create list of stacks, each entry representing each column
        List<String> rowsOfCrates = Arrays.stream(rows).toList().subList(0, STARTING_MAX_STACK);
        List<Deque<String>> stacks = createStacks(rowsOfCrates);

        // parse to get all instructions
        List<List<Integer>> instructions = Arrays.stream(rows).toList().subList(INSTRUCTIONS_START, rows.length).stream().map((instruction) -> {
            List<String> instructionWords = List.of(instruction.split(" "));
            return IntStream.range(0, instructionWords.size()).filter(i -> List.of(1, 3, 5).contains(i)).mapToObj(instructionWords::get).map(Integer::parseInt).toList();
        }).toList();

        part1(stacks, instructions);

        // Reset stacks
        stacks = createStacks(rowsOfCrates);
        part2(stacks, instructions);
    }

    private static void part1(List<Deque<String>> stacks, List<List<Integer>> instructions) {
        instructions.forEach((instruction) -> {
            int numCrates = instruction.get(0);
            int from = instruction.get(1) - 1;
            int to = instruction.get(2) - 1;

            for (int c = 0; c < numCrates; c++) {
                stacks.get(to).push(stacks.get(from).pop());
            }
        });

        System.out.println("Part 1 answer:");
        System.out.println(getTopCrates(stacks));
    }

    private static void part2(List<Deque<String>> stacks, List<List<Integer>> instructions) {
        for (List<Integer> instruction : instructions) {
            int numCrates = instruction.get(0);
            int from = instruction.get(1) - 1;
            int to = instruction.get(2) - 1;

            if (numCrates == 1) {
                stacks.get(to).push(stacks.get(from).pop());
                continue;
            }

            Deque<String> groupedCrates = new ArrayDeque<String>();
            IntStream.range(0, numCrates).forEach((c) -> groupedCrates.push(stacks.get(from).pop()));
            IntStream.range(0, numCrates).forEach((c) -> stacks.get(to).push(groupedCrates.pop()));
        }

        System.out.println("Part 2 answer:");
        System.out.println(getTopCrates(stacks));
    }

    private static List<Deque<String>> createStacks(List<String> rows) {
        List<Deque<String>> stacks = new ArrayList<>();
        for (int column = 0; column < numColumns; column++) {
            Deque<String> stack = new ArrayDeque<>();
            for (int position = 0; position < STARTING_MAX_STACK; position++) {
                String maybeCrate = getCrate(rows, column, position);
                if (maybeCrate.equals(" ")) {
                    continue;
                }
                stack.add(maybeCrate);
            }
            stacks.add(stack);
        }
        return stacks;
    }

    private static String getTopCrates(List<Deque<String>> stacks) {
        List<String> topCrates = new ArrayList<String>();
        stacks.forEach((stack) -> {
            String topCrate = stack.peekFirst();
            if (topCrate != null) {
                topCrates.add(topCrate);
            }
        });
        return String.join("", topCrates);
    }

    private static String getCrate(List<String> stacks, int column, int position) {
        // Parse from raw string representation of stacks and get rid of the square brackets
        int start = column * 4;
        return stacks.get(position).substring(start, start + 3).substring(1, 2);
    }
}