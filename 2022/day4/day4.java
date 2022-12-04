package day4;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

class Day4 {
    public static void main(String args[]) throws IOException {
        // make some magic!
        String input = Files.readString(Path.of("day4", "input.txt"));

        // Parse input
        List<Map<String, List<Integer>>> assignments = Arrays.stream(input.split("\n")).map((row) -> {
            List<List<Integer>> sections = Arrays.stream(row.split(",")).map((section) -> Arrays.stream(section.split("-")).map(Integer::parseInt).toList()).toList();
            Map<String, List<Integer>> sectionMap = new HashMap<>();
            sectionMap.put("section1", sections.get(0));
            sectionMap.put("section2", sections.get(1));
            return sectionMap;
        }).toList();
        part1(assignments);
        part2(assignments);
    }

    private static void part1(List<Map<String, List<Integer>>> assignments) {
        int counter = 0;
        for (Map<String, List<Integer>> pair : assignments) {
            if (fullyOverlaps(pair.get("section1"), pair.get("section2"))) {
                counter += 1;
            }
        }
        System.out.println("Part 1 answer");
        System.out.println(counter);
    }

    private static void part2(List<Map<String, List<Integer>>> assignments) {
        int counter = 0;
        for (Map<String, List<Integer>> pair : assignments) {
            if (!noOverlaps(pair.get("section1"), pair.get("section2"))) {
                counter += 1;
            }
        }
        System.out.println("Part 2 answer");
        System.out.println(counter);
    }

    private static boolean fullyOverlaps(List<Integer> a, List<Integer> b) {
        if (a.get(0) > b.get(0)) {
            return a.get(1) <= b.get(1);
        }
        if (b.get(0) > a.get(0)) {
            return b.get(1) <= a.get(1);
        }
        if (a.get(0).equals(b.get(0))) {
            return a.get(1) <= b.get(1) || b.get(1) <= a.get(1);
        }
        return false;
    }

    private static boolean noOverlaps(List<Integer> a, List<Integer> b) {
        // a starts higher up
        if (a.get(0) > b.get(0)) {
            return a.get(0) > b.get(1);
        }
        // b starts higher up
        if (b.get(0) > a.get(0)) {
            return b.get(0) > a.get(1);
        }
        return false;
    }
}
