function f1() {
    return 2
}

assert(f1() == 2)

function f2(val) {
    return val + 2
}

assert(f2(f1()) == 4)

function f3(v1, v2, v3) {
    return v1 * v2 * v3
}

assert(f3(1, 2, 3) == 6)

function f4(f5) {
    let a = 3
    return f5(a)
}

assert(f4(f2) == 5)

let a = 3
function f6() {
    let a = 4
    return a
}

assert(f6() == 4)
assert(a == 3)

function f7() {
    let b = 7
    function f8() {
        var b = 8
        function f9() {
            let b = 9
            return b
        }
        return b + f9()
    }
    return b + f8()
}
assert(f7() == 9+8+7)
assert(b == undefined)


