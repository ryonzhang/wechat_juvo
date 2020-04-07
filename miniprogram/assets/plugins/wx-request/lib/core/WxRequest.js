import InterceptorManager from './InterceptorManager'
import Utils from './../helpers/Utils'

/**
 * Promise wrapping wx.request 
 * 
 * @param {Object} defaults options
 * @param {String} defaults.suffix 
 * @param {String} defaults.baseURL 
 * @param {Object} defaults.header 
 * @param {Array} defaults.transformRequest 
 * @param {Array} defaults.transformResponse 
 * @param {Function} defaults.validateStatus 
 * 
 */
class WxRequest {
    constructor(defaults) {
        Object.assign(this, {
            defaults,
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
        const defaults = {
            suffix: 'Request',
            baseURL: '',
            header: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            transformRequest: [
                (data, header) => {
                    return data
                },
            ],
            transformResponse: [
                (data, header) => {
                    if (typeof data === 'string') {
                        try {
                            data = JSON.parse(data)
                        } catch (e) { /* Ignore */ }
                    }
                    return data
                },
            ],
            validateStatus: status => status >= 200 && status < 300,
        }

        this.defaults = Object.assign({}, defaults, this.defaults)
    }


    __initMethods() {
        const suffix = this.defaults.suffix

        const instanceSource = {
            method: [
                'OPTIONS',
                'GET',
                'HEAD',
                'POST',
                'PUT',
                'DELETE',
                'TRACE',
                'CONNECT',
            ],
        }

        for (let key in instanceSource) {
            instanceSource[key].forEach((method, index) => {
                this[method.toLowerCase() + suffix] = (url, config) => {
                    return this.__defaultRequest(Object.assign({}, config, {
                        method,
                        url,
                    }))
                }
            })
        }

        this.request = (...args) => this.__defaultRequest(...args)

        this.all = promises => Promise.all(promises)
    }

    /**
     * @param {Object|String} config 
     * @param {String} config.method 
     * @param {String} config.url   
     * @param {Object} config.data 
     * @param {Object} config.header 
     * @param {String} config.dataType 
     */
    __defaultRequest(config) {

        if (typeof config === 'string') {
            config = Object.assign({}, {
                url: arguments[1]
            }, arguments[2])
        }

        const defaults = Object.assign({
            method: 'GET',
            dataType: 'json',
        }, this.defaults, config)

        const { baseURL, header, validateStatus } = defaults

        const $$config = {
            url: defaults.url,
            data: defaults.data,
            header: defaults.header,
            method: defaults.method,
            dataType: defaults.dataType,
        }

        if (this.$$prefix && !Utils.isAbsoluteURL($$config.url)) {
            $$config.url = Utils.combineURLs(this.$$prefix, $$config.url)
        }

        if (baseURL && !Utils.isAbsoluteURL($$config.url)) {
            $$config.url = Utils.combineURLs(baseURL, $$config.url)
        }

        const chainInterceptors = (promise, interceptors) => {
            for (let i = 0, ii = interceptors.length; i < ii;) {
                let thenFn = interceptors[i++]
                let rejectFn = interceptors[i++]
                promise = promise.then(thenFn, rejectFn)
            }
            return promise
        }

        const transformData = (data, header, status, fns) => {
            fns.forEach(fn => {
                data = fn(data, header, status)
            })
            return data
        }

        const transformResponse = res => {
            const __res = Object.assign({}, res, {
                data: transformData(res.data, res.header, res.statusCode, defaults.transformResponse),
            })
            return validateStatus(res.statusCode) ? __res : Promise.reject(__res)
        }

        const serverRequest = config => {
            const __config = Object.assign({}, config, {
                data: transformData($$config.data, $$config.header, undefined, defaults.transformRequest),
            })
            return this.__http(__config).then(transformResponse, transformResponse)
        }

        let requestInterceptors = []
        let responseInterceptors = []
        let promise = Promise.resolve($$config)

        this.interceptors.forEach(n => {
            if (n.request || n.requestError) {
                requestInterceptors.push(n.request, n.requestError)
            }
            if (n.response || n.responseError) {
                responseInterceptors.unshift(n.response, n.responseError)
            }
        })

        promise = chainInterceptors(promise, requestInterceptors)

        promise = promise.then(serverRequest)

        promise = chainInterceptors(promise, responseInterceptors)

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

export default WxRequest