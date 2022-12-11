import JavascriptVisitor from '../lib/JavascriptVisitor.js'

export class JavascriptVisitorImplementation extends JavascriptVisitor {

    classStack = []
    loopStack = []
    exports = []
    isTranspilingTests = false
    fileName = ""

    // Visit a parse tree produced by JavascriptParser#Program_Start.
    visitProgram_Start(ctx) {
        if (this.isTranspilingTests) {
            return 'local __js = require "tests.testlibs"\n' +
                '__js.__prepare_environment()\n' +
                this.visitChildren(ctx).join('\n')
        }

        if(this.isTranspilingRobot) {
            return 'local __js = require "minecraft_classes.load_classes"\n' +
                '__js.__prepare_environment()\n' +
                this.visitChildren(ctx).join('\n')
        }

        return 'local __js = require "javascript_functions"\n' +
            '__js.__prepare_environment()\n' +
            this.visitChildren(ctx).join('\n')
    }


    // Visit a parse tree produced by JavascriptParser#Statement_List_Block.
    visitStatement_List_Block(ctx) {
        return this.visitChildren(ctx).filter(x => x !== undefined).join('\n')
    }


    // Visit a parse tree produced by JavascriptParser#Statement_List_Variable_Statement.
    visitStatement_List_Variable_Statement(ctx) {
        return this.visitChildren(ctx).join('\n')
    }


    // Visit a parse tree produced by JavascriptParser#Statement_List_Empty_Statement.
    visitStatement_List_Empty_Statement(ctx) {
        return ''
    }


    // Visit a parse tree produced by JavascriptParser#Statement_List_If_Statement.
    visitStatement_List_If_Statement(ctx) {
        return this.visitChildren(ctx).join('\n')
    }


    // Visit a parse tree produced by JavascriptParser#Statement_List_Iteration_Statement.
    visitStatement_List_Iteration_Statement(ctx) {
        return this.visitChildren(ctx).join('\n')
    }


    // Visit a parse tree produced by JavascriptParser#Statement_List_Continue.
    visitStatement_List_Continue(ctx) {
        return 'goto continue_' + this.loopStack[this.loopStack.length - 1]
    }


    // Visit a parse tree produced by JavascriptParser#Statement_List_Break.
    visitStatement_List_Break(ctx) {
        return 'break'
    }


    // Visit a parse tree produced by JavascriptParser#Statement_List_Return.
    visitStatement_List_Return(ctx) {
        return this.visitChildren(ctx)[0];
    }


    // Visit a parse tree produced by JavascriptParser#Statement_List_Function_Declaration.
    visitStatement_List_Function_Declaration(ctx) {
        return this.visitChildren(ctx)[0]
    }


    // Visit a parse tree produced by JavascriptParser#Function_Declaration.
    visitFunction_Declaration(ctx) {
        let output = 'function ' + ctx.function_name.text + '(arguments)\n\n'
        let args = []
        if (ctx.args) {
            args = this.visit(ctx.args)
        }
        output += args.map(
            (x, i) => x.isRestParameter
                ? 'local ' + x.name + ' = __javascript_splice(arguments, ' + (i + 1) + ')'
                : 'local ' + x.name + ' = arguments[' + (i + 1).toString() + ']' + ' or ' + x.default_value + '\n')
            .join('')
        output += '\n\n' + this.visit(ctx.body) + '\n\nend\n\n'

        return output
    }


    // Visit a parse tree produced by JavascriptParser#Formal_Parameter_List_With_Args.
    visitFormal_Parameter_List_With_Args(ctx) {
        return this.visitChildren(ctx).filter(x => x !== undefined)
    }


    // Visit a parse tree produced by JavascriptParser#Formal_Parameter_Rest_Parameter.
    visitFormal_Parameter_Rest_Parameter(ctx) {
        return this.visitChildren(ctx)
    }


    // Visit a parse tree produced by JavascriptParser#Formal_Parameter_Arg.
    visitFormal_Parameter_Arg(ctx) {
        return {
            name: ctx.name.text,
            default_value: ctx.default_value ? this.visit(ctx.default_value) : 'nil',
            isRestParameter: false
        }
    }


