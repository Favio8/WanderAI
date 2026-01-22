/**
 * 本地存储封装
 * 基于 uni.storage 的简化封装
 */

/**
 * 获取存储数据
 * @param {String} key - 存储键名
 * @param {*} defaultValue - 默认值 (当不存在时返回)
 * @returns {*} 存储的数据或默认值
 */
export function getStorage(key, defaultValue = null) {
	try {
		const value = uni.getStorageSync(key)
		return value !== '' ? value : defaultValue
	} catch (e) {
		console.error('getStorage error:', e)
		return defaultValue
	}
}

/**
 * 设置存储数据
 * @param {String} key - 存储键名
 * @param {*} value - 要存储的值
 * @returns {Boolean} 是否成功
 */
export function setStorage(key, value) {
	try {
		uni.setStorageSync(key, value)
		return true
	} catch (e) {
		console.error('setStorage error:', e)
		return false
	}
}

/**
 * 删除存储数据
 * @param {String} key - 存储键名
 * @returns {Boolean} 是否成功
 */
export function removeStorage(key) {
	try {
		uni.removeStorageSync(key)
		return true
	} catch (e) {
		console.error('removeStorage error:', e)
		return false
	}
}

/**
 * 清空所有存储数据
 * @returns {Boolean} 是否成功
 */
export function clearStorage() {
	try {
		uni.clearStorageSync()
		return true
	} catch (e) {
		console.error('clearStorage error:', e)
		return false
	}
}

/**
 * 获取存储信息
 * @returns {Object} 存储信息
 */
export function getStorageInfo() {
	try {
		return uni.getStorageInfoSync()
	} catch (e) {
		console.error('getStorageInfo error:', e)
		return null
	}
}

/**
 * 存储键名常量
 */
export const STORAGE_KEYS = {
	// 聊天相关
	CHAT_HISTORY: 'chat_history',           // 聊天历史记录
	CHAT_MESSAGES: 'chat_messages',         // 聊天消息列表

	// 用户相关
	USER_PROFILE: 'user_profile',           // 用户资料
	USER_SETTINGS: 'user_settings',         // 用户设置
	SETTINGS: 'app_settings',               // 应用设置
	THEME: 'app_theme',                    // 应用主题

	// 行程相关
	ITINERARIES: 'itineraries',             // 行程列表

	// 目的地相关
	DESTINATIONS: 'destinations',           // 目的地列表
	FAVORITES: 'favorites',                 // 收藏列表

	// 相册相关
	ALBUMS: 'albums',                       // 相册列表
	PHOTOS: 'photos'                        // 照片列表
}

// 导出统一的 storage 对象
export const storage = {
	get: getStorage,
	set: setStorage,
	remove: removeStorage,
	clear: clearStorage,
	info: getStorageInfo,
	keys: STORAGE_KEYS
}

export default storage
