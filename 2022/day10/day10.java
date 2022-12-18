package day10;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

class Day10 {

    public static void main(String args[]) throws IOException {
        // make some magic!
        String input = Files.readString(Path.of("day10", "input.txt"));
        List<String> instructions = List.of(input.split("\n"));
        Queue<String> instructions2 = new ArrayDeque<>(List.of(input.split("\n")));

        part2(instructions2);
    }

    private static void part2(Queue<String> instructions) {
        boolean isAddingX = false;
        boolean isFirstAddXCycle = false;
        int registerX = 1;
        int cyclesRun = 0;
        String instruction = instructions.peek();
        List<List<String>> CRT = new ArrayList<>();
        List<String> currentRow = new ArrayList<>();

        while (instructions.size() > 0) {
            cyclesRun++;
            if (cyclesRun % 40 == 1) {
                currentRow = new ArrayList<>();
            } else if (cyclesRun % 40 == 0) {
                CRT.add(currentRow);
            }

            draw(currentRow, registerX);

            if (!isAddingX) {
                instruction = instructions.poll();
            }

            // noop
            if (instruction.equals("noop")) {
                continue;
            }

            // addX
            isAddingX = true;
            isFirstAddXCycle = !isFirstAddXCycle;
            if (!isFirstAddXCycle) {
                registerX += Integer.parseInt(instruction.split(" ")[1]);
                isAddingX = false;
            }
        }
        CRT.forEach((row) -> {
            System.out.println(String.join("", row));
        });
    }

    private static void draw(List<String> row, int registerX) {
        List<Integer> sprite = List.of(registerX - 1, registerX, registerX + 1);
        if (sprite.contains(row.size())) {
            row.add("#");
        } else {
            row.add(".");
        }
    }

    private static void part1(List<String> instructions) {
        int sum = 0;
        int registerX = 1;
        int cycles = 0;
        Set<Integer> cyclesWeCareAbout = Set.of(20, 60, 100, 140, 180, 220);
        for (String instruction : instructions) {
            cycles++;
            if (cyclesWeCareAbout.contains(cycles)) {
                sum += registerX * cycles;
            }
            if (instruction.equals("noop")) {
                return;
            }

            cycles++;
            if (cyclesWeCareAbout.contains(cycles)) {
                sum += registerX * cycles;
            }
            // Only add to sum after the second cycle finishes
            registerX += Integer.parseInt(instruction.split(" ")[1]);
        }

        System.out.println("Part 1 answer:");
        System.out.println(sum);
    }
}
