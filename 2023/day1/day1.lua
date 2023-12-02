local input = assert(io.open("./input.txt", "r"))
local lines = {}
for l in input:lines() do
	table.insert(lines, l)
end
input:close()

local part_1 = function()
	local sum = 0
	for _, line in ipairs(lines) do
		local first = string.match(line, "%d")
		local last = string.reverse(line):match("%d")
		sum = sum + tonumber(first .. last)
	end
	return sum
end

local part_2 = function()
	local words = {
		"one",
		"two",
		"three",
		"four",
		"five",
		"six",
		"seven",
		"eight",
		"nine",
	}

	local reverse_words = {}
	for _, v in ipairs(words) do
		table.insert(reverse_words, v:reverse())
	end

	local find_first = function(line, numbers_in_words)
		local first = tonumber(string.match(line, "%d"))
		local first_digit_idx = string.find(line, "%d")
		local first_idx = first_digit_idx or string.len(line)
		for k, v in ipairs(numbers_in_words) do
			local matched_word_idx = string.find(line, v)
			if matched_word_idx and matched_word_idx < first_idx then
				first_idx = matched_word_idx
				first = k
			end
		end
		return first
	end

	local sum = 0
	for _, line in ipairs(lines) do
		local first = find_first(line, words)
		local last = find_first(string.reverse(line), reverse_words)
		sum = sum + tonumber(first .. last)
	end

	return sum
end

print(part_1())
print(part_2())
