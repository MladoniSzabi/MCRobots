extends Node

# Since the encoding of the messages will probbaly change in the future,
# This class will help with encoding and decoding them
# Also helps with satisfying the single responsability principle

const BLOCK_NAME_TO_ID = {
	"unknown_block": 0,
	"minecraft:stone": 1,
	"minecraft:diorite": 2,
	"minecraft:deepslate": 3,
}

static func encodeMoveCommand(params):
	if params == "forward":
		return "w".to_utf8()
	elif params == "back":
		return "s".to_utf8()
	elif params == "left":
		return "a".to_utf8()
	elif params == "right":
		return "d".to_utf8()

static func encode(command, params):
	if command == "move":
		return encodeMoveCommand(params)
	else:
		print("Command not understood: ", command)
		return PoolByteArray()

static func decode(message):
	if message.get_string_from_utf8() == "init":
		return { "type": "init" }
	
	var encoded_blocks = message.get_string_from_utf8().split(" ")
	var blocks = []
	for i in range(encoded_blocks.size()):
		if encoded_blocks[i] == "none":
			blocks.append(null)
		elif encoded_blocks[i] in BLOCK_NAME_TO_ID:
			blocks.append(BLOCK_NAME_TO_ID[encoded_blocks[i]])
		else:
			blocks.append(BLOCK_NAME_TO_ID["unknown_block"])
	print(blocks)
	return { "type": "surrounding", "blocks": blocks }
