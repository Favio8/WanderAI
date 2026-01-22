/**
 * 主题服务
 * 提供主题切换、获取和应用功能
 */

import { storage, STORAGE_KEYS } from '@/utils/storage.js'

/**
 * 主题配置
 */
export const THEMES = {
	light: {
		id: 'light',
		name: '浅色',
		icon: '☀️',
		backgroundColor: '#f7f8f6',
		textColor: '#131811',
		secondaryTextColor: '#708961',
		cardBackgroundColor: '#ffffff',
		borderColor: 'rgba(0, 0, 0, 0.05)',
		shadowColor: 'rgba(0, 0, 0, 0.05)',
		overlayColor: 'rgba(0, 0, 0, 0.4)',
		navigationBarFrontColor: '#000000',
		navigationBarBackgroundColor: '#ffffff'
	},
	dark: {
		id: 'dark',
		name: '深色',
		icon: '🌙',
		backgroundColor: '#1a1a1a',
		textColor: '#ffffff',
		secondaryTextColor: '#b0b0b0',
		cardBackgroundColor: '#2a2a2a',
		borderColor: 'rgba(255, 255, 255, 0.1)',
		shadowColor: 'rgba(0, 0, 0, 0.2)',
		overlayColor: 'rgba(0, 0, 0, 0.6)',
		navigationBarFrontColor: '#ffffff',
		navigationBarBackgroundColor: '#1a1a1a'
	}
}

/**
 * 获取当前主题
 * @returns {String} 主题ID
 */
export function getCurrentTheme() {
	try {
		return storage.get(STORAGE_KEYS.THEME) || 'light'
	} catch (e) {
		console.error('获取主题失败:', e)
		return 'light'
	}
}

/**
 * 设置主题
 * @param {String} themeId - 主题ID
 * @returns {Boolean} 是否成功
 */
export function setTheme(themeId) {
	try {
		storage.set(STORAGE_KEYS.THEME, themeId)
		applyTheme(themeId)
		return true
	} catch (e) {
		console.error('设置主题失败:', e)
		return false
	}
}

/**
 * 应用主题到页面
 * @param {String} themeId - 主题ID
 */
export function applyTheme(themeId) {
	const theme = THEMES[themeId] || THEMES.light

	// 设置导航栏颜色
	try {
		uni.setNavigationBarColor({
			frontColor: theme.navigationBarFrontColor,
			backgroundColor: theme.navigationBarBackgroundColor
		})
	} catch (e) {
		console.error('设置导航栏颜色失败:', e)
	}

	// 设置 tabBar 颜色
	try {
		uni.setTabBarStyle({
			selectedColor: '#63ec13',
			backgroundColor: theme.navigationBarBackgroundColor
		})
	} catch (e) {
		console.error('设置 tabBar 颜色失败:', e)
	}
}

/**
 * 获取主题配置
 * @param {String} themeId - 主题ID
 * @returns {Object} 主题配置
 */
export function getThemeConfig(themeId) {
	return THEMES[themeId] || THEMES.light
}

/**
 * 获取当前主题配置
 * @returns {Object} 当前主题配置
 */
export function getCurrentThemeConfig() {
	const themeId = getCurrentTheme()
	return getThemeConfig(themeId)
}

/**
 * 切换主题
 * @param {String} themeId - 主题ID
 */
export function toggleTheme(themeId) {
	setTheme(themeId)
	// 触发全局事件，通知所有页面更新主题
	uni.$emit('theme-change', themeId)
	uni.showToast({
		title: '主题已切换',
		icon: 'success'
	})
}

/**
 * 监听主题变化
 * @param {Function} callback - 回调函数
 */
export function onThemeChange(callback) {
	uni.$on('theme-change', callback)
}

/**
 * 移除主题变化监听
 * @param {Function} callback - 回调函数
 */
export function offThemeChange(callback) {
	uni.$off('theme-change', callback)
}

/**
 * 获取所有主题列表
 * @returns {Array} 主题列表
 */
export function getThemeList() {
	return Object.values(THEMES)
}

export const themeService = {
	THEMES,
	getCurrentTheme,
	setTheme,
	applyTheme,
	getThemeConfig,
	getCurrentThemeConfig,
	toggleTheme,
	getThemeList
}

export default themeService
