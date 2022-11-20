local Object = {}

function Object.__convert_to_object(value)
    if __lua_environment.type(value) == 'nil' then
        return {}
    elseif __lua_environment.type(value) == 'boolean' then
        return Boolean(false)
    elseif __lua_environment.type(value) == 'number' then
        return Number(value)
    elseif __lua_environment.type(value) == 'string' then
        return String(value)
    elseif __lua_environment.type(value) == 'table' then
        if value.__type == nil then
            return value
        elseif value.__type == String('null') then
            return {}
        elseif value.__type == String('boolean') then
            return value
        elseif value.__type == String('string') then
            return value
        elseif value.__type == String('object') then
            if value.length then
                return value
            else
                return value.__value
            end
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
    return "[object Object]"
end
function Object.valueOf(this, arguments)
    return __javascript_not_implemented()
end


function Object:__init(value)
    local inst = {}

    local internal_value = Object.__convert_to_object(value)
    if __lua_environment.type(internal_value) == 'table' and internal_value.__type == nil then
        inst.__value = internal_value
    else
        return internal_value
    end
    
    __lua_environment.setmetatable(inst, {
        __index = function(t, key)
            if key == '__value' then
                return __lua_environment.rawget(inst, '__value')
            elseif key == '__type' then
                return String('object')
            elseif __lua_environment.rawget(__lua_environment.rawget(inst, '__value'), key) then
                return __lua_environment.rawget(__lua_environment.rawget(inst, '__value'), key)
            elseif __lua_environment.type(key) == 'table' and key.__type == 'string' and __lua_environment.rawget(__lua_environment.rawget(inst, '__value'), key.__value) then
                return __lua_environment.rawget(__lua_environment.rawget(inst, '__value'), key.__value)
            elseif Object[key] then
                return function(arguments)
                    return Object[key](inst, arguments)
                end
            end
        end,

        __newindex = function(t, key, value)
            if __lua_environment.type(key) == 'string' then
                __lua_environment.rawset(__lua_environment.rawget(inst, '__value'), key, value)
            elseif __lua_environment.type(key) == 'table' and key.__type == 'string' then
                __lua_environment.rawset(__lua_environment.rawget(inst, '__value'), key.__value, value)
            end
        end
    })
    return inst
end

__lua_environment.setmetatable(Object, {
    __call = Object.__init
})

return Object
