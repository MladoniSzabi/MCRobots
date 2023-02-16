class Vector {

    constructor(x = 0, y = 0, z = 0) {
        this.x = x
        this.y = y
        this.z = z
    }

    add(other) {
        return new Vector(this.x + other.x, this.y + other.y, this.z + other.z)
    }

    sub(other) {
        return new Vector(this.x - other.x, this.y - other.y, this.z - other.z)
    }

    mul(other) {
        return new Vector(this.x * other.x, this.y * other.y, this.z * other.z)
    }

    div(other) {
        return new Vector(this.x / other.x, this.y / other.y, this.z / other.z)
    }

    dot(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z
    }

    cross(other) {
        return new Vector(
            this.y * other.z - this.z * other.y,
            this.z * other.a - this.a * other.z,
            this.a * other.b - this.b * other.a
        )
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)
    }

    normalize() {
        let length = this.length()
        return new Vector(this.x / length, this.y / length, this.z / length)
    }

    toString() {
        return this.x.toString() + ", " + this.y.toString() + ", " + this.z.toString()
    }

    equals(other) {
        return this.x == other.x && this.y == other.y && this.z == other.z
    }

    __toLuaVector() {
        return __lua_environment.vector['new']$notable(this.x.__value, this.y.__value, this.z.__value)
    }
}

/*                           north                    east                  south                west         */
const ORIENTATIONS_XZ = [new Vector(0, 0, -1), new Vector(1, 0, 0), new Vector(0, 0, 1), new Vector(-1, 0, 0)]

class Orientation {

    direction_vector = null

    constructor(vector) {
        if (vector) {
            this.direction_vector = vector
        } else {
            this.direction_vector = new Vector(1, 0, 0)
        }
    }

    turn_left() {
        let index = ORIENTATIONS_XZ.indexOf(this.direction_vector)
        if (index == -1) {
            return this
        }

        return new Orientation(ORIENTATIONS_XZ[(index + 1) % ORIENTATIONS_XZ.length])
    }

    turn_right() {
        let index = ORIENTATIONS_XZ.indexOf(this.direction_vector)
        if (index == -1) {
            return this
        }

        return new Orientation(ORIENTATIONS_XZ[(index - 1) % ORIENTATIONS_XZ.length])
    }

    equals(other_orientation) {
        // Check if they both point to the same vector first since its quicker
        if (this.direction_vector == other_orientation.direction_vector) {
            return true
        }

        return this.direction_vector.equals(other_orientation.direction_vector)
    }

}

const ORIENTATION_NORTH = new Orientation(ORIENTATIONS_XZ[0])
const ORIENTATION_SOUTH = new Orientation(ORIENTATIONS_XZ[2])
const ORIENTATION_WEST = new Orientation(ORIENTATIONS_XZ[3])
const ORIENTATION_EAST = new Orientation(ORIENTATIONS_XZ[1])
const ORIENTATION_UP = new Orientation(new Vector(0, 1, 0))
const ORIENTATION_DOWN = new Orientation(new Vector(0, -1, 0))

export default {
    Vector: Vector,
    Orientation: Orientation,
    ORIENTATION_NORTH: ORIENTATION_NORTH,
    ORIENTATION_SOUTH: ORIENTATION_SOUTH,
    ORIENTATION_WEST: ORIENTATION_WEST,
    ORIENTATION_EAST: ORIENTATION_EAST,
    ORIENTATION_UP: ORIENTATION_UP,
    ORIENTATION_DOWN: ORIENTATION_DOWN,
    ORIENTATIONS_XZ: ORIENTATIONS_XZ
}