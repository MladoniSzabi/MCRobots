local Math = {}

function Math.random(x)
    return Number(__lua_environment.math.random())
end

function Math.abs(x)
    return Number(__lua_environment.math.abs(Number(x[1]).__value))
end
function Math.acos(x)
    return Number(__lua_environment.math.acos(Number(x[1]).__value))
end
function Math.acosh(x)
    return __javascript_not_implemented()
end
function Math.asin(x)
    return Number(__lua_environment.math.asin(Number(x[1]).__value))
end
function Math.asinh(x)
    return __javascript_not_implemented()
end
function Math.atan(x)
    return Number(__lua_environment.math.atan(Number(x[1]).__value))
end
function Math.atanh(x)
    return __javascript_not_implemented()
end
function Math.cbrt(x)
    return Math.pow(x, 1/3)
end
function Math.ceil(x)
    return Number(__lua_environment.math.ceil(Number(x[1]).__value))
end
function Math.clz32(x)
    return __javascript_not_implemented()
end
function Math.cos(x)
    return Number(__lua_environment.math.cos(Number(x[1]).__value))
end
function Math.cosh(x)
    return Number(__lua_environment.math.cosh(Number(x[1]).__value))
end
function Math.exp(x)
    return Number(__lua_environment.math.exp(Number(x[1]).__value))
end
function Math.expm1(x)
    return Math.exp(x) - Number(1)
end
function Math.floor(x)
    return Number(__lua_environment.math.floor(Number(x[1]).__value))
end
function Math.fround(x)
    return __javascript_not_implemented()
end
function Math.log(x)
    return Number(__lua_environment.math.log(Number(x[1]).__value))
end
function Math.log1p(x)
    return Math.log(x + Number(1))
end
function Math.log10(x)
    return Number(__lua_environment.math.log10(Number(x[1]).__value))
end
function Math.log2(x)
    return Math.log(x) / Math.LN2
end
function Math.round(x)
    return Math.floor(x + Number(0.5))
end
function Math.sign(x)
    return x / Math.abs(x)
end
function Math.sin(x)
    return Number(__lua_environment.math.sin(Number(x[1]).__value))
end
function Math.sinh(x)
    return Number(__lua_environment.math.sinh(Number(x[1]).__value))
end
function Math.sqrt(x)
    return Number(__lua_environment.math.sqrt(Number(x[1]).__value))
end
function Math.tan(x)
    return Number(__lua_environment.math.tan(Number(x[1]).__value))
end
function Math.tanh(x)
    return Number(__lua_environment.math.tanh(Number(x[1]).__value))
end
function Math.trunc(x)
    return Number(__lua_environment.math.trunc(Number(x[1]).__value))
end

function Math.atan2(x)
    return Number(__lua_environment.math.atan2(Number(x[1]).__value, Number(x[2]).__value))
end
function Math.imul(x)
    return __javascript_not_implemented()
end
function Math.pow(x)
    return Number(__lua_environment.math.pow(Number(x[1]).__value, Number(x[2]).__value))
end

function Math.max(x)
    local vals = {}
    for i, v in __lua_environment.ipairs(x) do
        vals[i] = Number(v).__value
    end
    return Number(math.max(__lua_environment.unpack(vals)))
end
function Math.min(x)
    local vals = {}
    for i, v in __lua_environment.ipairs(x) do
        vals[i] = Number(v).__value
    end
    return Number(math.min(__lua_environment.unpack(vals)))
end
function Math.hypot(x)
    local res = 0
    for i, v in __lua_environment.ipairs(x) do
        res = res + Number(v).__value * Number(v).__value
    end
    return Number(math.sqrt(res))
end

function Math.toString(x)
    return String("[object Math]")
end

local constants = {
    E = Number(2.718281828459045);
    LN2 = Number(0.6931471805599453);
    LN10 = Number(2.302585092994046);
    LOG2E = Number(1.4426950408889634);
    LOG10E = Number(0.4342944819032518);
    PI = Number(3.141592653589793);
    SQRT1_2 = Number(0.7071067811865476);
    SQRT2 = Number(1.4142135623730951)
}

__lua_environment.setmetatable(Math, {
    __index = function(t, key)
        if __lua_environment.type(key) == 'table' and key.__value then
            key = key.__value
        end

        if constants[key] then
            return constants[key]
        end

        if __lua_environment.rawget(Math, key) then
            return __lua_environment.rawget(Math, key)
        end

        return nil
    end,

    __new_index = function()
        return 
    end
})

return Math
