extends GridMap

const Orientation = preload("res://Scripts/Orientation.gd")

const ROBOT_TILE = 15

const ORIENTATION_TO_ORTHOGONAL_INDEX = {
	Orientation.ORIENTATION_NORTH: 16,
	Orientation.ORIENTATION_SOUTH: 22,
	Orientation.ORIENTATION_WEST: 0,
	Orientation.ORIENTATION_EAST: 10,
	Orientation.ORIENTATION_UP: 1,
	Orientation.ORIENTATION_DOWN: 3,
}

var bounds = {
	"top_right": Vector3(),
	"bottom_left": Vector3()
}
var astar = AStar.new()

func grid_coord_to_astar_id(vec3):
	var xsize = bounds.top_right.x - bounds.bottom_left.x + 1
	var ysize = bounds.top_right.y - bounds.bottom_left.y + 1
	
	var retval = (vec3.z - bounds.bottom_left.z) * xsize * ysize
	retval += (vec3.y - bounds.bottom_left.y) * xsize
	retval += (vec3.x - bounds.bottom_left.x)
	
	return retval

func is_in_bounds(vec3):
	if vec3.x >= bounds.bottom_left.x and vec3.x <= bounds.top_right.x:
		if vec3.y >= bounds.bottom_left.y and vec3.y <= bounds.top_right.y:
			if vec3.z >= bounds.bottom_left.z and vec3.z <= bounds.top_right.z:
				return true
	
	return false

func setup_astar():
	
	print(bounds)
	# The bounds have changed so our ids are not valid anymore
	# Delete all nodes and set up again
	astar.clear()
	astar.reserve_space(
		( -bounds.bottom_left.x + bounds.top_right.x + 1) * 
		( -bounds.bottom_left.y + bounds.top_right.y + 1) * 
		( -bounds.bottom_left.z + bounds.top_right.z + 1)
	)
	
	# Add nodes
	for x in range(bounds.bottom_left.x, bounds.top_right.x + 1):
		for y in range(bounds.bottom_left.y, bounds.top_right.y + 1):
			for z in range(bounds.bottom_left.z, bounds.top_right.z + 1):
				astar.add_point(grid_coord_to_astar_id(Vector3(x,y,z)), Vector3(x,y,z))
	
	# Add connections
	for x in range(bounds.bottom_left.x, bounds.top_right.x  + 1):
		for y in range(bounds.bottom_left.y, bounds.top_right.y + 1):
			for z in range(bounds.bottom_left.z, bounds.top_right.z + 1):
				if get_cell_item(x,y,z) == INVALID_CELL_ITEM or get_cell_item(x,y,z) == ROBOT_TILE:
					var curr_pos = Vector3(x,y,z)
					for orientation in Orientation.ORIENTATIONS_ALL:
						var neighbour = curr_pos + orientation
						if is_in_bounds(neighbour) and get_cell_item(neighbour.x, neighbour.y, neighbour.z) == INVALID_CELL_ITEM or get_cell_item(neighbour.x, neighbour.y, neighbour.z) == ROBOT_TILE:
							astar.connect_points(
								grid_coord_to_astar_id(curr_pos),
								grid_coord_to_astar_id(neighbour)
							)

func should_update_bounds(vec):
	var need_to_update_bounds = false
	if vec.x > bounds.top_right.x:
		bounds.top_right.x = vec.x
		need_to_update_bounds = true
	elif vec.x < bounds.bottom_left.x:
		bounds.bottom_left.x = vec.x
		need_to_update_bounds = true
	
	if vec.y > bounds.top_right.y:
		bounds.top_right.y = vec.y
		need_to_update_bounds = true
	elif vec.y < bounds.bottom_left.y:
		bounds.bottom_left.y = vec.y
		need_to_update_bounds = true
	
	if vec.z > bounds.top_right.z:
		bounds.top_right.z = vec.z
		need_to_update_bounds = true
	elif vec.z < bounds.bottom_left.z:
		bounds.bottom_left.z = vec.z
		need_to_update_bounds = true
	
	return need_to_update_bounds

func find_path(var from: Vector3, var to: Vector3):
	print(from)
	print(to)
	return astar.get_point_path(grid_coord_to_astar_id(from), grid_coord_to_astar_id(to))

func save(file_name):
	var file = File.new()
	if file.open(file_name, File.WRITE) != OK:
		print("There was an error opening the file")
		return
	
	for pos in get_used_cells():
		file.store_var({
			"x": pos.x,
			"y": pos.y,
			"z": pos.z,
			"tile": get_cell_item(pos.x, pos.y, pos.z),
			"orientation": get_cell_item_orientation(pos.x, pos.y, pos.z)
		})
	file.close()

func load(file_name):
	clear()
	var file = File.new()
	file.open(file_name, File.READ)
	while not file.eof_reached():
		var cell_data = file.get_var()
		if cell_data == null:
			continue
		set_cell_item(cell_data.x, cell_data.y, cell_data.z, cell_data.tile, cell_data.orientation)
		should_update_bounds(cell_data)
	file.close()
	
	setup_astar()

func set_tile(position, type, orientation = Vector3()):
	var old_type = get_cell_item(position.x, position.y, position.z)
	set_cell_item(position.x, position.y, position.z, type, ORIENTATION_TO_ORTHOGONAL_INDEX.get(orientation, 0))
	if should_update_bounds(position):
		setup_astar()
	else:
		if (old_type != INVALID_CELL_ITEM and old_type != ROBOT_TILE) and \
			(type == INVALID_CELL_ITEM or type == ROBOT_TILE):
			
			for orientation in Orientation.ORIENTATIONS_ALL:
				var neighbour = position + orientation
				if is_in_bounds(neighbour) and get_cell_item(neighbour.x, neighbour.y, neighbour.z) == INVALID_CELL_ITEM or get_cell_item(neighbour.x, neighbour.y, neighbour.z) == ROBOT_TILE:
					astar.connect_points(
						grid_coord_to_astar_id(position),
						grid_coord_to_astar_id(neighbour)
					)
		if (old_type == INVALID_CELL_ITEM or old_type == ROBOT_TILE) and \
			(type != INVALID_CELL_ITEM and type != ROBOT_TILE):
			
			for orientation in Orientation.ORIENTATIONS_ALL:
				var neighbour = position + orientation
				if is_in_bounds(neighbour) and get_cell_item(neighbour.x, neighbour.y, neighbour.z) == INVALID_CELL_ITEM or get_cell_item(neighbour.x, neighbour.y, neighbour.z) == ROBOT_TILE:
					astar.disconnect_points(
						grid_coord_to_astar_id(position),
						grid_coord_to_astar_id(neighbour)
					)
