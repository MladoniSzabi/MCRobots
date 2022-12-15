extends Node

const Message = preload("res://Scripts/Message.gd")

const ORIENTATION_NORTH = Vector3(1,0,0)
const ORIENTATION_SOUTH = Vector3(-1,0,0)
const ORIENTATION_WEST = Vector3(0,0,-1)
const ORIENTATION_EAST = Vector3(0,0,1)
const ORIENTATION_UP = Vector3(0,1,0)
const ORIENTATION_DOWN = Vector3(0,-1,0)

const ORIENTATIONS = [ORIENTATION_NORTH, ORIENTATION_EAST, ORIENTATION_SOUTH, ORIENTATION_WEST]

var position := Vector3()
var orientation := ORIENTATION_NORTH

var socket: WebSocketPeer = null

signal found_block

func _init(var _socket: WebSocketPeer):
	socket = _socket

func _ready():
	pass

func broadcast_surrounding(message):
	# Tell the world about the blocks we have seen
	if message.blocks[0]:
		emit_signal("found_block", message.blocks[0], position + orientation + ORIENTATION_UP)
	
	if message.blocks[1]:
		emit_signal("found_block", message.blocks[1], position + orientation)
	
	if message.blocks[2]:
		emit_signal("found_block", message.blocks[2], position + orientation + ORIENTATION_DOWN)

func send_init_command(message):
	# TODO: This is temporary for testing. Fill this in properly.
	socket.put_packet("i 0 0 0 north rc".to_utf8())

func receive_message(var payload):
	# Decode the message we got over websocket
	var message = Message.decode(payload)
	if message.type == "init":
		send_init_command(message)
	elif message.type == "surrounding":
		broadcast_surrounding(message)

func get_socket_id():
	return socket.get_instance_id()

func move(var direction):
	if direction == "forward":
		position += orientation
	elif direction == "back":
		position -= orientation
	elif direction == "right":
		var new_orientation_index = (ORIENTATIONS.find(orientation) + 1) % ORIENTATIONS.size()
		orientation = ORIENTATIONS[new_orientation_index]
	elif direction == "left":
		var new_orientation_index = (ORIENTATIONS.find(orientation) - 1) % ORIENTATIONS.size()
		orientation = ORIENTATIONS[new_orientation_index]
	else:
		print("Cannot move in direction ", direction)
	socket.put_packet(Message.encode("move", direction))