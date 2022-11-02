javascript = {}

function javascript.add_to_table(t)
    for key, val in pairs(t) do
        _G[key] = val
    end
end

function javascript.javascript_toNumeric(val)
    return tonumber(val)
end

function javascript.javascript_toBoolean(val)
    return not not val
end

function javascript.javascript_instanceof(val, class)
    return false
end

function javascript.javascript_hasProperty(val, prop)
    return false
end

function javascript.javascript_logicalOr(expr1, expr2)
    return expr1 or expr2
end

function javascript.javascript_import(file)
end

function javascript.javascript_super(instance)
end

javascript.console = {}

function javascript.console.log(arguments)
    for i = 1,#arguments do
        print(arguments[i])
    end 
end

return javascript