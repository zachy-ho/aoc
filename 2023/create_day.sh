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
