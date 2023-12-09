local utils = require("utils")
local split = utils.split_exact

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

local part_2 = function()
	---@param game string
	---@return number
	local calc_game_power = function(game)
		local red_min = 0
		local green_min = 0
		local blue_min = 0

		for _, round in ipairs(split(game, "; ")) do
			for _, color in ipairs(split(round, ", ")) do
				local count_and_color = split(color, " ")
				local count = tonumber(count_and_color[1], 10)
				local name = count_and_color[2]
				if name == "red" and count > red_min then
					red_min = count
				elseif name == "green" and count > green_min then
					green_min = count
				else
					blue_min = count
				end
			end
		end
		return red_min * green_min * blue_min
	end

	local sum = 0
	for _, line in ipairs(input) do
		local game = split(line, ": ")
		sum = sum + calc_game_power(game[2])
	end
	return sum
end

print(part_1())
print(part_2())