    // Visit a parse tree produced by JavascriptParser#Last_Formal_Parameter_Arg.
    visitLast_Formal_Parameter_Arg(ctx) {
        return {
            name: this.visit(ctx.name),
            isRestParameter: true
        }
    }


    // Visit a parse tree produced by JavascriptParser#Function_Body.
    visitFunction_Body(ctx) {
        return this.visitChildren(ctx).filter(x => x !== undefined).join('\n')
    }


    // Visit a parse tree produced by JavascriptParser#Class_Declaration.
    visitClass_Declaration(ctx) {
        this.classStack.push(ctx.class_name.text)

        let inheritProperties = ''
        if (ctx.parent_class) {
            inheritProperties += this.visit(ctx.parent_class) + '.__javascript_add_default_properties(__javascript_class_properties)'
        }

        let classContent = this.visit(ctx.class_content)
        let propertyImplementations = ''
        let inClassProperties = ''
        for (let property of classContent) {
            if (property.type == 'property') {
                propertyImplementations += ctx.class_name.text + '.__javascript_default_properties.' + property.name + ' = ' + property.value + '\n'
                inClassProperties += '__javascript_class_properties.' + property.name + ' = ' + property.value + '\n'
            } else if (property.type == 'method') {
                propertyImplementations += ctx.class_name.text + '.__internal_methods.' + property.name + ' = function(this, __javascript_arguments)\n' +
                    property.arguments.map(
                        (x, i) => x.isRestParameter
                            ? ('local ' + x.name + ' = __javascript_splice(__javascript_arguments, ' + (i + 1) + ')')
                            : ('local ' + x.name + ' = __javascript_arguments[' + (i + 1).toString() + ']' + ' or ' + x.default_value + '\n'))
                        .join('') + '\n' +
                    property.body +
                    '\nend\n'
                if(property.isStatic) {
                    propertyImplementations += ctx.class_name.text + '.' + property.name + ' = function(__javascript_arguments) return ' +
                        ctx.class_name.text + '.__internal_methods.' + property.name + '(nil, __javascript_arguments) end\n'
                }

                inClassProperties += '__javascript_class_properties.' + property.name + ' = function(__javascript_arguments)\n' +
                    'return ' + this.classStack[this.classStack.length - 1] + '.__internal_methods.' + property.name + '(inst, __javascript_arguments)\n' +
                    'end\n'
            }
        }

        let output = 'local ' + ctx.class_name.text + ' = {}\n' +
            ctx.class_name.text + '.__internal_methods = {}\n' +
            ctx.class_name.text + '.__javascript_default_properties = {}\n' +
            ctx.class_name.text + '.__javascript_parent_class = ' + (ctx.parent_class ? this.visit(ctx.parent_class) : 'nil') + '\n' +
            'function ' + ctx.class_name.text + '.__javascript_get_internal_method(key)\n' +
            'if (' + ctx.class_name.text + '.__internal_methods[key]) then\n' +
            'return ' + ctx.class_name.text + '.__internal_methods[key]\n' +
            'elseif (' + ctx.class_name.text + '.__javascript_parent_class) then \n' +
            'return ' + ctx.class_name.text + '.__javascript_parent_class.__javascript_get_internal_method(key) \n' +
            'else\n' +
            'return nil\n' +
            'end\n' +
            'end\n\n' +
            'function ' + ctx.class_name.text + '.__javascript_add_default_properties(inst)\n' +
            'if(' + ctx.class_name.text + '.__javascript_parent_class) then\n' +
            ctx.class_name.text + '.__javascript_parent_class.__javascript_add_default_properties(inst)\n' +
            'end\n' +
            'for key,value in __lua_environment.pairs(' + ctx.class_name.text + '.__javascript_default_properties) do\n' +
            'inst[key] = value\n' +
            'end\n' +
            'end\n\n' +
            propertyImplementations +
            'function ' + ctx.class_name.text + '.new(arguments)\n' +
            'local inst = {}\n' +
            'local __javascript_class_properties = {}\n' +
            'local __javascript_parent = {}\n' +
            '__lua_environment.setmetatable(__javascript_parent, { __index = function(t,key)\n' +
            'return ' + (ctx.parent_class ? ('function(arguments) return ' + this.visit(ctx.parent_class) + '.__javascript_get_internal_method(key)(inst, arguments) end') : 'nil') + '\n' +
            'end\n' +
            '})\n' +
            inClassProperties +
            '__lua_environment.setmetatable(inst, { __index = function(t, key)\n' +
            'if(key=="__type") then\n' +
            'return String("object")\n' +
            'end\n' +
            'if(key=="__javascript_parent") then\n' +
            'return __javascript_parent\n' +
            'end\n' +
            'if(key=="__javascript_class") then\n' +
            'return ' + ctx.class_name.text + '\n' +
            'end\n' +
            'if __lua_environment.type(key) == "table" and key.__type == String("string") then\n' +
            'return __javascript_class_properties[key.__value]\n' +
            'elseif(__javascript_class_properties[key]) then\n' +
            'return __javascript_class_properties[key]\n' +
            'elseif(' + ctx.class_name.text + '.__javascript_parent_class and ' + ctx.class_name.text + '.__javascript_parent_class.__javascript_get_internal_method(key)) then\n' +
            'return function(arguments) return ' + ctx.class_name.text + '.__javascript_parent_class.__javascript_get_internal_method(key)(inst, arguments) end\n' +
            'else\n' +
            'return nil\n' +
            'end\n' +
            'end\n' +
            '})\n' +
            inheritProperties +
            '\nif(inst.constructor) then \n' +
            'inst.constructor(arguments)\n' +
            'end\n' +
            '\nreturn inst\n' +
            'end\n'

        this.classStack.pop()
        return output
    }


