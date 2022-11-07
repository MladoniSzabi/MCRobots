local javascript = {}

local __lua_environment = _G

function javascript.__javascript_post_increment(expr)

    local oldvalue = Number()
    oldvalue.__value = expr.__value
    expr.__value = expr.__value + 1
    return oldvalue
end

function javascript.__javascript_pre_increment(expr)
    expr.__value = expr.__value + 1
    return expr
end

function javascript.__javascript_post_decrement(expr)
    local oldvalue = Number()
    oldvalue.__value = expr.__value
    expr.__value = expr.__value - 1
    return oldvalue
end

function javascript.__javascript_pre_decrement(expr)
    expr.__value = expr.__value + 1
    return expr
end

function javascript.__javascript_add(expr1, expr2)
    if(__lua_environment.type(expr1) == 'string' and __lua_environment.type(expr2) == 'string') then
        return expr1 .. expr2
    end
    if (javascript.javascript_instanceof(expr1) == 'string' and javascript.javascript_instanceof(expr2) == 'string') then
        return expr1 + expr2
    end
    return javascript.toNumeric(expr1) + javascript.javascript_toNumeric(expr2)
end

function javascript.__add_to_global_table(t)
    for key, val in __lua_environment.pairs(t) do
        _G[key] = val
    end
end

function javascript.__javascript_toNumeric(val)
    return Number(val)
end

function javascript.__javascript_toBoolean(val)
    return Boolean(val)
end

function javascript.__javascript_type(val)
    return val.__type or __lua_environment.type(val)
end

function javascript.__javascript_instanceof(val, class)
    local inst_class = val.__javascript_class
    while (inst_class ~= nil) do
        if inst_class == class then
            return true
        end
        inst_class = inst_class.__javascript_parent_class
    end
    return false
end

function javascript.__javascript_hasProperty(val, prop)
    return val[prop] ~= nil
end

function javascript.__javascript_logical_or(expr1, expr2)
    if Boolean(expr1).__value then
        return expr1
    end
    return expr2
end

function javascript.__javascript_logical_and(expr1, expr2)
    if not Boolean(expr1).__value then
        return expr1
    end
    return Boolean(expr2)
end

function javascript.__javascript_import(file)
    return __lua_environment.require(file)
end

javascript.console = {}

function javascript.console.log(arguments)
    for i = 1, #arguments do
        __lua_environment.print(arguments[i])
    end
end

return javascript
