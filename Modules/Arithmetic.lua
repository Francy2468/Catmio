local Module = {}

function Module.Apply(n)
   local num = tonumber(n)
   
   local Power = {}
   local Remaining = num
   
   local ToPower = math.floor(math.log(Remaining) / math.log(2))
   while Remaining > 0 do
      local _Power = math.floor(math.log(Remaining) / math.log(2))
      table.insert(Power, _Power)
      Remaining = Remaining - (2^_Power)
   end
   
   local res = ""
   for i, p in ipairs(Power) do
      res = res .. "2^" .. p
        if i < #Power then
            res = res .. " + "
        end
   end
   
   return "(" .. res .. ")"
end

return Module