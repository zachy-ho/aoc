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
class ${dayCap} {
    public statc void main(String args[]) {
        // make some magic!
    }
}
EOL
