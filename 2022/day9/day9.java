package day9;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.IntStream;

class Day9 {
    private static final String UP = "U";
    private static final String DOWN = "D";
    private static final String LEFT = "L";
    private static final String RIGHT = "R";

    public static void main(String args[]) throws IOException {
        // make some magic!
        String input = Files.readString(Path.of("day9", "jridey.txt"));
        List<Instruction> instructions = Arrays.stream(input.split("\n")).map(Instruction::new).toList();
        part1(instructions);
    }

    private static void part2(List<Instruction> instructions) {
        List<Node> knots = IntStream.range(0, 10).mapToObj((i) -> new Node()).toList();
        Set<String> tailTraversed = new HashSet<String>();

        tailTraversed.add(knots.get(knots.size() - 1).toString());
//        instructions.forEach((instruction) -> {
//            execute(instruction, knots, tailTraversed);
//            System.out.println(knots);
//        });
        execute(instructions.get(0), knots, tailTraversed);
        System.out.println("cut");
        execute(instructions.get(1), knots, tailTraversed);
        System.out.println("cut");

        System.out.println("Part 2 answer:");
        System.out.println(tailTraversed.size());
    }

    private static void part1(List<Instruction> instructions) {
        Node head = new Node();
        Node tail = new Node();
        Set<String> tailTraversed = new HashSet<String>();

        tailTraversed.add(tail.toString());
        instructions.forEach((instruction) -> {
            execute(instruction, head, tail, tailTraversed);
        });

        System.out.println("Part 1 answer:");
        System.out.println(tailTraversed.size());
    }

    // Part 2 execute function
    // TODO: fix how each following node moves
    private static void execute(Instruction instruction, List<Node> knots, Set<String> tailTraversed) {
        Node head = knots.get(0);
        for (int i = 0; i < instruction.steps(); i++) {
            int prevHeadRow = head.row;
            int prevHeadCol = head.col;
            switch (instruction.direction()) {
                case UP -> head.row++;
                case DOWN -> head.row--;
                case LEFT -> head.col--;
                case RIGHT -> head.col++;
            }
            if (knots.get(1).shouldMove(knots.get(0))) {
                int rowShift = prevHeadRow - knots.get(1).row;
                int colShift = prevHeadCol - knots.get(1).col;
                for (int j = 1; j < knots.size(); j++) {
                    Node currKnot = knots.get(j);
                    Node prevKnot = knots.get(j - 1);
                    if (!currKnot.shouldMove(prevKnot)) {
                        break;
                    }
                    if (currKnot.row == 1 && currKnot.col == 3) {
                        System.out.println(rowShift);
                        System.out.println(colShift);
                    }
                    currKnot.row += rowShift;
                    currKnot.col += colShift;

                    // Last knot
                    if (j == knots.size() - 1) {
                        tailTraversed.add(currKnot.toString());
                    }
                }
            }
            System.out.println(knots);
        }
    }

    // Part 1 execute function
    private static void execute(Instruction instruction, Node head, Node tail, Set<String> tailTraversed) {
        for (int i = 0; i < instruction.steps(); i++) {
            int prevHeadRow = head.row;
            int prevHeadCol = head.col;
            switch (instruction.direction()) {
                case UP -> head.row++;
                case DOWN -> head.row--;
                case LEFT -> head.col--;
                case RIGHT -> head.col++;
            }
            if (tail.shouldMove(head)) {
                tail.row += Math.max(Math.min(1, prevHeadRow - tail.row), -1);
                tail.col += Math.max(Math.min(1, prevHeadCol - tail.col), -1);
                tailTraversed.add(tail.toString());
            }
        }
    }

}

class Node {
    public int row;
    public int col;

    public Node() {
        this.row = 0;
        this.col = 0;
    }

    @Override
    public String toString() {
        return "Node{" +
                "row=" + row +
                ", col=" + col +
                '}';
    }

    public boolean shouldMove(Node head) {
        if (head.row == this.row) {
            return Math.abs(head.col - this.col) > 1;
        }
        if (head.col == this.col) {
            return Math.abs(head.row - this.row) > 1;
        }
        // diagonal
        return Math.abs(head.row - this.row) + Math.abs(head.col - this.col) > 2;
    }
}

class Instruction {
    private final String direction;
    private final int steps;

    public Instruction(String instruction) {
        List<String> parts = List.of(instruction.split(" "));
        this.direction = parts.get(0);
        this.steps = Integer.parseInt(parts.get(1));
    }

    public String direction() {
        return this.direction;
    }

    public int steps() {
        return this.steps;
    }
}
