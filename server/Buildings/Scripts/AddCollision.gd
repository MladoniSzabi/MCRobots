tool
extends EditorScript


func _run():
	var tileset = ResourceLoader.load("res://assets/blocks.tres", "MeshLibrary") as MeshLibrary
	for item_index in tileset.get_item_list():
		print(item_index)
		var shape = BoxShape.new()
		shape.extents = Vector3(0.5,0.5,0.5)
		tileset.set_item_shapes(item_index, [shape, Transform.IDENTITY])
	
	ResourceSaver.save("res://assets/blocks.tres", tileset)
		
