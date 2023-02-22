const VectorImport = import("minecraft_classes.Vector")
const Vector = VectorImport.Vector

let Turtle

if (__lua_environment.computer) {
    Turtle = import("minecraft_classes.OpenComputer.Turtle")
}

if (__lua_environment.vector) {
    Turtle = import("minecraft_classes.ComputerCraft.Turtle")
}

class SpatialData {
    position = new Vector()
    orientation = VectorImport.ORIENTATION_NORTH

    constructor(spatial_data = null) {
        if (spatial_data) {
            this.position = spatial_data.position
            this.orientation = spatial_data.orientation
        }
    }
}

let spatial_data = new SpatialData()
let block_change_listeners = []

class Robot {

    static add_block_listener(listener) {
        block_change_listeners.push(listener)
    }

    static emit_change(new_block_location, new_block_value) {
        if (new_block_value != null && "error" in new_block_value) {
            new_block_value = null
        }

        for (let listener of block_change_listeners) {
            listener.on_block_changed(new_block_location, new_block_value)
        }
    }

    static record_surrounding() {
        Robot.inspect_up()
        Robot.inspect()
        Robot.inspect_down()
    }

    static set_spatial_data(new_spatial_data) {
        spatial_data = new_spatial_data
    }

    static get_spatial_data() {
        return spatial_data
    }

    static look_in_direction(target_direction) {
        if (target_direction.equals(new Vector(0, 0, 0))) {
            return
        }

        if (target_direction.x != 0) {
            target_direction.x = target_direction.x / Math.abs(target_direction.x)
        }

        if (target_direction.y != 0) {
            target_direction.y = target_direction.y / Math.abs(target_direction.y)
        }

        if (target_direction.z != 0) {
            target_direction.z = target_direction.z / Math.abs(target_direction.z)
        }

        let turtle_orientation = Robot.get_spatial_data().orientation
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
            if (o.equals(target_direction)) {
                orientation_to_block_index = i
                break
            }
        }

