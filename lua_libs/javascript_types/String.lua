local String = {}

function String.__convert_to_string(value)
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
        elseif value.__type.__value == 'string' then
            return value.__value
        elseif value.__type.__value == 'object' then
            if value.toString then
                return value.toString()
            end
            return "[object Object]"
        end
    end
end

function String.anchor(this, arguments)
    return __javascript_not_implemented()
end
function String.at(this, arguments)
    return __javascript_not_implemented()
end
function String.big(this, arguments)
    return __javascript_not_implemented()
end
function String.blink(this, arguments)
    return __javascript_not_implemented()
end
function String.bold(this, arguments)
    return __javascript_not_implemented()
end
function String.charAt(this, arguments)
    return __javascript_not_implemented()
end
function String.charCodeAt(this, arguments)
    return __javascript_not_implemented()
end
function String.codePointAt(this, arguments)
    return __javascript_not_implemented()
end
function String.concat(this, arguments)
    return __javascript_not_implemented()
end
function String.constructor(this, arguments)
    return __javascript_not_implemented()
end
function String.endsWith(this, arguments)
    return __javascript_not_implemented()
end
function String.fixed(this, arguments)
    return __javascript_not_implemented()
end
function String.fontcolor(this, arguments)
    return __javascript_not_implemented()
end
function String.fontsize(this, arguments)
    return __javascript_not_implemented()
end
function String.hasOwnProperty(this, arguments)
    return __javascript_not_implemented()
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
    return __javascript_not_implemented()
end
function String.small(this, arguments)
    return __javascript_not_implemented()
end
function String.split(this, arguments)
    return __javascript_not_implemented()
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

    __lua_environment.setmetatable(inst, {
        __index = function(t, key)
            if key == '__value' then
                --print({__lua_environment.rawget(inst, '__value')})
                return __lua_environment.rawget(inst, '__value')
            elseif key == '__type' then
                return String('string')
            elseif key == 'length' then
                return #(__lua_environment.rawget(inst, '__value'))
            elseif __lua_environment.type(key) == 'number' then
                return (__lua_environment.rawget(inst, '__value'))[key+1]
            elseif __lua_environment.type(key) == 'table' and key.__type == 'number' then
                return (__lua_environment.rawget(inst, '__value'))[key.__value+1]
            elseif String[key] then
                return function(arguments)
                    return String[key](inst, arguments)
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
    })

    return inst
end

__lua_environment.setmetatable(String, {
    __call = String.__init
})

return String
