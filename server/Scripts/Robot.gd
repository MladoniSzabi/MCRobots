extends Node

const Orientation = preload("res://Scripts/Orientation.gd")

var id := 0
var position := Vector3()
var orientation := Orientation.ORIENTATION_NORTH

var socket: WebSocketPeer = null

var is_selected := false

signal found_block
signal robot_moved

func _init(var _socket: WebSocketPeer):
	socket = _socket

func _ready():
	set_process_input(true)
	pass

func _input(event):
	if is_selected:
		if event.is_action_pressed("forward"):
			move("forward")
		elif event.is_action_pressed("back"):
			move("back")
		elif event.is_action_pressed("left"):
			move("left")
		elif event.is_action_pressed("right"):
			move("right")

func select(new_is_selected := true):
	print("Selecting")
	is_selected = new_is_selected

func save(file_name: String):
	var file = File.new()
	file.open(file_name, File.WRITE)
	file.store_var(position)
	file.store_var(orientation)
	file.close()

func load(file_name: String):
	var file = File.new()
	if not file.file_exists(file_name):
		print("Robot save file ", file_name, " does not exist")
		return
	file.open(file_name, File.READ)
	position = file.get_var()
	orientation = file.get_var()
	file.close()

func receive_message(var payload):
	# Decode the message we got over websocket
	var message = Message.decode(payload)
	if message.type == "init":
		self.id = message.id
		SaveManager.load_robot(self)
		socket.put_packet(Message.encode("init", {
			"position": position,
			"orientation": orientation,
			"mode": "follow"
		}))
	elif message.type == "position":
		emit_signal("robot_moved", self.position, message.position, message.orientation)
		self.position = message.position
		self.orientation = message.orientation
	elif message.type == "block":
		# Tell the world about this block so it can be rendered
		emit_signal("found_block", message.block, message.position)

func get_socket_id() -> int:
	return socket.get_instance_id()

func follow_path(var path: PoolVector3Array):
	socket.put_packet(Message.encode("follow", path))

func move(var direction: String):
	socket.put_packet(Message.encode("move", direction))
