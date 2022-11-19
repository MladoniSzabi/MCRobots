let a1 = [12, 25, 16]

assert(a1.length == 3)

for (let i = 0; i < a1.length; i++) {
    if (i == 0) {
        assert(a1[i] == 12)
    } else if (i == 1) {
        assert(a1[i] == 25)
    } else if (i == 2) {
        assert(a1[i] == 16)
    }
}

let index = 0
for (let el of a1) {
    if (index == 0) {
        assert(el == 12)
    } else if (index == 1) {
        assert(el == 25)
    } else if (index == 2) {
        assert(el == 16)
    }
    index++
}

assert(a1.push(49) == 4)
assert(a1.length == 4)

let obj = { fruit: 'apple', color: 'blue' }
assert(obj['fruit'] == 'apple')
assert(obj.color == 'blue')
assert(obj['animal'] == undefined)

obj.animal = 'dog'
assert(obj['animal'] == 'dog')
obj['animal'] = 'cat'
assert(obj.animal == 'cat')

found = []
for(let property in obj) {
    if(property == 'fruit') {
        assert(obj[property] == 'apple')
    }
    if(property == 'color') {
        assert(obj[property] == 'blue')
    }
    found.push(property)
}
assert(found.length == 3)