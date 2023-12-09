#!/bin/bash          
if [ $# -eq 0 ]; then
    echo "Which day is it?"
    exit 1
fi

day=$1
newFolder="./${day}"
if [ -d "$day" ]; then
    echo "$day already exists."
    exit 1
fi

newFile="${newFolder}/${day}.lua"

mkdir -p "${newFolder}"
touch "${newFolder}/input.txt"
touch "${newFile}"

cat > "${newFile}" << EOL
-- Just so I can require("utils") without worrying about where I'm executing this file from
local current_directory = debug.getinfo(1, "S").source:match([[^@?(.*[\/])[^\/]-$]])
local path = ";" .. current_directory .. "?.lua"
if not string.match(package.path, ";" .. current_directory .. "%?.lua") then
	package.path = package.path .. path
end

local utils = require("utils")

local parse = function()
	local script_path = debug.getinfo(1, "S").source:sub(2)
	local script_directory = script_path:match("(.*/)")
	local file = assert(io.open(script_directory .. "input.txt", "r"))
	local input = {}
	for l in file:lines() do
		table.insert(input, l)
	end
	file:close()
	return input
end
local input = parse()

local part_1 = function() end

local part_2 = function() end

print(part_1())
print(part_2())
EOL
