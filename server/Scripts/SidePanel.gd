extends TabContainer

var EMPTY_STYLE_BOX := StyleBoxEmpty.new()
var previous_tab := 0
var is_selected = false

var should_select = false
var should_deselect = false

func set_tab_icon_from_path(tabIndex: int, imagePath: String):
	var img = Image.new()
	img.load(imagePath)
	var texture = ImageTexture.new()
	texture.create_from_image(img)
	set_tab_icon(tabIndex, texture)

func select():
	print("select")
	add_stylebox_override("tab_fg", null)
	set_tab_hidden(0, true)
	is_selected = true

func deselect():
	print("deselect")
	add_stylebox_override("tab_fg", EMPTY_STYLE_BOX)
	set_tab_hidden(0, false)
	current_tab = 0
	is_selected = false

func change_tab(index: int):
	print("c")
	if not is_selected:
		should_select = true

func select_tab(index: int):
	print("s")
	if should_select:
		return
	if previous_tab == index:
		should_deselect = true
	previous_tab = index
	
func _process(delta):
	if should_select:
		assert(should_deselect == false)
		var old_tab = current_tab
		select()
		current_tab = old_tab
		should_select = false
	elif should_deselect:
		deselect()
		should_deselect = false

func _ready():
	deselect()
	set_tab_title(0, "")
	set_tab_icon_from_path(1, "res://assets/robots.svg")
	set_tab_title(1, "")
	set_tab_icon_from_path(2, "res://assets/buildings.svg")
	set_tab_title(2, "")
	
	connect("tab_changed", self, "change_tab")
	connect("tab_selected", self, "select_tab")
