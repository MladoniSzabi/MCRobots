extends GridMap

const Orientation = preload("res://Scripts/Orientation.gd")

const ROBOT_TILE = 15

const ORIENTATION_TO_ORTHOGONAL_INDEX = {
	Orientation.ORIENTATION_NORTH: 16,
	Orientation.ORIENTATION_SOUTH: 22,
	Orientation.ORIENTATION_WEST: 10,
	Orientation.ORIENTATION_EAST: 0,
	Orientation.ORIENTATION_UP: 1,
	Orientation.ORIENTATION_DOWN: 3,
}

func save(file_name):
	var file = File.new()
	if file.open(file_name, File.WRITE) != OK:
		print("There was an error opening the file")
	
	for pos in get_used_cells():
		file.store_var({
			"x": pos.x,
			"y": pos.y,
			"z": pos.z,
			"tile": get_cell_item(pos.x, pos.y, pos.z)
		})
	file.close()

func load(file_name):
	clear()
	var file = File.new()
	file.open(file_name, File.READ)
	while not file.eof_reached():
		var cell_data = file.get_var()
		set_cell_item(cell_data.x, cell_data.y, cell_data.z, cell_data.tile)
	file.close()

func populate_world(tiles):
	for t in tiles:
		set_cell_item(t.x, t.y, t.z, t.tile)
