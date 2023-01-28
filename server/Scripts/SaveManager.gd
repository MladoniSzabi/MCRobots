extends Node

const WORLD_SAVE_FILE = "user://mcrobot/world.dat"
const ROBOT_SAVE_DIR = "user://mcrobot/robots/"

static func save_world(world):
	world.save(WORLD_SAVE_FILE)

static func load_world(world):
	world.load(WORLD_SAVE_FILE)

static func save_robot(robot):
	if robot.id == -1:
		print("Robot does not have an id. (Possibly not loaded)")
		return
	robot.save(ROBOT_SAVE_DIR + str(robot.id) + ".dat")

static func load_robot(robot):
	if robot.id == -1:
		print("Robot does not have an id.")
		return
	robot.load(ROBOT_SAVE_DIR + str(robot.id) + ".dat")