    // Visit a parse tree produced by JavascriptParser#Class_Element_List.
    visitClass_Element_List(ctx) {
        return this.visitChildren(ctx)
    }


    // Visit a parse tree produced by JavascriptParser#Class_Element_Method_Definition.
    visitClass_Element_Method_Definition(ctx) {
        return this.visit(ctx.method)
    }


    // Visit a parse tree produced by JavascriptParser#Class_Element_Empty_Statement.
    visitClass_Element_Empty_Statement(ctx) {
        return { type: 'empty' }
    }


    // Visit a parse tree produced by JavascriptParser#Class_Element_Property_Definition.
    visitClass_Element_Property_Definition(ctx) {
        return {
            type: 'property',
            name: this.visit(ctx.property_name),
            value: this.visit(ctx.property_value)
        }
    }


    // Visit a parse tree produced by JavascriptParser#Class_Element_Property_Definition.
    visitMethod_Definition(ctx) {
        return {
            type: 'method',
            name: this.visit(ctx.method_name),
            arguments: ctx.method_args ? this.visit(ctx.method_args) : [],
            body: this.visit(ctx.method_body),
            isStatic: ctx.parentCtx.is_static ? true : false
        }
    }


    // Visit a parse tree produced by JavascriptParser#Statement_List_Expression_Statement.
    visitStatement_List_Expression_Statement(ctx) {
        return this.visitChildren(ctx).join('\n')
    }


    // Visit a parse tree produced by JavascriptParser#Return_Statement.
    visitReturn_Statement(ctx) {
        if(ctx.expression) {
            return 'return ' + this.visit(ctx.expression);
        }
        return 'return'
    }


    // Visit a parse tree produced by JavascriptParser#Expression_Statement.
    visitExpression_Statement(ctx) {
        return this.visitChildren(ctx).join('\n')
    }


    // Visit a parse tree produced by JavascriptParser#Block_Statement_List.
    visitBlock_Statement_List(ctx) {
        return this.visitChildren(ctx).join('\n')
    }


    // Visit a parse tree produced by JavascriptParser#Empty_Statement.
    visitEmpty_Statement(ctx) {
        return ''
    }


    // Visit a parse tree produced by JavascriptParser#If_Statement.
    visitIf_Statement(ctx) {
        return 'if ( __javascript_toBoolean(' + this.visit(ctx.condition) + ').__value ) \n' +
            'then\n' +
            this.visit(ctx.body) +
            (ctx.else_body ? ('\nelse\n' + this.visit(ctx.else_body)) : '') +
            '\nend\n\n'
    }


