import antlr4 from 'antlr4';
import JavascriptLexer from './lib/JavascriptLexer.js';
import JavascriptParser from './lib/JavascriptParser.js';
import { JavascriptVisitorImplementation } from './transpiler/JavascriptVisitor.js'

const input = `
for(let i = 0; i < 5; i++) {
    print(i)
}

while(true) {
    break
}

do {
    print(1)
} while(false)
`;

const chars = new antlr4.InputStream(input);
const lexer = new JavascriptLexer(chars);

const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new JavascriptParser(tokens);
const tree = parser.program();
const visitor = new JavascriptVisitorImplementation()

console.log(visitor.visit(tree));