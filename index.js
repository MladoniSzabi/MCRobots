import antlr4 from 'antlr4';
import JavascriptLexer from './lib/JavascriptLexer.js';
import JavascriptParser from './lib/JavascriptParser.js';
import { JavascriptVisitorImplementation } from './transpiler/JavascriptVisitor.js'

const input = `

class Test {
    sayHi() {
        print("ASd")
    }

    sayBoo() {
        print("Boo")
    }
}
class TestClass{
    sayHi() {
        this.asd += 1
        print(this.asd)
    }

    asd = 1;
}

let t = new Test()
t.sayHi()
t.sayBoo()
print(t.asd)

let t2 = new TestClass()
t2.sayHi()
t2.sayBoo()
print(t2.asd)
`;

const chars = new antlr4.InputStream(input);
const lexer = new JavascriptLexer(chars);

const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new JavascriptParser(tokens);
const tree = parser.program();
const visitor = new JavascriptVisitorImplementation()

console.log(visitor.visit(tree));