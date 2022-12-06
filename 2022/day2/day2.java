package day2;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

class Day2 {
    public enum RoundState {
        WON, LOST, DRAW
    }
    public static final char OPP_ROCK = 'A';
    public static final char OPP_PAPER = 'B';
    public static final char OPP_SCISSOR = 'C';
    public static final char ME_ROCK = 'X';
    public static final char ME_PAPER = 'Y';
    public static final char ME_SCISSOR = 'Z';

    // Codes for part 2 ---
    public static final char TO_LOSE = 'X';
    public static final char TO_DRAW = 'Y';
    public static final char TO_WIN = 'Z';
    // --- Codes for part 2 END ---
    public static final Map<Character, Integer> MyChoices = Map.of(ME_ROCK, 1, ME_PAPER, 2, ME_SCISSOR, 3);

    public static void main(String args[]) throws IOException {
        // make some magic!
        String input;
        input = Files.readString(Path.of("day2", "input.txt"));

        List<char[]> rounds = Arrays.stream(input.split("\n")).map((round) -> {
            var choices = round.split(" ");
            return new char[]{choices[0].charAt(0), choices[1].charAt(0)};
        }).collect(Collectors.toList());

        // --- Part 1 ---
        var totalScore1 = rounds.stream().map((round) -> round1Score(round[0], round[1])).reduce(0, Integer::sum);
        System.out.println("Part 1 answer:");
        System.out.println(totalScore1);
        // --- Part 1 END ---

        // --- Part 2 ---
        var totalScore2 = rounds.stream().map((round) -> round2Score(round[0], round[1])).reduce(0, Integer::sum);
        System.out.println("Part 2 answer:");
        System.out.println(totalScore2);
        // --- Part 2 END ---
    }

    static Integer round2Score(char opp, char strat) {
        // Default to draw
        char myPick = opp;
        var total = 0;

        // Figure out my pick and add score based on strat
        switch (strat) {
            case TO_DRAW -> {
                total += 3;
                if (opp == OPP_PAPER) {
                    myPick = ME_PAPER;
                }
                if (opp == OPP_SCISSOR) {
                    myPick = ME_SCISSOR;
                }
                if (opp == OPP_ROCK) {
                    myPick = ME_ROCK;
                }
            }
            case TO_WIN -> {
                total += 6;
                if (opp == OPP_PAPER) {
                    myPick = ME_SCISSOR;
                }
                if (opp == OPP_SCISSOR) {
                    myPick = ME_ROCK;
                }
                if (opp == OPP_ROCK) {
                    myPick = ME_PAPER;
                }
            }
            case TO_LOSE -> {
                total += 0;
                if (opp == OPP_PAPER) {
                    myPick = ME_ROCK;
                }
                if (opp == OPP_SCISSOR) {
                    myPick = ME_PAPER;
                }
                if (opp == OPP_ROCK) {
                    myPick = ME_SCISSOR;
                }
            }
        }

        return total + MyChoices.get(myPick);
    }

    static Integer round1Score(char opp, char me) {
        // Start with default score based on my pick
        var total = MyChoices.get(me);

        // Default to draw
        RoundState roundState = RoundState.DRAW;

        // Not draw
        if (opp != me) {
            switch (me) {
                case ME_ROCK -> {
                    if (opp == OPP_PAPER) {
                        roundState = RoundState.LOST;
                    }
                    if (opp == OPP_SCISSOR) {
                        roundState = RoundState.WON;
                    }
                }
                case ME_PAPER -> {
                    if (opp == OPP_SCISSOR) {
                        roundState = RoundState.LOST;
                    }
                    if (opp == OPP_ROCK) {
                        roundState = RoundState.WON;
                    }
                }
                case ME_SCISSOR -> {
                    if (opp == OPP_ROCK) {
                        roundState = RoundState.LOST;
                    }
                    if (opp == OPP_PAPER) {
                        roundState = RoundState.WON;
                    }
                }
            }
        }

        switch (roundState) {
            case LOST -> total += 0;
            case DRAW -> total += 3;
            case WON -> total += 6;
        }
        return total;
    }
}