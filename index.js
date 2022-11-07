import antlr4 from 'antlr4';
import JavascriptLexer from './lib/JavascriptLexer.js';
import JavascriptParser from './lib/JavascriptParser.js';
import { JavascriptVisitorImplementation } from './transpiler/JavascriptVisitor.js'

const input = `

class Test {
    sayHi() {
        console.log("ASd")
    }

    sayBoo() {
        console.log("Boo")
    }

    dsa = 2
}
class TestClass extends Test{
    sayHi() {
        this.asd += 1
        console.log(this.asd)
    }

    asd = 1;
}

let t = new Test()
t.sayHi()
t.sayBoo()
console.log(t.asd)
console.log(t.dsa)

let t2 = new TestClass()
t2.sayHi()
t2.sayBoo()
console.log(t2.asd)
console.log(t2.dsa)

console.log()
console.log("--------")
console.log()

let a = 1
console.log(a == 1)
a++
console.log(a)
a *= 3
console.log(a)
let b = "ASD"
console.log(b)


`;

const chars = new antlr4.InputStream(input);
const lexer = new JavascriptLexer(chars);

const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new JavascriptParser(tokens);
const tree = parser.program();
const visitor = new JavascriptVisitorImplementation()

console.log(visitor.visit(tree));