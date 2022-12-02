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
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z *this.z)
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

export default Vector