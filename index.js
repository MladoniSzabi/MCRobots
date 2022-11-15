import antlr4 from 'antlr4';
import * as fs from 'fs';
import JavascriptLexer from './lib/JavascriptLexer.js';
import JavascriptParser from './lib/JavascriptParser.js';
import { JavascriptVisitorImplementation } from './transpiler/JavascriptVisitor.js'

let onReadFinish = (err, input) => {
    const chars = new antlr4.InputStream(input);
    const lexer = new JavascriptLexer(chars);

    const tokens = new antlr4.CommonTokenStream(lexer);
    const parser = new JavascriptParser(tokens);
    const tree = parser.program();
    const visitor = new JavascriptVisitorImplementation()
    if(process.argv[2] == 'test') {
        visitor.isTranspilingTests = true
    }

    console.log(visitor.visit(tree));
}

if(process.argv[2] == 'test') {
    fs.readFile(process.argv[3], 'utf-8', onReadFinish)
} else {
    fs.readFile(process.argv[2], 'utf-8', onReadFinish)
}