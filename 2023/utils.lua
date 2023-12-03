local M = {}

function M.P(i)
	print(vim.inspect(i))
end

---@param str string
---@return string trimmed `str` without any starting or trailing white spaces
function M.trim(str)
	local trimmed = string.gsub(str, "^%s*(.-)%s*$", "%1")
	return trimmed
end

---@param str string
---@param delimiter string
---@return table splits a list of substrings of `str` separated by the `delimiter`
function M.split(str, delimiter)
	local splits = {}
	local last_pos = 1
	for pos in string.gmatch(str, "()" .. delimiter) do
		table.insert(splits, string.sub(str, last_pos, pos - 1))
		last_pos = pos + string.len(delimiter)
	end
	-- last item
	table.insert(splits, string.sub(str, last_pos))
	return splits
end

---@param t table
---@return number size of table
function M.size(t)
	local count = 0
	for _ in pairs(t) do
		count = count + 1
	end
	return count
end

return M
