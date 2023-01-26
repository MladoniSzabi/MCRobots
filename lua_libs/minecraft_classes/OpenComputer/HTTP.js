const internet = __lua_environment.component.internet

class Response {
    constructor(iteratorFunc) {
        this.response = ""
        let iteration = iteratorFunc()
        while(iteration) {
            this.response += iteration + '\n'
            iteration = iteratorFunc()
        }
    }

    getResponseCode() { return 0 }
    getResponseHeader() { return "" }

    getBody() {
        return this.response
    }
}

class HTTP {

    static canMakeRequest() {
        if(!internet) {
            return {
                error: "Computer does not have internet card",
                errorResponse: null
            }
        }

        if(!internet.isHttpEnabled$notable()) {
            return {
                error: "HTTP requests are not enabled by the server",
                errorResponse: null
            }
        }

        return {error: false}
    }

    static request(url, body = undefined, headers = undefined, binary = undefined, method = undefined, redirect = undefined) {
        let canMakeRequestResult = HTTP.canMakeRequest()
        if(canMakeRequestResult.error != false) {
            return canMakeRequestResult
        }

        return Response(internet.request$notable(url, body))
    }

    static get(url, body = undefined, headers = undefined, binary = undefined,  redirect = undefined) {
        let canMakeRequestResult = HTTP.canMakeRequest()
        if(canMakeRequestResult.error != false) {
            return canMakeRequestResult
        }

        return Response(internet.request$notable(url))
    }
    static post(url, body = undefined, headers = undefined, binary = undefined,  redirect = undefined) {
        let canMakeRequestResult = HTTP.canMakeRequest()
        if(canMakeRequestResult.error != false) {
            return canMakeRequestResult
        }

        if(body == undefined) {
            body = {}
        }

        return Response(internet.request$notable(url, body))
    }

    static checkUrl(url) {
        return true
    }
}

export default HTTP