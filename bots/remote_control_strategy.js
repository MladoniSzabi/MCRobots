const Turtle = import("minecraft_classes.Turtle")

class RemoteControlStrategy {
    run(command, robot_spatial_data) {
        if (command.type == "empty") {
            return true
        }

        if (command.type == "movement") {
            if (command.direction == 'forward') {
                Turtle.forward()
                robot_spatial_data.position = robot_spatial_data.position.add(robot_spatial_data.orientation)
            }
            else if (command.direction == 'left') {
                Turtle.turnLeft()
                robot_spatial_data.turn_left()
            }
            else if (command.direction == 'backwards') {
                Turtle.back()
                robot_spatial_data.position = robot_spatial_data.position.sub(robot_spatial_data.orientation)
            }
            else if (command.direction == 'right') {
                Turtle.turnRight()
                robot_spatial_data.turn_right()
            }
        }

        return false
    }
}

export default RemoteControlStrategy