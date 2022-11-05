local Object = {}

local __lua_environment = _G

function Object.__convert_to_object(value)
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

function Object.constructor(this, arguments)
    return __javascript_not_implemented()
end
function Object.hasOwnProperty(this, arguments)
    return __javascript_not_implemented()
end
function Object.isPrototypeOf(this, arguments)
    return __javascript_not_implemented()
end
function Object.propertyIsEnumerable(this, arguments)
    return __javascript_not_implemented()
end
function Object.toLocaleString(this, arguments)
    return __javascript_not_implemented()
end
function Object.toString(this, arguments)
    return __javascript_not_implemented()
end
function Object.valueOf(this, arguments)
    return __javascript_not_implemented()
end


function Object.__init(value)
    local inst = {}
    inst.__value = Object.__convert_to_object(value)
    __lua_environment.setmetatable(inst, {
        __index = function(t, key)
            if key == '__value' then
                return __lua_environment.rawget(inst, '__value')
            elseif key == '__type' then
                return 'object'
            elseif Object[key] then
                return function(arguments)
                    Object[key](inst, arguments)
                end
            end
        end
    })
    return inst
end

__lua_environment.setmetatable(Object, {
    __call = Object.__init
})

return {Object}
