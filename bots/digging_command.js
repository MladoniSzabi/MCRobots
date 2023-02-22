const Robot = import("minecraft_classes.Robot")

class DiggingStrategy {

    constructor(line, row, depth) {
        this.isRunning = true
        this.line = line
        this.row = row
        this.depth = depth
        this.go_left = true
    }

    run() {
        let curr_depth = 0
        while (this.depth == -1 || curr_depth < this.depth) {
            let curr_line = 0
            while (this.line == -1 || curr_line < this.line) {
                if (Robot.get_fuel_level() < this.line * this.row * 2) {
                    Robot.select(0)
                    Robot.refuel(3)
                }

                let curr_row = 0
                while (this.row == -1 || curr_row < this.row - 1) {
                    if (Robot.dig() != "") {
                        return false
                    }
                    Robot.forward()
                    curr_row++
                }

                if (i != this.line - 1) {
                    if (this.go_left) {
                        Robot.turn_left()
                    } else {
                        Robot.turn_right()
                    }

                    if (Robot.dig() != "") {
                        return false
                    }
                    Robot.forward()

                    if (this.go_left) {
                        Robot.turn_left()
                    } else {
                        Robot.turn_right()
                    }

                    this.go_left = !this.go_left
                }

                curr_line++
            }
            Robot.turn_left()
            Robot.turn_left()
            Robot.select(1)
            Robot.place()

            for (let j = 2; j < 16; j++) {
                Robot.select(j)
                Robot.drop()
            }

            let error = Robot.dig_down()
            if (error != '') {
                console.log(error)
                return false
            }
            Robot.down()
            curr_depth++
        }
        return true
    }
}

export default DiggingStrategy