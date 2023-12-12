-- Just so I can require("utils") without worrying about where I'm executing this file from
local current_directory = debug.getinfo(1, "S").source:match([[^@?(.*[\/])[^\/]-$]])
local path = ";" .. current_directory .. "?.lua"
if not string.match(package.path, ";" .. current_directory .. "%?.lua") then
	package.path = package.path .. path
end

local utils = require("utils")
local split = utils.split
local P = utils.P

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

---@param race table { time, distance }
---@return number ways_to_win
local find_winner_counts = function(race)
	-- find middle point
	-- binary search left and right recursively until time * (total_time - time)
	local low = 0
	local high = math.floor(race.time / 2)
	while low ~= high do
		local mid_time = math.floor((low + high) / 2)
		local mid = mid_time * (race.time - mid_time)
		local target = race.distance
		if target >= mid then
			low = mid_time + 1
		else
			high = mid_time
		end
	end

	local second = low
	local score = second * (race.time - second)
	local count = 0
	while score > race.distance do
		count = count + 1
		second = second + 1
		score = second * (race.time - second)
	end
	return count
end

local part_1 = function()
	local parse_races = function()
		local times = split(input[1], " ")
		table.remove(times, 1)
		local distances = split(input[2], " ")
		table.remove(distances, 1)
		local races = {}
		for k, v in ipairs(times) do
			races[k] = {
				time = tonumber(v),
				distance = tonumber(distances[k]),
			}
		end
		return races
	end
	local races = parse_races()

	local race_winners = {}
	for _, race in ipairs(races) do
		table.insert(race_winners, find_winner_counts(race))
	end
	P(race_winners)

	local margin = race_winners[1]
	for _, v in ipairs({ unpack(race_winners, 2) }) do
		margin = margin * v
	end
	return margin
end

local part_2 = function()
	local parse_race = function()
		local times = split(input[1], " ")
		table.remove(times, 1)
		local distances = split(input[2], " ")
		table.remove(distances, 1)
		return {
			time = tonumber(table.concat(times)),
			distance = tonumber(table.concat(distances)),
		}
	end

	local race = parse_race()
	local winners = find_winner_counts(race)
	P(winners)
end

-- print(part_1())
print(part_2())
