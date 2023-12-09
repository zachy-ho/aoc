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
	local sep = delimiter
	if delimiter == " " then
		sep = "%s"
	end

	local splits = {}
	for m in string.gmatch(str, "([^" .. sep .. "]+)") do
		table.insert(splits, m)
	end
	return splits
end

---@param str string
---@param delimiter string
---@return table splits a list of substrings of `str` separated by the `delimiter`
function M.split_exact(str, delimiter)
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

function M.shallow_copy(t)
	local t2 = {}
	for k, v in pairs(t) do
		if type(v) == "table" then
			t2[k] = M.shallow_copy(v)
		else
			t2[k] = v
		end
	end
	return t2
end

---@param t table with sortable keys
---@param fn function what to do with each k, v entry
function M.for_each_in_order(t, fn)
	local keys = {}
	for k in pairs(t) do
		table.insert(keys, k)
	end
	table.sort(keys)
	for _, k in ipairs(keys) do
		fn(k, t[k])
	end
end

-- Duplicate keys will default to table2's value. Use `concat` instead of indexed lists
---@param table1 table keyed table
---@param table2 table keyed table
---@return table merged { ...table1, ...table2 }
function M.merge(table1, table2)
	local merged = {}
	for k, v in pairs(table1) do
		merged[k] = v
	end
	for k, v in pairs(table2) do
		merged[k] = v
	end
	return merged
end

-- Returns a new list with table2 concatenated on table1
---@param table1 table keyed table
---@param table2 table keyed table
---@return table merged { ...table1, ...table2 }
function M.concat(table1, table2)
	local merged = {}
	for _, v in ipairs(table1) do
		table.insert(merged, v)
	end
	for _, v in ipairs(table2) do
		table.insert(merged, v)
	end
	return merged
end

return M
