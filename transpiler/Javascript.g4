grammar Javascript;

program: statementList+ # Program_Start;

statementList:
	block				# Statement_List_Block
	| variableStatement	# Statement_List_Variable_Statement
	| emptyStatement	# Statement_List_Empty_Statement;

block: '{' statementList+ '}' # Block_Statement_List;
emptyStatement: SemiColon # Empty_Statement;

singleExpression:
	value = literal			# Single_Expression_Literal
	| value = arrayLiteral	# Single_Expression_Array_Literal
	| value = objectLiteral	# Single_Expression_Object_Literal;

arrayLiteral: ('[' element_list = elementList ']') # Array_Literal;
elementList:
	','* arrayElement? (','+ arrayElement)* ','* # Element_List;
arrayElement: singleExpression # Array_Element;

objectLiteral:
	property_name = propertyName ':' property_value = singleExpression # Object_Literal;
propertyName: VariableName | StringLiteral # Property_Name;

variableStatement:
	variableDeclarationList eos # Variable_Statement;
variableDeclarationList:
	var_modifier = variableModifier single_declaration = variableDeclaration (
		',' other_declarations = variableDeclaration
	)* # Variable_Declaration_List;
variableDeclaration:
	VariableName ('=' singleExpression)? # Variable_Declaration;

variableModifier: Let | Const | Var # Variable_Modifier;

literal:
	NullLiteral			# Literal_Null
	| BooleanLiteral	# Literal_Boolean
	| StringLiteral		# Literal_String
	| numericLiteral	# LiteralNumberic;

numericLiteral:
	DecimalLiteral			# Literal_Decimal
	| HexIntegerLiteral		# Literal_Hex_Integer
	| OctalIntegerLiteral	# Literal_Octal_Integer
	| OctalIntegerLiteral2	# Literal_Octal_Integer_2
	| BinaryIntegerLiteral	# Literal_Binary_Integer;

eos: SemiColon;

WhiteSapce: [\n ] -> skip;
SemiColon: ';';
Let: 'let';
Var: 'var';
Const: 'const';
NullLiteral: 'null';
BooleanLiteral: 'true' | 'false';

StringLiteral:
	'"' DoubleStringCharacter* '"'
	| '\'' SingleStringCharacter* '\'';

DecimalLiteral:
	DecimalIntegerLiteral '.' [0-9] [0-9_]* ExponentPart?
	| '.' [0-9] [0-9_]* ExponentPart?
	| DecimalIntegerLiteral ExponentPart?;
HexIntegerLiteral: '0' [xX] [0-9a-fA-F] HexDigit*;
OctalIntegerLiteral: '0' [0-7]+;
OctalIntegerLiteral2: '0' [oO] [0-7] [_0-7]*;
BinaryIntegerLiteral: '0' [bB] [01] [_01]*;

VariableName: [_a-zA-Z][_a-zA-Z\-0-9]*;

fragment DoubleStringCharacter: ~["\\\r\n] | '\\"';
fragment SingleStringCharacter: ~['\\\r\n] | '\\\'';

fragment HexDigit: [_0-9a-fA-F];
fragment DecimalIntegerLiteral: '0' | [1-9] [0-9_]*;
fragment ExponentPart: [eE] [+-]? [0-9_]+;
