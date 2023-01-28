extends GridMap

const ROBOT_TILE = 15

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
