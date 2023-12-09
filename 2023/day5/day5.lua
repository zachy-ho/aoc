-- Just so I can require("utils") without worrying about where I'm executing this file from
local current_directory = debug.getinfo(1, "S").source:match([[^@?(.*[\/])[^\/]-$]])
local path = ";" .. current_directory .. "?.lua"
if not string.match(package.path, ";" .. current_directory .. "%?.lua") then
	package.path = package.path .. path
end

local utils = require("utils")
local split = utils.split
local concat = utils.concat
local size = utils.size

local parse = function(file_path)
	local script_path = debug.getinfo(1, "S").source:sub(2)
	local script_directory = script_path:match("(.*/)")
	local file = assert(io.open(script_directory .. file_path, "r"))
	local input = {}
	for l in file:lines() do
		table.insert(input, l)
	end
	file:close()
	return input
end

---@param file_path string
---@return table map list of mapped ranges ordered by source_range_start. All in numbers
-- { { destination_range_start, source_range_start, range_length } }
local create_map = function(file_path)
	local input = parse(file_path)
	-- local input = parse("test_" .. file_path)
	local map = {}
	for _, line in ipairs(input) do
		local dest, source, range = unpack(split(line, " "))
		table.insert(map, {
			source_range_start = tonumber(source),
			destination_range_start = tonumber(dest),
			range_length = tonumber(range),
		})
	end
	table.sort(map, function(a, b)
		return a.source_range_start < b.source_range_start
	end)
	return map
end

---@param component number
---@param map table list of partitions sorted by source_range_start
---@return number next_component
local get = function(component, map)
	for i, partition in ipairs(map) do
		local destination_range_start = partition.destination_range_start
		local source_range_start = partition.source_range_start
		local range_length = partition.range_length

		local is_last_partition = i == size(map)

		-- If less than the first partition (only possible if first specified source range starts from > 0)
		if component < source_range_start then
			return component
		end

		-- If within the current partition
		if is_last_partition or (component >= source_range_start and component < map[i + 1].source_range_start) then
			-- If within the mapped range
			if component < source_range_start + range_length then
				return destination_range_start + (component - source_range_start)
			else
				-- Otherwise there's no special mapping
				return component
			end
		end
	end

	-- shouldn't reach here
	return component
end

local seed_to_soil_map = create_map("seed_to_soil.txt")
local soil_to_fertilizer_map = create_map("soil_to_fertilizer.txt")
local fertilizer_to_water_map = create_map("fertilizer_to_water.txt")
local water_to_light_map = create_map("water_to_light.txt")
local light_to_temperature_map = create_map("light_to_temperature.txt")
local temperature_to_humidity_map = create_map("temperature_to_humidity.txt")
local humidity_to_location_map = create_map("humidity_to_location.txt")

local part_1 = function()
	local seeds = split(parse("seeds.txt")[1], " ")
	local locations = {}
	-- for each seed we go through the same function but use different maps in sequence
	for _, s in ipairs(seeds) do
		local seed = tonumber(s, 10)
		local soil = get(seed, seed_to_soil_map)
		local fertilizer = get(soil, soil_to_fertilizer_map)
		local water = get(fertilizer, fertilizer_to_water_map)
		local light = get(water, water_to_light_map)
		local temperature = get(light, light_to_temperature_map)
		local humidity = get(temperature, temperature_to_humidity_map)
		local location = get(humidity, humidity_to_location_map)
		table.insert(locations, location)
	end

	local min = math.huge
	for _, l in ipairs(locations) do
		min = math.min(min, l)
	end
	return min
end

---@param subject table { start, range }
---@param compare table { start, range }
---@return table the_breakdown { relation, minimal_intervals }
local break_it_down = function(subject, compare)
	local subject_start = subject.start
	local subject_end = subject.start + subject.range - 1
	local compare_start = compare.start
	local compare_end = compare.start + compare.range - 1

	if subject_start > compare_end or subject_end < compare_start then
		return { relation = "separate", original = subject }
	elseif subject_start < compare_start and subject_end > compare_end then
		return {
			relation = "superset",
			minimal_intervals = {
				left = {
					start = subject_start,
					range = compare_start - subject_start,
				},
				right = {
					start = compare_end + 1,
					range = subject_end - compare_end,
				},
				intersect = {
					start = compare_start,
					range = compare.range,
				},
			},
		}
	elseif subject_start < compare_start and subject_end >= compare_start then
		return {
			relation = "right_intersect",
			minimal_intervals = {
				left = {
					start = subject_start,
					range = compare_start - subject_start,
				},
				intersect = {
					start = compare_start,
					range = subject_end - compare_start + 1,
				},
			},
		}
	elseif subject_start >= compare_start and subject_end > compare_end then
		return {
			relation = "left_intersect",
			minimal_intervals = {
				intersect = {
					start = subject_start,
					range = compare_end - subject_start + 1,
				},
				right = {
					start = compare_end + 1,
					range = subject_end - compare_end,
				},
			},
		}
	end
	return {
		relation = "subset",
		minimal_intervals = {
			intersect = subject,
		},
	}
end

