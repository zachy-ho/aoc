package day2;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

// Exercise from reading https://github.com/Tavio/advent-of-code-2022/blob/main/src/Day2.java
class Day2_R2 {
    private static final String MY_ROCK = "X";
    private static final String MY_PAPER = "Y";
    private static final String MY_SCISSOR = "Z";
    private static final String OPP_ROCK = "A";
    private static final String OPP_PAPER = "B";
    private static final String OPP_SCISSOR = "C";
    private static final String TO_LOSE = "X";
    private static final String TO_DRAW = "Y";
    private static final String TO_WIN = "Z";
    private static final Map<String, Integer> myPickScores = Map.of(
            MY_ROCK, 1,
            MY_PAPER, 2,
            MY_SCISSOR, 3
    );

    private static final Map<String, Map<String, Integer>> roundScores = Map.of(
            MY_ROCK, Map.of(
                    OPP_PAPER, 0,
                    OPP_ROCK, 3,
                    OPP_SCISSOR, 6
            ),
            MY_PAPER, Map.of(
                    OPP_SCISSOR, 0,
                    OPP_PAPER, 3,
                    OPP_ROCK, 6
            ),
            MY_SCISSOR, Map.of(
                    OPP_ROCK, 0,
                    OPP_SCISSOR, 3,
                    OPP_PAPER, 6
            )
    );

    private static final Map<String, Map<String, String>> round2Strats = Map.of(
            OPP_ROCK, Map.of(
                    TO_DRAW, MY_ROCK,
                    TO_LOSE, MY_SCISSOR,
                    TO_WIN, MY_PAPER
            ),
            OPP_PAPER, Map.of(
                    TO_DRAW, MY_PAPER,
                    TO_LOSE, MY_ROCK,
                    TO_WIN, MY_SCISSOR
            ),
            OPP_SCISSOR, Map.of(
                    TO_DRAW, MY_SCISSOR,
                    TO_LOSE, MY_PAPER,
                    TO_WIN, MY_ROCK
            )
    );

    public static void main(String args[]) throws IOException {
        // make some magic!
        String input;
        input = Files.readString(Path.of("day2", "input.txt"));

        List<String[]> rounds = Arrays.stream(input.split("\n")).map((round) -> {
            var choices = round.split(" ");
            return new String[]{choices[0], choices[1]};
        }).toList();

        // --- Part 1 ---
        var totalScore1 = rounds.stream().map((round) -> {
            return roundScores.get(round[1]).get(round[0]) + myPickScores.get(round[1]);
        }).reduce(0, Integer::sum);
        System.out.println("Part 1 answer:");
        System.out.println(totalScore1);
        // --- Part 1 END ---

        // --- Part 2 ---
        var totalScore2 = rounds.stream().map((round) -> {
            var myPick = round2Strats.get(round[0]).get(round[1]);
            return myPickScores.get(myPick)
                    + roundScores.get(myPick).get(round[0]);
        }).reduce(0, Integer::sum);
        System.out.println("Part 2 answer:");
        System.out.println(totalScore2);
        // --- Part 2 END ---
    }
}