extends Camera

var previous_robot_transform = [Vector3(), Vector3()]

func _ready():
	pass

func follow_robot(robot, world: GridMap):
	if self.previous_robot_transform[0] == robot.position and self.previous_robot_transform[1] == robot.orientation:
		return
	
	previous_robot_transform[0] = robot.position
	previous_robot_transform[1] = robot.orientation
	
	translation = world.to_global(robot.position + robot.orientation*0.1 + Vector3(0.5,0.6,0.5))
	look_at(world.to_global(robot.position + Vector3(0.5,0.5,0.5) + robot.orientation), Vector3.UP)

func _input(event):
	# TODO: Use the input map instead
	if event is InputEventMouseButton:
		if event.button_index == BUTTON_WHEEL_UP:
			fov += 1
		elif event.button_index == BUTTON_WHEEL_DOWN:
			fov -= 1
	
	# TODO: use this instead
	#var step = 2
	#var camera_position = camera.global_transform.origin
	#var target_position = target.get_global_transform().origin
	#var zoom = camera_position.move_toward(target_position, step)
	#camera.global_transform.origin = zoom
