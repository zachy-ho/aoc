local utils = require("utils")
local P = utils.P
local script_path = debug.getinfo(1, "S").source:sub(2)
local script_directory = script_path:match("(.*/)")
local file = assert(io.open(script_directory .. "input.txt", "r"))
local input = {}
for l in file:lines() do
	table.insert(input, l)
end
file:close()

---@param str string
---@param delimiter string
---@return table
local split = function(str, delimiter)
	local splits = {}
	-- for i in string.gmatch(str, "[^" .. separator .. "]+") do
	-- for i in string.gmatch(str, "(.-):%s") do
	local last_pos = 1
	for pos in string.gmatch(str, "()" .. delimiter) do
		table.insert(splits, string.sub(str, last_pos, pos - 1))
		last_pos = pos + string.len(delimiter)
	end
	-- last item
	table.insert(splits, string.sub(str, last_pos))
	return splits
end

---@param color table { count, name }
---@param maxes table { <red>, <green>, <blue> }
local is_color_valid = function(color, maxes)
	local count = tonumber(color[1])
	local name = color[2]
	if
		(name == "red" and count > maxes["red"])
		or (name == "green" and count > maxes["green"])
		or (name == "blue" and count > maxes["blue"])
	then
		return false
	end
	return true
end

---@param game string
---@param maxes table
local is_game_valid = function(game, maxes)
	local rounds = split(game, "; ")
	for _, round in ipairs(rounds) do
		local cubes = split(round, ", ")
		for _, color in ipairs(cubes) do
			if not is_color_valid(split(color, " "), maxes) then
				return false
			end
		end
	end
	return true
end

local part_1 = function()
	local maxes = {
		red = 12,
		green = 13,
		blue = 14,
	}

	local sum = 0
	for n, line in ipairs(input) do
		local game = split(line, ": ")
		if is_game_valid(game[2], maxes) then
			sum = sum + n
		end
	end

	return sum
end

-- local part_2 = function() end

print(part_1())
-- print(part_2())
