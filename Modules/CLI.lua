local Module = {}

function Module.Process(code)
   return "return (function(...)\n" .. code .. "\nend)(...)"
end

return Module