local Module = {}

local function GenRanName()
   local length = math.random(1, 2)
    local set = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    local res = "_"
    
    for i = 1, length do
        local index = math.random(#set)
        res = res .. set:sub(index, index)
    end
    
    return res
end

local function GenerateJunk()
    local junk = { -- more junk code gon be added soon, but for now you add your own
        "local " .. GenRanName() .. " = math.random(1,100);",
        "local " .. GenRanName() .. " = tostring(math.pi);",
        "if false then print('nope') end;",
        "local " .. GenRanName() .. " = type('hello');",
        "do local " .. GenRanName() .. " = {} end;",
        "local " .. GenRanName() .. " = select('#');",
    }
    return junk[math.random(1, #junk)]
end

function Module.Process(code, amount)
    amount = amount or 5
    local result = ""
    for i = 1, amount do
        result = result .. GenerateJunk()
    end
    return result .. code .. GenerateJunk()
end


return Module