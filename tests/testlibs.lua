local js = require "lua_libs.javascript_functions"

return {
    __prepare_environment = function()
        js.__prepare_environment()
        _G.__test_count = 0
        _G.assert = function(value, file, line)
            if value.__value then
                console.log({String("Test " .. __lua_environment.tostring(__test_count) .. " successful.")})
            else
                console.log({String("Test " .. __lua_environment.tostring(__test_count) .. " unsuccessful. File: " .. file .. ". Line: " .. line .. ".")})
            end
            __test_count = __test_count + 1
        end
    end
}