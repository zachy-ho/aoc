-- Just so I can require("utils") without worrying about where I'm executing this file from
local current_directory = debug.getinfo(1, "S").source:match([[^@?(.*[\/])[^\/]-$]])
local path = ";" .. current_directory .. "?.lua"
if not string.match(package.path, ";" .. current_directory .. "%?.lua") then
	package.path = package.path .. path
end

local utils = require("utils")
local P = utils.P
local size = utils.size

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

local parse_lines = function()
	local directions_str = lines[1]
	local directions = {}
	for c in string.gmatch(directions_str, ".") do
		table.insert(directions, c)
	end

	local nodes_lines = { unpack(lines, 3, size(lines)) }
	local nodes = {}
	for _, line in ipairs(nodes_lines) do
		local node_str = string.sub(line, 1, 3)
		local left_str = string.sub(line, 8, 10)
		local right_str = string.sub(line, 13, 15)
		nodes[node_str] = {
			L = left_str,
			R = right_str,
			value = node_str,
		}
	end

	return directions, nodes
end

local START = "AAA"
local END = "ZZZ"

local part_1 = function()
	local directions, nodes = parse_lines()

	local direction_counter = 1
	local end_found = false
	local current_node = nodes[START]
	local steps = 0
	while not end_found do
		steps = steps + 1
		local direction = directions[direction_counter]
		current_node = nodes[current_node[direction]]
		if current_node.value == END then
			end_found = true
		end

		-- restart from first direction
		if direction_counter == size(directions) then
			direction_counter = 1
		else
			direction_counter = direction_counter + 1
		end
	end
	return steps
end

---@param nodes table
---@return table start_nodes
local find_start_nodes = function(nodes)
	local start_nodes = {}
	for k, node in pairs(nodes) do
		if string.sub(node.value, 3) == "A" then
			start_nodes[k] = node
		end
	end
	return start_nodes
end

---@param node string
---@return boolean is_end_node
local is_end_node = function(node)
	return string.sub(node, 3) == "Z"
end

local part_2_brute = function()
	local directions, nodes = parse_lines()
	local start_nodes = find_start_nodes(nodes)
	local aim = size(start_nodes)
	local count = 0
	local steps = 0
	local next_nodes = start_nodes
	local direction_counter = 1
	while count ~= aim do
		local new_nodes = {}
		local direction = directions[direction_counter]
		for _, node in pairs(next_nodes) do
			local next_node = nodes[node[direction]]
			if is_end_node(next_node.value) and not is_end_node(node.value) then
				count = count + 1
			elseif is_end_node(node.value) and not is_end_node(next_node.value) then
				count = count - 1
			end
			new_nodes[next_node.value] = next_node
		end
		-- restart from first direction
		if direction_counter == size(directions) then
			direction_counter = 1
		else
			direction_counter = direction_counter + 1
		end
		steps = steps + 1
		next_nodes = new_nodes
	end
	return steps
end

---@param starting_node table
---@param nodes table
---@param directions table
---@return number steps
local get_steps = function(starting_node, nodes, directions)
	local direction_counter = 1
	local end_found = false
	local current_node = starting_node
	local steps = 0
	while not end_found do
		steps = steps + 1
		local direction = directions[direction_counter]
		current_node = nodes[current_node[direction]]
		if is_end_node(current_node.value) then
			end_found = true
		end

		-- restart from first direction
		if direction_counter == size(directions) then
			direction_counter = 1
		else
			direction_counter = direction_counter + 1
		end
	end
	return steps
end

local M = {}

---@param a number
---@param b number
---@return number gcd
M.gcd = function(a, b)
	if b == 0 then
		return a
	else
		return M.gcd(b, a % b)
	end
end

---@param a number
---@param b number
---@return number lcm
M.lcm = function(a, b)
	return (a * b) / M.gcd(a, b)
end

local part_2 = function()
	local directions, nodes = parse_lines()
	local start_nodes = find_start_nodes(nodes)
	local all_steps = {}
	for _, node in pairs(start_nodes) do
		local steps = get_steps(node, nodes, directions)
		table.insert(all_steps, steps)
	end
	local least_steps = all_steps[1]
	for i = 1, size(all_steps) - 1 do
		least_steps = M.lcm(least_steps, all_steps[i + 1])
	end
	return least_steps
end

-- print(part_1())
print(part_2())