    // Visit a parse tree produced by JavascriptParser#Iteration_Statement_Do_While.
    visitIteration_Statement_Do_While(ctx) {
        let loopId = Math.floor(Math.random() * 1000000)
        this.loopStack.push(loopId)
        let output = 'repeat\n' +
            this.visit(ctx.body) +
            //'\n::continue_' + loopId.toString() + '::\n' +
            '\nuntil(not __javascript_toBoolean(' + this.visit(ctx.condition) + ').__value)\n\n'
        this.loopStack.pop()
        return output
    }



    // Visit a parse tree produced by JavascriptParser#Iteration_Statement_While.
    visitIteration_Statement_While(ctx) {
        let loopId = Math.floor(Math.random() * 1000000)
        this.loopStack.push(loopId)
        let output = 'while ( __javascript_toBoolean(' + this.visit(ctx.condition) + ').__value )\n' +
            'do\n' +
            this.visit(ctx.body) +
            //'\n::continue_' + loopId.toString() + '::' +
            '\nend\n\n'
        this.loopStack.pop()
        return output
    }


    // Visit a parse tree produced by JavascriptParser#Iteration_Statement_For.
    visitIteration_Statement_For(ctx) {
        let loopId = Math.floor(Math.random() * 1000000)
        this.loopStack.push(loopId)
        let output = 'repeat\n' + // Wrap in a repeat block so we don't leak variables to outside scope
            (ctx.initialisation_expression ? this.visit(ctx.initialisation_expression) + '\n' : '') +
            (ctx.initialisation_var ? this.visit(ctx.initialisation_var) + '\n' : '') +
            'while ( __javascript_toBoolean(' + this.visit(ctx.condition) + ').__value )\n' +
            'do\n' +
            this.visit(ctx.body) + '\n' +
            //'::continue_' + loopId.toString() + '::\n' +
            this.visit(ctx.increment) +
            '\nend\n' +
            'until(true)\n\n'
        this.loopStack.pop()
        return output
    }


    // Visit a parse tree produced by JavascriptParser#Iteration_Statement_For_In.
    visitIteration_Statement_For_In(ctx) {
        let loopId = Math.floor(Math.random() * 10000).toString()
        this.loopStack.push(loopId)
        let output = 'for  __javascript_loop_key_' + loopId + ', __javascript_loop_value_' + loopId + ' in __lua_environment.pairs(' + this.visit(ctx.dictionary) + '.__value ) do\n' +
            this.visit(ctx.initialisation_var) + ', __javascript_unused_variable' + ' = __javascript_loop_key_' + loopId + ', __javascript_loop_value_' + loopId + '\n' +
            this.visit(ctx.body) + '\n' +
            //'\n::continue_' + loopId.toString() + '::' +
            '\nend\n\n'
        this.loopStack.pop()
        return output
    }


