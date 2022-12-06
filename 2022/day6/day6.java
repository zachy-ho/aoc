package day6;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

class Day6 {
    public static final int PACKET = 4;
    public static final int MESSAGE = 14;

    public static void main(String args[]) throws IOException {
        // make some magic!
        String input = Files.readString(Path.of("day6", "input.txt"));

        System.out.println("Part 1 answer:");
        System.out.println(substringSolution(input, "MARKER"));
        System.out.println("Part 2 answer:");
        System.out.println(substringSolution(input, "MESSAGE"));

        System.out.println("Part 1 (faster) answer:");
        System.out.println(rollingSolution(input, "MARKER"));
        System.out.println("Part 2 (faster) answer:");
        System.out.println(rollingSolution(input, "MESSAGE"));
    }

    private static int substringSolution(String datastream, String type) {
        int marker = type.equals("MARKER") ? PACKET : MESSAGE;
        int c = 0;
        while (c < datastream.length()) {
            String substring = datastream.substring(c, c + marker);
            Set<String> uniques = new HashSet<String>(Arrays.asList(substring.split("")));
            if (uniques.size() == marker) {
                return c + marker;
            }
            c++;
        }
        // Unreachable
        return -1;
    }

    private static int rollingSolution(String datastream, String type) {
        int marker = type.equals("MARKER") ? PACKET : MESSAGE;
        List<String> chars = Arrays.asList(datastream.split(""));
        Set<String> uniques = new HashSet<>();
        int c = 0;
        while (c < chars.size() - marker) {
            uniques.add(chars.get(c));
            for (int j = 1; j <= marker; j++) {
                if (j == marker) {
                    return c + marker;
                }
                String thisChar = chars.get(j + c);
                if (uniques.contains(thisChar)) {
                    c = chars.subList(c, c + marker).indexOf(thisChar) + c + 1;
                    break;
                }
                uniques.add(thisChar);
            }
            uniques.clear();
        }
        // Unreachable
        return -1;
    }
}