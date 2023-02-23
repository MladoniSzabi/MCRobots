const Robot = import("minecraft_classes.Robot")
const VectorImport = import("minecraft_classes.Vector")
const Vector = VectorImport.Vector

class BuilderStrategy {

    constructor(cells) {
        this.cells = cells
    }

    run() {

        if (this.cells.length == 0) {
            return true
        }

        while (this.cells.length > 0) {
            let next_cell = this.cells.pop()
            let cell_pos = next_cell.pos.add(new Vector(0, 1, 0))
            if (!Robot.move_to(cell_pos)) {
                console.log("Move failed")
                return false
            }
            if (Robot.place_item_down(next_cell.name) != "") {
                console.log("Place failed")
                return false
            }
        }
        return true
    }
}

export default BuilderStrategy