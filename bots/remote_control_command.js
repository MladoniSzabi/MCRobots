const Robot = import("minecraft_classes.Robot")

class RemoteControlStrategy {

    constructor(direction) {
        this.direction = direction
    }

    run() {
        if (this.direction == 'forward') {
            if (Robot.forward() != "") {
                return false
            }
        }
        else if (this.direction == 'left') {
            if (Robot.turn_left() != "") {
                return false
            }
        }
        else if (this.direction == 'backwards') {
            if (Robot.back() != "") {
                return false
            }
        }
        else if (this.direction == 'right') {
            if (Robot.turn_right() != "") {
                return false
            }
        }

        return true
    }
}

export default RemoteControlStrategy