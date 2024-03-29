robot = __lua_environment.component.robot
generator = __lua_environment.component.generator
inventory_controller = __lua_environment.component.inventory_controller
crafting = __lua_environment.component.crafting

class OpenComputer {
    static craft(limit = 64) {
        if (crafting) {
            let(success, err) = crafting.craft$notable(limit.__value)
            return success ? '' : 'Could not craft item'
        }
        return 'Crafting upgrade not installed'
    }

    static forward() {
        let(success, err) = robot.forward$notable()
        return success ? '' : String(err)
    }

    static back() {
        let(success, err) = robot.back$notable()
        return success ? '' : String(err)
    }

    static up() {
        let(success, err) = robot.up$notable()
        return success ? '' : String(err)
    }

    static down() {
        let(success, err) = robot.down$notable()
        return success ? '' : String(err)
    }

    static turnLeft() {
        let(success, err) = robot.turnLeft$notable()
        return success ? '' : String(err)
    }

    static turnRight() {
        let(success, err) = robot.turnRight$notable()
        return success ? '' : String(err)
    }


    static dig(side = null) {
        let(success, err) = robot.swing$notable(side.__value || undefined)
        return success ? '' : String(err)
    }

    static digUp(side = null) {
        let(success, err) = robot.swingUp$notable(side.__value || undefined)
        return success ? '' : String(err)
    }

    static digDown(side = null) {
        let(success, err) = robot.swingDown$notable(side.__value || undefined)
        return success ? '' : String(err)
    }

    static place(text = "") {
        let(success, err) = robot.place$notable(text.__value)
        return success ? '' : String(err)
    }

    static placeUp(text = "") {
        let(success, err) = robot.placeUp$notable(text.__value)
        return success ? '' : String(err)
    }

    static placeDown(text = "") {
        let(success, err) = robot.placeDown$notable(text.__value)
        return success ? '' : String(err)
    }

    static drop(count = null) {
        let(success, err) = robot.drop$notable(count.__value || undefined)
        return success ? '' : String(err)
    }

    static dropUp(count = null) {
        let(success, err) = robot.dropUp$notable(count.__value || undefined)
        return success ? '' : String(err)
    }

    static dropDown(count = null) {
        let(success, err) = robot.dropDown$notable(count.__value || undefined)
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
        let(success, err) = robot.swing$notable(side.__value || undefined)
        return success ? '' : String(err)
    }

    static attackUp(side = null) {
        let(success, err) = robot.swingUp$notable(side.__value || undefined)
        return success ? '' : String(err)
    }

    static attackDown(side = null) {
        let(success, err) = robot.swingDown$notable(side.__value || undefined)
        return success ? '' : String(err)
    }

    static suck(count = 64) {
        let(success, err) = robot.suck$notable(count.__value)
        return success ? '' : String(err)
    }

    static suckUp(count = 64) {
        let(success, err) = robot.suckUp$notable(count.__value)
        return success ? '' : String(err)
    }

    static suckDown(count = 64) {
        let(success, err) = robot.suckDown$notable(count.__value)
        return success ? '' : String(err)
    }

    static getFuelLevel() {
        let fuelLevel = computer.energy$notable()
        return Number(fuelLevel)
    }

    static refuel(count = 1) {
        if (generator) {
            let(success, err) = generator.insert$notable(count.__value)
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
        if (inventory_controller) {
            let(success, err) = inventory_controller.equip$notable()
            return success ? '' : String(err)
        }
        return "Inventory controller not installer"
    }

    static inspect() {
        let(success, info) = robot.detect$notable()
        if (success)
            return __lua_environment.type(info) == 'string'.__value ? { info: info } : Object(info)
        return false
    }

    static inspectUp() {
        let(success, info) = robot.detectUp$notable()
        if (success)
            return __lua_environment.type(info) == 'string'.__value ? { info: info } : Object(info)
        return false
    }

    static inspectDown() {
        let(success, info) = robot.detectDown$notable()
        if (success)
            return __lua_environment.type(info) == 'string'.__value ? { info: info } : Object(info)
        return false
    }

    static getItemDetail(slot, detailed = false) {
        slot = slot + 1
        if (inventory_controller) {
            let side = 1
            return Object(inventory_controller.getStackInSlot$notable(side.__value, slot.__value))
        }
        return { error: "Inventory controller not installed" }
    }

    static getInventorySize() {
        if (inventory_controller) {
            let side = 1
            return Number(inventory_controller.getInventorySize(side.__value))
        }
        return 0
    }
}