    // Visit a parse tree produced by JavascriptParser#Iteration_Statement_For_Of.
    visitIteration_Statement_For_Of(ctx) {
        let loopId = Math.floor(Math.random() * 10000).toString()
        this.loopStack.push(loopId)
        let output = 'for __javascript_loop_index_' + loopId + '=0, ' + this.visit(ctx.array) + '.length.__value-1 do\n' +
            this.visit(ctx.initialisation_var) + ' = ' + this.visit(ctx.array) + '[__javascript_loop_index_' + loopId + ']\n' +
            this.visit(ctx.body) + '\n' +
            //'\n::continue_' + loopId.toString() + '::' +
            '\nend\n\n'
        this.loopStack.pop()
        return output
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Member_Index_Expression
    visitSingle_Expression_Member_Index_Expression(ctx) {
        return this.visit(ctx.member) + '[' + this.visit(ctx.member_content) + ']'
    }

    // Visit a parse tree produced by JavascriptParser#Single_Expression_Member_Dot_Expression.
    visitSingle_Expression_Member_Dot_Expression(ctx) {
        return this.visit(ctx.member) +
            '.' +
            ctx.member_content.text
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Instantiate_With_Args.
    visitSingle_Expression_Instantiate_With_Args(ctx) {
        return this.visit(ctx.class_name) + '.new' + this.visit(ctx.new_arguments)
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Instantiate.
    visitSingle_Expression_Instantiate(ctx) {
        return this.visit(ctx.class_name) + '.new({})'
    }

    // Visit a parse tree produced by JavascriptParser#Single_Expression_Assert.
    visitSingle_Expression_Assert(ctx) {
        let args = this.visit(ctx.function_arguments)
        return 'assert(' + args.substring(2, args.length - 2) + ', "' + this.fileName + '", ' + ctx.function_arguments.start.line + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Call.
    visitSingle_Expression_Call(ctx) {
        return this.visit(ctx.function_name) + this.visit(ctx.function_arguments)
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Delete.
    visitSingle_Expression_Delete(ctx) {
        return this.visit(ctx.expression) + ' = nil'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Typeof.
    visitSingle_Expression_Typeof(ctx) {
        return '__javascript_type(' + this.visit(ctx.expression) + ')'
    }


    // TODO: These 4 rules need a bit of work
    // Visit a parse tree produced by JavascriptParser#Single_Expression_Post_Increment.
    visitSingle_Expression_Post_Increment(ctx) {
        return '__javascript_post_increment(' + this.visit(ctx.expression) + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Post_Decrement.
    visitSingle_Expression_Post_Decrement(ctx) {
        return '__javascript_post_decrement(' + this.visit(ctx.expression) + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Pre_Increment.
    visitSingle_Expression_Pre_Increment(ctx) {
        return '__javascript_pre_increment(' + this.visit(ctx.expression) + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Pre_Decrement.
    visitSingle_Expression_Pre_Decrement(ctx) {
        return '__javascript_pre_decrement(' + this.visit(ctx.expression) + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Unary_Plus.
    visitSingle_Expression_Unary_Plus(ctx) {
        return '__javascript_toNumeric(' + this.visit(ctx.expression) + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Unary_Minus.
    visitSingle_Expression_Unary_Minus(ctx) {
        return '-__javascript_toNumeric(' + this.visit(ctx.expression) + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Bit_Not.
    visitSingle_Expression_Bit_Not(ctx) {
        return '~__javascript_toNumeric(' + this.visit(ctx.expression) + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Not.
    visitSingle_Expression_Not(ctx) {
        return '__javascript_toBoolean(not __javascript_toBoolean(' + this.visit(ctx.expression) + ').__value)'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Power.
    visitSingle_Expression_Power(ctx) {
        return '( __javascript_toNumeric(' + this.visit(ctx.exp1) + ') ^ __javascript_toNumeric(' + this.visit(ctx.exp2) + ')) '
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Multiplicative.
    visitSingle_Expression_Multiplicative(ctx) {
        return '(__javascript_toNumeric(' + this.visit(ctx.exp1) + ') ' + ctx.operation.text + ' __javascript_toNumeric(' + this.visit(ctx.exp2) + ')) '
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Additive.
    visitSingle_Expression_Additive(ctx) {
        if (ctx.operation.text == '+') {
            return '__javascript_add(' + this.visit(ctx.exp1) + ', ' + this.visit(ctx.exp2) + ')' // Treating addition differently as it has extra steps
        }
        return '(__javascript_toNumeric(' + this.visit(ctx.exp1) + ') ' + ctx.operation.text + ' __javascript_toNumeric(' + this.visit(ctx.exp2) + ')) '
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Bit_Shift.
    visitSingle_Expression_Bit_Shift(ctx) {
        let operation = ctx.operation.text
        if (operation == '<<') {
            return '(__javascript_toNumeric(' + this.visit(ctx.exp1) + ') << __javascript_toNumeric(' + this.visit(ctx.exp2) + ')) '
        } else if (operation == '>>') {
            return '(__javascript_toNumeric(' + this.visit(ctx.exp1) + ') // (2 ^ __javascript_toNumeric(' + this.visit(ctx.exp2) + '))) '
        } else if (operation == '>>>') {
            return '(__javascript_toNumeric(' + this.visit(ctx.exp1) + ') >> __javascript_toNumeric(' + this.visit(ctx.exp2) + ')) '
        }
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Relational.
    visitSingle_Expression_Relational(ctx) {
        let operator = ctx.operation.text
        if (operator == '!=') {
            operator = '~='
        }
        return '__javascript_toBoolean(' + this.visit(ctx.exp1) + ' ' + operator + ' ' + this.visit(ctx.exp2) + ') '
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Instance_of.
    visitSingle_Expression_Instance_of(ctx) {
        return '__javascript_instanceof(' + this.visit(ctx.exp1) + ', ' + this.visit(ctx.exp2) + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_In.
    visitSingle_Expression_In(ctx) {
        return '__javascript_hasProperty(' + this.visit(ctx.exp1) + ', ' + this.visit(ctx.exp2) + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Bit_And.
    visitSingle_Expression_Bit_And(ctx) {
        return '(__javascript_toNumeric(' + this.visit(ctx.exp1) + ') & __javascript_toNumeric(' + this.visit(ctx.exp2) + '))'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Bit_Xor.
    visitSingle_Expression_Bit_Xor(ctx) {
        return '(__javascript_toNumeric(' + this.visit(ctx.exp1) + ') ~ __javascript_toNumeric(' + this.visit(ctx.exp2) + '))'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Bit_Or.
    visitSingle_Expression_Bit_Or(ctx) {
        return '(__javascript_toNumeric(' + this.visit(ctx.exp1) + ') | __javascript_toNumeric(' + this.visit(ctx.exp2) + '))'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Logical_And.
    visitSingle_Expression_Logical_And(ctx) {
        return '__javascript_logical_and(' + this.visit(ctx.exp1) + ', ' + this.visit(ctx.exp2) + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Logical_Or.
    visitSingle_Expression_Logical_Or(ctx) {
        return '__javascript_logical_or(' + this.visit(ctx.exp1) + ', ' + this.visit(ctx.exp2) + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Ternary.
    visitSingle_Expression_Ternary(ctx) {
        return '(function() if __javascript_toBoolean(' + this.visit(ctx.exp1) + ').__value then return ' + this.visit(ctx.exp2) + ' else  return ' + this.visit(ctx.exp3) + 'end end)()'
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Assignment.
    visitSingle_Expression_Assignment(ctx) {
        return this.visit(ctx.exp1) + '=' + this.visit(ctx.exp2)
    }


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Assignment_Operator.
    visitSingle_Expression_Assignment_Operator(ctx) {
        switch (ctx.operator.getText()) {
            case '*=':
                return this.visit(ctx.exp1) + ' = __javascript_toNumeric(' + this.visit(ctx.exp1) + ') * __javascript_toNumeric(' + this.visit(ctx.exp2) + ')'
            case '/=':
                return this.visit(ctx.exp1) + ' = __javascript_toNumeric(' + this.visit(ctx.exp1) + ') / __javascript_toNumeric(' + this.visit(ctx.exp2) + ')'
            case '%=':
                return this.visit(ctx.exp1) + ' = __javascript_toNumeric(' + this.visit(ctx.exp1) + ') % __javascript_toNumeric(' + this.visit(ctx.exp2) + ')'
            case '+=':
                return this.visit(ctx.exp1) + ' = __javascript_add(' + this.visit(ctx.exp1) + ', ' + this.visit(ctx.exp2) + ')' // Treating addition differently as it has extra steps
            case '-=':
                return this.visit(ctx.exp1) + ' = __javascript_toNumeric(' + this.visit(ctx.exp1) + ') - __javascript_toNumeric(' + this.visit(ctx.exp2) + ')'
            case '<<=':
                return this.visit(ctx.exp1) + ' = __javascript_toNumeric(' + this.visit(ctx.exp1) + ') << __javascript_toNumeric(' + this.visit(ctx.exp2) + ')'
            case '>>=':
                return this.visit(ctx.exp1) + ' = __javascript_toNumeric(' + this.visit(ctx.exp1) + ') // (2 ^ __javascript_toNumeric(' + this.visit(ctx.exp2) + '))'
            case '>>>=':
                return this.visit(ctx.exp1) + ' = __javascript_toNumeric(' + this.visit(ctx.exp1) + ') >> __javascript_toNumeric(' + this.visit(ctx.exp2) + ')'
            case '&=':
                return this.visit(ctx.exp1) + ' = __javascript_toNumeric(' + this.visit(ctx.exp1) + ') & __javascript_toNumeric(' + this.visit(ctx.exp2) + ')'
            case '^=':
                return this.visit(ctx.exp1) + ' = __javascript_toNumeric(' + this.visit(ctx.exp1) + ') ~ __javascript_toNumeric(' + this.visit(ctx.exp2) + ')'
            case '|=':
                return this.visit(ctx.exp1) + ' = __javascript_toNumeric(' + this.visit(ctx.exp1) + ') | __javascript_toNumeric(' + this.visit(ctx.exp2) + ')'
            case '**=':
                return this.visit(ctx.exp1) + ' = __javascript_toNumeric(' + this.visit(ctx.exp1) + ') ^ __javascript_toNumeric(' + this.visit(ctx.exp2) + ')'
        }
        console.error('Assignment operator', ctx.operator.getText(), 'not understood. Defaulting to simple assignment')
        return this.visit(ctx.exp1) + '=' + this.visit(ctx.exp2)
    }


    // TODO:
    // Visit a parse tree produced by JavascriptParser#Single_Expression_Import.
    visitSingle_Expression_Import(ctx) {
        return '__javascript_import(' + this.visit(ctx.exp) + '.__value )'
    }

    // Visit a parse tree produced by JavascriptParser#Single_Expression_Export.
    visitSingle_Expression_Export(ctx) {
        return 'return ' + this.visit(ctx.exp)
    }

    // Visit a parse tree produced by JavascriptParser#Single_Expression_Super_Constructor.
    visitSingle_Expression_Super_Constructor(ctx) {
        return 'this.__javascript_parent.constructor( ' + this.visit(ctx.constructor_args) + ')'
    }

    // Visit a parse tree produced by JavascriptParser#Single_Expression_Super.
    visitSingle_Expression_Super(ctx) {
        return 'this.__javascript_parent'
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


    // Visit a parse tree produced by JavascriptParser#Single_Expression_Variable.
    visitSingle_Expression_Variable(ctx) {
        return ctx.getText()
    }


    // Visit a parse tree produced by JavascriptParser#Arguments_Rule.
    visitArguments_Rule(ctx) {
        if(ctx.parentCtx.no_table) {
            return '(' + this.visitChildren(ctx).filter(x => x !== undefined).join(', ') + ')'
        }
        return '({' + this.visitChildren(ctx).filter(x => x !== undefined).join(', ') + '})'
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
        return 'Array({' + this.visitChildren(ctx).filter(x => x !== undefined)[0].join(', ') + '})'
    }


    // Visit a parse tree produced by JavascriptParser#Element_List.
    visitElement_List(ctx) {
        let arr = this.visitChildren(ctx)
        let arrayElements = []
        if(arr !== null) {
            arrayElements = arr.filter(x => x !== undefined)
        }
        return arrayElements
    }


    // Visit a parse tree produced by JavascriptParser#Array_Element.
    visitArray_Element(ctx) {
        return this.visitChildren(ctx)[0]
    }


    // Visit a parse tree produced by JavascriptParser#Object_Literal.
    visitObject_Literal(ctx) {
        let propertiesAsStrings = []
        let properties = this.visitChildren(ctx).filter(x => x !== undefined)
        for (let prop of properties) {
            propertiesAsStrings.push(prop.name + ' = ' + prop.value)
        }
        return 'Object({ ' + propertiesAsStrings.join(', ') + ' })'
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
        let output = ''
        if (ctx.var_modifier.getText() == 'let' || ctx.var_modifier.getText() == 'const') {
            output = 'local '
        }

        let first_var = this.visit(ctx.single_declaration)

        let variable_names = []
        let variable_values = []
        let declarations = this.visitChildren(ctx).splice(1)
        for (let v of declarations) {
            if (v == undefined) {
                continue
            }
            if(v.expanded) {
                for(let variable of v.variable_name) {
                    variable_names.push(variable)
                }
                variable_values.push(v.variable_value)
            } else {
                variable_names.push(v.variable_name)
                variable_values.push(v.variable_value)
            }
        }

        output += variable_names.join(', ')
        if (!variable_values.every(element => element === 'nil')) {
            output += ' = ' + variable_values.join(', ')
        }
        return output

    }


    // Visit a parse tree produced by JavascriptParser#Variable_Declaration.
    visitVariable_Declaration(ctx) {
        let variable_name = ctx.variable_name.text
        let variable_value
        if (ctx.variable_value) {
            variable_value = this.visit(ctx.variable_value)
        } else {
            variable_value = 'nil'
        }
        return { variable_name, variable_value, expanded: false }
    }

    // Visit a parse tree produced by JavascriptParser#Variable_Declaration_Expand.
    visitVariable_Declaration_Expand(ctx) {
        let variable_names = this.visit(ctx.variable_names)
        let variable_value = this.visit(ctx.variable_value)

        return {variable_name: variable_names, variable_value, expanded: true}
    }

    // Visit a parse tree produced by JavascriptParser#Variables_To_Expand
    visitVariables_To_Expand(ctx) {
        let tokens = ctx.children.filter(x => x.symbol.text != ',')
        return tokens.map(x => x.symbol.text)
    }


    // Visit a parse tree produced by JavascriptParser#variableModifier.
    visitVariableModifier(ctx) {
        return ctx.getText()
    }


    // Visit a parse tree produced by JavascriptParser#Literal_Null.
    visitLiteral_Undefined(ctx) {
        return 'nil'
    }


    // Visit a parse tree produced by JavascriptParser#Literal_Null.
    visitLiteral_Null(ctx) {
        return 'null'
    }


    // Visit a parse tree produced by JavascriptParser#Literal_Boolean.
    visitLiteral_Boolean(ctx) {
        return 'Boolean(' + ctx.getText() + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Literal_String.
    visitLiteral_String(ctx) {
        return 'String(' + ctx.getText() + ')'
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

        let currentlyParsing = 'integerPart'

        for (let c of text) {
            if ('0123456789'.includes(c)) {
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

        let finalValue
        if (decimalPartLength != 0) {
            finalValue = (integerPart + decimalPart / 10 ** decimalPartLength) * (10 ** exponent)
        } else {
            finalValue = integerPart * (10 ** exponent)
        }
        if (isNegative) {
            finalValue = -finalValue
        }
        return 'Number(' + finalValue.toString() + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Literal_Hex_Integer.
    visitLiteral_Hex_Integer(ctx) {
        let value = 0
        let text = ctx.getText().substring(2)
        for (let c of text) {
            if ('0123456789'.includes(c)) {
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
                    console.error('Hexadecimal digit', c, 'not understood. Ignoring.')
            }
        }
        return 'Number(' + value.toString() + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Literal_Octal_Integer.
    visitLiteral_Octal_Integer(ctx) {
        let text = ctx.getText()
        if (text[1] == 'o' || text[1] == 'O') {
            text = text.substring(2)
        } else {
            text = text.substring(1)
        }

        let value = 0
        for (c of text) {
            if (c == '_') {
                continue
            }
            value = value * 8 + c.charCodeAt() - 48 // character code of 0
        }

        return 'Number(' + value.toString() + ')'
    }


    // Visit a parse tree produced by JavascriptParser#Literal_Octal_Integer_2.
    visitLiteral_Octal_Integer_2(ctx) {
        return this.visitLiteral_Octal_Integer(ctx)
    }


    // Visit a parse tree produced by JavascriptParser#Literal_Binary_Integer.
    visitLiteral_Binary_Integer(ctx) {
        let value = 0
        let text = ctx.getText().substring(2)

        for (c of text) {
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
                    console.error('Binary digit', c, 'not understood. Ignoring')
            }
        }

        return 'Number(' + value.toString() + ')'
    }


    // Visit a parse tree produced by JavascriptParser#eos.
    visitEos(ctx) {
        return ''
    }

}
