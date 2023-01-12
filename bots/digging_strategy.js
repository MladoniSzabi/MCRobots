const Turtle = import("minecraft_classes.Turtle")

const LINE_COUNT = 16

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

        while(this.isRunning) {
            for(let i = 0; i < LINE_COUNT; i++) {

                if(Turtle.getFuelLevel() < 16*16*2) {
                    Turtle.select(0)
                    Turtle.refuel(3)
                }

                for(let j = 0; j < 15; j++) {
                    Turtle.dig()
                    Turtle.forward()
                }

                if(i !=  LINE_COUNT - 1) {
                    if(this.goLeft) {
                        Turtle.turnLeft()
                    } else {
                        Turtle.turnRight()
                    }
    
                    Turtle.dig()
                    Turtle.forward()
    
                    if(this.goLeft) {
                        Turtle.turnLeft()
                    } else {
                        Turtle.turnRight()
                    }

                    this.goLeft = !this.goLeft
                }
            }

            Turtle.turnLeft()
            Turtle.turnLeft()
            Turtle.select(1)
            Turtle.place()

            for(let j = 2; j < 16; j++) {
                Turtle.select(j)
                Turtle.drop()
            }

            let error = Turtle.digDown()
            if(error != '') {
                this.isRunning = false
                console.log(error)
                return true
            }
            Turtle.down()
        }

        return false
    }
}

export default DiggingStrategy