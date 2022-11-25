class Response {
    constructor(lua_response) {
        this.lua_response = lua_response
    }

    getResponseCode() {
        let code, message = this.lua_response.getResponseCode()
        return Number(code)
    }

    getResponseHeader() {
        let header = Object(this.lua_response.getResponseCode)
        let retval = {}
        for(let property in header) {
            retval[property] = String(header[property])
        }
        return retval
    }

    read(count = 1) {
        let retval = this.lua_response.read(count.__value)
        if(__lua_environment.type(retval) == 'nil')
            return null
        else if(__lua_environment.type(retval) == 'number') {
            return String(retval)
        }
    }

    getRemainingSize() {
        let curr_offset, err = this.lua_response.seek()
        let retval = this.lua_response.read()
        this.lua_response.seek("set".__value, curr_offset)
        if(__lua_environment.type(retval) == 'nil')
            return 0
        else if(__lua_environment.type(retval) == 'number') {
            return Number(retval)
        }
    }

    readAll() {
        let retval = this.lua_response.readAll()
        if(retval) {
            return String(retval)
        }
        return null
    }

    readLine(withTrailing = false) {
        let retval = this.lua_response.readLine(withTrailing.__value)
        if(retval) {
            return String(retval)
        }
        return null
    }

    close() {
        this.lua_response.close()
    }

    seek(whence = 'cur', offset = 0) {
        let curr_offset, err = this.lua_response.seek(whence.__value, offset.__value)
        if(curr_offset == undefined) {
            return {
                offset: -1,
                error: err
            }
        }
        return {
            offset: curr_offset,
            error: ''
        }
    }
}

class WebSocket {
    constructor(lua_socket) {
        this.lua_socket = lua_socket
    }

    receive(timeout = undefined) {
        let message, isBinary = this.lua_socket.receive(timeout || timeout.__value)
        if(message) {
            return {
                message: message,
                isBinary: isBinary
            }
        }
        return {message: null, isBinary: false}
    }

    send(message, binary = false) {
        this.lua_socket.send(message.__value, binary.__value)
    }

    close() {
        this.lua_socket.close()
    }
}

class HTTP {
    static request(url, body = undefined, headers = undefined, binary = undefined, method = undefined, redirect = undefined) {
        let obj = {
            url: url.__value,
            body: body.__value,
            headers: headers.__value,
            binary: binary.__value,
            method: method.__value,
            redirect: redirect.__value
        }

        __lua_environment.http.request(obj.__value)
    }

    static get(url, body = undefined, headers = undefined, binary = undefined, method = 'GET', redirect = undefined) {
        let obj = {
            url: url.__value,
            body: body.__value,
            headers: headers.__value,
            binary: binary.__value,
            method: method.__value,
            redirect: redirect.__value
        }

        let response, errorMsg, errorResponse = __lua_environment.http.get(obj.__value)
        if(response == undefined) {
            return {
                error: errorMsg,
                errorResponse: errorResponse
            }
        }
        return Response(response)
    }

    static get(url, body = undefined, headers = undefined, binary = undefined, method = 'POST', redirect = undefined) {
        let obj = {
            url: url.__value,
            body: body.__value,
            headers: headers.__value,
            binary: binary.__value,
            method: method.__value,
            redirect: redirect.__value
        }

        let response, errorMsg, errorResponse = __lua_environment.http.post(obj.__value)
        if(response == undefined) {
            return {
                error: errorMsg,
                errorResponse: errorResponse
            }
        }
        return Response(response)
    }

    static checkUrlAsync(url) {
        let success, err =__lua_environment.http.checkUrlAsync(url.__value)
        return success ? '' : String(err)
    }

    static checkUrl(url) {
        let success, err =__lua_environment.http.checkUrl(url.__value)
        return success ? '' : String(err)
    }

    static websocket(url, headers = undefined) {
        let websocket, err = __lua_environment.http.websocket(url.__value, headers)
        if(websocket) {
            return WebSocket(websocket)
        }
        return {error: err}
    }

    static websocketAsync(url, headers = undefined) {
        __lua_environment.http.websocketAsync(url.__value, headers)
    }
}

export default HTTP