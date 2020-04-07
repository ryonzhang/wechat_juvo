/**
 * 
 * @param {Object} rules 
 * @param {Object} messages 
 * 
 */
class WxValidate {
	constructor(rules = {}, messages = {}) {
		Object.assign(this, {
			rules, 
			messages, 
		})
		this.__init()
	}

	/**
	 * __init
	 */
	__init() {
		this.__initMethods()
		this.__initDefaults()
		this.__initData()
	}


	__initData() {
		this.form = {}
		this.errorList = []
	}

	__initDefaults() {
		this.defaults = {
			messages: {
				required: 'This is required',
				email: 'Please enter an valid email',
				tel: 'Please enter phone number of 11 digits',
				url: 'Please enter a valid URL',
				date: 'Please enter a date',
				dateISO: 'Please enter a valid date e.g.2009-06-23，1998/01/22',
				number: 'Please enter a number',
				digits: 'Please enter a digit',
				idcard: 'Please enter a valid ID card number',
				equalTo: this.formatTpl('Must be the same with {0} '),
				contains: this.formatTpl('Must contain {0}'),
				minlength: this.formatTpl('At least {0} chars'),
				maxlength: this.formatTpl('At most {0} chars'),
				rangelength: this.formatTpl('Length must be between {0} to {1}'),
				min: this.formatTpl('Must be larger than {0} '),
				max: this.formatTpl('Must be smaller than {0} '),
				range: this.formatTpl('Range from {0} to {1} '),
			}
		}
	}


	__initMethods() {
		const that = this
		that.methods = {

			required(value, param) {
				if (!that.depend(param)) {
					return 'dependency-mismatch'
				} else if (typeof value === 'number') {
					value = value.toString()
				} else if (typeof value === 'boolean') {
					return !0
				}

				return value.length > 0
			},

			email(value) {
				return that.optional(value) || /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(value)
			},

			tel(value) {
				return that.optional(value) || /^1[34578]\d{9}$/.test(value)
			},

			url(value) {
				return that.optional(value) || /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})).?)(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value)
			},

			date(value) {
				return that.optional(value) || !/Invalid|NaN/.test(new Date(value).toString())
			},

			dateISO(value) {
				return that.optional(value) || /^\d{4}[\/\-](0?[1-9]|1[012])[\/\-](0?[1-9]|[12][0-9]|3[01])$/.test(value)
			},

			number(value) {
				return that.optional(value) || /^(?:-?\d+|-?\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value)
			},

			digits(value) {
				return that.optional(value) || /^\d+$/.test(value)
			},

			idcard(value) {
				return that.optional(value) || /^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/.test(value)
			},

			equalTo(value, param) {
				return that.optional(value) || value === that.scope.detail.value[param]
			},

			contains(value, param) {
				return that.optional(value) || value.indexOf(param) >= 0
			},

			minlength(value, param) {
				return that.optional(value) || value.length >= param
			},

			maxlength(value, param) {
				return that.optional(value) || value.length <= param
			},

			rangelength(value, param) {
				return that.optional(value) || (value.length >= param[0] && value.length <= param[1])
			},

			min(value, param) {
				return that.optional(value) || value >= param
			},

			max(value, param) {
				return that.optional(value) || value <= param
			},

			range(value, param) {
				return that.optional(value) || (value >= param[0] && value <= param[1])
			},
		}
	}


	addMethod(name, method, message) {
		this.methods[name] = method
		this.defaults.messages[name] = message !== undefined ? message : this.defaults.messages[name]
	}


	isValidMethod(value) {
		let methods = []
		for(let method in this.methods) {
			if (method && typeof this.methods[method] === 'function') {
				methods.push(method)
			}
		}
		return methods.indexOf(value) !== -1
	}

	formatTpl(source, params) {
		const that = this
		if (arguments.length === 1) {
			return function() {
				let args = Array.from(arguments)
				args.unshift(source)
				return that.formatTpl.apply(this, args)
			}
		}
		if (params === undefined) {
			return source
		}
		if (arguments.length > 2 && params.constructor !== Array) {
			params = Array.from(arguments).slice(1)
		}
		if (params.constructor !== Array) {
			params = [ params ]
		}
		params.forEach(function(n, i) {
			source = source.replace(new RegExp("\\{" + i + "\\}", "g"), function() {
				return n
			})
		})
		return source
	}


	depend(param) {
		switch(typeof param) {
			case 'boolean':
				param = param
				break
			case 'string':
				param = !!param.length
				break
			case 'function':
				param = param()
			default:
				param = !0
		}
		return param
	}


	optional(value) {
		return !this.methods.required(value) && 'dependency-mismatch'
	}


	customMessage(param, rule) {
		const params = this.messages[param]
		const isObject = typeof params === 'object'
		if (params && isObject) return params[rule.method]
	}


	defaultMessage(param, rule) {
		let message = this.customMessage(param, rule) || this.defaults.messages[rule.method]
		let type = typeof message
		
		if (type === 'undefined') {
			message = `Warning: No message defined for ${rule.method}.`
		} else if (type === 'function') {
			message = message.call(this, rule.parameters)
		}

		return message
	}

	formatTplAndAdd(param, rule, value) {
		let msg = this.defaultMessage(param, rule)

		this.errorList.push({
			param: param, 
			msg: msg, 
			value: value, 
		})
	}


	checkParam(param, rules, event) {

		this.scope = event

		const data = event.detail.value
		const value = data[param] || ''

		for(let method in rules) {

			if (this.isValidMethod(method)) {

				const rule = { 
					method: method, 
					parameters: rules[method] 
				}

				const result = this.methods[method](value, rule.parameters)
				
				if (result === 'dependency-mismatch') {
					continue
				}

				this.setValue(param, method, result, value)

				if (!result) {
					this.formatTplAndAdd(param, rule, value)
					break
				}
			}
		}
	}


	setView(param) {
		this.form[param] = {
			$name: param, 
			$valid: true, 
			$invalid: false, 
			$error: {}, 
			$success: {}, 
			$viewValue: ``, 
		}
	}


	setValue(param, method, result, value) {
		const params = this.form[param]
		params.$valid = result
		params.$invalid = !result
		params.$error[method] = !result
		params.$success[method] = result
		params.$viewValue = value
	}

	
	checkForm(event) {
		this.__initData()

		for (let param in this.rules) {
			this.setView(param)
			this.checkParam(param, this.rules[param], event)
		}

		return this.valid()
	}

	
	valid() {
		return this.size() === 0
	}


	size() {
		return this.errorList.length
	}


	validationErrors() {
		return this.errorList
	}
}

export default WxValidate