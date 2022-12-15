local javascript = {}

function javascript.__lua_type_to_javascript(value)
    if __lua_environment.type(value) == 'nil' then
        return {}
    elseif __lua_environment.type(value) == 'boolean' then
        return Boolean(false)
    elseif __lua_environment.type(value) == 'number' then
        return Number(value)
    elseif __lua_environment.type(value) == 'string' then
        return String(value)
    elseif __lua_environment.type(value) == 'table' then
        if value.__type ~= nil then
            return value
        elseif #value ~= 0 then
            return Array(value)
        elseif value.__internal_methods then
            return value
        else
            return Object(value)
        end
    end
end

function javascript.__prepare_environment()
    local global_table = {}
    global_table.require = require
    for key, value in pairs(_G) do
        if key ~= '_G' then
            global_table[key] = value
            --_G[key] = nil
        end
    end

    _G.__lua_environment = global_table

    for key, value in __lua_environment.pairs(javascript) do
        _G[key] = value
    end

    _G.Number = __lua_environment.require('javascript_types.Number')
    _G.Boolean = __lua_environment.require('javascript_types.Boolean')
    _G.String = __lua_environment.require('javascript_types.String')
    _G.Object = __lua_environment.require('javascript_types.Object')
    _G.Array = __lua_environment.require('javascript_types.Array')

end

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
    if (__lua_environment.type(expr1) == 'string' and __lua_environment.type(expr2) == 'string') then
        return expr1 .. expr2
    end
    if (javascript.__javascript_instanceof(expr1, String) and javascript.__javascript_instanceof(expr2, String)) then
        return expr1 + expr2
    end
    return Number(javascript.__javascript_toNumeric(expr1).__value + javascript.__javascript_toNumeric(expr2).__value)
end

function javascript.__javascript_toNumeric(val)
    return Number(val)
end

function javascript.__javascript_toBoolean(val)
    return Boolean(val)
end

function javascript.__javascript_type(val)
    if __lua_environment.type(val) == "table" then
        return val.__type or String(__lua_environment.type(val))
    end
    return __lua_environment.type(val)
end

function javascript.__javascript_instanceof(val, class)
    if not val then
        return false
    end
    local inst_class = val.__javascript_class
    while (inst_class ~= nil) do
        if inst_class == class then
            return Boolean(true)
        end
        inst_class = inst_class.__javascript_parent_class
    end
    return Boolean(false)
end

function javascript.__javascript_hasProperty(prop, object)
    return Boolean(object[prop] ~= nil)
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
    return expr2
end

function javascript.__javascript_import(file)
    return __lua_environment.require(file)
end

function javascript.__javascript_splice(args, index)
    local pos, new = 1, {}
    
    for i = index, #args do
        new[pos] = args[i]
        pos = pos + 1
    end
    return Array(new)
end

javascript.console = {}

function javascript.console.log(arguments)
    -- global tostring is used by print function so need to set it here
    --_G.tostring = __lua_environment.tostring
    for i = 1, #arguments do
        if __lua_environment.type(arguments[i]) == 'table' and arguments[i].toString then
            local toPrint = arguments[i].toString()
            if toPrint.__value then
                __lua_environment.print(toPrint.__value)
            else
                __lua_environment.print(toPrint)
            end
        else
            __lua_environment.print(arguments[i])
        end
    end
    if (#arguments == 0) then
        __lua_environment.print()
    end
    -- delete tostring from global since it is not part of javascript
    --_G.tostring = nil
end

javascript.console.warn = javascript.console.log
javascript.console.error = javascript.console.log


return javascript
