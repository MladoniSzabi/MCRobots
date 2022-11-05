local Array = {}

local __lua_environment = _G

function Array.__convert_to_array(value)
    if #value == 1 then
        return value
    end

    if value.__javascript_class == 'Array' then
        return value.__value
    end
    
    return {value}
end


function Array.at(this, arguments)
    return __javascript_not_implemented()
end
function String.concat(this, arguments)
    return __javascript_not_implemented()
end
function String.constructor(this, arguments)
    return __javascript_not_implemented()
end
function String.copyWithin(this, arguments)
    return __javascript_not_implemented()
end
function String.entries(this, arguments)
    return __javascript_not_implemented()
end
function String.every(this, arguments)
    return __javascript_not_implemented()
end
function String.fill(this, arguments)
    return __javascript_not_implemented()
end
function String.filter(this, arguments)
    return __javascript_not_implemented()
end
function String.find(this, arguments)
    return __javascript_not_implemented()
end
function String.findIndex(this, arguments)
    return __javascript_not_implemented()
end
function String.fillLast(this, arguments)
    return __javascript_not_implemented()
end
function String.fillLastIndex(this, arguments)
    return __javascript_not_implemented()
end
function String.flat(this, arguments)
    return __javascript_not_implemented()
end
function String.flatMap(this, arguments)
    return __javascript_not_implemented()
end
function String.forEach(this, arguments)
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
function String.join(this, arguments)
    return __javascript_not_implemented()
end
function String.keys(this, arguments)
    return __javascript_not_implemented()
end
function String.lastIndexOf(this, arguments)
    return __javascript_not_implemented()
end
function String.map(this, arguments)
    return __javascript_not_implemented()
end
function String.pop(this, arguments)
    return __javascript_not_implemented()
end
function String.propertyIsEnumerable(this, arguments)
    return __javascript_not_implemented()
end
function String.push(this, arguments)
    return __javascript_not_implemented()
end
function String.reduce(this, arguments)
    return __javascript_not_implemented()
end
function String.reduceRight(this, arguments)
    return __javascript_not_implemented()
end
function String.reverse(this, arguments)
    return __javascript_not_implemented()
end
function String.shift(this, arguments)
    return __javascript_not_implemented()
end
function String.slice(this, arguments)
    return __javascript_not_implemented()
end
function String.some(this, arguments)
    return __javascript_not_implemented()
end
function String.sort(this, arguments)
    return __javascript_not_implemented()
end
function String.splice(this, arguments)
    return __javascript_not_implemented()
end
function String.toLocaleString(this, arguments)
    return __javascript_not_implemented()
end
function String.toLocaleUpperCase(this, arguments)
    return __javascript_not_implemented()
end
function String.toString(this, arguments)
    return __javascript_not_implemented()
end
function String.unshift(this, arguments)
    return __javascript_not_implemented()
end
function String.valueOf(this, arguments)
    return __javascript_not_implemented()
end
function String.values(this, arguments)
    return __javascript_not_implemented()
end

function Array.__init(value)
    local inst = {}
    inst.__value = Array.__convert_to_array(value)
    __lua_environment.setmetatable(inst, {
        __index = function(t, key)
            if key == '__value' then
                return __lua_environment.rawget(inst, '__value')
            elseif key == '__type' then
                return 'object'
            elseif key == 'length' then
                return #(__lua_environment.rawget(inst, '__value'))
            elseif __lua_environment.type(key) == 'number' then
                return (__lua_environment.rawget(inst, '__value'))[key]
            elseif __lua_environment.type(key) == 'table' and key.__type == 'number' then
                return (__lua_environment.rawget(inst, '__value'))[key.__value]
            elseif Array[key] then
                return function(arguments)
                    Array[key](inst, arguments)
                end
            end
        end,

        _add = function(op1, op2)
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
    })
end

__lua_environment.setmetatable(Array, {
    __call = Array.__init
})

return {Array}
