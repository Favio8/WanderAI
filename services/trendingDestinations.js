/**
 * 热门目的地服务
 * 使用 AI 自动获取近30日的热门地点，分国内/国外
 */

import { storage, STORAGE_KEYS } from '@/utils/storage.js'
import { chat } from '@/api/deepseek.js'

// 存储键名
const STORAGE_KEY_TRENDING = 'trending_destinations'
const STORAGE_KEY_LAST_UPDATE = 'trending_last_update'
const UPDATE_INTERVAL_DAYS = 7 // 每7天更新一次

/**
 * 生成热门目的地提示词
 */
function generateTrendingPrompt() {
	const now = new Date()
	const month = now.getMonth() + 1
	const season = getSeason(month)

	return `你是一个专业的旅游推荐助手。请根据当前时间（${month}月，${season}）推荐热门旅游目的地。

请按以下JSON格式返回数据（只返回JSON，不要其他文字）：
{
	"domestic": [
		{
			"name": "目的地名称",
			"location": "省份/地区",
			"rating": 4.5-5.0,
			"tags": ["文化", "自然", "美食", "城市", "超值", "宁静海滩"],
			"description": "一句话描述（20字以内）",
			"reason": "为什么这个季节推荐（30字以内）",
			"isTopPick": true/false
		}
	],
	"international": [
		{
			"name": "Destination Name",
			"location": "国家",
			"rating": 4.5-5.0,
			"tags": ["文化", "自然", "美食", "城市", "超值", "宁静海滩"],
			"description": "One sentence description",
			"reason": "Why recommended this season",
			"isTopPick": true/false
		}
	]
}

要求：
1. 国内推荐8-10个，国际推荐8-10个
2. 考虑当前季节的气候和旅游特点
3. 标签从以下选择：文化、自然、美食、城市、超值、宁静海滩
4. isTopPick true的占30%左右
5. description要吸引人，reason要说明为什么这个季节适合
6. 图片URL使用占位符: https://images.unsplash.com/photo-{random}?w=800`
}

/**
 * 获取当前季节
 */
function getSeason(month) {
	if (month >= 3 && month <= 5) return '春季'
	if (month >= 6 && month <= 8) return '夏季'
	if (month >= 9 && month <= 11) return '秋季'
	return '冬季'
}

/**
 * 解析 AI 返回的 JSON 数据
 */
function parseAIResponse(response) {
	try {
		// 尝试直接解析
		return JSON.parse(response)
	} catch (e) {
		// 如果直接解析失败，尝试提取 JSON 部分
		const jsonMatch = response.match(/\{[\s\S]*\}/)
		if (jsonMatch) {
			return JSON.parse(jsonMatch[0])
		}
		throw new Error('无法解析 AI 返回的数据')
	}
}

/**
 * 将 AI 数据转换为目的地格式
 */
function convertToDestinations(aiData, imageSeed) {
	const destinations = []
	let id = 1

	// 处理国内目的地
	if (aiData.domestic && Array.isArray(aiData.domestic)) {
		aiData.domestic.forEach(item => {
			destinations.push({
				id: String(id++),
				name: item.name,
				location: `${item.location}, 中国`,
				rating: item.rating || 4.5,
				image: item.image || `https://images.unsplash.com/photo-${imageSeed + id}?w=800`,
				tags: item.tags || ['文化'],
				isFavorite: false,
				isTopPick: item.isTopPick || false,
				description: item.description || ''
			})
		})
	}

	// 处理国际目的地
	if (aiData.international && Array.isArray(aiData.international)) {
		aiData.international.forEach(item => {
			destinations.push({
				id: String(id++),
				name: item.name,
				location: item.location,
				rating: item.rating || 4.5,
				image: item.image || `https://images.unsplash.com/photo-${imageSeed + id}?w=800`,
				tags: item.tags || ['文化'],
				isFavorite: false,
				isTopPick: item.isTopPick || false,
				description: item.description || ''
			})
		})
	}

	return destinations
}

/**
 * 从 AI 获取热门目的地
 */
