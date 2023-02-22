const Turtle = import("minecraft_classes.Turtle")
const VectorImport = import("minecraft_classes.Vector")
const Vector = VectorImport.Vector

class PathFollowStrategy {

    constructor() {
        this.path = []
    }

    attempt_move(dir) {
        let res = dir()
        if (res == "")
            return false

        this.path = []
        return true
    }

    run(command) {
        if (command.type == "empty" && this.path.length == 0) {
            return true
        }

        if (command.type == "follow") {
            this.path = command.path
        }

        if (this.path.length == 0) {
            return true
        }

        let next_block = this.path.pop()
        if (!Turtle.move_to(next_block)) {
            this.path = []
            return false
        }
    }
}

export default PathFollowStrategy