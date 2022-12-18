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
        String input = Files.readString(Path.of("day9", "input.txt"));
        List<Instruction> instructions = Arrays.stream(input.split("\n")).map(Instruction::new).toList();
        part2(instructions);
    }

    private static void part2(List<Instruction> instructions) {
        List<Node> knots = IntStream.range(0, 10).mapToObj((i) -> new Node()).toList();
        Set<String> tailTraversed = new HashSet<String>();

        tailTraversed.add(knots.get(knots.size() - 1).toString());
        instructions.forEach((instruction) -> {
            execute(instruction, knots, tailTraversed);
            System.out.println(knots);
        });
        System.out.println("Part 2 answer:");
        System.out.println(tailTraversed.size());
        System.out.println(tailTraversed);
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
            for (int j = 1; j < knots.size(); j++) {
                Node follow = knots.get(j);
                Node lead = knots.get(j - 1);
                if (follow.shouldMove(lead)) {
                    follow.row += Math.max(Math.min(1, lead.row - follow.row), -1);
                    follow.col += Math.max(Math.min(1, lead.col - follow.col), -1);
                    if (j == knots.size() - 1) {
                        tailTraversed.add(follow.toString());
                    }
                }
            }
        }
    }

    // Part 1 execute function
    private static void execute(Instruction instruction, Node lead, Node follow, Set<String> tailTraversed) {
        for (int i = 0; i < instruction.steps(); i++) {
            int prevHeadRow = lead.row;
            int prevHeadCol = lead.col;
            switch (instruction.direction()) {
                case UP -> lead.row++;
                case DOWN -> lead.row--;
                case LEFT -> lead.col--;
                case RIGHT -> lead.col++;
            }
            if (follow.shouldMove(lead)) {
                follow.row += Math.max(Math.min(1, lead.row - follow.row), -1);
                follow.col += Math.max(Math.min(1, lead.col - follow.col), -1);
                tailTraversed.add(follow.toString());
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
