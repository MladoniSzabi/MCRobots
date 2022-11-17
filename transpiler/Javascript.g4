grammar Javascript;

program: statementList+ # Program_Start;

statementList:
	block					# Statement_List_Block
	| variableStatement		# Statement_List_Variable_Statement
	| emptyStatement		# Statement_List_Empty_Statement
	| classDeclaration		# Statement_List_Class_Declaration
	| expressionStatement	# Statement_List_Expression_Statement
	| ifStatement			# Statement_List_If_Statement
	| iterationStatement	# Statement_List_Iteration_Statement
	| continueStatement		# Statement_List_Continue
	| breakStatement		# Statement_List_Break
	| returnStatement		# Statement_List_Return
	| functionDeclaration	# Statement_List_Function_Declaration;

block: '{' statementList+ '}' # Block_Statement_List;
emptyStatement: SemiColon # Empty_Statement;

expressionStatement: expressionSequence # Expression_Statement;

ifStatement:
	If '(' condition = expressionSequence ')' body = statementList (
		Else else_body = statementList
	)? # If_Statement;
iterationStatement:
	Do body = statementList While '(' condition = expressionSequence ')' #
		Iteration_Statement_Do_While
	| While '(' condition = expressionSequence ')' body = statementList # Iteration_Statement_While
	| For '(' (
		initialisation_expression = expressionSequence
		| initialisation_var = variableDeclarationList
	)? ';' condition = expressionSequence? ';' increment = expressionSequence? ')' body =
		statementList # Iteration_Statement_For
	| For '(' initialisation_var = variableDeclarationList In dictionary = expressionSequence ')'
		body = statementList # Iteration_Statement_For_In
	| For '(' initialisation_var = variableDeclarationList Of array = expressionSequence ')' body =
		statementList # Iteration_Statement_For_Of;

continueStatement: Continue;
breakStatement: Break;
returnStatement:
	Return expression = expressionSequence # Return_Statement;

functionDeclaration:
	Function_ function_name = VariableName '(' args = formalParameterList? ')' body = functionBody #
		Function_Declaration;
formalParameterList:
	formalParameterArg (',' formalParameterArg)* (
		',' lastFormalParameterArg
	)?							# Formal_Parameter_List_With_Args
	| lastFormalParameterArg	# Formal_Parameter_Rest_Parameter;

formalParameterArg:
	name = VariableName ('=' default_value = singleExpression)? # Formal_Parameter_Arg;
lastFormalParameterArg:
	Ellipsis name = singleExpression # Last_Formal_Parameter_Arg;
functionBody: '{' statementList+ '}' # Function_Body;

classDeclaration:
	Class class_name = VariableName (
		Extends parent_class = singleExpression
	)? '{' class_content = classElementList '}' # Class_Declaration;
classElementList: classElement* # Class_Element_List;
classElement:
	isStatic = Static? method = methodDefinition							# Class_Element_Method_Definition
	| emptyStatement														# Class_Element_Empty_Statement
	| property_name = propertyName '=' property_value = singleExpression	#
		Class_Element_Property_Definition;

methodDefinition:
	method_name = propertyName '(' method_args = formalParameterList? ')' method_body = functionBody 
		# Method_Definition;

singleExpression:
	member = singleExpression '.' member_content = VariableName #
		Single_Expression_Member_Dot_Expression
	| New class_name = singleExpression new_arguments = arguments #
		Single_Expression_Instantiate_With_Args
	| New class_name = singleExpression # Single_Expression_Instantiate
	// | anonymousFunction
	| 'assert' function_arguments = arguments										# Single_Expression_Assert
	| function_name = singleExpression function_arguments = arguments				# Single_Expression_Call
	| Delete expression = singleExpression											# Single_Expression_Delete
	| Typeof expression = singleExpression											# Single_Expression_Typeof
	| expression = singleExpression '++'											# Single_Expression_Post_Increment
	| expression = singleExpression '--'											# Single_Expression_Post_Decrement
	| '++' expression = singleExpression											# Single_Expression_Pre_Increment
	| '--' expression = singleExpression											# Single_Expression_Pre_Decrement
	| '+' expression = singleExpression												# Single_Expression_Unary_Plus
	| '-' expression = singleExpression												# Single_Expression_Unary_Minus
	| '~' expression = singleExpression												# Single_Expression_Bit_Not
	| '!' expression = singleExpression												# Single_Expression_Not
	| <assoc = right> exp1 = singleExpression '**' exp2 = singleExpression			# Single_Expression_Power
	| exp1 = singleExpression operation = ('*' | '/' | '%') exp2 = singleExpression	#
		Single_Expression_Multiplicative
	| exp1 = singleExpression operation = ('+' | '-') exp2 = singleExpression #
		Single_Expression_Additive
	| exp1 = singleExpression operation = ('<<' | '>>' | '>>>') exp2 = singleExpression #
		Single_Expression_Bit_Shift
	| exp1 = singleExpression operation = (
		'<'
		| '>'
		| '<='
		| '>='
		| '=='
		| '!='
	) exp2 = singleExpression															# Single_Expression_Relational
	| exp1 = singleExpression Instanceof exp2 = singleExpression						# Single_Expression_Instance_of
	| exp1 = singleExpression In exp2 = singleExpression								# Single_Expression_In
	| exp1 = singleExpression '&' exp2 = singleExpression								# Single_Expression_Bit_And
	| exp1 = singleExpression '^' exp2 = singleExpression								# Single_Expression_Bit_Xor
	| exp1 = singleExpression '|' exp2 = singleExpression								# Single_Expression_Bit_Or
	| exp1 = singleExpression '&&' exp2 = singleExpression								# Single_Expression_Logical_And
	| exp1 = singleExpression '||' exp2 = singleExpression								# Single_Expression_Logical_Or
	| exp1 = singleExpression '?' exp2 = singleExpression ':' exp3 = singleExpression	#
		Single_Expression_Ternary
	| <assoc = right> exp1 = singleExpression '=' exp2 = singleExpression #
		Single_Expression_Assignment
	| <assoc = right> exp1 = singleExpression operator = assignmentOperator exp2 = singleExpression #
		Single_Expression_Assignment_Operator
	| Import '(' exp = singleExpression ')'	# Single_Expression_Import
	| Super constructor_args = arguments	# Single_Expression_Super_Constructor
	| Super									# Single_Expression_Super
	| VariableName							# Single_Expression_Variable
	| literal								# Single_Expression_Literal
	| arrayLiteral							# Single_Expression_Array_Literal
	| objectLiteral							# Single_Expression_Object_Literal
	| '(' expr = expressionSequence ')'		# Single_Expression_Parenthesis;

