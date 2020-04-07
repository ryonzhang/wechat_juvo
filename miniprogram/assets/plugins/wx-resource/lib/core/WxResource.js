import InterceptorManager from './InterceptorManager'
import RouteManager from './RouteManager'

/**
 * 
 * @param {String} url 
 * @param {Object} paramDefaults 
 * @param {Object} actions
 * @param {Object} options 
 * 
 */
class WxResource {
    constructor(url = '', paramDefaults = {}, actions = {}, options = {}) {
        Object.assign(this, {
            url,
            paramDefaults,
            actions,
            options,
        })
        this.__init()
    }

 
    __init() {
        this.__initInterceptor()
        this.__initDefaults()
        this.__initMethods()
    }

    __initInterceptor() {
        this.interceptors = new InterceptorManager
        this.interceptors.use({
            request(request) {
                request.requestTimestamp = new Date().getTime()
                return request
            },
            requestError(requestError) {
                return Promise.reject(requestError)
            },
            response(response) {
                response.responseTimestamp = new Date().getTime()
                return response
            },
            responseError(responseError) {
                return Promise.reject(responseError)
            },
        })
    }

    __initDefaults() {
        this.defaults = {
            stripTrailingSlashes: true,

            suffix: 'Async',

            actions: {
                'get': { method: 'GET' },
                'save': { method: 'POST' },
                'update': { method: 'PUT' },
                'query': { method: 'GET' },
                'remove': { method: 'DELETE' },
                'delete': { method: 'DELETE' },
            }
        }
    }

    __initRoute(template, defaults) {
        return new RouteManager(template, Object.assign({}, this.defaults, defaults))
    }

    __initMethods() {
        const route = this.__initRoute(this.url, this.options)
        const actions = Object.assign({}, this.defaults.actions, this.actions)

        for (let name in actions) {
            this[name + route.defaults.suffix] = (...args) => {
                const httpConfig = this.__setHttpConfig(route, actions[name], ...args)
                return this.__defaultRequest(httpConfig)
            }
        }
    }

    /**
     * 
     * @param {object} route 
     * @param {string} action 
     * @param {arrary} args 
     */
    __setHttpConfig(route, action, ...args) {
        const MEMBER_NAME_REGEX = /^(\.[a-zA-Z_$@][0-9a-zA-Z_$@]*)+$/

        const isValidDottedPath = (path) => {
            return (path != null && path !== '' && path !== 'hasOwnProperty' && MEMBER_NAME_REGEX.test('.' + path))
        }

        const lookupDottedPath = (obj, path) => {
            if (!isValidDottedPath(path)) {
                throw `badmember, Dotted member path ${path} is invalid.`
            }
            let keys = path.split('.')
            for (let i = 0, ii = keys.length; i < ii && typeof obj !== 'undefined'; i++) {
                let key = keys[i]
                obj = (obj !== null) ? obj[key] : undefined
            }
            return obj
        }

        const extractParams = (data, actionParams) => {
            let ids = {}
            actionParams = Object.assign({}, this.paramDefaults, actionParams)
            for (let key in actionParams) {
                let value = actionParams[key]
                if (typeof value === 'function') {
                    value = value(data)
                }
                ids[key] = value && value.charAt && value.charAt(0) === '@' ? lookupDottedPath(data, value.substr(1)) : value
            }
            return ids
        }

        let params = {},
            data = {},
            httpConfig = {},
            hasBody = /^(POST|PUT|PATCH)$/i.test(action.method)

        switch (args.length) {
            case 2:
                params = args[0]
                data = args[1]
                break
            case 1:
                if (hasBody) data = args[0]
                else params = args[0]
                break
            case 0:
                break
            default:
                throw `Expected up to 2 arguments [params, data], got ${args.length} arguments`
        }

        for (let key in action) {
            switch (key) {
                case 'params':
                case 'isArray':
                case 'interceptor':
                case 'cancellable':
                    break
                default:
                    httpConfig[key] = action[key]
                    break
            }
        }

        if (hasBody) {
            httpConfig.data = data
        }

        route.setUrlParams(httpConfig, Object.assign({}, extractParams(data, action.params || {}), params), action.url)

        return httpConfig
    }


    __defaultRequest(httpConfig) {
        const chainInterceptors = (promise, interceptors) => {
            for (let i = 0, ii = interceptors.length; i < ii;) {
                let thenFn = interceptors[i++]
                let rejectFn = interceptors[i++]
                promise = promise.then(thenFn, rejectFn)
            }
            return promise
        }

        let requestInterceptors = []
        let responseInterceptors = []
        let promise = Promise.resolve(httpConfig)

        this.interceptors.forEach(n => {
            if (n.request || n.requestError) {
                requestInterceptors.push(n.request, n.requestError)
            }
            if (n.response || n.responseError) {
                responseInterceptors.unshift(n.response, n.responseError)
            }
        })

        promise = chainInterceptors(promise, requestInterceptors)

        promise = promise.then(this.__http)

        promise = chainInterceptors(promise, responseInterceptors)

        promise = promise.then(res => res, err => err)

        return promise
    }

    /**
     * __http - wx.request
     */
    __http(obj) {
        return new Promise((resolve, reject) => {
            obj.success = (res) => resolve(res)
            obj.fail = (res) => reject(res)
            wx.request(obj)
        })
    }
}

export default WxResource