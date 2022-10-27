import JavascriptVisitor from "../lib/JavascriptVisitor";

class JavascriptVisitorImplementation extends JavascriptVisitor {

    // Visit a parse tree produced by JavascriptParser#Program_Start.
    visitProgram_Start(ctx) {
        return this.visitChildren(ctx).join('\n')
    }


    // Visit a parse tree produced by JavascriptParser#Statement_List_Block.
    visitStatement_List_Block(ctx) {
        return this.visitChildren(ctx).join('\n')
    }


    // Visit a parse tree produced by JavascriptParser#Statement_List_Variable_Statement.
    visitStatement_List_Variable_Statement(ctx) {
        return this.visitChildren(ctx).join('\n')
    }


    // Visit a parse tree produced by JavascriptParser#Statement_List_Empty_Statement.
    visitStatement_List_Empty_Statement(ctx) {
        return ''
    }


    // Visit a parse tree produced by JavascriptParser#Block_Statement_List.
    visitBlock_Statement_List(ctx) {
        return this.visitChildren(ctx).join('\n')
    }


    // Visit a parse tree produced by JavascriptParser#Empty_Statement.
    visitEmpty_Statement(ctx) {
        return ''
    }

    //TODO:
    // Visit a parse tree produced by JavascriptParser#Single_Expression_Instantiate_With_Args.
    visitSingle_Expression_Instantiate_With_Args(ctx) {
        return this.visit(ctx.class_name) + '.new '  + this.visit(new_arguments)
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Instantiate.
    visitSingle_Expression_Instantiate(ctx) {
        return this.visit(ctx.class_name) + '.new()'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Call.
    visitSingle_Expression_Call(ctx) {
        return this.visit(ctx.functionName) + this.visit(ctx.function_arguments)
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Delete.
    visitSingle_Expression_Delete(ctx) {
        return this.visit(ctx.expression) + ' = nil'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Typeof.
    visitSingle_Expression_Typeof(ctx) {
        return 'javascript_type(' + this.visit(ctx.expression) + ')'
    }


    // TODO: These 4 rules need a bit of work
    // Visit a parse tree produced by JavascriptParser#Single_Expression_Post_Increment.
    visitSingle_Expression_Post_Increment(ctx) {
        return this.visit(ctx.expression) + ' = ' + this.visit(ctx.expression) + '+1'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Post_Decrement.
    visitSingle_Expression_Post_Decrement(ctx) {
        return this.visit(ctx.expression) + ' = ' + this.visit(ctx.expression) + '-1'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Pre_Increment.
    visitSingle_Expression_Pre_Increment(ctx) {
        return this.visit(ctx.expression) + ' = ' + this.visit(ctx.expression) + '+1'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Pre_Decrement.
    visitSingle_Expression_Pre_Decrement(ctx) {
        return this.visit(ctx.expression) + ' = ' + this.visit(ctx.expression) + '-1'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Unary_Plus.
    visitSingle_Expression_Unary_Plus(ctx) {
        return 'javascript_toNumeric(' + this.visit(ctx.expression) + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Unary_Minus.
    visitSingle_Expression_Unary_Minus(ctx) {
        return '-javascript_toNumeric(' + this.visit(ctx.expression) + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Bit_Not.
    visitSingle_Expression_Bit_Not(ctx) {
        return '~javascript_toNumeric(' + this.visit(ctx.expression) + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Not.
    visitSingle_Expression_Not(ctx) {
        return '!javascript_toBoolean(' + this.visit(ctx.expression)[0] + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Power.
    visitSingle_Expression_Power(ctx) {
        return '( javascript_toNumeric(' + this.visit(ctx.exp1) + ') ^ javascript_toNumeric(' + this.visit(ctx.exp2) + ')) '
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Multiplicative.
    visitSingle_Expression_Multiplicative(ctx) {
        return '(javascript_toNumeric(' + this.visit(ctx.exp1) + ') ' + ctx.operation.text + ' javascript_toNumeric(' + this.visit(ctx.exp2) + ')) '
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Additive.
    visitSingle_Expression_Additive(ctx) {
        return '(javascript_toNumeric(' + this.visit(ctx.exp1) + ') ' + ctx.operation.text + ' javascript_toNumeric(' + this.visit(ctx.exp2) + ')) '
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Bit_Shift.
    visitSingle_Expression_Bit_Shift(ctx) {
        if (ctx.operation.text == "<<") {
            return '(javascript_toNumeric(' + this.visit(ctx.exp1) + ') << javascript_toNumeric(' + this.visit(ctx.exp2) + ')) '
        } else if (ctx.operation.text == '>>') {
            return '(javascript_toNumeric(' + this.visit(ctx.exp1) + ') // javascript_exponentiate(2, javascript_toNumeric(' + this.visit(ctx.exp2) + '))) '
        } else if (ctx.operation.text == '>>>') {
            return '(javascript_toNumeric(' + this.visit(ctx.exp1) + ') >> javascript_toNumeric(' + this.visit(ctx.exp2) + ')) '
        }
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Relational.
    visitSingle_Expression_Relational(ctx) {
        return '(' + this.visit(ctx.exp1) + ' ' + ctx.operation.text + ' ' + this.visit(ctx.exp2) + ') '
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Instance_of.
    visitSingle_Expression_Instance_of(ctx) {
        return 'javascript_instanceof(' + this.visit(ctx.exp1) + ', ' + this.visit(ctx.exp2) + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_In.
    visitSingle_Expression_In(ctx) {
        return 'javascript_hasProperty(' + this.visit(ctx.exp1) + ', javascript_toPropertyKey(' + this.visit(ctx.exp2) + '))'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Bit_And.
    visitSingle_Expression_Bit_And(ctx) {
        return '(javascript_toNumeric(' + this.visit(ctx.exp1) + ') & toNumeric(' + this.visit(ctx.exp2) + '))'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Bit_Xor.
    visitSingle_Expression_Bit_Xor(ctx) {
        return '(javascript_toNumeric(' + this.visit(ctx.exp1) + ') ~ toNumeric(' + this.visit(ctx.exp2) + '))'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Bit_Or.
    visitSingle_Expression_Bit_Or(ctx) {
        return '(javascript_toNumeric(' + this.visit(ctx.exp1) + ') | toNumeric(' + this.visit(ctx.exp2) + '))'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Logical_And.
    visitSingle_Expression_Logical_And(ctx) {
        return '( javascript_toBoolean(' + this.visit(ctx.exp1) + ') and ' + this.visit(ctx.exp2) + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Logical_Or.
    visitSingle_Expression_Logical_Or(ctx) {
        return '( javascript_logicalOr(' + this.visit(ctx.exp1) + ', ' + this.visit(ctx.exp2) + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Ternary.
    visitSingle_Expression_Ternary(ctx) {
        return '( javascript_toBoolean(' + this.visit(ctx.exp1) + ')? ' + this.visit(ctx.exp2) + ':' + this.visit(ctx.exp3) + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Assignment.
    visitSingle_Expression_Assignment(ctx) {
        return this.visit(ctx.exp1) + '=' + this.visit(ctx.exp2)
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Assignment_Operator.
    visitSingle_Expression_Assignment_Operator(ctx) {
        switch (ctx.operator.text) {
            case '*=':
                return this.visit(ctx.exp1) + ' = javascript_toNumeric(' + this.visit(ctx.exp1) + ') * javascript_toNumeric(' + this.visit(ctx.exp2) + ')'
            case '/=':
                return this.visit(ctx.exp1) + ' = javascript_toNumeric(' + this.visit(ctx.exp1) + ') / javascript_toNumeric(' + this.visit(ctx.exp2) + ')'
            case '%=':
                return this.visit(ctx.exp1) + ' = javascript_toNumeric(' + this.visit(ctx.exp1) + ') % javascript_toNumeric(' + this.visit(ctx.exp2) + ')'
            case '+=':
                return this.visit(ctx.exp1) + ' = javascript_toNumeric(' + this.visit(ctx.exp1) + ') + javascript_toNumeric(' + this.visit(ctx.exp2) + ')'
            case '-=':
                return this.visit(ctx.exp1) + ' = javascript_toNumeric(' + this.visit(ctx.exp1) + ') - javascript_toNumeric(' + this.visit(ctx.exp2) + ')'
            case '<<=':
                return this.visit(ctx.exp1) + ' = javascript_toNumeric(' + this.visit(ctx.exp1) + ') << javascript_toNumeric(' + this.visit(ctx.exp2) + ')'
            case '>>=':
                return this.visit(ctx.exp1) + ' = javascript_toNumeric(' + this.visit(ctx.exp1) + ') // javascript_exponentiate(2, javascript_toNumeric(' + this.visit(ctx.exp2) + '))'
            case '>>>=':
                return this.visit(ctx.exp1) + ' = javascript_toNumeric(' + this.visit(ctx.exp1) + ') >> javascript_toNumeric(' + this.visit(ctx.exp2) + ')'
            case '&=':
                return this.visit(ctx.exp1) + ' = javascript_toNumeric(' + this.visit(ctx.exp1) + ') & javascript_toNumeric(' + this.visit(ctx.exp2) + ')'
            case '^=':
                return this.visit(ctx.exp1) + ' = javascript_toNumeric(' + this.visit(ctx.exp1) + ') ~ javascript_toNumeric(' + this.visit(ctx.exp2) + ')'
            case '|=':
                return this.visit(ctx.exp1) + ' = javascript_toNumeric(' + this.visit(ctx.exp1) + ') | javascript_toNumeric(' + this.visit(ctx.exp2) + ')'
            case '**=':
                return this.visit(ctx.exp1) + ' = javascript_toNumeric(' + this.visit(ctx.exp1) + ') ^ javascript_toNumeric(' + this.visit(ctx.exp2) + ')'
        }
        console.error('Assignment operator', ctx.operator.text, 'not understood. Defaulting to simple assignment')
        return this.visit(ctx.exp1) + '=' + this.visit(ctx.exp2)
    }


    // TODO:
    // Visit a parse tree produced by JavascriptParser#Single_Expression_Import.
    visitSingle_Expression_Import(ctx) {
        return 'javascript_import(' + this.visit(ctx.exp) + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Super.
    visitSingle_Expression_Super(ctx) {
        return 'javascript_super'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Literal.
    visitSingle_Expression_Literal(ctx) {
        return this.visitChildren(ctx)[0]
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Array_Literal.
    visitSingle_Expression_Array_Literal(ctx) {
        return this.visitChildren(ctx)[0]
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Object_Literal.
    visitSingle_Expression_Object_Literal(ctx) {
        return this.visitChildren(ctx)[0]
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Parenthesis.
    visitSingle_Expression_Parenthesis(ctx) {
        return '(' + this.visit(ctx.expr) + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Expression_Sequence.
    visitExpression_Sequence(ctx) {
        return this.visitChildren(ctx).join(', ')
    }


    // Visit a parse tree produced by JavascriptParser#Arguments_Rule.
    visitArguments_Rule(ctx) {
        return '(' + this.visitChildren(ctx).join(', ') + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Argument_Rule.
    visitArgument_Rule(ctx) {
        return this.visitChildren(ctx)[0]
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Literal.
    visitSingle_Expression_Literal(ctx) {
        return this.visitChildren(ctx)[0]
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Array_Literal.
    visitSingle_Expression_Array_Literal(ctx) {
        return this.visitChildren(ctx)[0]
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Object_Literal.
    visitSingle_Expression_Object_Literal(ctx) {
        return this.visitChildren(ctx)[0]
    }


    // Visit a parse tree produced by JavascriptParser#Array_Literal.
    visitArray_Literal(ctx) {
        return '{' + this.visitChildren(ctx)[0].join(", ") + '}'
    }


    // Visit a parse tree produced by JavascriptParser#Element_List.
    visitElement_List(ctx) {
        let arrayElements = this.visitChildren(ctx)
        console.log(arrayElements)
        return arrayElements
    }


    // Visit a parse tree produced by JavascriptParser#Array_Element.
    visitArray_Element(ctx) {
        return this.visitChildren(ctx)[0]
    }


    // Visit a parse tree produced by JavascriptParser#Object_Literal.
    visitObject_Literal(ctx) {
        let propertiesAsStrings = []
        let properties = this.visitChildren(ctx)
        for (let prop in properties) {
            propertiesAsStrings.push(prop.name + " = " + prop.value)
        }
        console.log(properties, obj)
        return "{ " + propertiesAsStrings.join(", ") + " }"
    }


    // Visit a parse tree produced by JavascriptParser#Object_Property_Assignment.
    visitObject_Property_Assignment(ctx) {
        let name = this.visit(ctx.property_name)
        let value = this.visit(ctx.property_value)
        return { name, value }
    }

    // Visit a parse tree produced by JavascriptParser#Propery_Name_Variable.
    visitPropery_Name_Variable(ctx) {
        return ctx.getText()
    }


    // Visit a parse tree produced by JavascriptParser#Property_Name_String.
    visitProperty_Name_String(ctx) {
        let name = ctx.getText()
        name = name.substring(1).substring(0, name.length - 1)
        return name
    }


    // Visit a parse tree produced by JavascriptParser#Variable_Statement.
    visitVariable_Statement(ctx) {
        return this.visitChildren(ctx)[0]
    }


    // Visit a parse tree produced by JavascriptParser#Variable_Declaration_List.
    visitVariable_Declaration_List(ctx) {
        let output = ""
        if (ctx.var_modifier.text == "let" || ctx.var_modifier.text == "const") {
            output = "local "
        }

        let first_var = this.visit(ctx.single_declaration)

        let variable_names = [first_var.variable_name]
        let variable_values = [first_var.variable_value]

        if (ctx.other_declaration) {
            for (let v in this.visit(ctx.other_declaration)) {
                variable_names.push(v.variable_name)
                variable_values.push(v.variable_value)
            }
        }

        output += variable_names.join(", ") + " = " + variable_values.join(",")
        return output

    }


    // Visit a parse tree produced by JavascriptParser#Variable_Declaration.
    visitVariable_Declaration(ctx) {
        let variable_name = ctx.variable_name.text
        let variable_value
        if (ctx.variable_value) {
            variable_value = this.visit(ctx.variable_value)
        } else {
            variable_value = "nil"
        }
        return { variable_name, variable_value }
    }


    // Visit a parse tree produced by JavascriptParser#variableModifier.
    visitVariableModifier(ctx) {
        return ctx.getText()
    }


    // Visit a parse tree produced by JavascriptParser#Literal_Null.
    visitLiteral_Null(ctx) {
        return "nil"
    }


    // Visit a parse tree produced by JavascriptParser#Literal_Boolean.
    visitLiteral_Boolean(ctx) {
        return ctx.getText();
    }


    // Visit a parse tree produced by JavascriptParser#Literal_String.
    visitLiteral_String(ctx) {
        return ctx.getText()
    }


    // Visit a parse tree produced by JavascriptParser#LiteralNumberic.
    visitLiteral_Numberic(ctx) {
        return this.visitChildren(ctx)[0]
    }


    // Visit a parse tree produced by JavascriptParser#Literal_Decimal.
    visitLiteral_Decimal(ctx) {
        let integerPart = 0
        let decimalPart = 0
        let exponent = 0
        let text = ctx.getText()
        let decimalPartLength = 0
        let isNegative = false

        let currentlyParsing = "integerPart"

        for (let c in text) {
            if ("0123456789".includes(c)) {
                if (currentlyParsing == 'integerPart') {
                    integerPart = integerPart * 10 + c.charCodeAt(0) - 48 // character code of 0
                } else if (currentlyParsing == 'decimalPart') {
                    decimalPart = decimalPart * 10 + c.charCodeAt(0) - 48 // character code of 0
                    decimalPartLength++
                } else if (currentlyParsing == 'exponentPart') {
                    exponent = exponent * 10 + c.charCodeAt(0) - 48 // character code of 0
                }
            } else if (c == '-') {
                isNegative = true
            } else if (c == '_') {
                continue
            } else if (c == 'e') {
                currentlyParsing = 'exponentPart'
            } else if (c == '.') {
                currentlyParsing = 'decimalPart'
            }
        }

        let finalValue = (integerPart + decimalPart / decimalPartLength) * (10 ** exponent)
        if (isNegative) {
            finalValue = -finalValue
        }
        return finalValue.toString()
    }


    // Visit a parse tree produced by JavascriptParser#Literal_Hex_Integer.
    visitLiteral_Hex_Integer(ctx) {
        let value = 0
        let text = ctx.getText().substring(2)
        for (let c in text) {
            if ("0123456789".includes(c)) {
                value = value * 16 + c.charCodeAt(0) - 48 // character code of 0
                continue
            }
            switch (c) {
                case 'a':
                    value = value * 16 + 10
                    break
                case 'b':
                    value = value * 16 + 11
                    break
                case 'c':
                    value = value * 16 + 12
                    break
                case 'd':
                    value = value * 16 + 13
                    break
                case 'e':
                    value = value * 16 + 14
                    break
                case 'f':
                    value = value * 16 + 15
                    break
                case '_':
                    break
                default:
                    console.error("Hexadecimal digit", c, "not understood. Ignoring.")
            }
        }
        return value.toString()
    }


    // Visit a parse tree produced by JavascriptParser#Literal_Octal_Integer.
    visitLiteral_Octal_Integer(ctx) {
        let text = ctx.getText()
        if (text[1] == "o" || text[1] == "O") {
            text = text.substring(2)
        } else {
            text = text.substring(1)
        }

        let value = 0
        for (c in text) {
            if (c == "_") {
                continue
            }
            value = value * 8 + c.charCodeAt() - 48 // character code of 0
        }

        return value.toString()
    }


    // Visit a parse tree produced by JavascriptParser#Literal_Octal_Integer_2.
    visitLiteral_Octal_Integer_2(ctx) {
        return this.visitLiteral_Octal_Integer(ctx)
    }


    // Visit a parse tree produced by JavascriptParser#Literal_Binary_Integer.
    visitLiteral_Binary_Integer(ctx) {
        let value = 0
        let text = ctx.getText().substring(2)

        for (c in text) {
            switch (c) {
                case '0':
                    value = value * 2
                    continue
                case '1':
                    value = value2 + 1
                    continue
                case '_':
                    continue
                default:
                    console.error("Binary digit", c, "not understood. Ignoring")
            }
        }

        return value.toString()
    }


    // Visit a parse tree produced by JavascriptParser#eos.
    visitEos(ctx) {
        return "";
    }

}