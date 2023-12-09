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

local current_directory = debug.getinfo(1, "S").source:match([[^@?(.*[\/])[^\/]-$]])
local path = ";" .. current_directory .. "?.lua"
if not string.match(package.path, ";" .. current_directory .. "%?.lua") then
	package.path = package.path .. path
end

local utils = require("utils")

local split = utils.split
local split_exact = utils.split_exact
local part_1 = function()
	---@param matches number
	local calculate = function(matches)
		if matches == 0 then
			return 0
		end

		local sum = 0
		for i = 1, matches do
			if i == 1 then
				sum = 1
			else
				sum = sum * 2
			end
		end
		return sum
	end

	local sum = 0
	for _, line in pairs(input) do
		local cards = split_exact(line, ": ")
		local numbers = split_exact(cards[2], " | ")
		local winning_numbers = split(numbers[1], " ")
		local my_numbers = split(numbers[2], " ")
		local matches = 0
		for _, num in pairs(my_numbers) do
			for _, winner in pairs(winning_numbers) do
				if num == winner then
					matches = matches + 1
				end
			end
		end

		sum = sum + calculate(matches)
	end
	return sum
end

local for_each = utils.for_each_in_order
local part_2 = function()
	---@param numbers table
	local get_matches = function(numbers)
		local winning_numbers = split(numbers[1], " ")
		local my_numbers = split(numbers[2], " ")
		local matches = 0
		for _, num in pairs(my_numbers) do
			for _, winner in pairs(winning_numbers) do
				if num == winner then
					matches = matches + 1
				end
			end
		end
		return matches
	end

	local card_count = {}
	for k in pairs(input) do
		card_count[k] = 1
	end

	for_each(card_count, function(card, count)
		local cards = split_exact(input[tonumber(card)], ": ")
		local _, card_number = unpack(split(cards[1], " "))
		-- P(card_number)
		local numbers = split_exact(cards[2], " | ")
		local matches = get_matches(numbers)

		for i = 1, matches do
			local card_to_add = tonumber(card_number) + i
			card_count[card_to_add] = card_count[card_to_add] + count
		end
	end)

	local sum = 0
	for _, v in pairs(card_count) do
		sum = sum + v
	end
	return sum
end

print(part_1())
print(part_2())
