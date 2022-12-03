package day3;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

class Day3 {
    public static final int GROUP_SIZE = 3;

    public static void main(String args[]) throws IOException {
        // make some magic!
        String input;
        input = Files.readString(Path.of("day3", "input.txt"));

        String[] rucksacks = input.split("\n");

        // Part 1
        List<Character> dupes = new ArrayList<Character>();
        Arrays.stream(rucksacks).toList().forEach((rucksack) -> {
            String compartment1 = rucksack.substring(0, rucksack.length() / 2);
            String compartment2 = rucksack.substring(rucksack.length() / 2);

            List<Character> items1 = new ArrayList<Character>(
                    compartment1.chars().mapToObj((i) -> (char) i).collect(Collectors.toSet())
            ).stream().sorted().toList();
            List<Character> items2 = new ArrayList<Character>(
                    compartment2.chars().mapToObj((i) -> (char) i).collect(Collectors.toSet())
            ).stream().sorted().toList();

            for (Character character : items1) {
                if (binarySearch(items2, character)) {
                    dupes.add(character);
                    break;
                }
            }
        });

        System.out.println("Part 1 answer:");
        System.out.println(dupes.stream().map(Day3::getPriority).reduce(0, Integer::sum));

        // Part 2
        List<Character> badges = new ArrayList<Character>();
        for (int c = 0; c < rucksacks.length; c += GROUP_SIZE) {
            int elf1 = c;
            int elf2 = c + 1;
            int elf3 = c + 2;

            List<List<Character>> elves = new ArrayList<String>(
                    Arrays.asList(rucksacks[elf1], rucksacks[elf2], rucksacks[elf3])
            ).stream().map((elf) -> new ArrayList<Character>(elf
                            .chars()
                            .mapToObj((item) -> (char) item)
                            .collect(Collectors.toSet())
                    )
                            .stream()
                            .sorted()
                            .toList()
            ).toList();

            for (Character character : elves.get(0)) {
                if (binarySearch(elves.get(1), character) && binarySearch(elves.get(2), character)) {
                    badges.add(character);
                    break;
                }
            }
        }
        System.out.println("Part 2 answer:");
        System.out.println(badges.stream().map(Day3::getPriority).reduce(0, Integer::sum));
    }

    // O(log(n)) baby <3
    private static boolean binarySearch(List<Character> list, char item) {
        int mid = list.size() / 2;
        if (list.get(mid) == item) {
            return true;
        }

        if (list.size() == 1) {
            return false;
        }

        if (list.get(mid) > item) {
            return binarySearch(list.subList(0, mid), item);
        }

        return binarySearch(list.subList(mid, list.size()), item);
    }

    private static int getPriority(char item) {
        // capital
        if ((int) item >= (int) 'A' && (int) item <= (int) 'Z') {
            return 27 + ((int) item - (int) 'A');
        }

        // smolittle
        return 1 + ((int) item - (int) 'a');
    }
}
