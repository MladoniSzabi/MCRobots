local Object = {}

local object_metatable = {
    __index = function(t, key)
        if __lua_environment.type(key) == 'table' and key.__value then
            key = key.__value
        end
        if key == '__value' then
            return __lua_environment.rawget(t, '__value')
        elseif key == '__type' then
            return String('object')
        elseif key == '__javascript_class' then
            return Object
        elseif __lua_environment.rawget(__lua_environment.rawget(t, '__value'), key) then
            return __lua_environment.rawget(__lua_environment.rawget(t, '__value'), key)
        elseif Object[key] then
            return function(arguments)
                return Object[key](t, arguments)
            end
        end
    end,

    __newindex = function(t, key, value)
        if __lua_environment.type(key) == 'string' then
            __lua_environment.rawset(__lua_environment.rawget(t, '__value'), key, value)
        elseif __lua_environment.type(key) == 'table' and key.__type == 'string' then
            __lua_environment.rawset(__lua_environment.rawget(t, '__value'), key.__value, value)
        end
    end
}

function Object.__convert_to_object(value)

    if __lua_environment.type(value) == 'table' and #value == 1 then
        value = value[1]
    end

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
            if #value ~= 0 then
                return Array(value)
            end

            local obj = {}
            for key, val in __lua_environment.pairs(value) do
                obj[key] = __lua_type_to_javascript(val)
            end
            return obj
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
    
    __lua_environment.setmetatable(inst, object_metatable)
    return inst
end

__lua_environment.setmetatable(Object, {
    __call = Object.__init
})

return Object
