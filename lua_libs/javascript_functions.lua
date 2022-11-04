javascript = {}

function javascript.javascript_post_increment(expr)
    oldvalue = expr
    expr = expr+1
    return oldvalue
end

function javascript.javascript_pre_increment(expr)
    expr = expr+1
    return expr
end

function javascript.javascript_post_decrement(expr)
    oldvalue = expr
    expr = expr-1
    return oldvalue
end

function javascript.javascript_pre_decrement(expr)
    expr = expr-1
    return expr
end

function javascript.javascript_add(expr1, expr2)
    if(javascript_instanceof(expr1) == 'string' and javascript_instanceof(expr2) == 'string') then
        return expr1 .. expr2
    end
    return toNumeric(expr1) + javascript_toNumeric(expr2)
end

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
    inst_class = val.__javascript_class
    while (inst_class ~= nil) do
        if inst_class == class then
            return true
        end
        inst_class = inst_class.__javascript_parent_class
    end
    return false
end

function javascript.javascript_hasProperty(val, prop)
    return val[prop] ~= nil
end

function javascript.javascript_logicalOr(expr1, expr2)
    return expr1 or expr2
end

function javascript.javascript_import(file)
    return require(file)
end

javascript.console = {}

function javascript.console.log(arguments)
    for i = 1, #arguments do
        print(arguments[i])
    end
end

return javascript
