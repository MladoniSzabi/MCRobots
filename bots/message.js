const PathFollowStrategy = import("path_follower")
const RemoteControlStrategy = import("remote_control_strategy")
const DiggingStrategy = import("digging_strategy")
const VectorImport = import("minecraft_classes.Vector")
const Robot = import("minecraft_classes.Robot")
const Vector = VectorImport.Vector

class Message {

    static orientation_to_string(orientation) {
        if (orientation.equals(VectorImport.ORIENTATION_NORTH))
            return "north"
        if (orientation.equals(VectorImport.ORIENTATION_SOUTH))
            return "south"
        if (orientation.equals(VectorImport.ORIENTATION_WEST))
            return "west"
        if (orientation.equals(VectorImport.ORIENTATION_EAST))
            return "east"
        return ""
    }

    static string_to_orientation(orientation_string) {
        if (orientation_string == "north")
            return VectorImport.ORIENTATION_NORTH
        if (orientation_string == "south")
            return VectorImport.ORIENTATION_SOUTH
        if (orientation_string == "west")
            return VectorImport.ORIENTATION_WEST
        if (orientation_string == "east")
            return VectorImport.ORIENTATION_EAST
        return new VectorImport.Orientation(new Vector(0, 0, 0))
    }

    static encode_surrounding(new_block_location, new_block_value) {

        let messages = []
        let message = "position, " + Robot.get_spatial_data().position.toString() + ", " + Message.orientation_to_string(Robot.get_spatial_data().orientation)
        messages.push(message)
        message = "block, " + new_block_location.toString() + ", "
        if (new_block_value != null) {
            message += String(new_block_value["name"]) + ", "
        } else {
            message += "none"
        }
        messages.push(message)

        return messages
    }

    static encode(message_type, ...params) {
        if (message_type == "init") {
            return "init, " + String(params[0])
        }

        if (message_type == "surrounding") {
            return Message.encode_surrounding(params[0], params[1])
        }
    }

    static decode_init_command(message) {
        let tokens = message.split(" ")
        let position = new Vector(Number(tokens[1]), Number(tokens[2]), Number(tokens[3]))
        let orientation = Message.string_to_orientation(tokens[4])

        let strategy = null
        if (tokens[5] == "rc") {
            strategy = new RemoteControlStrategy()
        } else if (tokens[5] == "dig") {
            strategy = new DiggingStrategy()
        } else if (tokens[5] == "follow") {
            strategy = new PathFollowStrategy()
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

    static decode_follow_command(message) {
        let tokens = message.split(" ")
        let path = []
        for (let i = 1; i < tokens.length; i += 3) {
            path.push(new Vector(Number(tokens[i]), Number(tokens[i + 1]), Number(tokens[i + 2])))
        }
        return { type: "follow", path: path }
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
        if (message[0] == "f")
            return Message.decode_follow_command(message)

        return { type: "unknown" }
    }
}

export default Message