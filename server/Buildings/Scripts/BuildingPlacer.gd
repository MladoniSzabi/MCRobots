extends Spatial

const Building = preload("res://Buildings/Building.tscn")

var placing_bulding: GridMap = null
var raylength = 4444

signal construct_building

func plan_building(bulding):
	placing_bulding = Building.instance()
	add_child(placing_bulding)

func get_pos_in_grid_of_building():
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
		return pos_in_grid
	return null

func _input(event : InputEvent):
	if event is InputEventKey:
		var ie = event as InputEventKey
		if ie.pressed and ie.scancode == KEY_T:
			plan_building(Building)
		
	elif event is InputEventMouseMotion:
		if placing_bulding:
			var ie = event as InputEventMouseMotion
			var pos_in_grid = get_pos_in_grid_of_building()
			if pos_in_grid:
				var parent = get_parent() as GridMap
				placing_bulding.translation = parent.map_to_world(pos_in_grid.x, pos_in_grid.y, pos_in_grid.z) + parent.cell_size/2
	
	elif event is InputEventMouseButton:
		if placing_bulding:
			var ie = event as InputEventMouseButton
			var parent = get_parent() as GridMap
			var pos_in_grid = parent.world_to_map(placing_bulding.translation)
			var cells_to_construct = []
			for cells in placing_bulding.get_used_cells():
				var cell_type = placing_bulding.get_cell_item(cells[0], cells[1], cells[2])
				cells_to_construct.push_back([pos_in_grid.x + cells[0], pos_in_grid.y + cells[1], pos_in_grid.z + cells[2], cell_type])
			
			emit_signal("construct_building", cells_to_construct, placing_bulding)
			placing_bulding = null
