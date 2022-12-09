extends Spatial

var server: WebSocketServer = WebSocketServer.new()
var clientIds: Array = []
var selectedRobot = 0

const BLOCK_TRANSLATION := {
	"minecraft:deepslate": 2
}

func _ready():
	server.connect("client_connected", self, "on_client_connected")
	server.connect("data_received", self, "on_data_received")
	server.connect("client_disconnected", self, "on_client_disconnected")
	var err = server.listen(9999)
	if err != OK:
		print("Unable to start server")
		set_process(false)
	print("Done readying")

func _process(delta):
	server.poll()
	if Input.is_action_just_pressed("forward"):
		server.get_peer(clientIds[selectedRobot]).put_packet("w".to_utf8())
	elif Input.is_action_just_pressed("back"):
		server.get_peer(clientIds[selectedRobot]).put_packet("s".to_utf8())
	elif Input.is_action_just_pressed("left"):
		server.get_peer(clientIds[selectedRobot]).put_packet("a".to_utf8())
	elif Input.is_action_just_pressed("right"):
		server.get_peer(clientIds[selectedRobot]).put_packet("d".to_utf8())

func on_data_received(var id):
	var payload = server.get_peer(id).get_packet().get_string_from_utf8().split(" ")
	print(payload)
	var i := 1
	for tile in payload:
		if tile == "none":
			i+= 1
			continue
		if tile in BLOCK_TRANSLATION:
			$World.set_cell_item(0, i, 0, BLOCK_TRANSLATION[tile])
		else:
			$World.set_cell_item(0, i, 0, 0)
		i += 1

func on_client_disconnected(var id, var was_clean_close):
	clientIds.erase(id)
	selectedRobot = clientIds.size()-1
	print("Client disconnected")

func on_client_connected(var id, var protocol):
	clientIds.append(id)
	selectedRobot = clientIds.size()-1
	print("Client connected")
