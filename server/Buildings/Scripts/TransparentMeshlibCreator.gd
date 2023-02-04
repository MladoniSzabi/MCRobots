tool
extends EditorScript


# TODO: For some reason Godot does not use an external resource when saving the tileset but instead creating a copy of them in tileset.tres
# Commenting out saving the materials until a solution is found
func _run():
	var tileset : MeshLibrary = ResourceLoader.load("res://assets/blocks.tres")
	var new_tileset = tileset.duplicate()
	
	var materials = {}
	for item_index in tileset.get_item_list():
		var original_mesh : Mesh = tileset.get_item_mesh(item_index)
		var new_mesh : Mesh = original_mesh.duplicate()
		for surface_id in new_mesh.get_surface_count():
			var old_material = new_mesh.surface_get_material(surface_id)
			print(old_material.resource_path)
			var material_name = old_material.resource_name
			if not materials.has(material_name):
				var new_material: SpatialMaterial = old_material.duplicate()
				new_material.albedo_color.a = 0.5
				new_material.flags_transparent = true
				#new_material.resource_path = "res://Buildings/Tileset/" + material_name.replace(".", "_") + ".material"
				#ResourceSaver.save(new_material.resource_path, new_material)
				materials[material_name] = new_material
				print(new_material.resource_path)
			new_mesh.surface_set_material(surface_id, materials[material_name])
		
		new_tileset.set_item_mesh(item_index, new_mesh)
	
	var err = ResourceSaver.save("res://Buildings/Tileset/tileset.tres", new_tileset, ResourceSaver.FLAG_BUNDLE_RESOURCES | ResourceSaver.FLAG_CHANGE_PATH)
