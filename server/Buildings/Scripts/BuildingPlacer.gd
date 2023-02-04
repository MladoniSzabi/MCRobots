extends Spatial

const Building = preload("res://Buildings/Building.tscn")

var placing_bulding: GridMap = null
var raylength = 4444

func _input(event : InputEvent):
	if event is InputEventKey:
		var ie = event as InputEventKey
		if ie.pressed and ie.scancode == KEY_T:
			placing_bulding = Building.instance()
			add_child(placing_bulding)
		
	elif event is InputEventMouseMotion:
		if placing_bulding:
			var ie = event as InputEventMouseMotion
			var mouse_pos = get_viewport().get_mouse_position()
			var source = get_viewport().get_camera().project_ray_origin(mouse_pos)
			var destination = source + get_viewport().get_camera().project_ray_normal(mouse_pos) * raylength
			var space_state = get_world().direct_space_state
			var result = space_state.intersect_ray(source, destination)
			if result:
				var resultPos = Vector3(result.position.x, result.position.y, result.position.z)
				resultPos.y += (destination - source).normalized().y * 0.5
				var parent = get_parent() as GridMap
				var pos_in_grid = parent.world_to_map(resultPos) - Vector3(1,0,1)
				placing_bulding.translation = parent.map_to_world(pos_in_grid.x, pos_in_grid.y, pos_in_grid.z) + parent.cell_size/2
