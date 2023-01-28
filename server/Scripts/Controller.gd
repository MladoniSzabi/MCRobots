extends Spatial

const Robot = preload("res://Scripts/Robot.gd")
const Server = preload("res://Scripts/Server.gd")
const SaveManager = preload("res://Scripts/SaveManager.gd")

var server: Server
var selected_robot_socket_id = -1

func _ready():
	get_tree().set_auto_accept_quit(false)
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
	pass

func _notification(what):
	if what == MainLoop.NOTIFICATION_WM_QUIT_REQUEST:
		SaveManager.save_world($World)
		for robotid in server.robots:
			server.robots[robotid].save()
		get_tree().quit()

func on_block_received(var block: int, var location: Vector3):
	$World.set_cell_item(location.x, location.y, location.z, block)

func on_robot_moved(var old_position: Vector3, var new_position: Vector3):
	$World.set_cell_item(old_position.x, old_position.y, old_position.z, $World.INVALID_CELL_ITEM)
	$World.set_cell_item(new_position.x, new_position.y, new_position.z, $World.ROBOT_TILE)

func on_client_connected(socket_id, robot):
	# Add the robot to the world and listen to its blocks
	robot.connect("found_block", self, "on_block_received")
	robot.connect("robot_moved", self, "on_robot_moved")
	selected_robot_socket_id = socket_id

func on_client_disconnected(socket_id, robot):
	# Remove the robot from the world
	$World.set_cell_item(robot.position.x, robot.position.y, robot.position.z, $World.INVALID_CELL_ITEM)
	robot.save()
	pass
