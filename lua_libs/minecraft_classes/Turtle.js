class Turtle {

    static craft(limit=64) {
        let (success, err) = __lua_environment.turtle.craft$notable(limit.__value)
        return success ? '' : String(err)
    }

    static forward() {
        let (success, err) = __lua_environment.turtle.forward$notable()
        return success ? '' : String(err)
    }

    static back() {
        let (success, err) = __lua_environment.turtle.back$notable()
        return success ? '' : String(err)
    }

    static up() {
        let (success, err) = __lua_environment.turtle.up$notable()
        return success ? '' : String(err)
    }

    static down() {
        let (success, err) = __lua_environment.turtle.down$notable()
        return success ? '' : String(err)
    }

    static turnLeft() {
        let (success, err) = __lua_environment.turtle.turnLeft$notable()
        return success ? '' : String(err)
    }

    static turnRight() {
        let (success, err) = __lua_environment.turtle.turnRight$notable()
        return success ? '' : String(err)
    }

    static dig(side = null) {
        let (success, err) = __lua_environment.turtle.dig$notable(side.__value || undefined)
        return success ? '' : String(err)
    }

    static digUp(side = null) {
        let (success, err) = __lua_environment.turtle.digUp$notable(side.__value || undefined)
        return success ? '' : String(err)
    }

    static digDown(side = null) {
        let (success, err) = __lua_environment.turtle.digDown$notable(side.__value || undefined)
        return success ? '' : String(err)
    }

    static place(text = "") {
        let (success, err) = __lua_environment.turtle.place$notable(text.__value)
        return success ? '' : String(err)
    }

    static placeUp(text = "") {
        let (success, err) = __lua_environment.turtle.placeUp$notable(text.__value)
        return success ? '' : String(err)
    }

    static placeDown(text = "") {
        let (success, err) = __lua_environment.turtle.placeDown$notable(text.__value)
        return success ? '' : String(err)
    }

    static drop(count = null) {
        let (success, err) = __lua_environment.turtle.drop$notable(count.__value || undefined)
        return success ? '' : String(err)
    }

    static dropUp(count = null) {
        let (success, err) = __lua_environment.turtle.dropUp$notable(count.__value || undefined)
        return success ? '' : String(err)
    }

    static dropDown(count = null) {
        let (success, err) = __lua_environment.turtle.dropDown$notable(count.__value || undefined)
        return success ? '' : String(err)
    }

    static select(slot) {
        return Boolean(__lua_environment.turtle.select$notable(slot.__value))
    }

    static getItemCount(slot = null) {
        return Number(__lua_environment.turtle.getItemCount$notable(slot.__value || undefined))
    }

    static getItemSpace(slot = null) {
        return Number(__lua_environment.turtle.getItemSpace$notable(slot.__value || undefined))
    }

    static detect() {
        return Boolean(__lua_environment.turtle.detect$notable())
    }

    static detectUp() {
        return Boolean(__lua_environment.turtle.detectUp$notable())
    }

    static detectDown() {
        return Boolean(__lua_environment.turtle.detectDown$notable())
    }

    static compare() {
        return Boolean(__lua_environment.turtle.compare$notable())
    }

    static compareUp() {
        return Boolean(__lua_environment.turtle.compareUp$notable())
    }

    static compareDown() {
        return Boolean(__lua_environment.turtle.compareDown$notable())
    }

    static attack(side = null) {
        let (success, err) = __lua_environment.turtle.attack$notable(side.__value || undefined)
        return success ? '' : String(err)
    }

    static attackUp(side = null) {
        let (success, err) = __lua_environment.turtle.attackUp$notable(side.__value || undefined)
        return success ? '' : String(err)
    }

    static attackDown(side = null) {
        let (success, err) = __lua_environment.turtle.attackDown$notable(side.__value || undefined)
        return success ? '' : String(err)
    }

    static suck(count = 64) {
        let (success, err) = __lua_environment.turtle.suck$notable(count.__value)
        return success ? '' : String(err)
    }

    static suckUp(count = 64) {
        let (success, err) = __lua_environment.turtle.suckUp$notable(count.__value)
        return success ? '' : String(err)
    }

    static suckDown(count = 64) {
        let (success, err) = __lua_environment.turtle.suckDown$notable(count.__value)
        return success ? '' : String(err)
    }

    static getFuelLevel() {
        let fuelLevel = __lua_environment.turtle.getFuelLevel$notable()
        return __lua_environment.type(fuelLevel) == 'string'.__value ? -1 : Number(fuelLevel)
    }

    static refule(count = 1) {
        let (success, err) = __lua_environment.turtle.refuel$notable(count.__value)
        return success ? '' : String(err)
    }

    static compareTo(slot) {
        return Boolean(__lua_environment.turtle.compareTo$notable(slot.__value))
    }

    static transferTo(slot, count = 64) {
        return Boolean(__lua_environment.turtle.transferTo$notable(slot.__value, count.__value))
    }

    static getSelectedSlot() {
        return Number(__lua_environment.turtle.getSelectedSlot$notable())
    }

    static getFuelLimit() {
        let fuelLimit = __lua_environment.turtle.getFuelLimit$notable()
        return __lua_environment.type(fuelLimit) == 'string'.__value ? -1 : Number(fuelLevel)
    }

    static equipLeft() {
        let (success, err) = __lua_environment.turtle.equipLeft$notable()
        return success ? '' : String(err)
    }

    static equipRight() {
        let (success, err) = __lua_environment.turtle.equipRight$notable()
        return success ? '' : String(err)
    }

    static inspect() {
        let (success, info) = __lua_environment.turtle.inspect$notable()
        if(success)
            return __lua_environment.type(info) == 'string'.__value ? {info: info} : Object(info)
        return null
    }

    static inspectUp() {
        let (success, info) = __lua_environment.turtle.inspectUp$notable()
        if(success)
            return __lua_environment.type(info) == 'string'.__value ? {info: info} : Object(info)
        return null
    }

    static inspectDown() {
        let (success, info) = __lua_environment.turtle.inspectDown$notable()
        if(success)
            return __lua_environment.type(info) == 'string'.__value ? {info: info} : Object(info)
        return null
    }

    static getItemDetail(slot, detailed = false) {
        return Object(__lua_environment.turtle.getItemDetail$notable(slot.__value, detailed.__value))
    }

}

export default Turtle