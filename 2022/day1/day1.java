package day1;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;

class Day1 {
    public static void main(String args[]) throws IOException {
        // make some magic!
        ArrayList<String> lines = new ArrayList<String>();
        String content;
        try {
            content = Files.readString(Path.of("day1", "input.txt"));
        } catch (FileNotFoundException e) {
            throw e;
        }
        String[] caloriesByElf = content.split("\n\n");
        ArrayList<Integer> totalCalories = new ArrayList<>();
        for (String elfCalories: caloriesByElf) {
            totalCalories.add(Arrays.stream(elfCalories.split("\n")).map(Integer::parseInt).reduce(0, Integer::sum));
        }
        totalCalories.sort(Collections.reverseOrder());

        // Part one
        System.out.println("Part 1 answer:");
        System.out.println(totalCalories.get(0));

        // Part two
        System.out.println("Part 2 answer:");
        System.out.println(totalCalories.subList(0, 3).stream().reduce(0, Integer::sum));
    }
}
