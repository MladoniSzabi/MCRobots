class WebSocket {
    static supportsWebsocket() {
        return true
    }

    constructor(url, headers = undefined) {
        this.url = url
        this.headers = headers
    }

    connect() {
        let(websocket, err) = __lua_environment.http.websocket$notable(url.__value, headers)
        if (websocket) {
            this.socket = websocket
            return {}
        }
        return { error: err }
    }

    receive(timeout = undefined) {
        if (timeout != undefined) {
            timeout = timeout.__value
        }
        let(message, isBinary) = this.socket.receive$notable(timeout)
        if (message) {
            return {
                message: String(message),
                isBinary: Boolean(isBinary)
            }
        }
        return { message: null, isBinary: false }
    }

    send(message, binary = false) {
        if (message instanceof Array) {
            let encodedMessage = ""
            for (let el of message) {
                encodedMessage += String(__lua_environment.string.char$notable(el.__value))
            }
            this.socket.send$notable(encodedMessage.__value, binary.__value)
        } else {
            this.socket.send$notable(message.__value, binary.__value)
        }
    }

    close() {
        this.socket.close$notable()
    }
}