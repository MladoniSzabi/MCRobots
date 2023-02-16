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
        // console.log("pos : ", Turtle.get_spatial_data().position)
        // console.log("next: ", next_block)
        let dir_to_block = next_block.sub(Turtle.get_spatial_data().position)
        if (dir_to_block.equals(new Vector(0, 0, 0))) {
            return false
        }

        if (dir_to_block.equals(new Vector(0, 1, 0))) {
            return this.attempt_move(Turtle.up)
        }

        if (dir_to_block.equals(new Vector(0, -1, 0))) {
            return this.attempt_move(Turtle.down)
        }

        let turtle_orientation = Turtle.get_spatial_data().orientation
        let turtle_orientation_index
        for (let i = 0; i < VectorImport.ORIENTATIONS_XZ.length; i++) {
            let o = VectorImport.ORIENTATIONS_XZ[i]
            if (o.equals(turtle_orientation.direction_vector)) {
                turtle_orientation_index = i
                break
            }
        }

        let orientation_to_block_index
        for (let i = 0; i < VectorImport.ORIENTATIONS_XZ.length; i++) {
            let o = VectorImport.ORIENTATIONS_XZ[i]
            if (o.equals(dir_to_block)) {
                orientation_to_block_index = i
                break
            }
        }

        let orientation_index_change = (turtle_orientation_index - orientation_to_block_index) % 4
        console.log(turtle_orientation_index, orientation_to_block_index)
        if (orientation_index_change == 1) {
            Turtle.turnRight()
        }
        if (orientation_index_change == 3) {
            Turtle.turnLeft()
        }
        if (orientation_index_change == 2) {
            Turtle.turnRight()
            Turtle.turnRight()
        }

        return this.attempt_move(Turtle.forward)
    }
}

export default PathFollowStrategy