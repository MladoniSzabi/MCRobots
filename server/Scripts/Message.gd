extends Node

const Orientation = preload("res://Scripts/Orientation.gd")

# Since the encoding of the messages will probbaly change in the future,
# This class will help with encoding and decoding them
# Also helps with satisfying the single responsability principle

const BLOCK_NAME_TO_ID = {
	"unknown_block": 14,
	"minecraft:stone": 0,
	"minecraft:cobblestone": 1,
	"minecraft:diorite": 4,
	"minecraft:andesite": 3,
	"minecraft:granite": 5,
	"minecraft:dirt": 16,
	"minecraft:coal_ore": 2,
	"minecraft:iron_ore": 8,
	"minecraft:gold_ore": 9,
	"minecraft:lapis_ore": 10,
	"minecraft:redstone_ore": 11,
	"minecraft:emeral_ore": 7,
	"minecraft:diamond_ore": 6,
	"minecraft:oak_log": 17,
	"minecraft:oak_plank": 18,
	"minecraft:oak_sapling": 19,
}

var ID_TO_BLOCK_NAME = {}

const STRING_TO_ORIENTATION = {
	"north": Orientation.ORIENTATION_NORTH,
	"south": Orientation.ORIENTATION_SOUTH,
	"east": Orientation.ORIENTATION_EAST,
	"west": Orientation.ORIENTATION_WEST
}

const ORIENTATION_TO_STRING = {
	Orientation.ORIENTATION_NORTH: "north",
	Orientation.ORIENTATION_SOUTH: "south",
	Orientation.ORIENTATION_EAST: "east",
	Orientation.ORIENTATION_WEST: "west"
}

var unidentified_blocks = []

func _init():
	for block in BLOCK_NAME_TO_ID:
		ID_TO_BLOCK_NAME[BLOCK_NAME_TO_ID[block]] = block

func encode_position(pos):
	return str(-pos.x) + " " + str(pos.y) + " " + str(pos.z)

func encode_move_command(params):
	if params == "forward":
		return "rw".to_utf8()
	elif params == "back":
		return "rs".to_utf8()
	elif params == "left":
		return "ra".to_utf8()
	elif params == "right":
		return "rd".to_utf8()

func encode_init_command(params):
	var retval =  "i " + \
		encode_position(params.position) + " " + \
		ORIENTATION_TO_STRING[params.orientation] + " "+ \
		params.mode
	return retval.to_utf8()

func encode_follow_command(path: PoolVector3Array):
	var retval = "f"
	for pos in path:
		retval += " " + encode_position(pos)
	return retval.to_utf8()

func encode_dig_command(rows: int, lines: int, depth: int):
	var retval = "d " + String(rows) + " " + String(lines) + " " + String(depth)
	return retval.to_utf8()

func encode_build_command(cells: Array):
	var retval = "b"
	for c in cells:
		retval += ", " + String(-c[0]) + ", " + String(c[1]) + ", " + String(c[2]) + ", " + ID_TO_BLOCK_NAME[c[3]]
	
	return retval.to_utf8()

func encode(command, params):
	if command == "init":
		return encode_init_command(params)
	if command == "move":
		return encode_move_command(params)
	if command == "follow":
		return encode_follow_command(params)
	if command == "build":
		return encode_build_command(params)
	print("Command not understood: ", command)
	return PoolByteArray()

func decode_position_command(command):
	var position = Vector3(-int(command[1]), int(command[2]), int(command[3]))
	var orientation = STRING_TO_ORIENTATION.get(command[4], Vector3())
	return { "type":"position", "position": position, "orientation": orientation }

func decode_block_command(command):
	var position = Vector3(-int(command[1]), int(command[2]), int(command[3]))
	var block = BLOCK_NAME_TO_ID["unknown_block"]
	if command[4] == "none":
		block = GridMap.INVALID_CELL_ITEM
	elif command[4] in BLOCK_NAME_TO_ID:
		block = BLOCK_NAME_TO_ID[command[4]]
	else:
		if not command[4] in  unidentified_blocks:
			print("Block of type ", command[4], " does not exist")
			unidentified_blocks.append(command[4])
	return { "type": "block", "position": position, "block": block }

func decode_init_command(command):
	return { "type": "init", "id": int(command[1])}

func decode(message):
	var encoded_data = message.get_string_from_utf8().split(", ")
	if encoded_data[0] == "init":
		return decode_init_command(encoded_data)
	elif encoded_data[0] == "position":
		return decode_position_command(encoded_data)
	elif encoded_data[0] == "block":
		return decode_block_command(encoded_data)
	elif encoded_data[0] == "success":
		return {"type": "success"}
	elif encoded_data[0] == "failure":
		return {"type": "failure"}
	else:
		print("Unknown command " + encoded_data[0])
		return {}
