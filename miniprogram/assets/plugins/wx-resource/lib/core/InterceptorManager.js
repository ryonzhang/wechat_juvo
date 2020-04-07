/**
 * register interceptor
 */
class InterceptorManager {
    constructor() {
        this.__init()
    }

    __init() {
        this.handlers = []
    }

    /**
     * add an interceptor
     */
    use(obj) {
        this.handlers.push({
            request: obj.request,
            requestError: obj.requestError,
            response: obj.response,
            responseError: obj.responseError,
        })
        return this.handlers.length - 1
    }

    /**
     * remove an interceptor
     */
    eject(id) {
        if (this.handlers[id]) {
            this.handlers[id] = null
        }
    }

    /**
     * traverse all interceptors
     */
    forEach(fn) {
        this.handlers.forEach(h => {
            if (h !== null) {
                fn(h)
            }
        })
    }
}

export default InterceptorManager