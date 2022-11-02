extends GridMap

func populate_world(tiles):
	for t in tiles:
		set_cell_item(t.x, t.y, t.z, t.tile)
