import antlr4 from 'antlr4';
import JavascriptLexer from './lib/JavascriptLexer.js';
import JavascriptParser from './lib/JavascriptParser.js';
import { JavascriptVisitorImplementation } from './transpiler/JavascriptVisitor.js'

const input = `
let i = 1
i *= 2
let j = 2
`;

console.log(input)
const chars = new antlr4.InputStream(input);
const lexer = new JavascriptLexer(chars);

const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new JavascriptParser(tokens);
const tree = parser.program();
const visitor = new JavascriptVisitorImplementation()

console.log(visitor.visit(tree));