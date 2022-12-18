extends Node

const Orientation = preload("res://Scripts/Orientation.gd")

# Since the encoding of the messages will probbaly change in the future,
# This class will help with encoding and decoding them
# Also helps with satisfying the single responsability principle

const BLOCK_NAME_TO_ID = {
	"unknown_block": 0,
	"minecraft:stone": 1,
	"minecraft:diorite": 2,
	"minecraft:deepslate": 3,
}

static func stringToOrientation(string):
	if string == "north":
		return Orientation.ORIENTATION_NORTH
	elif string == "south":
		return Orientation.ORIENTATION_SOUTH
	elif string == "east":
		return Orientation.ORIENTATION_EAST
	elif string == "west":
		return Orientation.ORIENTATION_WEST
	
	return Vector3(0,0,0)

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
	
	var encoded_data = message.get_string_from_utf8().split(", ")
	var position = Vector3(int(encoded_data[0]), int(encoded_data[1]), int(encoded_data[2]))
	var orientation = stringToOrientation(encoded_data[3])
	var blocks = []
	for i in range(4, encoded_data.size()):
		if encoded_data[i] == "none":
			blocks.append(null)
		elif encoded_data[i] in BLOCK_NAME_TO_ID:
			blocks.append(BLOCK_NAME_TO_ID[encoded_data[i]])
		else:
			blocks.append(BLOCK_NAME_TO_ID["unknown_block"])
	print(blocks)
	return { "type": "surrounding", "position": position, "orientation": orientation, "blocks": blocks }
