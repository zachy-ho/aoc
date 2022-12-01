package day1;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;

class Day1 {
    public static void main(String args[]) throws IOException {
        // make some magic!
        BufferedReader br;
        try {
            br = new BufferedReader(new FileReader("input.txt"));
            while (br.readLine())
            br.close();
        } catch (FileNotFoundException e) {
            throw e;
        } catch(IOException e) {
            throw e;
        }
    }
}
