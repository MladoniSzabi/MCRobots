let retval

if(__lua_environment.computer) {
    retval = import("minecraft_classes.OpenComputer")
}

if(__lua_environment.vector) {
    retval = import("minecraft_classes.ComputerCraft")
}

export default retval