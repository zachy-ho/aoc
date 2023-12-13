-- Just so I can require("utils") without worrying about where I'm executing this file from
local current_directory = debug.getinfo(1, "S").source:match([[^@?(.*[\/])[^\/]-$]])
local path = ";" .. current_directory .. "?.lua"
if not string.match(package.path, ";" .. current_directory .. "%?.lua") then
	package.path = package.path .. path
end

local utils = require("utils")
local split = utils.split
local P = utils.P
local size = utils.size

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

local parse_sets = function()
	local sets = {}
	for _, line in ipairs(input) do
		local hand, bid = unpack(split(line, " "))
		table.insert(sets, {
			hand = hand,
			bid = tonumber(bid),
		})
	end
	return sets
end

local Type = {
	FIVE = 7,
	FOUR = 6,
	HOUSE = 5,
	THREE = 4,
	TWO = 3,
	ONE = 2,
	HIGH = 1,
}

local cards = {
	["A"] = 13,
	["K"] = 12,
	["Q"] = 11,
	["J"] = 10,
	["T"] = 9,
	["9"] = 8,
	["8"] = 7,
	["7"] = 6,
	["6"] = 5,
	["5"] = 4,
	["4"] = 3,
	["3"] = 2,
	["2"] = 1,
}

---@param hand string
---@return number type Type
local evaluate_hand = function(hand)
	local card_counts = {}
	local keys = {}
	for c in string.gmatch(hand, ".") do
		if card_counts[c] == nil then
			card_counts[c] = 1
			table.insert(keys, c)
		else
			card_counts[c] = card_counts[c] + 1
		end
	end
	table.sort(keys, function(a, b)
		return card_counts[a] > card_counts[b]
	end)

	if card_counts[keys[1]] == 5 then
		return Type.FIVE
	elseif card_counts[keys[1]] == 4 then
		return Type.FOUR
	elseif card_counts[keys[1]] == 3 then
		if card_counts[keys[2]] == 2 then
			return Type.HOUSE
		else
			return Type.THREE
		end
	elseif card_counts[keys[1]] == 2 then
		if card_counts[keys[2]] == 2 then
			return Type.TWO
		else
			return Type.ONE
		end
	else
		return Type.HIGH
	end
end

---@param sets table
---@return table buckets
local put_into_buckets = function(sets)
	local buckets = {}
	for _, set in ipairs(sets) do
		local hand = evaluate_hand(set.hand)
		if buckets[hand] == nil then
			buckets[hand] = { set }
		else
			table.insert(buckets[hand], set)
		end
	end
	return buckets
end

---@param hand1 string
---@param hand2 string
---@return boolean | nil hand1_higher_than_hand2
local is_lower = function(hand1, hand2)
	local cards1 = {}
	local cards2 = {}
	for c in string.gmatch(hand1, ".") do
		table.insert(cards1, c)
	end
	for c in string.gmatch(hand2, ".") do
		table.insert(cards2, c)
	end
	for k, c in ipairs(cards1) do
		if cards[c] < cards[cards2[k]] then
			return true
		end
		if cards[c] > cards[cards2[k]] then
			return false
		end
	end
	-- shouldn't reach here
	return nil
end

---@param bucket table { { hand, bid } }
---@return table sorted_bucket
local sort = function(bucket)
	-- P(bucket)
	table.sort(bucket, function(a, b)
		return is_lower(a.hand, b.hand)
	end)
	return bucket
end

local part_1 = function()
	local sets = parse_sets()
	local buckets = put_into_buckets(sets)
	local bucket_keys = {}
	for k, bucket in pairs(buckets) do
		sort(bucket)
		table.insert(bucket_keys, k)
	end

	table.sort(bucket_keys, function(a, b)
		return tonumber(a) < tonumber(b)
	end)

	local rank = 1
	local sum = 0
	for _, k in ipairs(bucket_keys) do
		local bucket = buckets[k]
		for _, set in pairs(bucket) do
			local score = set.bid * rank
			if set.hand == "22228" then
				P(rank)
			end
			sum = sum + score
			rank = rank + 1
		end
	end
	return sum
end

local part_2 = function() end

print(part_1())
print(part_2())

-- 251213677 (wrong)
