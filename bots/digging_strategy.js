const Robot = import("minecraft_classes.Robot")

const LINE_COUNT = 8
const ROW_COUNT = 8 - 1

class DiggingStrategy {

    isRunning = false
    goLeft = true

    constructor() {
        this.isRunning = true
    }

    run(command) {
        if (command.type == "empty" && !this.isRunning) {
            return true
        }

        for (let i = 0; i < LINE_COUNT; i++) {

            if (Robot.get_fuel_level() < LINE_COUNT * ROW_COUNT * 2) {
                Robot.select(0)
                Robot.refuel(3)
            }

            for (let j = 0; j < ROW_COUNT; j++) {
                Robot.dig()
                Robot.forward()
            }

            if (i != LINE_COUNT - 1) {
                if (this.goLeft) {
                    Robot.turn_left()
                } else {
                    Robot.turn_right()
                }

                Robot.dig()
                Robot.forward()

                if (this.goLeft) {
                    Robot.turn_left()
                } else {
                    Robot.turn_right()
                }

                this.goLeft = !this.goLeft
            }
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
            this.isRunning = false
            console.log(error)
            return true
        }
        Robot.down()

        return false
    }
}

export default DiggingStrategy