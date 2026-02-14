local Module = {}
local Arth = require("Modules.Arithmetic")

local numericKey = math.random(1, 97)
local KeyExpression = Arth.Apply(numericKey)

local function Apply(code)
   local res = {}
   
   for i = 1, #code do
        local byte = code:byte(i) - 7
        local encrypted = bit32.bxor(byte, numericKey)
        res[#res + 1] = "\\" .. encrypted
   end
   
   return table.concat(res)
end

function Module.Process(code)
   local Table = 'local T = {"' .. Apply(code) .. '"}'

   
   local helper = Table .. " local function _K(_d) return T[1]:byte(_d) end; "
   
   local decoder = ""
   decoder = helper .. "local function _a(_b)"
   decoder = decoder .. "local _c = {}"
   decoder = decoder .. " for i = 1, #_b do "
decoder = decoder .. " local _d = _K(i); "
decoder = decoder .. " local _e = bit32.bxor(_d, " .. KeyExpression .. ") + 7; "
decoder = decoder .. " _c[#_c+1] = string.char(_e); "
decoder = decoder .. " end; "
   decoder = decoder .. "return table.concat(_c)"
   decoder = decoder .. "end;"
   
   local res = decoder .. "local _f = loadstring; _f(_a(T[1]))()"
   
   return res
end

return Module