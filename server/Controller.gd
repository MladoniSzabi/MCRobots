extends Spatial

var server: WebSocketServer = WebSocketServer.new()

func _ready():
	var err = server.connect("client_connected", self, "on_client_connected")
	if err != OK:
		print("WTF?1")
	err = server.connect("data_received", self, "on_data_received")
	if err != OK:
		print("WTF?2")
	err = server.listen(9999)
	if err != OK:
		print("Unable to start server")
		set_process(false)
	print("Done readying")

func _process(delta):
	server.poll()

func on_data_received(var id):
	var payload = server.get_peer(id).get_packet().get_string_from_utf8()
	print(payload)
	server.get_peer(id).put_packet(JSON.print(({"test": "test"})).to_utf8())
	
	
func on_client_connected(var id, var protocol):
	print("Client connected")
