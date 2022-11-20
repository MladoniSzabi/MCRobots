class A {
    a = 22
    constructor() {
    }
    getA() { return this.a }
    setA(newA) { this.a = newA }
}

class B {
    b = 33
    constructor(b) {
        this.b = b
    }
}

class C extends A {
    otherFunction() {
        return 'asd'
    }

    getA() { return super.getA()*2 }
}

class D extends B {
    constructor(d) {
        super(d*2)
    }
}

let a = new A()
assert(a instanceof A)
assert(a.a == 22)
assert(a.getA() == 22)
a.setA(33)
assert(a.getA() == 33)
assert(typeof a == 'object')
assert('a' in a)
assert(!('b' in a))

let b = new B(44)
assert(b.b == 44)

let c = new C()
assert(c.a == 22)
assert(c.getA() == 44)
assert(c.otherFunction() == 'asd')
assert(!('otherFunction' in a))
c.setA(11)
assert(c.getA() == 22)
assert(c.a == 11)

let d = new D(11)
assert(d.b == 22)
