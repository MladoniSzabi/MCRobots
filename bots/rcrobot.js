const HTTP = import("minecraft_classes.HTTP")
//const Turtle = import('minecraft_classes.Turtle')

function main() {
    let c = HTTP.websocket("ws://localhost:9999")

    if("error" in c) {
        console.log("There was an error connecting to the server", c.error)
        return
    }
    
}

main()