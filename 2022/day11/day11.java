package day11;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayDeque;
import java.util.Arrays;
import java.util.Queue;
import java.util.function.Function;

class Day11 {
    public static void main(String args[]) throws IOException {
        // make some magic!
        String input = Files.readString(Path.of("day11", "sample.txt"));
        var monkeyInits = input.split("\n\n");
        createMonkey(monkeyInits[0]);
    }

    private static void createMonkey(String monkeyInit) {
        var rows = monkeyInit.split("\n");
        var id = Integer.parseInt(String.valueOf(rows[0].split(" ")[1].charAt(0)));
        var startingItems = new ArrayDeque<Integer>(Arrays.stream(rows[1].split(":")[1].split(",")).toList().stream().map((i) -> {
            return Integer.parseInt(i.trim());
        }).toList());
        var operation = createOperation(rows[2].split(" = ")[1].split(" "));

        System.out.println(startingItems);
    }

    // TODO: test this function
    private static Function<Integer, Integer> createOperation(String[] parts) {
        Function<Integer, Integer> func;
        if (parts[1].equals("*")) {
            func = (old) -> Math.multiplyExact(old, getOperand(parts[2], old));
        } else {
            func = (old) -> Math.addExact(old, getOperand(parts[2], old));
        }
        return func;
    }

    private static int getOperand(String raw, int old) {
        if (raw.equals("old")) {
            return old;
        }
        return Integer.parseInt(raw);
    }
}


class Monkey {
    Integer id;
    Queue<Integer> items;
    private Function<Integer, Integer> operation;
    private Function<Integer, Integer> throwTest;

    private Monkey(Integer id, Queue<Integer> items, Function<Integer, Integer> operation, Function<Integer, Integer> throwTest) {
        this.id = id;
        this.items = items;
        this.operation = operation;
        this.throwTest = throwTest;
    }

    public static Builder builder(Integer id) {
        return new Builder(id);
    }

    public static final class Builder {
        private final Integer id;
        private Queue<Integer> items = new ArrayDeque<>();
        private Function<Integer, Integer> operation = (old) -> old;
        private Function<Integer, Integer> throwTest = (level) -> 0;

        private Builder(Integer id) {
            this.id = id;
        }

        public Builder withItems(Queue<Integer> items) {
            this.items = items;
            return this;
        }

        public Builder withOperation(Function<Integer, Integer> operation) {
            this.operation = operation;
            return this;
        }

        public Builder withThrowTest(Function<Integer, Integer> throwTest) {
            this.throwTest = throwTest;
            return this;
        }

        public Monkey build() {
            return new Monkey(id, items, operation, throwTest);
        }
    }
}