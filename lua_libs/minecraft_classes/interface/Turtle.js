class ITurtle {
    static flush_blocks() { }
    static set_spatial_data(new_spatial_data) { }
    static get_spatial_data() { }
    static craft(limit = 64) { }
    static forward() { }
    static back() { }
    static up() { }
    static down() { }
    static turnLeft() { }
    static turnRight() { }
    static dig(side = null) { }
    static digUp(side = null) { }
    static digDown(side = null) { }
    static place(text = "") { }
    static placeUp(text = "") { }
    static placeDown(text = "") { }
    static drop(count = null) { }
    static dropUp(count = null) { }
    static dropDown(count = null) { }
    static select(slot) { }
    static getItemCount(slot = null) { }
    static getItemSpace(slot = null) { }
    static detect() { }
    static detectUp() { }
    static detectDown() { }
    static compare() { }
    static compareUp() { }
    static compareDown() { }
    static attack(side = null) { }
    static attackUp(side = null) { }
    static attackDown(side = null) { }
    static suck(count = 64) { }
    static suckUp(count = 64) { }
    static suckDown(count = 64) { }
    static getFuelLevel() { }
    static refuel(count = 1) { }
    static compareTo(slot) { }
    static transferTo(slot, count = 64) { }
    static getSelectedSlot() { }
    static getFuelLimit() { }
    static equip() { }
    static inspect() { }
    static inspectUp() { }
    static inspectDown() { }
    static getItemDetail(slot, detailed = false) { }

}

export default Turtle