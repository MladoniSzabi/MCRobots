class Response {
    constructor(lua_response) {
        this.lua_response = lua_response
    }

    getResponseCode() {
        let (code, message) = this.lua_response.getResponseCode()
        return Number(code)
    }

    getResponseHeader() {
        let header = Object(this.lua_response.getResponseHeaders())
        let retval = {}
        for(let property in header) {
            retval[property] = String(header[property])
        }
        return retval
    }

    read(count = 1) {
        let retval = this.lua_response.read$notable(count.__value)
        if(__lua_environment.type$notable(retval) == 'nil')
            return null
        else if(__lua_environment.type$notable(retval) == 'number') {
            return String(retval)
        }
    }

    getRemainingSize() {
        let (curr_offset, err) = this.lua_response.seek$notable()
        let retval = this.lua_response.read$notable()
        this.lua_response.seek$notable("set".__value, curr_offset)
        if(__lua_environment.type$notable(retval) == 'nil')
            return 0
        else if(__lua_environment.type$notable(retval) == 'number') {
            return Number(retval)
        }
    }

    readAll() {
        let retval = this.lua_response.readAll$notable()
        if(retval) {
            return String(retval)
        }
        return null
    }

    readLine(withTrailing = false) {
        let retval = this.lua_response.readLine$notable(withTrailing.__value)
        if(retval) {
            return String(retval)
        }
        return null
    }

    close() {
        this.lua_response.close()
    }

    seek(whence = 'cur', offset = 0) {
        let (curr_offset, err) = this.lua_response.seek$notable(whence.__value, offset.__value)
        if(curr_offset == undefined) {
            return {
                offset: -1,
                error: String(err)
            }
        }
        return {
            offset: Number(curr_offset),
            error: ''
        }
    }
}

class WebSocket {
    constructor(lua_socket) {
        this.lua_socket = lua_socket
    }

    receive(timeout = undefined) {
        let (message, isBinary) = this.lua_socket.receive$notable(timeout && timeout.__value)
        if(message) {
            return {
                message: String(message),
                isBinary: Boolean(isBinary)
            }
        }
        return {message: null, isBinary: false}
    }

    send(message, binary = false) {
        if(message instanceof Array) {
            let encodedMessage = ""
            for(let el of message) {
                encodedMessage += String(__lua_environment.string.char$notable(el.__value))
            }
            this.lua_socket.send$notable(encodedMessage.__value, binary.__value)
        } else {
            this.lua_socket.send$notable(message.__value, binary.__value)
        }
    }

    close() {
        this.lua_socket.close$notable()
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

        __lua_environment.http.request$notable(obj.__value)
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

        let (response, errorMsg, errorResponse) = __lua_environment.http.get$notable(obj.__value)
        if(response == undefined) {
            return {
                error: errorMsg,
                errorResponse: errorResponse
            }
        }
        return new Response(response)
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

        let (response, errorMsg, errorResponse) = __lua_environment.http.post$notable(obj.__value)
        if(response == undefined) {
            return {
                error: errorMsg,
                errorResponse: errorResponse
            }
        }
        return new Response(response)
    }

    static checkUrlAsync(url) {
        let (success, err) =__lua_environment.http.checkUrlAsync$notable(url.__value)
        return success ? '' : String(err)
    }

    static checkUrl(url) {
        let (success, err) =__lua_environment.http.checkUrl$notable(url.__value)
        return success ? '' : String(err)
    }

    static websocket(url, headers = undefined) {
        let (websocket, err) = __lua_environment.http.websocket$notable(url.__value, headers)
        if(websocket) {
            return new WebSocket(websocket)
        }
        return {error: err}
    }

    static websocketAsync(url, headers = undefined) {
        __lua_environment.http.websocketAsync$notable(url.__value, headers)
    }
}

export default HTTP