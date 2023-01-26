class Response {
    constructor() { }
    getResponseCode() { }
    getResponseHeader() { }
    getBody() { }
}

class WebSocket {
    constructor() { }
    receive(timeout = undefined) { }
    send(message, binary = false) { }
    close() { }
}

class HTTP {
    static supportsWebsocket() { }
    static request(url, body = undefined, headers = undefined, binary = undefined, method = undefined, redirect = undefined) { }
    static get(url, body = undefined, headers = undefined, binary = undefined, redirect = undefined) { }
    static post(url, body = undefined, headers = undefined, binary = undefined, redirect = undefined) { }
    static checkUrl(url) { }
    static websocket(url, headers = undefined) { }
}

export default HTTP