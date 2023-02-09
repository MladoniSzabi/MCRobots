extends Camera

var previous_robot_transform = [Vector3(), Vector3()]
const ZOOM_STEP = 0.8
const ZOOM_STEP_FINE = 0.1
const ROTATION_SPEED = 0.05

var original_mouse_pos = null
var original_transformation : Transform = Transform()

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
	if event.is_action_pressed("camera_zoom_in"):
		var step = ZOOM_STEP_FINE if Input.is_action_pressed("finer_control") else ZOOM_STEP
		var forward = global_transform.basis.z
		var zoom = global_transform.origin.move_toward(global_translation - forward, step)
		global_transform.origin = zoom
	elif event.is_action_pressed("camera_zoom_out"):
		var step = ZOOM_STEP_FINE if Input.is_action_pressed("finer_control") else ZOOM_STEP
		var forward = global_transform.basis.z
		var zoom = global_transform.origin.move_toward(global_translation + forward, step)
		global_transform.origin = zoom
	elif event.is_action_pressed("rotate_camera"):
		var mouse_pos = get_viewport().get_mouse_position()
		original_mouse_pos = mouse_pos
		original_transformation = global_transform
	if event is InputEventMouseMotion:
		if Input.is_action_pressed("rotate_camera"):
			var ie = event as InputEventMouseMotion
			var mouse_pos_diff = ie.position - original_mouse_pos
			var dir_to_look_at = original_transformation.basis.y * -mouse_pos_diff.y * ROTATION_SPEED + \
				original_transformation.basis.x * mouse_pos_diff.x * ROTATION_SPEED - original_transformation.basis.z * 10
			look_at(original_transformation.origin + dir_to_look_at, original_transformation.basis.y)
