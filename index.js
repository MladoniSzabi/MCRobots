import antlr4 from 'antlr4';
import JavascriptLexer from './lib/JavascriptLexer.js';
import JavascriptParser from './lib/JavascriptParser.js';

const input = 'var i = 1';

const chars = new antlr4.InputStream(input);
const lexer = new JavascriptLexer(chars);

const tokens = new antlr4.CommonTokenStream(lexer);
const parser = new JavascriptParser(tokens);
const tree = parser.program();

console.log(tree.toStringTree(parser.ruleNames));