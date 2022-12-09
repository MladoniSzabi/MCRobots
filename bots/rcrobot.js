const HTTP = import("minecraft_classes.HTTP")
const Turtle = import("minecraft_classes.Turtle")

function sendBlocks(socket) {
    let message = ""
    let upblock = Turtle.inspectUp()
    if(upblock) {
        message += upblock["name"] + " "
    } else {
        message += "none "
    }
    let forwardBlock = Turtle.inspect()
    if(forwardBlock) {
        message += forwardBlock["name"] + " "
    } else {
        message += "none "
    }
    let bottomBlock = Turtle.inspectDown()
    if(bottomBlock) {
        message += bottomBlock["name"]
    } else {
        message += "none"
    }
    console.log(message)
    socket.send(message)
}

function main() {
    let c = HTTP.websocket("ws://localhost:9999")

    if("error" in c) {
        console.log("There was an error connecting to the server", c.error)
        return
    }

    sendBlocks(c)

    while(1) {
        let response = c.receive(5)
        if(response.message) {
            if(response.message == 'w') {
                Turtle.forward()
            }
            else if(response.message == 'a') {
                Turtle.turnLeft()
            }
            else if(response.message == 's'){
                Turtle.back()
            }
            else if(response.message == 'd') {
                Turtle.turnRight()
            }

            sendBlocks(c)
        } else {
            console.log("no message")
        }
    }
    
}

main()