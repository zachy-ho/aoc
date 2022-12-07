package day7;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.*;

class Day7 {
    public static Dir root = new Dir("/");
    public static final int MAX_SIZE = 100000;
    public static final int TOTAL_DISK_SPACE = 70000000;
    public static final int MINIMUM_UNUSED_SPACE = 30000000;

    public static void main(String args[]) throws IOException {
        // make some magic!
        String input = Files.readString(Path.of("day7", "input.txt"));
        List<String> commands = List.of(input.split("\n"));
        Deque<Node> stack = new ArrayDeque<>();

        // assumption based on input: we start from the root dir '/'
        Node currNode = root;
        stack.push(root);

        // Don't need to parse the first command because we've already done it above based on assumption
        for (String command : commands.subList(1, commands.size())) {
            List<String> commandParts = List.of(command.split(" "));
            if (commandParts.get(0).equals("$")) {
                if (commandParts.get(1).equals("ls")) {
                    // do nothing
                    continue;
                }
                // $ cd
                String cdArg = commandParts.get(2);
                // $ cd ..
                if (cdArg.equals("..")) {
                    stack.pop();
                }
                // $ cd someDir
                else {
                    // assumption: this node has been listed by 'ls' and the parent node knows this node exists in this dir
                    assert currNode != null;
                    stack.push(((Dir) currNode).childNodes.get(cdArg));
                }
                currNode = stack.peek();
            }
            // Listed dir or file
            else {
                assert currNode instanceof Dir;
                ((Dir) currNode).addChild(commandParts.get(1), NodeFactory.create(command));
            }
        }

        List<Dir> deezDirs = new ArrayList<>();
        List<Dir> deezDirs2 = new ArrayList<>();
        sumDaSizes(root, deezDirs, deezDirs2);
        System.out.println("Part 1 answer:");
        System.out.println(deezDirs.stream().map((dir) -> dir.size).reduce(0, Integer::sum));

        System.out.println("Part 2 answer:");
        System.out.println(deezDirs2.stream().map((dir) -> dir.size).filter((size) -> {
            int currentlyAvailable = TOTAL_DISK_SPACE - root.size;
            return size > (MINIMUM_UNUSED_SPACE - currentlyAvailable);
        }).sorted().toList().get(0));
    }

    // Using DFS
    // Has side effects of summing calculating and assigning sizes to each Dir node + updating deezDirs and deezDirs2
    private static int sumDaSizes(Node node, List<Dir> deezDirs, List<Dir> deezDirs2) {
        if (node instanceof File) {
            return node.size;
        }
        int sum = 0;
        assert node instanceof Dir;
        for (Node child : ((Dir) node).childNodes.values()) {
            sum += sumDaSizes(child, deezDirs, deezDirs2);
        }
        node.size = sum;
        if (sum < MAX_SIZE) {
            deezDirs.add((Dir) node);
        }
        deezDirs2.add((Dir) node);
        return sum;
    }
}

class NodeFactory {
    public static Node create(String command) {
        List<String> commandParts = List.of(command.split(" "));
        if (commandParts.get(0).equals("dir")) {
            return new Dir(commandParts.get(1));
        }
        return new File(commandParts.get(1), Integer.parseInt(commandParts.get(0)));
    }
}

class Node {
    public int size;
    public String name;
}

class File extends Node {
    public File(String name, int size) {
        this.name = name;
        this.size = size;
    }
}

class Dir extends Node {
    public Map<String, Node> childNodes;

    public Dir(String name) {
        this.name = name;
        this.size = 0;
        this.childNodes = new HashMap<>();
    }

    public void addChild(String name, Node node) {
        this.childNodes.put(name, node);
    }
}