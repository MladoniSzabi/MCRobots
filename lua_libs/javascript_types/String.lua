local String = {}

local string_metatable = {
    __index = function(t, key)
        if __lua_environment.type(key) == 'table' and key.__value then
            key = key.__value
        end
        if key == '__value' then
            return __lua_environment.rawget(t, '__value')
        elseif key == '__type' then
            return String('string')
        elseif key == '__javascript_class' then
            return String
        elseif key == 'length' then
            return #(__lua_environment.rawget(t, '__value'))
        elseif __lua_environment.type(key) == 'number' then
            local val = __lua_environment.rawget(t, '__value')
            return String(__lua_environment.string.sub(val, key+1, key+1))
        elseif String[key] then
            return function(arguments)
                return String[key](t, arguments)
            end
        end
    end,

    __add = function(op1, op2)
        return String(String.__convert_to_string(op1) .. String.__convert_to_string(op2))
    end,

    __eq = function(op1, op2)
        return String.__convert_to_string(op1) == String.__convert_to_string(op2)
    end,

    __lt = function(op1, op2)
        return String.__convert_to_string(op1) < String.__convert_to_string(op2)
    end,

    __le = function(op1, op2)
        return String.__convert_to_string(op1) <= String.__convert_to_string(op2)
    end
}

function String.__convert_to_string(value)

    if __lua_environment.type(value) == 'table' and #value == 1 then
        value = value[1]
    end

    if __lua_environment.type(value) == 'nil' then
        return 'undefined'
    elseif __lua_environment.type(value) == 'boolean' then
        if value then
            return 'true'
        else
            return 'false'
        end
    elseif __lua_environment.type(value) == 'number' then
        return __lua_environment.tostring(value)
    elseif __lua_environment.type(value) == 'string' then
        return value
    elseif __lua_environment.type(value) == 'table' then
        if value.__type == nil then
            if value.toString then
                return value.toString()
            end
            return "[object Object]"
        elseif value.__type.__value == 'null' then
            return 'null'
        elseif value.__type.__value == 'boolean' then
            if value.__value then
                return 'true'
            else
                return 'false'
            end
        elseif value.__type.__value == 'number' then
            return __lua_environment.tostring(value.__value)
        elseif value.__type.__value == 'string' then
            return value.__value
        elseif value.__type.__value == 'object' then
            if value.toString then
                return value.toString()
            end
            return "[object Object]"
        else
            console.log({"Cannot convert to string as JS type unknown", value.__type})
        end
    else
        console.log({"Cannot convert to string as Lua type unknown", __lua_environment.type(value)})
    end
end

function String.at(this, arguments)
    local index = Number(arguments[1]).__value
    if index < 0 then
        index = #this.__value + index
    end

    if index >= #this.__value then
        return nil
    end

    return String(this.__value[index+1])
end
function String.charAt(this, arguments)
    local index = Number(arguments[1]).__value
    if index < 0 then
        index = #this.__value + index
    end

    if index >= #this.__value then
        return String("")
    end

    return String(this.__value[index+1])
end
function String.charCodeAt(this, arguments)
    local index = Number(arguments[1]).__value
    if index < 0 then
        index = #this.__value + index
    end

    if index >= #this.__value then
        return Number(0) -- TODO: This should be NaN
    end

    return Number(__lua_environment.string.byte(this.__value[index+1]))
end
function String.codePointAt(this, arguments)
    return __javascript_not_implemented()
end
function String.concat(this, arguments)
    local retval = this.__value
    for i=1,#arguments do
        retval = retval .. String(arguments[i]).__value
    end
    return retval
end
function String.constructor(this, arguments)
    return String(arguments)
