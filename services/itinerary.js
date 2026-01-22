/**
 * 行程数据服务
 * 提供行程数据的增删改查和持久化功能
 */

import { storage, STORAGE_KEYS } from '@/utils/storage.js'

// 默认行程数据（示例）
export const DEFAULT_ITINERARY = {
	title: '京都之旅计划',
	startDate: '10月12日',
	endDate: '10月20日',
	items: [
		{
			id: '1',
			day: 2,
			time: '09:00',
			period: 'morning',
			title: 'Kichi Kichi 早餐',
			description: '著名的蛋包饭预约',
			category: '餐饮',
			duration: '1.5小时'
		},
		{
			id: '2',
			day: 2,
			time: '10:30',
			period: 'morning',
			title: '伏见稻荷大社',
			description: '徒步登山路线',
			category: '文化',
			duration: '2小时',
			image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCUkqFmW1LWHSiPhXwHqQMkWVF2SYczgdmx-0gQwksJYhhbcLNK3y7v3BFuFtMFTbMwZBsqRCQoFF8IGfvkP2xN0EUQ20naCjd-qUdUecinv5Mo4P-dZYd5tB_TZZP6lWjUij0lHkOQhTDOLtkr6cnzXw7pIvvtGwNRVW5_1CGWcjn6EfFPi_WMe56hVzLYE0b-9FSDn4rw3SOVf3GR66heDkqhfs5PN5rrpGJv0dSEcLsaK1RVuMd6jGQkNLOg8zT1ciRFRPpz4IA'
		},
		{
			id: '3',
			day: 2,
			time: '13:00',
			period: 'afternoon',
			title: '车站附近的午餐',
			description: '根据您的拉面喜好推荐',
			category: '餐饮',
			duration: '1小时',
			isAiSuggestion: true
		},
		{
			id: '4',
			day: 2,
			time: '15:00',
			period: 'afternoon',
			title: '祇园区域漫步',
			description: '探索艺伎与茶室文化',
			category: '文化',
			duration: '2小时'
		}
	]
}

/**
 * 获取所有行程数据
 * @returns {Object} 行程数据对象
 */
export function getItinerary() {
	try {
		const data = storage.get(STORAGE_KEYS.ITINERARIES)
		if (data && data.items && data.items.length > 0) {
			return data
		}
		return DEFAULT_ITINERARY
	} catch (e) {
		console.error('获取行程数据失败:', e)
		return DEFAULT_ITINERARY
	}
}

/**
 * 保存行程数据
 * @param {Object} data - 行程数据对象
 * @returns {Boolean} 是否成功
 */
export function saveItinerary(data) {
	try {
		console.log('itineraryService.saveItinerary - 保存数据:', JSON.stringify(data))
		storage.set(STORAGE_KEYS.ITINERARIES, data)
		console.log('保存成功')
		return true
	} catch (e) {
		console.error('保存行程数据失败:', e)
		return false
	}
}

/**
 * 获取指定日期的行程项
 * @param {Number} day - 天数
 * @returns {Array} 行程项数组
 */
export function getItemsByDay(day) {
	const itinerary = getItinerary()
	return itinerary.items
		.filter(item => item.day === day)
		.sort((a, b) => a.time.localeCompare(b.time))
}

/**
 * 添加行程项
 * @param {Object} item - 行程项对象
 * @returns {Object} 添加后的行程数据
 */
export function addItem(item) {
	console.log('itineraryService.addItem - 输入数据:', JSON.stringify(item))
	const itinerary = getItinerary()
	const newItem = {
		...item,
		id: generateId(),
		isAiSuggestion: false
	}
	console.log('创建的新行程项:', JSON.stringify(newItem))
	itinerary.items.push(newItem)
	console.log('添加前的行程数量:', itinerary.items.length)
	const result = saveItinerary(itinerary)
	console.log('添加后的行程数量:', itinerary.items.length)
	return result
}

/**
 * 更新行程项
 * @param {String} id - 行程项ID
 * @param {Object} updates - 更新的数据
 * @returns {Object} 更新后的行程数据
 */
export function updateItem(id, updates) {
	const itinerary = getItinerary()
	const index = itinerary.items.findIndex(item => item.id === id)
	if (index !== -1) {
		itinerary.items[index] = { ...itinerary.items[index], ...updates }
		saveItinerary(itinerary)
	}
	return itinerary
}

