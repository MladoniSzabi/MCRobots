let retval

if(__lua_environment.computer) {
    retval = import("minecraft_classes.OpenComputer.Turtle")
}

if(__lua_environment.vector) {
    retval = import("minecraft_classes.ComputerCraft.Turtle")
}

export default retval