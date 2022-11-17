local Boolean = {}

function Boolean.__convert_to_boolean(value)
    if __lua_environment.type(value) == 'nil' then
        return false
    elseif __lua_environment.type(value) == 'boolean' then
        return value
    elseif __lua_environment.type(value) == 'number' then
        if value == 0 then
            return false
        end
        return true
    elseif __lua_environment.type(value) == 'string' then
        if #value == 0 then
            return false
        end
        return true
    elseif __lua_environment.type(value) == 'table' then
        if value.__type == nil then
            return true -- A regular lua table, should return true.
        elseif value.__type == 'null' then
            return false
        elseif value.__type == 'boolean' then
            return value.__value
        elseif value.__type == 'string' then
            if #value.__value == 0 then
                return false
            else
                return true
            end
        elseif value.__type == 'object' then
            return true
        end
    end
end

function Boolean.constructor(this, arguments)
    return __javascript_not_implemented()
end
function Boolean.hasOwnProperty(this, arguments)
    return __javascript_not_implemented()
end
function Boolean.isPrototypeOf(this, arguments)
    return __javascript_not_implemented()
end
function Boolean.propertyIsEnumerable(this, arguments)
    return __javascript_not_implemented()
end
function Boolean.toLocaleString(this, arguments)
    return __javascript_not_implemented()
end
function Boolean.toString(this, arguments)
    return String(this.__value).__value
end
function Boolean.valueOf(this, arguments)
    return __javascript_not_implemented()
end


function Boolean:__init(value)
    local inst = {}
    inst.__value = Boolean.__convert_to_boolean(value)
    __lua_environment.setmetatable(inst, {
        __index = function(t, key)
            if key == '__value' then
                return __lua_environment.rawget(inst, '__value')
            elseif key == '__type' then
                return 'boolean'
            elseif Boolean[key] then
                return function(arguments)
                    return Boolean[key](inst, arguments)
                end
            end
        end,

        __eq = function(op1, op2)
            return Boolean(op1).__value == Boolean(op2).__value
        end,
    })
    return inst
end

__lua_environment.setmetatable(Boolean, {
    __call = Boolean.__init
})

return Boolean