/**
 * 删除行程项
 * @param {String} id - 行程项ID
 * @returns {Object} 删除后的行程数据
 */
export function deleteItem(id) {
	const itinerary = getItinerary()
	itinerary.items = itinerary.items.filter(item => item.id !== id)
	saveItinerary(itinerary)
	return itinerary
}

/**
 * 接受 AI 建议
 * @param {String} id - 行程项ID
 * @returns {Object} 更新后的行程数据
 */
export function acceptAiSuggestion(id) {
	return updateItem(id, { isAiSuggestion: false })
}

/**
 * 添加 AI 建议行程
 * @param {Object} item - AI 建议的行程项
 * @returns {Object} 添加后的行程数据
 */
export function addAiSuggestion(item) {
	const itinerary = getItinerary()
	const newItem = {
		...item,
		id: generateId(),
		isAiSuggestion: true
	}
	itinerary.items.push(newItem)
	saveItinerary(itinerary)
	return itinerary
}

/**
 * 清空所有行程
 * @returns {Boolean} 是否成功
 */
export function clearItinerary() {
	try {
		storage.remove(STORAGE_KEYS.ITINERARIES)
		return true
	} catch (e) {
		console.error('清空行程数据失败:', e)
		return false
	}
}

/**
 * 更新行程基本信息
 * @param {Object} info - 行程基本信息 { title, startDate, endDate }
 * @returns {Object} 更新后的行程数据
 */
export function updateItineraryInfo(info) {
	const itinerary = getItinerary()
	Object.assign(itinerary, info)
	saveItinerary(itinerary)
	return itinerary
}

/**
 * 获取行程统计信息
 * @returns {Object} 统计信息
 */
export function getItineraryStats() {
	const itinerary = getItinerary()
	const items = itinerary.items

	// 按日期分组
	const byDay = {}
	items.forEach(item => {
		if (!byDay[item.day]) {
			byDay[item.day] = []
		}
		byDay[item.day].push(item)
	})

	// 按分类统计
	const byCategory = {}
	items.forEach(item => {
		if (!byCategory[item.category]) {
			byCategory[item.category] = 0
		}
		byCategory[item.category]++
	})

	// 计算总时长（估算）
	const totalHours = items.reduce((sum, item) => {
		const match = item.duration?.match(/(\d+(\.\d+)?)/)
		const hours = match ? parseFloat(match[1]) : 0
		return sum + hours
	}, 0)

	return {
		totalItems: items.length,
		daysWithPlans: Object.keys(byDay).length,
		totalHours: Math.round(totalHours),
		byCategory,
		aiSuggestions: items.filter(item => item.isAiSuggestion).length
	}
}

/**
 * 生成唯一 ID
 * @returns {String} 唯一 ID
 */
function generateId() {
	return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

/**
 * 从 AI 聊天内容中提取行程信息
 * 用于将聊天中的建议转换为行程项
 * @param {String} content - AI 回复内容
 * @param {Number} day - 添加到第几天
 * @returns {Object|null} 提取的行程项
 */
export function parseItineraryFromChat(content, day = 1) {
	// 简单的解析逻辑，可以根据实际需要扩展
	// 这里只是一个示例，实际使用时可能需要更复杂的 NLP 处理

	const lines = content.split('\n').filter(line => line.trim())
	for (const line of lines) {
		// 尝试匹配时间格式 (如 "09:00" 或 "9:00")
		const timeMatch = line.match(/(\d{1,2}):(\d{2})/)
		if (timeMatch) {
			const time = line.substring(timeMatch.index, timeMatch.index + 5)
			const rest = line.substring(timeMatch.index + 5).trim()

			// 提取标题（去掉开头的冒号或空格）
			let title = rest.replace(/^[:：]\s*/, '').split(/[，,。]/)[0].trim()

			if (title) {
				return {
					day,
					time,
					period: parseInt(time.split(':')[0]) < 12 ? 'morning' : 'afternoon',
					title,
					description: content.substring(0, 100),
					category: '景点',
					duration: '2小时',
					isAiSuggestion: true
				}
			}
		}
	}

	return null
}

// 导出统一的 service 对象
export const itineraryService = {
	getItinerary,
	saveItinerary,
	getItemsByDay,
	addItem,
	updateItem,
	deleteItem,
	acceptAiSuggestion,
	addAiSuggestion,
	clearItinerary,
	updateItineraryInfo,
	getItineraryStats,
	parseItineraryFromChat
}

export default itineraryService
