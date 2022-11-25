class Turtle {

    static craft(limit=64) {
        let success, err = __lua_environment.turtle.craft(limit.__value)
        return success ? '' : String(err)
    }

    static forward() {
        let success, err = __lua_environment.turtle.forward()
        return success ? '' : String(err)
    }

    static back() {
        let success, err = __lua_environment.turtle.back()
        return success ? '' : String(err)
    }

    static up() {
        let success, err = __lua_environment.turtle.up()
        return success ? '' : String(err)
    }

    static down() {
        let success, err = __lua_environment.turtle.down()
        return success ? '' : String(err)
    }

    static turnLeft() {
        let success, err = __lua_environment.turtle.turnLeft()
        return success ? '' : String(err)
    }

    static turnRight() {
        let success, err = __lua_environment.turtle.turnRight()
        return success ? '' : String(err)
    }

    static dig(side = null) {
        let success, err = __lua_environment.turtle.dig(side.__value || undefined)
        return success ? '' : String(err)
    }

    static digUp(side = null) {
        let success, err = __lua_environment.turtle.digUp(side.__value || undefined)
        return success ? '' : String(err)
    }

    static digDown(side = null) {
        let success, err = __lua_environment.turtle.digDown(side.__value || undefined)
        return success ? '' : String(err)
    }

    static place(text = "") {
        let success, err = __lua_environment.turtle.place(text.__value)
        return success ? '' : String(err)
    }

    static placeUp(text = "") {
        let success, err = __lua_environment.turtle.placeUp(text.__value)
        return success ? '' : String(err)
    }

    static placeDown(text = "") {
        let success, err = __lua_environment.turtle.placeDown(text.__value)
        return success ? '' : String(err)
    }

    static drop(count = null) {
        let success, err = __lua_environment.turtle.drop(count.__value || undefined)
        return success ? '' : String(err)
    }

    static dropUp(count = null) {
        let success, err = __lua_environment.turtle.dropUp(count.__value || undefined)
        return success ? '' : String(err)
    }

    static dropDown(count = null) {
        let success, err = __lua_environment.turtle.dropDown(count.__value || undefined)
        return success ? '' : String(err)
    }

    static select(slot) {
        return Boolean(__lua_environment.turtle.select(slot.__value))
    }

    static getItemCount(slot = null) {
        return Number(__lua_environment.turtle.getItemCount(slot.__value || undefined))
    }

    static getItemSpace(slot = null) {
        return Number(__lua_environment.turtle.getItemSpace(slot.__value || undefined))
    }

    static detect() {
        return Boolean(__lua_environment.turtle.detect())
    }

    static detectUp() {
        return Boolean(__lua_environment.turtle.detectUp())
    }

    static detectDown() {
        return Boolean(__lua_environment.turtle.detectDown())
    }

    static compare() {
        return Boolean(__lua_environment.turtle.compare())
    }

    static compareUp() {
        return Boolean(__lua_environment.turtle.compareUp())
    }

    static compareDown() {
        return Boolean(__lua_environment.turtle.compareDown())
    }

    static attack(side = null) {
        let success, err = __lua_environment.turtle.attack(side.__value || undefined)
        return success ? '' : String(err)
    }

    static attackUp(side = null) {
        let success, err = __lua_environment.turtle.attackUp(side.__value || undefined)
        return success ? '' : String(err)
    }

    static attackDown(side = null) {
        let success, err = __lua_environment.turtle.attackDown(side.__value || undefined)
        return success ? '' : String(err)
    }

    static suck(count = 64) {
        let success, err = __lua_environment.turtle.suck(count.__value)
        return success ? '' : String(err)
    }

    static suckUp(count = 64) {
        let success, err = __lua_environment.turtle.suckUp(count.__value)
        return success ? '' : String(err)
    }

    static suckDown(count = 64) {
        let success, err = __lua_environment.turtle.suckDown(count.__value)
        return success ? '' : String(err)
    }

    static getFuelLevel() {
        let fuelLevel = __lua_environment.turtle.getFuelLevel()
        return __lua_environment.type(fuelLevel) == 'string'.__value ? -1 : Number(fuelLevel)
    }

    static refule(count = 1) {
        let success, err = __lua_environment.turtle.refuel(count.__value)
        return success ? '' : String(err)
    }

    static compareTo(slot) {
        return Boolean(__lua_environment.turtle.compareTo(slot.__value))
    }

    static transferTo(slot, count = 64) {
        return Boolean(__lua_environment.turtle.transferTo(slot.__value, count.__value))
    }

    static getSelectedSlot() {
        return Number(__lua_environment.turtle.getSelectedSlot())
    }

    static getFuelLimit() {
        let fuelLimit = __lua_environment.turtle.getFuelLimit()
        return __lua_environment.type(fuelLimit) == 'string'.__value ? -1 : Number(fuelLevel)
    }

    static equipLeft() {
        let success, err = __lua_environment.turtle.equipLeft()
        return success ? '' : String(err)
    }

    static equipRight() {
        let success, err = __lua_environment.turtle.equipRight()
        return success ? '' : String(err)
    }

    static inspect() {
        let success, info = __lua_environment.turtle.inspect()
        if(success)
            return __lua_environment.type(info) == 'string'.__value ? {info: info} : Object(info)
        return null
    }

    static inspectUp() {
        let success, info = __lua_environment.turtle.inspectUp()
        if(success)
            return __lua_environment.type(info) == 'string'.__value ? {info: info} : Object(info)
        return null
    }

    static inspectDown() {
        let success, info = __lua_environment.turtle.inspectDown()
        if(success)
            return __lua_environment.type(info) == 'string'.__value ? {info: info} : Object(info)
        return null
    }

    static getItemDetail(slot, detailed = false) {
        return Object(__lua_environment.turtle.getItemDetail(slot.__value, detailed.__value))
    }

}

export default Turtle