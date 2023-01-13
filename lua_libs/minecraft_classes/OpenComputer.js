const VectorImport = import("minecraft_classes.Vector")
const Vector = VectorImport.Vector

robot = __lua_environment.component.robot
generator = __lua_environment.component.generator
inventory_controller = __lua_environment.component.inventory_controller
crafting = __lua_environment.component.crafting

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
let blocks = {}

class OpenComputer {
    static record_surrounding() {
        let retval = Turtle.inspectUp()
        if(!("error" in retval)) {
            blocks[(spatial_data.position.add(VectorImport.ORIENTATION_UP.direction_vector)).toString()] = retval
        } else {
            blocks[(spatial_data.position.add(VectorImport.ORIENTATION_UP.direction_vector)).toString()] = null
        }

        retval = Turtle.inspect()
        if(!("error" in retval)) {
            blocks[(spatial_data.position.add(spatial_data.orientation.direction_vector)).toString()] = retval
        } else {
            blocks[(spatial_data.position.add(spatial_data.orientation.direction_vector)).toString()] = null
        }

        retval = Turtle.inspectDown()
        if(!("error" in retval)) {
            blocks[(spatial_data.position.add(VectorImport.ORIENTATION_DOWN.direction_vector)).toString()] = retval
        } else {
            blocks[(spatial_data.position.add(VectorImport.ORIENTATION_DOWN.direction_vector)).toString()] = null
        }
    }

    static record_forward() {
        retval = Turtle.inspect()
        if(!("error" in retval)) {
            blocks[(spatial_data.position.add(spatial_data.orientation.direction_vector)).toString()] = retval
        } else {
            blocks[(spatial_data.position.add(spatial_data.orientation.direction_vector)).toString()] = null
        }
    }

    static flush_blocks() {
        retval = blocks
        blocks = {}
        return retval
    }

    static set_spatial_data(new_spatial_data) {
        spatial_data = new_spatial_data
    }

    static get_spatial_data() {
        return spatial_data
    }

    static craft(limit=64) {
        if(crafting) {
            let (success, err) = crafting.craft$notable(limit.__value)
            return success ? '' : 'Could not craft item'
        }
        return 'Crafting upgrade not installed'
    }

    static forward() {
        let (success, err) = robot.forward$notable()

        if(success) {
            spatial_data.position = spatial_data.position.add(spatial_data.orientation.direction_vector)
            OpenComputer.record_surrounding()
        }

        return success ? '' : String(err)
    }

    static back() {
        let (success, err) = robot.back$notable()

        if(success) {
            spatial_data.position = spatial_data.position.sub(spatial_data.orientation.direction_vector)
            OpenComputer.record_surrounding()
        }

        return success ? '' : String(err)
    }

    static up() {
        let (success, err) = robot.up$notable()

        if(success) {
            spatial_data.position = spatial_data.position.add(VectorImport.ORIENTATION_UP.direction_vector)
            OpenComputer.record_surrounding()
        }

        return success ? '' : String(err)
    }

    static down() {
        let (success, err) = robot.down$notable()

        if(success) {
            spatial_data.position = spatial_data.position.add(VectorImport.ORIENTATION_DOWN.direction_vector)
            OpenComputer.record_surrounding()
        }

        return success ? '' : String(err)
    }

    static turnLeft() {
        let (success, err) = robot.turnLeft$notable()

        if(success) {
            spatial_data.orientation = spatial_data.orientation.turn_left()
            OpenComputer.record_forward()
        }

        return success ? '' : String(err)
    }

    static turnRight() {
        let (success, err) = robot.turnRight$notable()

        if(success) {
            spatial_data.orientation = spatial_data.orientation.turn_right()
            OpenComputer.record_forward()
        }

        return success ? '' : String(err)
    }


    static dig(side = null) {
        let (success, err) = robot.swing$notable(side.__value || undefined)
        if(success) {
            blocks[(spatial_data.position.add(spatial_data.orientation.direction_vector)).toString()] = null
            return ''
        }
        return String(err)
    }

    static digUp(side = null) {
        let (success, err) = robot.swingUp$notable(side.__value || undefined)
        if(success) {
            blocks[(spatial_data.position.add(VectorImport.ORIENTATION_UP.direction_vector)).toString()] = null
            return ''
        }
        return String(err)
    }

