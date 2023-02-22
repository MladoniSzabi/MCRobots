
const WebSocket = import("minecraft_classes.WebSocket")
const Robot = import("minecraft_classes.Robot")
const Message = import("message")

const SERVER_ADDRESS = "ws://localhost:9999"

class RobotController {

    socket = null
    strategy = null
    is_erroring = false
    is_idle = false

    constructor() {
        this.socket = new WebSocket(SERVER_ADDRESS)
        let retval = this.socket.connect()

        if ("error" in retval) {
            console.error("There was an error connecting to the server", c.error)
            this.is_erroring = true
            return
        }

        this.initialise()
    }

    on_block_changed(new_block_location, new_block_value) {
        let messages = Message.encode("surrounding", new_block_location, new_block_value)
        for (let message of messages) {
            this.socket.send(message)
        }
    }

    initialise() {
        // Command should be `init {robot_id}` but since we don't have a filesystem API yet and only one robot
        // hardcode robot ID to 0
        Robot.add_block_listener(this)
        this.socket.send(Message.encode("init", "0"))
        let response = this.socket.receive(1)
        if (!response.message) {
            console.error("Did not receive an initialisation response")
            this.is_erroring = true
        }

        let init_command = Message.decode(response.message)
        Robot.set_spatial_data(init_command.spatial_data)
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
                this.is_idle = this.strategy.run(command)
            }
        }

        this.socket.close()
    }
}

let robot = new RobotController()
robot.run()