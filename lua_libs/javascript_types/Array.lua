local Array = {}

local array_metatable = {
    __index = function(t, key)
        if key == '__value' then
            return __lua_environment.rawget(t, '__value')
        elseif key == '__type' then
            return String('object')
        elseif key == 'length' then
            return Number(#(__lua_environment.rawget(t, '__value')))
        elseif __lua_environment.type(key) == 'number' then
            return (__lua_environment.rawget(t, '__value'))[key+1]
        elseif __lua_environment.type(key) == 'table' and key.__type == 'number' then
            return (__lua_environment.rawget(t, '__value'))[key.__value+1]
        elseif Array[key] then
            return function(arguments)
                return Array[key](t, arguments)
            end
        end
    end,

    __add = function(op1, op2)
        return String(String(op1) + String(op2))
    end,

    __eq = function(op1, op2)
        if __lua_environment.type(op1) == 'table' and __lua_environment.type(op2) == 'table' and op1.__value and op2.__value then
            return Boolean(op1.__value == op2.__value)
        end
        return false
    end,

    __lt = function(op1, op2)
        return __javascript_not_implemented()
    end,

    __le = function(op1, op2)
        return __javascript_not_implemented()
    end
}

function Array.__convert_to_array(value)
    if value.__javascript_class == 'Array' then
        return value.__value
    end

    if __lua_environment.type(value) == 'table' and #value == 1 then
        return {value}
    end
    
    return value
end


function Array.at(this, arguments)
    return __javascript_not_implemented()
end
function Array.concat(this, arguments)
    return __javascript_not_implemented()
end
function Array.constructor(this, arguments)
    return __javascript_not_implemented()
end
function Array.copyWithin(this, arguments)
    return __javascript_not_implemented()
end
function Array.entries(this, arguments)
    return __javascript_not_implemented()
end
function Array.every(this, arguments)
    return __javascript_not_implemented()
end
function Array.fill(this, arguments)
    return __javascript_not_implemented()
end
function Array.filter(this, arguments)
    return __javascript_not_implemented()
end
function Array.find(this, arguments)
    return __javascript_not_implemented()
end
function Array.findIndex(this, arguments)
    return __javascript_not_implemented()
end
function Array.fillLast(this, arguments)
    return __javascript_not_implemented()
end
function Array.fillLastIndex(this, arguments)
    return __javascript_not_implemented()
end
function Array.flat(this, arguments)
    return __javascript_not_implemented()
end
function Array.flatMap(this, arguments)
    return __javascript_not_implemented()
end
function Array.forEach(this, arguments)
    return __javascript_not_implemented()
end
function Array.hasOwnProperty(this, arguments)
    return __javascript_not_implemented()
end
function Array.includes(this, arguments)
    return __javascript_not_implemented()
end
function Array.indexOf(this, arguments)
    return __javascript_not_implemented()
end
function Array.isPrototypeOf(this, arguments)
    return __javascript_not_implemented()
end
function Array.join(this, arguments)
    return __javascript_not_implemented()
end
function Array.keys(this, arguments)
    return __javascript_not_implemented()
end
function Array.lastIndexOf(this, arguments)
    return __javascript_not_implemented()
end
function Array.map(this, arguments)
    return __javascript_not_implemented()
end
function Array.pop(this, arguments)
    return __javascript_not_implemented()
end
function Array.propertyIsEnumerable(this, arguments)
    return __javascript_not_implemented()
end

function Array.push(this, arguments)
    for i = 0,#arguments do
        __lua_environment.table.insert(this.__value, arguments[i])
    end
    return Number(#this.__value)
end

function Array.reduce(this, arguments)
    return __javascript_not_implemented()
end
function Array.reduceRight(this, arguments)
    return __javascript_not_implemented()
end
function Array.reverse(this, arguments)
    return __javascript_not_implemented()
end
function Array.shift(this, arguments)
    return __javascript_not_implemented()
end
function Array.slice(this, arguments)
    return __javascript_not_implemented()
end
function Array.some(this, arguments)
    return __javascript_not_implemented()
end
function Array.sort(this, arguments)
    return __javascript_not_implemented()
end
function Array.splice(this, arguments)
    return __javascript_not_implemented()
end
function Array.toLocaleString(this, arguments)
    return __javascript_not_implemented()
end
function Array.toLocaleUpperCase(this, arguments)
    return __javascript_not_implemented()
end
function Array.toString(this, arguments)
    return __javascript_not_implemented()
end
function Array.unshift(this, arguments)
    return __javascript_not_implemented()
end
function Array.valueOf(this, arguments)
    return __javascript_not_implemented()
end
function Array.values(this, arguments)
    return __javascript_not_implemented()
end

function Array:__init(value)
    local inst = {}
    inst.__value = Array.__convert_to_array(value)
    __lua_environment.setmetatable(inst, array_metatable)

    return inst
end

__lua_environment.setmetatable(Array, {
    __call = Array.__init
})

return Array
