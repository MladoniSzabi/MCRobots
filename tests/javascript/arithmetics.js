// test basic assignments
let a = 1
let b = 2
assert(a == 1)
assert(b == 3)

// test assignment operators
a -= 3
assert(a == -2)
b *= a + 1
assert(b == -4)
a += b
assert(a == -6)
a /= 3
assert(a == -2)
a *= -1
assert(a == 2)
a %= 3
assert(a == 1)
a >>= 2
assert(a == 4)
a **= 2
assert(a == 8)
a <<= 1
assert(a == 4)
a |= 1
assert(a == 5)
a &= 3
assert(a == 1)

// test operators
a = 2
b = 3
let c

c = a + b
assert(c == 5)
c = 2 * 3
assert(c == 6)
c = a / 4
assert(c == 0.5)
c = c ** 3
assert(c == 0.125)
c = (2 << 6) ** 0.5 + 1 * 2
assert(c == 10)
c = c & 24
assert(c == 8)
