class WxService {
    constructor() {
        this.__init()
    }

    /**
     * __init
     */
    __init() {
        this.__initTools()
        this.__initDefaults()
        this.__initMethods()
    }

    __initTools() {
        this.tools = {
            isArray(value) {
                return Array.isArray(value)
            },
            isObject(value) {
                return value !== null && typeof value === 'object'
            },
            isNumber(value) {
                return typeof value === 'number'
            },
            isDate(value) {
                return Object.prototype.toString.call(value) === '[object Date]'
            },
            isUndefined(value) {
                return typeof value === 'undefined'
            },
            toJson(obj, pretty) {
                if (this.isUndefined(obj)) return undefined
                if (!this.isNumber(pretty)) {
                    pretty = pretty ? 2 : null
                }
                return JSON.stringify(obj, null, pretty)
            },
            serializeValue(value) {
                if (this.isObject(value)) return this.isDate(value) ? value.toISOString() : this.toJson(value)
                return value
            },
            encodeUriQuery(value, pctEncodeSpaces) {
                return encodeURIComponent(value)
                    .replace(/%40/gi, '@')
                    .replace(/%3A/gi, ':')
                    .replace(/%24/g, '$')
                    .replace(/%2C/gi, ',')
                    .replace(/%3B/gi, ';')
                    .replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'))
            },
            paramSerializer(obj) {
                if (!obj) return ''
                let parts = []
                for (let key in obj) {
                    const value = obj[key]
                    if (value === null || this.isUndefined(value)) return
                    if (this.isArray(value)) {
                        value.forEach((v) => {
                            parts.push(this.encodeUriQuery(key) + '=' + this.encodeUriQuery(this.serializeValue(v)))
                        })
                    } else {
                        parts.push(this.encodeUriQuery(key) + '=' + this.encodeUriQuery(this.serializeValue(value)))
                    }
                }
                return parts.join('&')
            },
            buildUrl(url, obj) {
                const serializedParams = this.paramSerializer(obj)
                if (serializedParams.length > 0) {
                    url += ((url.indexOf('?') == -1) ? '?' : '&') + serializedParams
                }
                return url
            },
        }
    }

    __initDefaults() {
        this.noPromiseMethods = [
            'stopRecord',
            'pauseVoice',
            'stopVoice',
            'pauseBackgroundAudio',
            'stopBackgroundAudio',
            'showNavigationBarLoading',
            'hideNavigationBarLoading',
            'createAnimation',
            'createContext',
            'hideKeyboard',
            'stopPullDownRefresh',
        ]

        this.instanceSource = {
            method: Object.keys(wx)
        }
    }


    __initMethods() {
        for (let key in this.instanceSource) {
            this.instanceSource[key].forEach((method, index) => {
                this[method] = (...args) => {
                    if (this.noPromiseMethods.indexOf(method) !== -1 || method.substr(0, 2) === 'on' || /\w+Sync$/.test(method)) {
                        return wx[method](...args)
                    }
                    return this.__defaultRequest(method, ...args)
                }
            })
        }

        const navigate = [
            'navigateTo',
            'redirectTo',
            'switchTab',
            'reLaunch',
        ]

        navigate.forEach((method, index) => {
            this[method] = (url, params) => {
                const obj = {
                    url,
                }
                if (method !== 'switchTab') {
                    obj.url = this.tools.buildUrl(url, params)
                }
                return this.__defaultRequest(method, obj)
            }
        })


        this.navigateBack = (delta = 1) => {
            return wx.navigateBack({
                delta,
            })
        }
    }

    __defaultRequest(method = '', obj = {}) {
        return new Promise((resolve, reject) => {
            obj.success = (res) => resolve(res)
            obj.fail = (res) => reject(res)
            wx[method](obj)
        })
    }
}

export default WxService