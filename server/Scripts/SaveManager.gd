extends Node

const WORLD_SAVE_FILE = ["user://saves/", "world.dat" ]
const ROBOT_SAVE_DIR = "user://saves/robots/"

static func save_world(world):
	var dir = Directory.new()
	if not dir.file_exists(WORLD_SAVE_FILE[0] + WORLD_SAVE_FILE[1]):
		dir.make_dir_recursive(WORLD_SAVE_FILE[0])
	
	world.save(WORLD_SAVE_FILE[0] + WORLD_SAVE_FILE[1])

static func load_world(world):
	var dir = Directory.new()
	if dir.file_exists(WORLD_SAVE_FILE[0] + WORLD_SAVE_FILE[1]):
		print("Loading world")
		world.load(WORLD_SAVE_FILE[0] + WORLD_SAVE_FILE[1])

static func save_robot(robot):
	if robot.id == -1:
		print("Robot does not have an id. (Possibly not loaded)")
		return
	
	var dir = Directory.new()
	dir.make_dir_recursive(ROBOT_SAVE_DIR)
	
	robot.save(ROBOT_SAVE_DIR + str(robot.id) + ".dat")

static func load_robot(robot):
	if robot.id == -1:
		print("Robot does not have an id.")
		return
	robot.load(ROBOT_SAVE_DIR + str(robot.id) + ".dat")
