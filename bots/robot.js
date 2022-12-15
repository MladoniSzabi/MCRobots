const HTTP = import("minecraft_classes.HTTP")
const Turtle = import("minecraft_classes.Turtle")
const Message = import("message")
const VectorImport = import("minecraft_classes.Vector")
const Vector = VectorImport.Vector

const SERVER_ADDRESS = "ws://localhost:9999"

class SpatialData {
    position = new Vector()
    orientation = VectorImport.ORIENTATION_NORTH

    constructor(spatial_data = null) {
        if (spatial_data) {
            this.position = spatial_data.position
            this.orientation = spatial_data.orientation
        }
    }

    turn_left() {
        let index = VectorImport.ORIENTATIONS.indexOf(this.orientation)
        this.orientation = VectorImport.ORIENTATIONS[(index + 1) % VectorImport.ORIENTATIONS.length]
    }

    turn_right() {
        let index = VectorImport.ORIENTATIONS.indexOf(this.orientation)
        this.orientation = VectorImport.ORIENTATIONS[(index - 1) % VectorImport.ORIENTATIONS.length]
    }
}

class Robot {

    socket = null
    strategy = null
    spatial_data = null
    is_erroring = false
    is_idle = false

    constructor() {
        this.spatial_data = new SpatialData()
        this.socket = HTTP.websocket(SERVER_ADDRESS)

        if ("error" in this.socket) {
            console.error("There was an error connecting to the server", c.error)
            this.is_erroring = true
            return
        }

        this.initialise()
    }

    initialise() {
        this.socket.send("init")
        let response = this.socket.receive(1)
        if (!response.message) {
            console.error("Did not receive an initialisation response")
            this.is_erroring = true
        }

        let init_command = Message.decode(response.message)
        this.spatial_data = new SpatialData(init_command.spatial_data)
        this.strategy = init_command.strategy

    }

    run() {
        while (!this.is_erroring) {
            let response = this.socket.receive(this.is_idle ? 3 : 0)
            let command = Message.decode(response.message)
            if (command.type == "change_strategy") {
                this.strategy = command.new_strategy
            }

            if (this.strategy) {
                this.is_idle = this.strategy.run(command, this.spatial_data)
            }

            if (!this.is_idle) {
                this.send_blocks()
            }
        }

        this.socket.close()
    }

    send_blocks() {
        let message = Message.encode("surrounding", Turtle.inspectUp(), Turtle.inspect(), Turtle.inspectDown())
        this.socket.send(message)
    }

}

let robot = new Robot()
robot.run()