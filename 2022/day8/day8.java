package day8;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

class Day8 {
    public static void main(String args[]) throws IOException {
        // make some magic!
        String input = Files.readString(Path.of("day8", "input.txt"));
        List<List<Integer>> forest = Arrays.stream(input.split("\n")).map((row) ->
                Arrays.stream(row.split("")).map(Integer::parseInt).toList()
        ).toList();
        part2(forest);
    }

    private static void part2(List<List<Integer>> forest) {
        int maxScenicScore = 0;
        for (int row = 1; row < forest.size() - 1; row++) {
            for (int col = 1; col < forest.get(0).size() - 1; col++) {
                int leftScore = 0;
                int rightScore = 0;
                int topScore = 0;
                int bottomScore = 0;

                int treeHeight = forest.get(row).get(col);
                for (int left = col - 1; left >= 0; left--) {
                    leftScore++;
                    if (treeHeight <= forest.get(row).get(left)) {
                        break;
                    }
                }
                for (int right = col + 1; right < forest.get(row).size(); right++) {
                    rightScore++;
                    if (treeHeight <= forest.get(row).get(right)) {
                        break;
                    }
                }
                for (int top = row - 1; top >= 0; top--) {
                    topScore++;
                    if (treeHeight <= forest.get(top).get(col)) {
                        break;
                    }
                }
                for (int bottom = row + 1; bottom < forest.size(); bottom++) {
                    bottomScore++;
                    if (treeHeight <= forest.get(bottom).get(col)) {
                        break;
                    }
                }
                int treeScenicScore = leftScore * rightScore * topScore * bottomScore;
                if (treeScenicScore > maxScenicScore) {
                    maxScenicScore = treeScenicScore;
                }
            }
        }

        System.out.println("Part 2 answer:");
        System.out.println(maxScenicScore);
    }

    private static void part1(List<List<Integer>> forest) {
        // Key: '<row>-<col>'
        Set<String> visibleTrees = new HashSet<String>();
        int numRows = forest.size();
        int numCols = forest.get(0).size();
        for (int row = 0; row < numRows; row++) {
            // First column
            visibleTrees.add(treeCoordinates(row, 0));
            // Last column
            visibleTrees.add(treeCoordinates(row, numCols - 1));
        }
        for (int col = 0; col < numCols; col++) {
            // First row
            visibleTrees.add(treeCoordinates(0, col));
            // Last row
            visibleTrees.add(treeCoordinates(numRows - 1, col));
        }

        // left and right
        for (int row = 1; row < numRows - 1; row++) {
            int leftMax = forest.get(row).get(0);
            int rightMax = forest.get(row).get(forest.get(row).size() - 1);
            int highestVisibleCol = 0;

            // ltr
            for (int col = 1; col < forest.get(row).size() - 1; col++) {
                int treeHeight = forest.get(row).get(col);
                if (treeHeight > leftMax) {
                    leftMax = treeHeight;
                    visibleTrees.add(treeCoordinates(row, col));
                    highestVisibleCol = col;
                }
            }

            // rtl
            for (int col = forest.get(row).size() - 2; col > highestVisibleCol; col--) {
                int treeHeight = forest.get(row).get(col);
                if (treeHeight > rightMax) {
                    rightMax = treeHeight;
                    visibleTrees.add(treeCoordinates(row, col));
                }
            }
        }

        // top and bottom
        for (int col = 1; col < numCols - 1; col++) {
            int topMax = forest.get(0).get(col);
            int bottomMax = forest.get(forest.size() - 1).get(col);
            int highestVisibleRow = 0;

            // ltr
            for (int row = 1; row < forest.size() - 1; row++) {
                int treeHeight = forest.get(row).get(col);
                if (treeHeight > topMax) {
                    topMax = treeHeight;
                    visibleTrees.add(treeCoordinates(row, col));
                    highestVisibleRow = row;
                }
            }

            // rtl
            for (int row = forest.size() - 2; row > highestVisibleRow; row--) {
                int treeHeight = forest.get(row).get(col);
                if (treeHeight > bottomMax) {
                    bottomMax = treeHeight;
                    visibleTrees.add(treeCoordinates(row, col));
                }
            }
        }

        System.out.println("Part 1 answer:");
        System.out.println(visibleTrees.size());
    }

    private static String treeCoordinates(int row, int col) {
        return String.format("%s-%s", row, col);
    }
}
