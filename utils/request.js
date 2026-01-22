/**
 * 网络请求封装
 * 基于 uni.request 的 Promise 封装
 */

/**
 * 发起 HTTP 请求
 * @param {Object} options - 请求配置
 * @param {String} options.url - 请求地址
 * @param {String} options.method - 请求方法 (GET/POST/PUT/DELETE)
 * @param {Object} options.data - 请求数据
 * @param {Object} options.header - 请求头
 * @param {Number} options.timeout - 超时时间 (毫秒)
 * @param {Boolean} options.sslVerify - 是否验证 SSL 证书
 * @returns {Promise}
 */
export function request(options) {
	return new Promise((resolve, reject) => {
		uni.request({
			url: options.url,
			method: options.method || 'GET',
			data: options.data || {},
			header: {
				'Content-Type': 'application/json',
				...options.header
			},
			timeout: options.timeout || 60000, // 默认 60 秒超时
			sslVerify: options.sslVerify !== undefined ? options.sslVerify : false, // 默认不验证 SSL（解决证书问题）
			dataType: 'json',
			success: (res) => {
				// HTTP 状态码 2xx 视为成功
				if (res.statusCode >= 200 && res.statusCode < 300) {
					resolve(res.data)
				} else {
					reject({
						statusCode: res.statusCode,
						message: res.data?.message || res.data?.error?.message || '请求失败',
						data: res.data
					})
				}
			},
			fail: (err) => {
				console.error('[请求失败]', options.url, err)
				reject({
					statusCode: -1,
					message: err.errMsg || '网络请求失败',
					error: err
				})
			}
		})
	})
}

/**
 * GET 请求
 */
export function get(url, data, options = {}) {
	return request({
		url,
		method: 'GET',
		data,
		...options
	})
}

/**
 * POST 请求
 */
export function post(url, data, options = {}) {
	return request({
		url,
		method: 'POST',
		data,
		...options
	})
}

/**
 * PUT 请求
 */
export function put(url, data, options = {}) {
	return request({
		url,
		method: 'PUT',
		data,
		...options
	})
}

/**
 * DELETE 请求
 */
export function del(url, data, options = {}) {
	return request({
		url,
		method: 'DELETE',
		data,
		...options
	})
}

export default {
	request,
	get,
	post,
	put,
	delete: del
}
