const HTTP = import("minecraft_classes.HTTP")
const Turtle = import("minecraft_classes.Turtle")
const Message = import("message")

const SERVER_ADDRESS = "ws://localhost:9999"

class Robot {

    socket = null
    strategy = null
    is_erroring = false
    is_idle = false

    constructor() {
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
        Turtle.set_spatial_data(init_command.spatial_data)
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

            if (!this.is_idle) {
                this.send_blocks()
            }
            console.log(Turtle.get_spatial_data().position)
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