const Robot = import("minecraft_classes.Robot")

class RemoteControlStrategy {
    run(command) {
        if (command.type == "empty") {
            return true
        }

        if (command.type == "movement") {
            if (command.direction == 'forward') {
                Robot.forward()
            }
            else if (command.direction == 'left') {
                Robot.turn_left()
            }
            else if (command.direction == 'backwards') {
                Robot.back()
            }
            else if (command.direction == 'right') {
                Robot.turn_right()
            }
        }

        return false
    }
}

export default RemoteControlStrategy