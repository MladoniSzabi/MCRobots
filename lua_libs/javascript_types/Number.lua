local Number = {}

local number_metatable = {
    __index = function(t, key)
        if __lua_environment.type(key) == 'table' and key.__value then
            key = key.__value
        end
        if key == '__value' then
            return __lua_environment.rawget(t, '__value')
        elseif key == '__type' then
            return String('number')
        elseif key == '__javascript_class' then
            return Number
        elseif Number[key] then
            return function(arguments)
                return Number[key](t, arguments)
            end
        end
    end,

    __add = function(op1, op2)
        return Number(Number(op1).__value + Number(op2).__value)
    end,

    __sub = function(op1, op2)
        return Number(Number(op1).__value - Number(op2).__value)
    end,

    __mul = function(op1, op2)
        return Number(Number(op1).__value * Number(op2).__value)
    end,

    __div = function(op1, op2)
        return Number(Number(op1).__value / Number(op2).__value)
    end,

    __mod = function(op1, op2)
        return Number(Number(op1).__value % Number(op2).__value)
    end,

    __pow = function(op1, op2)
        return Number(Number(op1).__value ^ Number(op2).__value)
    end,

    -- __idiv = function(op1, op2)
    --     return Number(Number(op1).__value // Number(op2).__value)
    -- end,

    -- __band = function(op1, op2)
    --     return Number(Number(op1).__value & Number(op2).__value)
    -- end,
    
    -- __bor = function(op1, op2)
    --     return Number(Number(op1).__value | Number(op2).__value)
    -- end,

    -- __bxor = function(op1, op2)
    --     return Number(Number(op1).__value ~ Number(op2).__value)
    -- end,
    
    -- __bnot = function(op1)
    --     return Number(~Number(op1).__value)
    -- end,
    
    -- __shl = function(op1, op2)
    --     return Number(Number(op1).__value << Number(op2).__value)
    -- end,
    
    -- __shr = function(op1, op2)
    --     return Number(Number(op1).__value >> Number(op2).__value)
    -- end,

    __unm = function(op1)
        return Number(-(Number(op1).__value))
    end,

    __eq = function(op1, op2)
        return Number(op1).__value == Number(op2).__value
    end,

    __lt = function(op1, op2)
        return Number(op1).__value < Number(op2).__value
    end,

    __le = function(op1, op2)
        return Number(op1).__value <= Number(op2).__value
    end
}

function Number.__convert_to_number(value)

    if __lua_environment.type(value) == 'table' and #value == 1 then
        value = value[1]
    end

    if __lua_environment.type(value) == 'nil' then
        return 0
    elseif __lua_environment.type(value) == 'number' then
        return value
    elseif __lua_environment.type(value) == 'boolean' then
        if value then
            return 1
        else
            return 0
        end
    elseif __lua_environment.type(value) == 'string' then
        return (__lua_environment.tonumber(value) or 0)
    elseif __lua_environment.type(value) == 'table' then
        if value.__type == nil then
            return 0
        elseif value.__type.__value == 'null' then
            value = 0
        elseif value.__type.__value == 'boolean' then
            if value.__value == true then
                value = 1
            else
                value = 0
            end
        elseif value.__type.__value == 'number' then
            return value.__value
        elseif value.__type.__value == 'string' then
            return (__lua_environment.tonumber(value.__value) or 0)
        elseif value.__type.__value == 'object' then
            if value.valueOf then
                return value.valueOf()
            elseif value.toString then
                return (__lua_environment.tonumber(value.toString()) or 0)
            else
                return 0
            end
        end
    else
        return 0
    end
end

function Number.constructor(this, arguments)
    return __javascript_not_implemented()
end
function Number.hasOwnProperty(this, arguments)
    return __javascript_not_implemented()
end
function Number.isPrototypeOf(this, arguments)
    return __javascript_not_implemented()
end
function Number.propertyIsEnumerable(this, arguments)
    return __javascript_not_implemented()
end
function Number.toExponential(this, arguments)
    return __javascript_not_implemented()
end
function Number.toFixed(this, arguments)
    return __javascript_not_implemented()
end
function Number.toLocaleString(this, arguments)
    return __javascript_not_implemented()
end
function Number.toPrecision(this, arguments)
    return __javascript_not_implemented()
end
function Number.toString(this, arguments)
    return String(this.__value).__value
end
function Number.valueOf(this, arguments)
    return __javascript_not_implemented()
end

function Number:__init(value)
    local inst = {}
    inst.__value = Number.__convert_to_number(value)
    __lua_environment.setmetatable(inst, number_metatable)
    return inst
end

__lua_environment.setmetatable(Number, {
    __call = Number.__init
})

return Number
