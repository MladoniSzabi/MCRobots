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

static func decodePositionCommand(command):
	var position = Vector3(int(command[1]), int(command[2]), int(command[3]))
	var orientation = stringToOrientation(command[4])
	return { "type":"position", "position": position, "orientation": orientation }

static func decodeBlockCommand(command):
	var position = Vector3(int(command[1]), int(command[2]), int(command[3]))
	var block = BLOCK_NAME_TO_ID["unknown_block"]
	if command[4] == "none":
		block = null
	elif command[4] in BLOCK_NAME_TO_ID:
		block = BLOCK_NAME_TO_ID[command[4]]
	return { "type": "block", "position": position, "block": block }

static func decode(message):
	if message.get_string_from_utf8() == "init":
		return { "type": "init" }
	
	var encoded_data = message.get_string_from_utf8().split(", ")
	if encoded_data[0] == "position":
		return decodePositionCommand(encoded_data)
	elif encoded_data[0] == "block":
		return decodeBlockCommand(encoded_data)
	else:
		print("Unknown command " + encoded_data[0])
		return {}
