class WebSocket {
    static supportsWebsocket() { return false }

    constructor(url, headers = undefined) { console.error("Not implemented") }
    connect() { }
    receive(timeout = undefined) { }
    send(message, binary = false) { }
    close() { }
}