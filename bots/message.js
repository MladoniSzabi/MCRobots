const RemoteControlStrategy = import("remote_control_strategy")
const VectorImport = import("minecraft_classes.Vector")
const Vector = VectorImport.Vector

class Message {

    static encode_surrounding(surrounding) {
        let message = ""
        if (surrounding[0]) {
            message += surrounding[0]["name"] + " "
        } else {
            message += "none "
        }

        if (surrounding[1]) {
            message += surrounding[1]["name"] + " "
        } else {
            message += "none "
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
        let orientation
        if(tokens[4] == "north")
            orientation = VectorImport.ORIENTATION_NORTH
        if(tokens[4] == "south")
            orientation = VectorImport.ORIENTATION_SOUTH
        if(tokens[4] == "west")
            orientation = VectorImport.ORIENTATION_WEST
        if(tokens[4] == "east")
            orientation = VectorImport.ORIENTATION_EAST
        
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