end
function String.endsWith(this, arguments)
    local str = this.__value
    local _end = String(arguments[1]).__value
    return Boolean(__lua_environment.string.find(str, _end, #str - #_end))
end
function String.hasOwnProperty(this, arguments)
    local arg = String(arguments[1]).__value
    if arg == 'length' then return Boolean(true) end
    return Boolean(false)
end
function String.includes(this, arguments)
    return __javascript_not_implemented()
end
function String.indexOf(this, arguments)
    return __javascript_not_implemented()
end
function String.isPrototypeOf(this, arguments)
    return __javascript_not_implemented()
end
function String.italics(this, arguments)
    return __javascript_not_implemented()
end
function String.lastIndexOf(this, arguments)
    return __javascript_not_implemented()
end
function String.link(this, arguments)
    return __javascript_not_implemented()
end
function String.localeCompare(this, arguments)
    return __javascript_not_implemented()
end
function String.match(this, arguments)
    return __javascript_not_implemented()
end
function String.matchAll(this, arguments)
    return __javascript_not_implemented()
end
function String.normalize(this, arguments)
    return __javascript_not_implemented()
end
function String.padEnd(this, arguments)
    return __javascript_not_implemented()
end
function String.padStart(this, arguments)
    return __javascript_not_implemented()
end
function String.propertyIsEnumerable(this, arguments)
    return __javascript_not_implemented()
end
String['repeat'] = function(this, arguments)
    return __javascript_not_implemented()
end
function String.replace(this, arguments)
    return __javascript_not_implemented()
end
function String.replaceAll(this, arguments)
    return __javascript_not_implemented()
end
function String.search(this, arguments)
    return __javascript_not_implemented()
end
function String.slice(this, arguments)
    local indexStart = Number(arguments[1])
    local indexEnd = Number(arguments[2] or #this.__value-1)

    indexStart = indexStart.__value
    indexEnd = indexEnd.__value

    if indexStart >= #this.__value then
        return ""
    end

    if indexEnd >= #this.__value then
        indexEnd = #this.__value-1
    end

    if indexStart < 0 then
        indexStart = Math.max(indexStart + #this.__value, 0).__value
    end

    if indexEnd < 0 then
        indexEnd = Math.max(indexEnd + #this.__value, 0).__value
    end

    if indexEnd <= indexStart then
        return ""
    end

    return __lua_environment.string.sub(this.__value, indexStart + 1, indexEnd + 1 )
end
function String.small(this, arguments)
    return __javascript_not_implemented()
end
function String.split(this, arguments)
    local delimiter = arguments[1]
    if __lua_environment.type(delimiter) == 'table' and delimiter.__type.__value == 'string' then
        delimiter = delimiter.__value
    end
    local result = Array();
    
    local pattern = __lua_environment.string.format("([^%s]+)", delimiter)
    __lua_environment.string.gsub(this.__value, pattern, function(c)
        result.push({String(c)})
    end)
    
    return result;
end
function String.startsWith(this, arguments)
    return __javascript_not_implemented()
end
function String.strike(this, arguments)
    return __javascript_not_implemented()
end
function String.sub(this, arguments)
    return __javascript_not_implemented()
end
function String.substr(this, arguments)
    return __javascript_not_implemented()
end
function String.substring(this, arguments)
    return __javascript_not_implemented()
end
function String.sup(this, arguments)
    return __javascript_not_implemented()
end
function String.toLocaleLowerCase(this, arguments)
    return __javascript_not_implemented()
end
function String.toLocaleString(this, arguments)
    return __javascript_not_implemented()
end
function String.toLocaleUpperCase(this, arguments)
    return __javascript_not_implemented()
end
function String.toLowerCase(this, arguments)
    return __javascript_not_implemented()
end
function String.toString(this, arguments)
    return this.__value
end
function String.toUpperCase(this, arguments)
    return __javascript_not_implemented()
end
function String.trim(this, arguments)
    return __javascript_not_implemented()
end
function String.trimEnd(this, arguments)
    return __javascript_not_implemented()
end
function String.trimLeft(this, arguments)
    return __javascript_not_implemented()
end
function String.trimRight(this, arguments)
    return __javascript_not_implemented()
end
function String.trimStart(this, arguments)
    return __javascript_not_implemented()
end
function String.valueOf(this, arguments)
    return __javascript_not_implemented()
end

function String:__init(value)
    local inst = {}
    inst.__value = String.__convert_to_string(value)

    __lua_environment.setmetatable(inst, string_metatable)

    return inst
end

__lua_environment.setmetatable(String, {
    __call = String.__init
})

return String
