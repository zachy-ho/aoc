#!/bin/bash          
if [ $# -eq 0 ]; then
    echo "Provide a new day, please"
    exit 1
fi

day=$1
newFolder="./${day}"
newFile="${newFolder}/${day}.java"

mkdir -p "${newFolder}"
touch "${newFile}"

dayCap=${day^}
cat > "${newFile}" << EOL
package ${day};

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

class ${dayCap} {
    public static void main(String args[]) throws IOException {
        // make some magic!
        String input = Files.readString(Path.of("${day}", "input.txt"));
    }
}
EOL
