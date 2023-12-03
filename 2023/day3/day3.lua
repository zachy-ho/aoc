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

local is_in_bounds = function(x, y)
	local max_x = string.len(input[1])
	local max_y = #input
	return not (x < 1 or x > max_x or y < 1 or y > max_y)
end

---@param x_start number
---@param y_start number
---@param length number
---@return table neighbors list of x and y coordinates
local get_neighbors = function(x_start, y_start, length)
	local neighbors = {}
	for x = x_start - 1, x_start + length do
		for y = y_start - 1, y_start + 1 do
			-- if in bounds and not part of the string
			if is_in_bounds(x, y) and not (y == y_start and (x >= x_start and x < x_start + length)) then
				table.insert(neighbors, { x = x, y = y })
			end
		end
	end
	return neighbors
end

---@param neighbors table list of neighbor coordinates for a part
---@return boolean is_part true if one or more neighbor characters is a special character
local is_part_number = function(neighbors)
	for _, coord in ipairs(neighbors) do
		local x = coord["x"]
		local y = coord["y"]
		local char = string.sub(input[tonumber(y)], x, x)
		if not (tonumber(char, 10) or char == ".") then
			return true
		end
	end
	return false
end

local part_1 = function()
	local sum = 0

	for row, line in ipairs(input) do
		for number_pos in string.gmatch(line, "()%d+") do
			local number = string.match(string.sub(line, tonumber(number_pos, 10)), "%d+")
			local neighbors = get_neighbors(tonumber(number_pos, 10), row, string.len(number))
			if is_part_number(neighbors) then
				sum = sum + tonumber(number, 10)
			end
		end
	end

	return sum
end

---@param x number x-coordinate
---@param y number y-coordinate
local is_number = function(x, y)
	return tonumber(string.sub(input[y], x, x), 10) ~= nil
end

---@return table number_map list of all numbers - [{ y, numbers: [{ x, number }] }]
local prep_number_map = function()
	local number_map = {}
	for row, line in ipairs(input) do
		local row_map = number_map[tostring(row)] or {}
		for pos in string.gmatch(line, "()%d+") do
			local number = string.match(string.sub(line, tonumber(pos, 10)), "%d+")
			table.insert(row_map, {
				x = tostring(pos),
				number = number,
			})
		end

		-- sort by x pos
		table.sort(row_map, function(a, b)
			return tonumber(a["x"], 10) < tonumber(b["x"], 10)
		end)

		-- naturally inserted in order of y pos
		table.insert(number_map, {
			y = tostring(row),
			numbers = row_map,
		})
	end

	return number_map
end

---@param neighbors table list of x and y coordinates
---@return table numeric_neighbors `neighbors` filtered to those that is of numerical value
local filter_numeric = function(neighbors)
	local numeric_neighbors = {}

	-- get coords of neighbors that are numbers
	for _, coord in ipairs(neighbors) do
		local x = coord["x"]
		local y = coord["y"]
		if is_number(tonumber(x, 10), tonumber(y, 10)) then
			table.insert(numeric_neighbors, {
				x = x,
				y = y,
			})
		end
	end
	return numeric_neighbors
end

local utils = require("utils")
local size = utils.size

local part_2 = function()
	local number_map = prep_number_map()

	---@param neighbors table list of neighbors that are numbers
	---@return table connected list of numbers, keyed by a ":"-delimited coordinate, representing complete numbers that are connected (adjacent) through a "*" symbol in the input
	local get_connected_numbers = function(neighbors)
		local connected = {}
		for _, coord in ipairs(neighbors) do
			local row_to_search = number_map[coord["y"]]
			local numbers = row_to_search["numbers"]
			local x = tonumber(coord["x"], 10)
			for k, number in pairs(numbers) do
				local x_of_number = tonumber(number["x"], 10)
				local x_of_next_number = numbers[k + 1] and tonumber(numbers[k + 1]["x"])
					-- in case numbers[k + 1] is out of bounds
					or string.len(input[tonumber(coord["y"])])
				if x >= x_of_number and x < x_of_next_number then
					-- use a ":"-delimited identifier made up of x and y coordinates to behave like a set (i.e. prevent duplicates)
					connected[coord["y"] .. ":" .. number["x"]] = number["number"]
				end
			end
		end
		return connected
	end

	local sum = 0
	for row, line in ipairs(input) do
		for pos in string.gmatch(line, "()%*") do
			local neighbors = get_neighbors(pos, row, 1)
			local numeric_neighbors = filter_numeric(neighbors)

			-- further filter down to actual complete numbers
			local numbers = get_connected_numbers(numeric_neighbors)

			local list = {}
			if size(numbers) == 2 then
				for _, v in pairs(numbers) do
					table.insert(list, tonumber(v))
				end
				sum = sum + list[1] * list[2]
			end
		end
	end
	return sum
end

print(part_1())
print(part_2())
