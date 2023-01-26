const js = import("javascript_functions")

function __prepare_environment() {
    js.__prepare_environment()
    //_G.sleep = __lua_environment.sleep
}

export default {
    __prepare_environment: __prepare_environment
}