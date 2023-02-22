const Robot = import("minecraft_classes.Robot")

class PathFollowStrategy {

    constructor(path) {
        this.path = path
    }

    run() {
        if (this.path.length == 0) {
            return true
        }


        while (this.path.length > 0) {
            let next_block = this.path.pop()
            if (!Robot.move_to(next_block)) {
                this.path = []
                return false
            }
        }

        return true

    }
}

export default PathFollowStrategy