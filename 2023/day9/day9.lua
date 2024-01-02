-- Just so I can require("utils") without worrying about where I'm executing this file from
local current_directory = debug.getinfo(1, "S").source:match([[^@?(.*[\/])[^\/]-$]])
local path = ";" .. current_directory .. "?.lua"
if not string.match(package.path, ";" .. current_directory .. "%?.lua") then
	package.path = package.path .. path
end

local utils = require("utils")
local size = utils.size
local split = utils.split
local P = utils.P

local parse = function()
	local script_path = debug.getinfo(1, "S").source:sub(2)
	local script_directory = script_path:match("(.*/)")
	local file = assert(io.open(script_directory .. "input.txt", "r"))
	local lines = {}
	for l in file:lines() do
		table.insert(lines, l)
	end
	file:close()
	return lines
end
local lines = parse()

---@param seq table
---@return table diff_seq
local calculate_diffs = function(seq)
	local diff_seq = {}
	for i = 1, size(seq) - 1 do
		table.insert(diff_seq, seq[i + 1] - seq[i])
	end
	return diff_seq
end

---@param seq table
---@return boolean all_zeros
local are_all_zeros = function(seq)
	for _, v in ipairs(seq) do
		if v ~= 0 then
			return false
		end
	end
	return true
end

---@param line string
---@return table sequence
local parse_into_sequence = function(line)
	local sequence = {}
	for _, s in ipairs(split(line, " ")) do
		table.insert(sequence, tonumber(s))
	end
	return sequence
end

---@param seq table
---@return number num
local extrapolate_last = function(seq)
	local temp = { unpack(seq) }
	local count = 0
	local ends = {}
	while not are_all_zeros(temp) do
		table.insert(ends, temp[size(temp)])
		count = count + 1
		local new_seq = calculate_diffs(temp)
		temp = new_seq
	end

	local num = 0
	for i = size(ends), 1, -1 do
		num = num + ends[i]
	end
	return num
end

---@param seq table
---@return number num
local extrapolate_first = function(seq)
	local temp = { unpack(seq) }
	local count = 0
	local starts = {}
	while not are_all_zeros(temp) do
		table.insert(starts, temp[1])
		count = count + 1
		local new_seq = calculate_diffs(temp)
		temp = new_seq
	end

	local num = 0
	for i = size(starts), 1, -1 do
		num = starts[i] - num
	end
	return num
end

local part_1 = function()
	local sequences = {}
	for _, line in ipairs(lines) do
		table.insert(sequences, parse_into_sequence(line))
	end

	local sum = 0
	for _, sequence in ipairs(sequences) do
		sum = sum + extrapolate_last(sequence)
	end

	return sum
end

local part_2 = function()
	local sequences = {}
	for _, line in ipairs(lines) do
		table.insert(sequences, parse_into_sequence(line))
	end
	local sum = 0
	for _, sequence in ipairs(sequences) do
		sum = sum + extrapolate_first(sequence)
	end
	return sum
end

-- print(part_1())
print(part_2())
