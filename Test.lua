-- test.lua
print("Hello from Zen!")

local function add(a, b)
    return a + b
end

local function greet(name)
    return "Hello, " .. name .. "!"
end

local t = {1, 2, 3, 4, 5}
local sum = 0

for i, v in ipairs(t) do
    sum = add(sum, v)
end

print(greet("World"))
print("Sum:", sum)
print("Done!")