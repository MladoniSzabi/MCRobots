extends Node

const Message = preload("res://Scripts/Message.gd")
const Orientation = preload("res://Scripts/Orientation.gd")

var position := Vector3()
var orientation := Orientation.ORIENTATION_NORTH

var socket: WebSocketPeer = null

signal found_block

func _init(var _socket: WebSocketPeer):
	socket = _socket

func _ready():
	pass

func broadcast_surrounding(message):
	# Tell the world about the blocks we have seen
	if message.blocks[0]:
		emit_signal("found_block", message.blocks[0], position + orientation + Orientation.ORIENTATION_UP)
	
	if message.blocks[1]:
		emit_signal("found_block", message.blocks[1], position + orientation)
	
	if message.blocks[2]:
		emit_signal("found_block", message.blocks[2], position + orientation + Orientation.ORIENTATION_DOWN)

func send_init_command(message):
	# TODO: This is temporary for testing. Fill this in properly.
	socket.put_packet("i 0 0 0 north rc".to_utf8())

func receive_message(var payload):
	# Decode the message we got over websocket
	var message = Message.decode(payload)
	if message.type == "init":
		send_init_command(message)
	elif message.type == "surrounding":
		self.position = message.position
		self.orientation = message.orientation
		print(self.position, self.orientation)
		broadcast_surrounding(message)

func get_socket_id():
	return socket.get_instance_id()

func move(var direction):
	socket.put_packet(Message.encode("move", direction))
