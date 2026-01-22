/**
 * 用户数据服务
 * 提供用户信息的增删改查和持久化功能
 */

import { storage, STORAGE_KEYS } from '@/utils/storage.js'

// 默认用户数据
export const DEFAULT_USER = {
	// 基本信息
	name: '漫游者',
	avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfRBDKbJG0mM_4keHzAGm27g748VRBz07CgmGEz7sDaHHy_zgzjdpxgZo-L2r9D9QY0DmDdYK5kCAjTmx8yf0Gh6ug1H8jvZwkbigZCK0IBaUuclK34CIZ_4bsA0ZninEMAJ2HwQIyrSP9vq6La99UjzDjUE5rmcBzdRb2VCRZ0rGJZ73bhqBTr2TcY76wjeKJ_-T9gJF4FzL_CH9UXyEaI5yLHnl1kN1YY7IW4-yKG-EpXtw4WXjFxKmF9eCfplzu_s3p7kMKpZc',
	level: 1,
	joinYear: new Date().getFullYear(),

	// 统计数据
	countries: 0,
	days: 0,
	continents: 0,

	// 设置
	preferences: {
		theme: 'light',
		language: 'zh-CN',
		notifications: true
	}
}

/**
 * 获取用户信息
 * @returns {Object} 用户数据
 */
export function getUserProfile() {
	try {
		const user = storage.get(STORAGE_KEYS.USER_PROFILE)
		if (user && user.name) {
			return user
		}
		return { ...DEFAULT_USER }
	} catch (e) {
		console.error('获取用户信息失败:', e)
		return { ...DEFAULT_USER }
	}
}

/**
 * 保存用户信息
 * @param {Object} userData - 用户数据
 * @returns {Boolean} 是否成功
 */
export function saveUserProfile(userData) {
	try {
		storage.set(STORAGE_KEYS.USER_PROFILE, userData)
		return true
	} catch (e) {
		console.error('保存用户信息失败:', e)
		return false
	}
}

/**
 * 更新用户信息
 * @param {Object} updates - 要更新的字段
 * @returns {Object} 更新后的用户数据
 */
export function updateUserProfile(updates) {
	const user = getUserProfile()
	const updated = { ...user, ...updates }
	saveUserProfile(updated)
	return updated
}

/**
 * 更新用户基本信息（姓名、头像等）
 * @param {String} name - 用户名
 * @param {String} avatar - 头像URL
 * @returns {Object} 更新后的用户数据
 */
export function updateBasicInfo(name, avatar) {
	return updateUserProfile({ name, avatar })
}

/**
 * 更新用户等级
 * @param {Number} level - 等级
 * @returns {Object} 更新后的用户数据
 */
export function updateLevel(level) {
	return updateUserProfile({ level })
}

/**
 * 增加旅行统计
 * @param {Number} countries - 去过的国家数
 * @param {Number} days - 旅行天数
 * @param {Number} continents - 大洲数
 * @returns {Object} 更新后的用户数据
 */
export function addTravelStats(countries = 0, days = 0, continents = 0) {
	const user = getUserProfile()
	return updateUserProfile({
		countries: user.countries + countries,
		days: user.days + days,
		continents: user.continents + continents
	})
}

/**
 * 获取用户等级信息
 * @param {Number} level - 等级
 * @returns {Object} 等级信息
 */
export function getLevelInfo(level) {
	const levels = [
		{ level: 1, title: '新手旅行者', minExp: 0 },
		{ level: 2, title: '城市探险家', minExp: 100 },
		{ level: 3, title: '探险家', minExp: 500 },
		{ level: 4, title: '旅行达人', minExp: 1500 },
		{ level: 5, title: '环球旅行家', minExp: 3000 }
	]

	const current = levels.find(l => l.level === level) || levels[0]
	const next = levels.find(l => l.level === level + 1)

	return {
		...current,
		nextLevel: next ? next.title : null,
		progress: next ? Math.min(100, ((level * 500 - current.minExp) / (next.minExp - current.minExp)) * 100) : 100
	}
}

