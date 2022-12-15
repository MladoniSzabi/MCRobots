const Turtle = import("minecraft_classes.Turtle")

class RemoteControlStrategy {
    run(command) {
        if (command.type == "empty") {
            return true
        }

        if (command.type == "movement") {
            if (command.direction == 'forward') {
                Turtle.forward()
            }
            else if (command.direction == 'left') {
                Turtle.turnLeft()
            }
            else if (command.direction == 'backwards') {
                Turtle.back()
            }
            else if (command.direction == 'right') {
                Turtle.turnRight()
            }
        }

        return false
    }
}

export default RemoteControlStrategy