-- Similar to `get(component, map)`, assumes that `interval` will match exactly
-- one of the intervals in `map` or just a no-map (i.e. mapping to the same range)
---@param interval table { start, range }
---@param map table sorted { { destination_range_start, source_range_start, range_length } }
---@return table mapped_interval { start, range }
local map_interval = function(interval, map)
	local interval_start = interval.start

	local first = map[1]
	local last = map[size(map)]
	-- If less than the first partition or past the last partition, then map to same range
	if
		interval_start < first.source_range_start
		or interval_start > (last.source_range_start + last.range_length - 1)
	then
		return { start = interval_start, range = interval.range }
	end

	for i, partition in ipairs(map) do
		local destination_range_start = partition.destination_range_start
		local source_range_start = partition.source_range_start
		local range_length = partition.range_length

		local is_last_partition = i == size(map)

		-- If within the current partition
		if
			is_last_partition
			or (interval_start >= source_range_start and interval_start < map[i + 1].source_range_start)
		then
			-- If within the mapped range
			if interval_start < source_range_start + range_length then
				return {
					start = destination_range_start + (interval_start - source_range_start),
					range = interval.range,
				}
			else
				-- Otherwise there's no special mapping
				return { start = interval_start, range = interval.range }
			end
		end
	end

	-- shouldnt reach here
	error("map_interval went wrong")
end

local sifter = {}
---@param interval table { start, range }, starting interval
---@param map table { { destination_range_start, source_range_start, range_length } }
---@return table intervals list of mapped intervals {}
function sifter.sift(interval, map)
	local the_breakdown
	for _, source_interval in ipairs(map) do
		the_breakdown = break_it_down(interval, {
			start = source_interval.source_range_start,
			range = source_interval.range_length,
		})
		if the_breakdown.relation ~= "separate" then
			break
		end
	end

	-- base case 1: no matching interval
	if the_breakdown.relation == "separate" then
		local new_intervals = {}
		table.insert(new_intervals, the_breakdown.original)
		return new_intervals
	end
	-- base case 2: subset
	if the_breakdown.relation == "subset" then
		local new_intervals = {}
		table.insert(new_intervals, map_interval(the_breakdown.minimal_intervals.intersect, map))
		return new_intervals
	end

	if the_breakdown.relation == "superset" then
		local new_intervals = {}
		local left = sifter.sift(the_breakdown.minimal_intervals.left, map)
		local intersect = sifter.sift(the_breakdown.minimal_intervals.intersect, map)
		local right = sifter.sift(the_breakdown.minimal_intervals.right, map)
		for _, i in ipairs(left) do
			table.insert(new_intervals, i)
		end
		for _, i in ipairs(intersect) do
			table.insert(new_intervals, i)
		end
		for _, i in ipairs(right) do
			table.insert(new_intervals, i)
		end
		return new_intervals
	end

	if the_breakdown.relation == "left_intersect" then
		local new_intervals = {}
		local right = sifter.sift(the_breakdown.minimal_intervals.right, map)
		local intersect = sifter.sift(the_breakdown.minimal_intervals.intersect, map)
		for _, i in ipairs(intersect) do
			table.insert(new_intervals, i)
		end
		for _, i in ipairs(right) do
			table.insert(new_intervals, i)
		end
		return new_intervals
	end

	if the_breakdown.relation == "right_intersect" then
		local new_intervals = {}
		local left = sifter.sift(the_breakdown.minimal_intervals.left, map)
		local intersect = sifter.sift(the_breakdown.minimal_intervals.intersect, map)
		for _, i in ipairs(left) do
			table.insert(new_intervals, i)
		end
		for _, i in ipairs(intersect) do
			table.insert(new_intervals, i)
		end
		return new_intervals
	end

	-- shouldn't reach here
	error("sift logic is wrong")
end

local create_pipeline = function()
	local pipeline = {}
	table.insert(pipeline, seed_to_soil_map)
	table.insert(pipeline, soil_to_fertilizer_map)
	table.insert(pipeline, fertilizer_to_water_map)
	table.insert(pipeline, water_to_light_map)
	table.insert(pipeline, light_to_temperature_map)
	table.insert(pipeline, temperature_to_humidity_map)
	table.insert(pipeline, humidity_to_location_map)
	return pipeline
end

---@param intervals table list of { range, start }
---@param map table you know what the map is
---@return table minimal_intervals
function sifter.sift_many(intervals, map)
	local flatlist = {}
	for _, i in ipairs(intervals) do
		local mapped_from_one = sifter.sift(i, map)
		for _, minimal in ipairs(mapped_from_one) do
			table.insert(flatlist, minimal)
		end
	end
	return flatlist
end

local part_2 = function()
	local get_seed_intervals = function()
		local list = split(parse("seeds.txt")[1], " ")
		local intervals = {}
		for k, v in ipairs(list) do
			if math.fmod(k, 2) == 1 then
				table.insert(intervals, {
					start = tonumber(v),
					range = tonumber(list[k + 1]),
				})
			end
		end
		return intervals
	end

	local pipeline = create_pipeline()
	local intervals = get_seed_intervals()

	-- for each interval, go through the pipeline to generate new sets of intervals
	-- and add to mapped_intervals
	local all_mapped_intervals = {}
	for _, interval in ipairs(intervals) do
		local minimal_intervals = { interval }
		for _, map in ipairs(pipeline) do
			minimal_intervals = sifter.sift_many(minimal_intervals, map)
		end
		all_mapped_intervals = concat(all_mapped_intervals, minimal_intervals)
	end

	table.sort(all_mapped_intervals, function(a, b)
		return a.start < b.start
	end)

	return all_mapped_intervals[1].start
end

print(part_1())
print(part_2())