    static digDown(side = null) {
        let (success, err) = robot.swingDown$notable(side.__value || undefined)
        if(success) {
            blocks[(spatial_data.position.add(VectorImport.ORIENTATION_DOWN.direction_vector)).toString()] = null
            return ''
        }
        return String(err)
    }

    static place(text = "") {
        let (success, err) = robot.place$notable(text.__value)
        return success ? '' : String(err)
    }

    static placeUp(text = "") {
        let (success, err) = robot.placeUp$notable(text.__value)
        return success ? '' : String(err)
    }

    static placeDown(text = "") {
        let (success, err) = robot.placeDown$notable(text.__value)
        return success ? '' : String(err)
    }

    static drop(count = null) {
        let (success, err) = robot.drop$notable(count.__value || undefined)
        return success ? '' : String(err)
    }

    static dropUp(count = null) {
        let (success, err) = robot.dropUp$notable(count.__value || undefined)
        return success ? '' : String(err)
    }

    static dropDown(count = null) {
        let (success, err) = robot.dropDown$notable(count.__value || undefined)
        return success ? '' : String(err)
    }

    static select(slot) {
        // Start indexing from 0
        slot = slot + 1
        return Boolean(robot.select$notable(slot.__value))
    }

    static getItemCount(slot = null) {
        return Number(robot.count$notable(slot.__value || undefined))
    }

    static getItemSpace(slot = null) {
        return 64 - Number(robot.space$notable(slot.__value || undefined))
    }

    static detect() {
        let (success, block) = robot.detect$notable()
        return Boolean(success)
    }

    static detectUp() {
        let (success, block) = robot.detectUp$notable()
        return Boolean(success)
    }

    static detectDown() {
        let (success, block) = robot.detectDown$notable()
        return Boolean(success)
    }

    static compare() {
        return Boolean(robot.compare$notable())
    }

    static compareUp() {
        return Boolean(robot.compareUp$notable())
    }

    static compareDown() {
        return Boolean(robot.compareDown$notable())
    }

    static attack(side = null) {
        let (success, err) = robot.swing$notable(side.__value || undefined)
        return success ? '' : String(err)
    }

    static attackUp(side = null) {
        let (success, err) = robot.swingUp$notable(side.__value || undefined)
        return success ? '' : String(err)
    }

    static attackDown(side = null) {
        let (success, err) = robot.swingDown$notable(side.__value || undefined)
        return success ? '' : String(err)
    }

    static suck(count = 64) {
        let (success, err) = robot.suck$notable(count.__value)
        return success ? '' : String(err)
    }

    static suckUp(count = 64) {
        let (success, err) = robot.suckUp$notable(count.__value)
        return success ? '' : String(err)
    }

    static suckDown(count = 64) {
        let (success, err) = robot.suckDown$notable(count.__value)
        return success ? '' : String(err)
    }

    static getFuelLevel() {
        let fuelLevel = computer.energy$notable()
        return Number(fuelLevel)
    }

    static refuel(count = 1) {
        if(generator) {
            let (success, err) = generator.insert$notable(count.__value)
            return success ? '' : String(err)
        }
        return "Generator upgrade not installed"
    }

    static compareTo(slot) {
        return Boolean(robot.compareTo$notable(slot.__value))
    }

    static transferTo(slot, count = 64) {
        return Boolean(robot.transferTo$notable(slot.__value, count.__value))
    }

    static getSelectedSlot() {
        return -1
    }

    static getFuelLimit() {
        let fuelLimit = computer.maxEnergy$notable()
        return Number(fuelLimit)
    }

    static equip() {
        if(inventory_controller) {
            let (success, err) = inventory_controller.equip$notable()
            return success ? '' : String(err)
        }
        return "Inventory controller not installer"
    }

    static inspect() {
        let (success, info) = robot.detect$notable()
        if(success)
            return __lua_environment.type(info) == 'string'.__value ? {info: info} : Object(info)
        return false
    }

    static inspectUp() {
        let (success, info) = robot.detectUp$notable()
        if(success)
            return __lua_environment.type(info) == 'string'.__value ? {info: info} : Object(info)
        return false
    }

    static inspectDown() {
        let (success, info) = robot.detectDown$notable()
        if(success)
            return __lua_environment.type(info) == 'string'.__value ? {info: info} : Object(info)
        return false
    }

    static getItemDetail(slot, detailed = false) {
        if(inventory_controller) {
            let side = 1
            return Object(inventory_controller.getStackInSlot$notable(side.__value, slot.__value))
        }
        return {error: "Inventory controller not installer"}
    }
}