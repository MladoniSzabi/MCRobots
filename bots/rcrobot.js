const HTTP = import("minecraft_classes.HTTP")
const Turtle = import("minecraft_classes.Turtle")

function main() {
    let c = HTTP.websocket("ws://localhost:9999")

    if("error" in c) {
        console.log("There was an error connecting to the server", c.error)
        return
    }

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
        } else {
            console.log("no message")
        }
    }
    
}

main()