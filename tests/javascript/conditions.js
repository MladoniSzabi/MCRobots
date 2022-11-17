let a = 2
let b = 5

assert(true)
assert(2 == 2)
assert(a <= 2)
assert(b > 4)
assert(a != b)

assert(a+3 == b && b*2==10)
assert(false || 3)
assert(!0)
assert(false ? false : 1)

let c = false
if(a == 2) {
    c = true
}
assert(c)

if(true) {
    c = false
}
assert(c == false)

while(a < 10) {
    a++
    b++
}
assert(a == 10 && b == 13)

do {
    b--
} while(b % 2  == 0)

assert(b == 11)

a = 0
for(let i = 0; i< 10; i++) {
    if(i == 3) {
        a = 0
        continue
    }
    a+=2
}

assert(a == 12)

a = 13
while(a > 10) {
    a-= 1
    if(a == 11) {
        break
    }
}

assert(a == 11)