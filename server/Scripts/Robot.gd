extends Node

const Orientation = preload("res://Scripts/Orientation.gd")

var id := 0
var position := Vector3()
var orientation := Orientation.ORIENTATION_NORTH

var socket: WebSocketPeer = null

var is_selected := false

var command_queue := []

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

func handle_receive_init(message):
	self.id = message.id
	SaveManager.load_robot(self)
	socket.put_packet(Message.encode("init", {
		"position": position,
		"orientation": orientation,
		"mode": "follow"
	}))

func handle_receive_position(message):
	emit_signal("robot_moved", self.position, message.position, message.orientation)
	self.position = message.position
	self.orientation = message.orientation

func handle_receive_block(message):
	# Tell the world about this block so it can be rendered
	emit_signal("found_block", message.block, message.position)

func handle_receive_success(message):
	command_queue.pop_front()
	send_next_command()

func handle_receive_failure(message):
	var command = command_queue.front()
	var command_type = command[0]
	if command_type == "follow":
		var path = Array(command[1])
		command_queue[0] = ["follow", get_parent().find_path(path.front(), position)]
	elif command_type == "move":
		command_queue.pop_front()
		return
	else:
		command_queue.pop_front()
	
	send_next_command()
	

func receive_message(var payload):
	# Decode the message we got over websocket
	var message = Message.decode(payload)
	if message.type == "init":
		handle_receive_init(message)
	elif message.type == "position":
		handle_receive_position(message)
	elif message.type == "block":
		handle_receive_block(message)
	elif message.type == "success":
		handle_receive_success(message)
	elif message.type == "failure":
		handle_receive_failure(message)

func get_socket_id() -> int:
	return socket.get_instance_id()

func send_next_command():
	if command_queue.size() > 0:
		var command = command_queue.front()
		socket.put_packet(Message.encode(command[0], command[1]))

func follow_path(var path: PoolVector3Array):
	command_queue.append(["follow", path])
	send_next_command()

func move(var direction: String):
	command_queue.append(["move", direction])
	send_next_command()

func build(var blocks):
	command_queue.append(["build", blocks])
