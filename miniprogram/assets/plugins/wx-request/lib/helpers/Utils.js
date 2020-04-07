/**
 * @param {string} baseURL 
 * @param {string} relativeURL 
 * @returns {string} 
 */
const combineURLs = (baseURL, relativeURL) => {
	return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

/**
 * @param {string} url 
 * @returns {boolean} 
 */
const isAbsoluteURL = url => {
	return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

export default {
	combineURLs,
	isAbsoluteURL,
}