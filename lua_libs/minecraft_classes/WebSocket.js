let retval

if(__lua_environment.computer) {
    retval = import("minecraft_classes.OpenComputer.WebSocket")
}

if(__lua_environment.vector) {
    retval = import("minecraft_classes.ComputerCraft.WebSocket")
}

export default retval