extends Spatial

const Robot = preload("res://Scripts/Robot.gd")
const Server = preload("res://Scripts/Server.gd")

var server: Server
var selected_robot_id := -1

func _ready():
	get_tree().set_auto_accept_quit(false)
	SaveManager.load_world($World)
	server = Server.new()
	server.connect("on_client_connected", self, "on_client_connected")
	server.connect("on_client_disconnected", self, "on_client_disconnected")
	$World/BulidingPlacer.connect("construct_building", self, "on_bulding_constructed")
	add_child(server)

func on_bulding_constructed(building_cells, building):
	var builder_robot = null
	var robot_path = []
	var robot_path_length = 99999
	for robot in server.robots.values():
		var path = $World.find_path($World.world_to_map(building.translation), robot.position)
		if path.size() < robot_path_length:
			robot_path = path
			robot_path_length = path.size()
			builder_robot = robot
	
	if builder_robot:
		print(robot_path)
		builder_robot.follow_path(robot_path)
	else:
		print("No robot has a clear path to the building")

func select_robot(robot_id: int):
	if selected_robot_id != -1:
		server.get_robot(selected_robot_id).select(false)
	
	var robot = server.get_robot(robot_id)
	robot.select()
	selected_robot_id = robot_id
	$World/Camera.follow_robot(server.get_robot(robot_id))

func _process(delta: float):
	server.poll()

func _notification(what: int):
	if what == MainLoop.NOTIFICATION_WM_QUIT_REQUEST:
		SaveManager.save_world($World)
		for robotid in server.robots:
			SaveManager.save_robot(server.robots[robotid])
		get_tree().quit()

func on_block_received(var block: int, var location: Vector3):
	$World.set_tile(location, block)

func on_robot_moved(var old_position: Vector3, var new_position: Vector3, var new_orientation: Vector3):
	$World.set_tile(old_position, $World.INVALID_CELL_ITEM)
	$World.set_tile(new_position, $World.ROBOT_TILE, new_orientation)

func on_client_connected(socket_id: int, robot: Robot):
	# Add the robot to the world and listen to its blocks
	robot.connect("found_block", self, "on_block_received")
	robot.connect("robot_moved", self, "on_robot_moved")
	#select_robot(socket_id)

func on_client_disconnected(socket_id: int, robot: Robot):
	# Remove the robot from the world
	$World.set_tile(robot.position, $World.INVALID_CELL_ITEM)
	SaveManager.save_robot(robot)
