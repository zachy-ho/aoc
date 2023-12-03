local M = {}
function M.P(i)
	print(vim.inspect(i))
end

function M.trim(str)
	return string.gsub(str, "^%s*(.-)%s*$", "%1")
end

return M
