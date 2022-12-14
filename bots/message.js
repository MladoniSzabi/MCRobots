const RemoteControlStrategy = import("remote_control_strategy")
const VectorImport = import("minecraft_classes.Vector")
const Turtle = import("minecraft_classes.Turtle")
const Vector = VectorImport.Vector

class Message {

    static orientation_to_string(orientation) {
        if(orientation.equals(VectorImport.ORIENTATION_NORTH))
            return "north"
        if(orientation.equals(VectorImport.ORIENTATION_SOUTH))
            return "south"
        if(orientation.equals(VectorImport.ORIENTATION_WEST))
            return "west"
        if(orientation.equals(VectorImport.ORIENTATION_EAST))
            return "east"
        return ""
    }

    static string_to_orientation(orientation_string) {
        if(orientation_string == "north")
            return VectorImport.ORIENTATION_NORTH
        if(orientation_string == "south")
            return VectorImport.ORIENTATION_SOUTH
        if(orientation_string == "west")
            return VectorImport.ORIENTATION_WEST
        if(orientation_string == "east")
            return VectorImport.ORIENTATION_EAST
        return new VectorImport.Orientation(new Vector(0,0,0))
    }

    static encode_surrounding(surrounding) {
        
        let message = Turtle.get_spatial_data().position.toString() + ", " + Message.orientation_to_string(Turtle.get_spatial_data().orientation) + ", "
        if (surrounding[0]) {
            message += surrounding[0]["name"] + ", "
        } else {
            message += "none, "
        }

        if (surrounding[1]) {
            message += surrounding[1]["name"] + ", "
        } else {
            message += "none, "
        }

        if (surrounding[2]) {
            message += surrounding[2]["name"]
        } else {
            message += "none"
        }

        return message
    }

    static encode(message_type, ...params) {
        if (message_type == "surrounding") {
            return Message.encode_surrounding(params)
        }
    }

    static decode_init_command(message) {
        let tokens = message.split(" ")
        let position = new Vector(Number(tokens[1]), Number(tokens[2]), Number(tokens[3]))
        let orientation = Message.string_to_orientation(tokens[4])
        
        let strategy = null
        if(tokens[5] == "rc") {
            strategy = new RemoteControlStrategy()
        }
        
        return {
            type: "init",
            spatial_data: {
                position: position,
                orientation: orientation
            },
            strategy: strategy
        }
    }

    static decode(message) {
        if (!message)
            return { type: "empty" }
        if (message == "w")
            return { type: "movement", direction: "forward" }
        if (message == "s")
            return { type: "movement", direction: "backwards" }
        if (message == "a")
            return { type: "movement", direction: "left" }
        if (message == "d")
            return { type: "movement", direction: "right" }
        if (message[0] == "i")
            return Message.decode_init_command(message)

        return { type: "unknown" }
    }
}

export default Message