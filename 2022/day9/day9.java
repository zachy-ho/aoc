package day9;


import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

class Day9 {
    private static final String UP = "U";
    private static final String DOWN = "D";
    private static final String LEFT = "L";
    private static final String RIGHT = "R";
    private static final Set<String> tailTraversed = new HashSet<String>();
    public static void main(String args[]) throws IOException {
        // make some magic!
        String input = Files.readString(Path.of("day9", "sample.txt"));
        List<Instruction> instructions = Arrays.stream(input.split("\n")).map(Instruction::new).toList();
        System.out.println(instructions);

        Node head = new Node();
        Tail tail = new Tail();

        instructions.forEach((instruction) -> {
            moveHead(instruction, head, tail);
        });

        System.out.println(tailTraversed.size());
    }

    public static void moveHead(Instruction instruction, Node head, Tail tail) {
        for (int i = 0; i < instruction.steps(); i++) {
            switch (instruction.direction()) {
                case UP -> head.row++;
                case DOWN -> head.row--;
                case LEFT -> head.col--;
                case RIGHT -> head.col++;
            }
            tail.maybeCloseGap(head);
            tailTraversed.add(tail.toString());
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

    public boolean isLeftOf(Node other) {
        return this.row == other.row && this.col < other.col;
    }

    public boolean isRightOf(Node other) {
        return this.row == other.row && this.col > other.col;
    }

    public boolean isTopOf(Node other) {
        return this.row > other.row && this.col == other.col;
    }

    public boolean isBottomOf(Node other) {
        return this.row < other.row && this.col == other.col;
    }

    public boolean isTopLeftOf(Node other) {
        return this.row < other.row && this.col == other.col;
    }

    public boolean isTopRightOf(Node other) {
        return this.row > other.row && this.col > other.col;
    }

    public boolean isBottomLeftOf(Node other) {
        return this.row < other.row && this.col < other.col;
    }

    public boolean isBottomRightOf(Node other) {
        return this.row < other.row && this.col > other.col;
    }
}

class Tail extends Node {
    public Tail() {
        super();
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

    public void maybeCloseGap(Node head) {
        if (!shouldMove(head)) {
            return;
        }
        if (head.isLeftOf(this) || head.isRightOf(this)) {
            this.col = this.col + ((head.col - this.col)/2);
        } else if (head.isTopLeftOf(this) || head.isBottomOf(this)) {
            this.row = this.row + ((head.row - this.row)/2);
        } else {
            if (head.isTopLeftOf(this)) {
                this.row = this.row + 1;
                this.col = this.col - 1;
            } else if (head.isTopRightOf(this)) {
                this.row = this.row + 1;
                this.col = this.col + 1;
            } else if (head.isBottomLeftOf(this)) {
                this.row = this.row - 1;
                this.col = this.col - 1;
            } else if (head.isBottomRightOf(this)) {
                this.row = this.row - 1;
                this.col = this.col + 1;
            }
        }
        return;
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
