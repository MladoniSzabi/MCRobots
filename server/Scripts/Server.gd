extends Node
const Robot = preload("res://Scripts/Robot.gd")

var server: WebSocketServer = WebSocketServer.new()
var robots := {}

signal on_client_connected
signal on_client_disconnected

func _init():
	server.connect("client_connected", self, "on_client_connected")
	server.connect("data_received", self, "on_data_received")
	server.connect("client_disconnected", self, "on_client_disconnected")
	var err = server.listen(9999)
	if err != OK:
		print("Unable to start server")
		set_process(false)

func get_robot(id: int) -> Robot:
	return robots[id]

func poll():
	server.poll()

func on_data_received(var id: int):
	# Send the data to the robot it came from for processing
	var payload = server.get_peer(id).get_packet()
	robots[id].receive_message(payload)

func on_client_disconnected(var id: int, var was_clean_close: bool):
	# Remove the robot from the dictionary and tell the world to delete it
	emit_signal("on_client_disconnected", id, robots[id])
	robots.erase(id)
	print("Client disconnected")

func on_client_connected(var id: int, var protocol: String):
	# Create robot class, add it to the dictionary and tell the world to add it visually
	var robot = Robot.new(server.get_peer(id))
	robots[id] = robot
	emit_signal("on_client_connected", id, robot)