expressionSequence:
	singleExpression (',' singleExpression)* # Expression_Sequence;

assignmentOperator:
	'*='
	| '/='
	| '%='
	| '+='
	| '-='
	| '<<='
	| '>>='
	| '>>>='
	| '&='
	| '^='
	| '|='
	| '**=';

arguments:
	'(' (argument (',' argument)* ','?)? ')' # Arguments_Rule;

argument: (singleExpression) # Argument_Rule;

arrayLiteral: ('[' elementList ']') # Array_Literal;
elementList:
	','* arrayElement? (','+ arrayElement)* ','* # Element_List;
arrayElement: singleExpression # Array_Element;

objectLiteral:
	'{' (propertyAssignment (',' propertyAssignment)* ','?)? '}' # Object_Literal;
propertyAssignment:
	property_name = propertyName ':' property_value = singleExpression # Object_Property_Assignment;
propertyName:
	VariableName	# Propery_Name_Variable
	| StringLiteral	# Property_Name_String;

variableStatement: variableDeclarationList # Variable_Statement;
variableDeclarationList:
	var_modifier = variableModifier single_declaration = variableDeclaration (
		',' other_declarations = variableDeclaration
	)* # Variable_Declaration_List;
variableDeclaration:
	variable_name = VariableName (
		'=' variable_value = singleExpression
	)? # Variable_Declaration;

variableModifier: Let | Const | Var # Variable_Modifier;

literal:
	NullLiteral			# Literal_Null
	| BooleanLiteral	# Literal_Boolean
	| StringLiteral		# Literal_String
	| numericLiteral	# Literal_Numberic;

numericLiteral:
	DecimalLiteral			# Literal_Decimal
	| HexIntegerLiteral		# Literal_Hex_Integer
	| OctalIntegerLiteral	# Literal_Octal_Integer
	| OctalIntegerLiteral2	# Literal_Octal_Integer_2
	| BinaryIntegerLiteral	# Literal_Binary_Integer;

eos: SemiColon;

MultiLineComment: '/*' .*? '*/' -> channel(HIDDEN);
SingleLineComment:
	'//' ~[\r\n\u2028\u2029]* -> channel(HIDDEN);
WhiteSapce: [\n ] -> skip;
SemiColon: ';';
Ellipsis: '...';
Static: 'static';
Class: 'class';
Extends: 'extends';
Of: 'of';
For: 'for';
Do: 'do';
While: 'while';
Else: 'else';
If: 'if';
Function_: 'function';
Return: 'return';
Break: 'break';
Continue: 'continue';
Import: 'import';
Super: 'super';
In: 'in';
Instanceof: 'instanceof';
Typeof: 'typeof';
Delete: 'delete';
New: 'new';
Let: 'let';
Var: 'var';
Const: 'const';
NullLiteral: 'null';
BooleanLiteral: 'true' | 'false';

StringLiteral:
	'"' DoubleStringCharacter* '"'
	| '\'' SingleStringCharacter* '\'';

DecimalLiteral:
	'-'? DecimalIntegerLiteral '.' [0-9] [0-9_]* ExponentPart?
	| '-'? '.' [0-9] [0-9_]* ExponentPart?
	| '-'? DecimalIntegerLiteral ExponentPart?;
HexIntegerLiteral: '0' [xX] [0-9a-fA-F] HexDigit*;
OctalIntegerLiteral: '0' [0-7]+;
OctalIntegerLiteral2: '0' [oO] [0-7] [_0-7]*;
BinaryIntegerLiteral: '0' [bB] [01] [_01]*;

VariableName: [_a-zA-Z][_a-zA-Z0-9]*;

fragment DoubleStringCharacter: ~["\\\r\n] | '\\"';
fragment SingleStringCharacter: ~['\\\r\n] | '\\\'';

fragment HexDigit: [_0-9a-fA-F];
fragment DecimalIntegerLiteral: '0' | [1-9] [0-9_]*;
fragment ExponentPart: [eE] [+-]? [0-9_]+;
