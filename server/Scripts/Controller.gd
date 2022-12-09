extends Spatial

const Robot = preload("res://Scripts/Robot.gd")
const Server = preload("res://Scripts/Server.gd")

var server: Server
var selected_robot_socket_id = -1

func _ready():
	server = Server.new()
	server.connect("on_client_connected", self, "on_client_connected")
	server.connect("on_client_disconnected", self, "on_client_disconnected")

func move_selected_robot():
	if Input.is_action_just_pressed("forward"):
		server.robots[selected_robot_socket_id].move("forward")
	elif Input.is_action_just_pressed("back"):
		server.robots[selected_robot_socket_id].move("back")
	elif Input.is_action_just_pressed("left"):
		server.robots[selected_robot_socket_id].move("left")
	elif Input.is_action_just_pressed("right"):
		server.robots[selected_robot_socket_id].move("right")

func _process(delta):
	server.poll()
	if selected_robot_socket_id != -1:
		move_selected_robot()

func on_block_received(var block: int, var location: Vector3):
	$World.set_cell_item(location.x, location.y, location.z, block)

func on_client_connected(socket_id, robot):
	# Add the robot to the world and listen to its blocks
	robot.connect("found_block", self, "on_block_received")
	selected_robot_socket_id = socket_id

func on_client_disconnected(socket_id, robot):
	# Remove the robot from the world
	pass