async function fetchTrendingFromAI() {
	try {
		console.log('[热门目的地] 开始从 AI 获取数据...')

		const prompt = generateTrendingPrompt()
		const messages = [{ role: 'user', content: prompt }]

		// 调用 chat 函数，增加超时时间
		const response = await chat(messages, {
			temperature: 0.7,
			max_tokens: 2000,
			timeout: 90000 // 90秒超时
		})

		// 提取返回的内容
		const content = response?.choices?.[0]?.message?.content || response?.content || ''

		if (!content) {
			throw new Error('AI 返回为空')
		}

		console.log('[热门目的地] AI 返回成功，长度:', content.length)

		// 解析 AI 返回的数据
		const aiData = parseAIResponse(content)

		// 转换为目的地格式
		const imageSeed = Date.now()
		const destinations = convertToDestinations(aiData, imageSeed)

		console.log('[热门目的地] 成功获取', destinations.length, '个目的地')

		return destinations
	} catch (e) {
		console.error('[热门目的地] 获取失败:', e)

		// 详细错误信息
		if (e.statusCode === -1) {
			console.error('[热门目的地] 网络连接失败，请检查网络设置')
		} else if (e.statusCode === 401) {
			console.error('[热门目的地] API 密钥无效')
		} else if (e.statusCode === 429) {
			console.error('[热门目的地] API 请求频率限制')
		}

		throw e
	}
}

/**
 * 检查是否需要更新
 */
function shouldUpdate() {
	try {
		const lastUpdate = storage.get(STORAGE_KEY_LAST_UPDATE, 0)
		const now = Date.now()
		const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24)

		console.log('[热门目的地] 距离上次更新:', daysSinceUpdate.toFixed(1), '天')

		return daysSinceUpdate >= UPDATE_INTERVAL_DAYS || lastUpdate === 0
	} catch (e) {
		console.error('[热门目的地] 检查更新失败:', e)
		return true
	}
}

/**
 * 获取热门目的地（自动更新）
 * @param {Boolean} forceUpdate - 是否强制更新
 * @returns {Promise<Array>}
 */
export async function getTrendingDestinations(forceUpdate = false) {
	try {
		// 检查是否需要更新
		if (!forceUpdate && !shouldUpdate()) {
			const cached = storage.get(STORAGE_KEY_TRENDING)
			if (cached && cached.length > 0) {
				console.log('[热门目的地] 使用缓存数据，共', cached.length, '个')
				return cached
			}
		}

		// 从 AI 获取新数据
		console.log('[热门目的地] 正在更新热门目的地...')
		const destinations = await fetchTrendingFromAI()

		// 保存到本地
		storage.set(STORAGE_KEY_TRENDING, destinations)
		storage.set(STORAGE_KEY_LAST_UPDATE, Date.now())

		console.log('[热门目的地] 更新完成，下次更新时间:', UPDATE_INTERVAL_DAYS, '天后')

		return destinations
	} catch (e) {
		console.error('[热门目的地] 获取失败，使用缓存数据:', e)

		// 如果获取失败，返回缓存数据
		const cached = storage.get(STORAGE_KEY_TRENDING, [])
		if (cached.length > 0) {
			return cached
		}

		// 如果缓存也没有，返回空数组
		return []
	}
}

/**
 * 获取国内热门目的地
 */
export async function getDomesticTrending(forceUpdate = false) {
	const all = await getTrendingDestinations(forceUpdate)
	return all.filter(dest => dest.location.includes('中国'))
}

/**
 * 获取国际热门目的地
 */
export async function getInternationalTrending(forceUpdate = false) {
	const all = await getTrendingDestinations(forceUpdate)
	return all.filter(dest => !dest.location.includes('中国'))
}

/**
 * 强制更新热门目的地
 */
export async function forceUpdateTrending() {
	return await getTrendingDestinations(true)
}

/**
 * 获取更新时间信息
 */
export function getUpdateInfo() {
	const lastUpdate = storage.get(STORAGE_KEY_LAST_UPDATE, 0)
	const nextUpdate = lastUpdate + (UPDATE_INTERVAL_DAYS * 24 * 60 * 60 * 1000)
	const now = Date.now()

	return {
		lastUpdate: new Date(lastUpdate),
		nextUpdate: new Date(nextUpdate),
		daysUntilUpdate: Math.max(0, Math.floor((nextUpdate - now) / (24 * 60 * 60 * 1000))),
		isStale: now >= nextUpdate
	}
}

/**
 * 清除热门目的地缓存
 */
export function clearTrendingCache() {
	storage.remove(STORAGE_KEY_TRENDING)
	storage.remove(STORAGE_KEY_LAST_UPDATE)
	console.log('[热门目的地] 缓存已清除')
}

export const trendingService = {
	getTrendingDestinations,
	getDomesticTrending,
	getInternationalTrending,
	forceUpdateTrending,
	getUpdateInfo,
	clearTrendingCache
}

export default trendingService
