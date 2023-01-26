let retval

if(__lua_environment.computer) {
    retval = import("minecraft_classes.OpenComputer.HTTP")
}

if(__lua_environment.vector) {
    retval = import("minecraft_classes.ComputerCraft.HTTP")
}

export default retval