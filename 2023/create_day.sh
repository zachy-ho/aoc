#!/bin/bash          
if [ $# -eq 0 ]; then
    echo "Which day is it?"
    exit 1
fi

day=$1
newFolder="./${day}"
newFile="${newFolder}/${day}.lua"

mkdir -p "${newFolder}"
touch "${newFile}"