/**
 * 获取用户等级标题
 * @param {Number} level - 等级
 * @returns {String} 等级标题
 */
export function getLevelTitle(level) {
	const info = getLevelInfo(level)
	return info.title
}

/**
 * 更新用户设置
 * @param {Object} preferences - 设置选项
 * @returns {Object} 更新后的用户数据
 */
export function updatePreferences(preferences) {
	const user = getUserProfile()
	return updateUserProfile({
		preferences: { ...user.preferences, ...preferences }
	})
}

/**
 * 获取用户设置
 * @returns {Object} 用户设置
 */
export function getPreferences() {
	const user = getUserProfile()
	return user.preferences || DEFAULT_USER.preferences
}

/**
 * 清空用户数据（重置为默认）
 * @returns {Boolean} 是否成功
 */
export function clearUserData() {
	try {
		storage.remove(STORAGE_KEYS.USER_PROFILE)
		return true
	} catch (e) {
		console.error('清空用户数据失败:', e)
		return false
	}
}

/**
 * 上传头像（模拟）
 * 实际项目中应该上传到服务器
 * @param {String} filePath - 本地文件路径
 * @returns {Promise<String>} 头像URL
 */
export function uploadAvatar(filePath) {
	return new Promise((resolve, reject) => {
		// 这里只是模拟，实际应该调用上传 API
		// 可以使用 uni.uploadFile 上传到服务器

		// 暂时直接使用本地路径作为头像
		resolve(filePath)

		// 实际使用示例：
		// uni.uploadFile({
		//   url: 'https://your-api.com/upload',
		//   filePath: filePath,
		//   name: 'avatar',
		//   success: (res) => {
		//     const data = JSON.parse(res.data)
		//     resolve(data.url)
		//   },
		//   fail: reject
		// })
	})
}

/**
 * 从相册选择头像
 * @returns {Promise<String>} 选择的头像路径
 */
export function chooseAvatar() {
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			sourceType: ['album'],
			success: (res) => {
				resolve(res.tempFilePaths[0])
			},
			fail: reject
		})
	})
}

/**
 * 拍照获取头像
 * @returns {Promise<String>} 拍照的头像路径
 */
export function takeAvatar() {
	return new Promise((resolve, reject) => {
		uni.chooseImage({
			count: 1,
			sizeType: ['compressed'],
			sourceType: ['camera'],
			success: (res) => {
				resolve(res.tempFilePaths[0])
			},
			fail: reject
		})
	})
}

/**
 * 选择并更新头像
 * @returns {Promise<String>} 新头像URL
 */
export async function chooseAndUpdateAvatar() {
	try {
		const filePath = await chooseAvatar()
		const avatarUrl = filePath
		updateUserProfile({ avatar: avatarUrl })
		return avatarUrl
	} catch (e) {
		console.error('选择头像失败:', e)
		throw e
	}
}

/**
 * 拍照并更新头像
 * @returns {Promise<String>} 新头像URL
 */
export async function takeAndUpdateAvatar() {
	try {
		const filePath = await takeAvatar()
		const avatarUrl = filePath
		updateUserProfile({ avatar: avatarUrl })
		return avatarUrl
	} catch (e) {
		console.error('拍照头像失败:', e)
		throw e
	}
}

// 导出统一的 service 对象
export const userService = {
	getUserProfile,
	saveUserProfile,
	updateUserProfile,
	updateBasicInfo,
	updateLevel,
	addTravelStats,
	getLevelInfo,
	getLevelTitle,
	updatePreferences,
	getPreferences,
	clearUserData,
	uploadAvatar,
	chooseAvatar,
	takeAvatar,
	chooseAndUpdateAvatar,
	takeAndUpdateAvatar
}

export default userService