        let orientation_index_change = (turtle_orientation_index - orientation_to_block_index) % 4
        if (orientation_index_change == 1) {
            Robot.turn_right()
        }
        if (orientation_index_change == 3) {
            Robot.turn_left()
        }
        if (orientation_index_change == 2) {
            Robot.turn_right()
            Robot.turn_right()
        }
    }

    static move_to(target_position) {
        let curr_pos = Robot.get_spatial_data().position

        if (curr_pos.equals(target_position)) {
            return true
        }

        let target_x = new Vector(target_position.x, curr_pos.y, curr_pos.z)
        Robot.look_in_direction(target_x.sub(curr_pos))

        while (curr_pos.x != target_position.x) {
            if (Robot.forward() != "") {
                return false
            }
            curr_pos = Robot.get_spatial_data().position
        }

        while (curr_pos.y != target_position.y) {
            if (Robot.up() != "") {
                return false
            }
            curr_pos = Robot.get_spatial_data().position
        }

        Robot.look_in_direction(target_position.sub(curr_pos))
        while (curr_pos.z != target_position.z) {
            if (Robot.forward() != "") {
                return false
            }
            curr_pos = Robot.get_spatial_data().position
        }

        return true
    }

    static craft(limit = 64) { Turtle.craft(limit) }
    static move(command, future_pos) {
        let err = command()
        if (err == "") {
            Robot.get_spatial_data().position = future_pos
            Robot.record_surrounding()
        }
        return err
    }

    static turn(command, future_orientation) {
        let err = command()
        if (err == "") {
            Robot.get_spatial_data().orientation = future_orientation
            Robot.inspect()
        }
        return err;
    }

    static forward() {
        return Robot.move(Turtle.forward, spatial_data.position.add(spatial_data.orientation.direction_vector))
    }
    static back() {
        return Robot.move(Turtle.back, spatial_data.position.sub(spatial_data.orientation.direction_vector))
    }
    static up() {
        return Robot.move(Turtle.up, spatial_data.position.add(VectorImport.ORIENTATION_UP.direction_vector))
    }
    static down() {
        return Robot.move(Turtle.down, spatial_data.position.sub(VectorImport.ORIENTATION_UP.direction_vector))
    }
    static turn_left() {
        return Robot.turn(Turtle.turnLeft, spatial_data.orientation.turn_left())
    }
    static turn_right() {
        return Robot.turn(Turtle.turnRight, spatial_data.orientation.turn_right())
    }
    static dig(side = null) {
        let err = Turtle.dig(side)
        if (err == "") {
            Robot.emit_change(spatial_data.position.add(spatial_data.orientation.direction_vector), null)
        }
        return err
    }
    static dig_up(side = null) {
        let err = Turtle.dig(side)
        if (err == "") {
            Robot.emit_change(spatial_data.position.add(VectorImport.ORIENTATION_UP.direction_vector), null)
        }
        return err
    }
    static dig_down(side = null) {
        let err = Turtle.dig(side)
        if (err == "") {
            Robot.emit_change(spatial_data.position.sub(VectorImport.ORIENTATION_UP.direction_vector), null)
        }
        return err
    }
    static place(text = "") {
        let item = Turtle.getItemDetail(Turtle.getSelectedSlot())
        if (item == "") {
            item = null
        } else {
            item = item.name
        }

        let err = Turtle.place(text)
        if (err == "") {
            Robot.emit_change(spatial_data.position.add(spatial_data.orientation.direction_vector), item)
        }

        return err
    }
    static place_up(text = "") {
        let item = Turtle.getItemDetail(Turtle.getSelectedSlot())
        if (item == "") {
            item = null
        } else {
            item = item.name
        }

        let err = Turtle.placeUp(text)
        if (err == "") {
            Robot.emit_change(spatial_data.position.add(VectorImport.ORIENTATION_UP.direction_vector), item)
        }

        return err
    }
    static place_down(text = "") {
        let item = Turtle.getItemDetail(Turtle.getSelectedSlot())
        if (item == "") {
            item = null
        } else {
            item = item.name
        }

        let err = Turtle.placeUp(text)
        if (err == "") {
            Robot.emit_change(spatial_data.position.sub(VectorImport.ORIENTATION_UP.direction_vector), item)
        }

        return err
    }
    static drop(count = null) {
        return Turtle.drop(count)
    }
    static drop_up(count = null) {
        return Turtle.drop_up(count)
    }
    static drop_down(count = null) {
        return Turtle.drop_down(count)
    }
    static select(slot) {
        return Turtle.select(slot)
    }
    static get_item_count(slot = null) {
        return Turtle.getItemCount(slot)
    }
    static get_item_space(slot = null) {
        return Turtle.getItemSpace(slot)
    }
    static compare() {
        return Turtle.compare()
    }
    static compare_up() {
        return Turtle.compareUp()
    }
    static compare_down() {
        return Turtle.compareDown()
    }
    static attack(side = null) {
        return Turtle.attack(side)
    }
    static attack_up(side = null) {
        return Turtle.attackUp(side)
    }
    static attack_down(side = null) {
        return Turtle.attackDown(side)
    }
    static suck(count = 64) {
        return Turtle.suck(count)
    }
    static suck_up(count = 64) {
        return Turtle.suckUp(count)
    }
    static suck_down(count = 64) {
        return Turtle.suckDown(count)
    }
    static get_fuel_level() {
        return Turtle.getFuelLevel()
    }
    static refuel(count = 1) {
        return Turtle.refuel(count)
    }
    static compare_to(slot) {
        return Turtle.compareTo(slot)
    }
    static transferTo(slot, count = 64) {
        return Turtle.transferTo(slot, count)
    }
    static get_selected_slot() {
        return Turtle.getSelectedSlot()
    }
    static get_fuel_limit() {
        return Turtle.getFuelLimit
    }
    static equip() {
        return Turtle.equip()
    }

    static inspect() {
        let retval = Turtle.inspect()
        Robot.emit_change(spatial_data.position.add(spatial_data.orientation.direction_vector), retval)
        return retval
    }
    static inspect_up() {
        let retval = Turtle.inspectUp()
        Robot.emit_change(spatial_data.position.add(VectorImport.ORIENTATION_UP.direction_vector), retval)
        return retval
    }
    static inspect_down() {
        let retval = Turtle.inspectDown()
        Robot.emit_change(spatial_data.position.sub(VectorImport.ORIENTATION_UP.direction_vector), retval)
        return retval
    }
    static get_item_detail(slot, detailed = false) {
        return Turtle.getItemDetail(slot, detailed)
    }

}

export default Robot