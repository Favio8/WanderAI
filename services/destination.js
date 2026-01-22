/**
 * 目的地数据服务
 * 提供目的地的增删改查、搜索、筛选和收藏功能
 * 支持使用 AI 获取热门目的地
 */

import { storage, STORAGE_KEYS } from '@/utils/storage.js'
import { trendingService } from './trendingDestinations.js'

// Mock 目的地数据
export const MOCK_DESTINATIONS = [
	// ========== 东南亚目的地 ==========
	{
		id: '1',
		name: '佩尼达岛',
		location: '印度尼西亚',
		rating: 4.9,
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCrC3zXvqCRWlRdlSG4N7lQuhwQYT3phB0fD8osyJGCF8mFv5fmdIqx582ftPERDXxv--PB9iPW5wbfy-0NOBI2SyaDAeluN4Nh7raHeqBYhAzHX8ULAPfrCeht0VgVpZQQQ9Eb0-M1HWoelMTUcoPV-Z3qkWXwXIbgekf83RN3mvh981UIPHiEXTgCG0hOP9X_eK-SRTLmKMmRbMt4zzU7mUtDdwbUJlnILkztpXQXSvamDcMjxOSt8EpqDneJfsff5IzC8tApYyc',
		tags: ['自然', '超值'],
		isFavorite: false,
		isTopPick: false,
		description: '绝美的海滩和壮观的悬崖景观，是潜水和浮潜的天堂。'
	},
	{
		id: '2',
		name: '高龙岛',
		location: '柬埔寨',
		rating: 4.8,
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB-yjzkbM7jbzGPLyBxUuG7yud9-q15GN0g42TWZMv-WhcOsntW4CmUtS5NknvFvlibiN5CH0fXNw9BWah0rsgZNJr7ro09RJncehlf0Tz3CoaXl4Qo2f43LcffTeFQRHZ7l5XQx7QvIL9_n26aSVq8mhpql8-Yds0L_iBWaV8ld6LUmRQed0WrxDo0BMAEnLkamPlpkYNhwLDBLN0YwW64J1QML3HCwe_rAVTr-QJOArtimkXwI6AqX-nTRjt80fqQQv1QL-ShVxA',
		tags: ['超值', '宁静海滩'],
		isFavorite: false,
		isTopPick: false,
		description: '未被开发的热带天堂，拥有原始的海滩和丰富的海洋生物。'
	},
	{
		id: '3',
		name: '爱妮岛',
		location: '菲律宾',
		rating: 4.9,
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7WZSiNrmRPlQBb9olo0te4hEHKgGLherb0TsykVWqGsSMJyo5JzjZm35rAsWd5uBxVxhJT_jRXwrr-2ZGkInKgvwsYWB670d5bKYUL5V5zwbGulZbmpXgT7LhD4mpU4EiOxg2otyVUGP2nrKNx6yXqNETfln0dLKV2t4OZR9AL5WhKebnwyyMohsquHPcEtyDG8yPGCHYVZwEUcFZz3_hwtq46WNgxRU-Od82VB7t0RCoPMYCBPcRttzCxZRI9hfWFpa0rESeH6M',
		tags: ['宁静海滩', '自然'],
		isFavorite: false,
		isTopPick: true,
		description: '拥有壮观的石灰岩岛屿、清澈的泻湖和丰富的海洋生物。'
	},
	{
		id: '4',
		name: '莱利',
		location: '泰国',
		rating: 4.7,
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBo8lexkV9vxI6cEfdHOaNEHO8Liy6b_8hy6-RgJvQyCndJQDJCF8CMG_SrcnUQFrb0l1WXSNUZJ1dpX3kef8QxcEGMLqzK6ZeFaBoqfJ5H65h5NA7ko-Qa1SaGYrAexA39jkkTL5HbIGHXdZQfA4esKXR8n04oMPIUn_jVraLc_JDH-JUfOoUyw1mDi4BHHKjeAnnDanR2Xly7pT1cXP924kktHhNpRR_ruhsjl4o5FVWuReTn4h7Yl7UucYXx_8CpAK1S5KL_awc',
		tags: ['宁静海滩', '自然'],
		isFavorite: false,
		isTopPick: false,
		description: '以壮观的石灰岩悬崖、清澈的海水和美丽的沙滩而闻名。'
	},
	{
		id: '5',
		name: '巴厘岛',
		location: '印度尼西亚',
		rating: 4.8,
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBfRBDKbJG0mM_4keHzAGm27g748VRBz07CgmGEz7sDaHHy_zgzjdpxgZo-L2r9D9QY0DmDdYK5kCAjTmx8yf0Gh6ug1H8jvZwkbigZCK0IBaUuclK34CIZ_4bsA0ZninEMAJ2HwQIyrSP9vq6La99UjzDjUE5rmcBzdRb2VCRZ0rGJZ73bhqBTr2TcY76wjeKJ_-T9gJF4FzL_CH9UXyEaI5yLHnl1kN1YY7IW4-yKG-EpXtw4WXjFxKmF9eCfplzu_s3p7kMKpZc',
		tags: ['文化', '自然'],
		isFavorite: false,
		isTopPick: false,
		description: '拥有美丽的海滩、古老的寺庙和丰富的文化遗产。'
	},
	{
		id: '6',
		name: '普吉岛',
		location: '泰国',
		rating: 4.6,
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDlmAISi5g0qEXTGgHKpNLeCHJxXVh0-dOZ8mijTk5mLHDNabYPxmr5VK5c5K4onCYRO7gXth28yYwKzPQ1mSrg13GxtR6UVqR6ipe6EBS127BYOiqcoByALm6qQWPgymAqNMVsTD-vUCOJS9pTrmya-N-UpMI7xUYv3FY0TbyZm118QiSWUIJj1mytu9jSGp7vA_JfQKGwPFS556RdylhNN92_NZYX--84fyJ4jklv6t8iaEiZyJTmbKm_s8Q7peEc2TFquuMOlI1ePpCmhd4Z3dp41YV-B0qa6lU8RGBU28YEKOA8sUz39JFCSjomxLSdifngoK5iW9prn_rFlv8',
		tags: ['超值', '文化'],
		isFavorite: false,
		isTopPick: false,
		description: '以夜生活、海滩和水上活动而闻名。'
	},
	{
		id: '7',
		name: '长滩岛',
		location: '菲律宾',
		rating: 4.7,
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDvJdbJmlf7kP7turKsi-y-FJtNCEqC5Qn4-Von0QmSoifiBAGGcmjYghA-vaXl3Qjg5prEPIJ38iYspUwiBoe5j9ReTH_2KEBh3kBwEutpbSW76xlTr67-6gcRMb3MIqrfN14hIBDJQZSos0I4eiye7jU4bzWERA43mWPGR1x1u8uLb4NoYtNvPeXcS2fFMbWI1ePpCmhd4Z3dp41YV-B0qa6lU8RGBU28YEKOA8sUz39JFCSjomxLSdifngoK5iW9prn_rFlv8',
		tags: ['宁静海滩', '超值'],
		isFavorite: false,
		isTopPick: false,
		description: '拥有世界上最长的白沙滩和丰富的海洋生物。'
	},
	{
		id: '8',
		name: '兰塔威',
		location: '印度尼西亚',
		rating: 4.9,
		image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnp-q8iICOWCFQ0hnJp28UDyu4K9Eks2jgidyvrqVqAAw0oSKyv5qnx1i2v6UFC0kyZR69P7R9DPHyplk90KE6rdt5FR1RHzmpLSfUp9Qf-SvJ30fPtPzUF36azTlHhhc1NPoRG6bcvRXnDm1u6rgW2nxYOcbfofXU2jPX4GuzlhHlDkUvNGsFQ89BbwIUc9v0wNI1_wfQSSbHJ6B1j1klIdYyg_RGtIK19N7r9IFID-GZ1mLkaKBquKG3AJVz-77Q0cF6Bu3TaRSyGP1A97v5kSDgA0LHNC0fD6zKRKeKZ63-lBO4v82r2Bu6EI',
		tags: ['自然', '宁静海滩'],
		isFavorite: false,
		isTopPick: true,
		description: '以壮观的火山景观、清澈的湖水和丰富的海洋生物而闻名。'
	},
	// ========== 中国国内目的地 ==========
	{
		id: '9',
		name: '西安',
		location: '中国',
		rating: 4.8,
		image: 'https://images.unsplash.com/photo-1584952811565-c90e3d7d6a4a?w=800',
		tags: ['文化', '城市', '美食'],
		isFavorite: false,
		isTopPick: true,
		description: '十三朝古都，兵马俑、大雁塔、古城墙，感受千年历史沉淀。'
	},
	{
		id: '10',
		name: '北京',
		location: '中国',
		rating: 4.9,
		image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
		tags: ['文化', '城市', '美食'],
		isFavorite: false,
		isTopPick: true,
		description: '故宫、长城、天坛，探索中国首都的历史文化和现代魅力。'
	},
	{
		id: '11',
		name: '成都',
		location: '中国',
		rating: 4.8,
		image: 'https://images.unsplash.com/photo-1584278860037-57a5198089bd?w=800',
		tags: ['美食', '城市', '超值'],
		isFavorite: false,
		isTopPick: true,
		description: '熊猫基地、火锅、宽窄巷子，体验慢生活的天府之国。'
	},
	{
		id: '12',
		name: '丽江',
		location: '中国',
		rating: 4.7,
		image: 'https://images.unsplash.com/photo-1508281377477-9768ea9086fc?w=800',
		tags: ['自然', '文化', '宁静海滩'],
		isFavorite: false,
		isTopPick: false,
		description: '玉龙雪山、古城、泸沽湖，感受纳西族的浪漫与神秘。'
	},
	{
		id: '13',
		name: '三亚',
		location: '中国',
		rating: 4.6,
		image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
		tags: ['宁静海滩', '自然', '超值'],
		isFavorite: false,
		isTopPick: false,
		description: '亚龙湾、天涯海角、热带天堂，中国的马尔代夫。'
	},
	{
		id: '14',
		name: '桂林',
		location: '中国',
		rating: 4.8,
		image: 'https://images.unsplash.com/photo-1529921879218-f99546d03a16?w=800',
		tags: ['自然', '超值'],
		isFavorite: false,
		isTopPick: true,
		description: '漓江、阳朔、象鼻山，山水甲天下的喀斯特地貌奇观。'
	},
	{
		id: '15',
		name: '上海',
		location: '中国',
		rating: 4.7,
		image: 'https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=800',
		tags: ['城市', '美食', '文化'],
		isFavorite: false,
		isTopPick: false,
		description: '外滩、东方明珠、南京路，现代化国际大都市的风采。'
	},
	{
		id: '16',
		name: '杭州',
		location: '中国',
		rating: 4.8,
		image: 'https://images.unsplash.com/photo-1520625366354-9aabdb8d8140?w=800',
		tags: ['自然', '文化', '城市'],
		isFavorite: false,
		isTopPick: false,
		description: '西湖、灵隐寺、龙井茶，人间天堂的诗意江南。'
	},
	// ========== 日本目的地 ==========
	{
		id: '17',
		name: '东京',
		location: '日本',
		rating: 4.8,
		image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800',
		tags: ['城市', '美食', '文化'],
		isFavorite: false,
		isTopPick: true,
		description: '涩谷、浅草、秋叶原，现代与传统完美融合的国际大都市。'
	},
	{
		id: '18',
		name: '京都',
		location: '日本',
		rating: 4.9,
		image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800',
		tags: ['文化', '自然', '城市'],
		isFavorite: false,
		isTopPick: true,
		description: '清水寺、伏见稻荷、岚山，千年古都的优雅与禅意。'
	},
	{
		id: '19',
		name: '大阪',
		location: '日本',
		rating: 4.7,
		image: 'https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?w=800',
		tags: ['美食', '城市', '超值'],
		isFavorite: false,
		isTopPick: false,
		description: '道顿堀、大阪城、环球影城，美食之都的欢乐时光。'
	},
	// ========== 韩国目的地 ==========
	{
		id: '20',
		name: '首尔',
		location: '韩国',
		rating: 4.6,
		image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800',
		tags: ['城市', '美食', '文化'],
		isFavorite: false,
		isTopPick: false,
		description: '明洞、景福宫、江南，K-pop 文化和传统宫殿的魅力。'
	},
	{
		id: '21',
		name: '济州岛',
		location: '韩国',
		rating: 4.7,
		image: 'https://images.unsplash.com/photo-1512551984093-af570e5aa791?w=800',
		tags: ['自然', '超值', '宁静海滩'],
		isFavorite: false,
		isTopPick: false,
		description: '汉拿山、火山岩、海滩，韩国的夏威夷度假胜地。'
	}
]

/**
 * 获取所有目的地
 * @param {Boolean} useTrending - 是否使用热门目的地数据
 * @returns {Array} 目的地列表
 */
export function getDestinations(useTrending = false) {
	try {
		// 优先使用热门目的地数据
		if (useTrending) {
			const trending = storage.get('trending_destinations')
			if (trending && trending.length > 0) {
				console.log('[目的地服务] 使用热门目的地数据，共', trending.length, '个')
				return trending
			}
		}

		// 使用存储的数据
		const stored = storage.get(STORAGE_KEYS.DESTINATIONS)
		if (stored && stored.length > 0) {
			return stored
		}
		return [...MOCK_DESTINATIONS]
	} catch (e) {
		console.error('获取目的地数据失败:', e)
		return [...MOCK_DESTINATIONS]
	}
}

/**
 * 加载热门目的地（异步）
 * @param {Boolean} forceUpdate - 是否强制更新
 * @returns {Promise<Array>}
 */
export async function loadTrendingDestinations(forceUpdate = false) {
	try {
		console.log('[目的地服务] 正在加载热门目的地...')

		// 尝试从 AI 获取热门目的地
		const destinations = await trendingService.getTrendingDestinations(forceUpdate)

		// 更新到存储
		if (destinations && destinations.length > 0) {
			storage.set(STORAGE_KEYS.DESTINATIONS, destinations)
			console.log('[目的地服务] 热门目的地已加载，共', destinations.length, '个')
			return destinations
		}

		// 如果返回空数据，使用 mock 数据
		console.log('[目的地服务] AI 返回空数据，使用默认数据')
		const mockData = [...MOCK_DESTINATIONS]
		storage.set(STORAGE_KEYS.DESTINATIONS, mockData)
		return mockData

	} catch (e) {
		console.error('[目的地服务] 加载热门目的地失败:', e)

		// 判断是否是网络错误
		if (e.statusCode === -1 || e.message?.includes('Socket closed')) {
			console.log('[目的地服务] 网络连接失败，使用默认数据')
		}

		// 返回默认 mock 数据作为降级方案
		const mockData = [...MOCK_DESTINATIONS]
		storage.set(STORAGE_KEYS.DESTINATIONS, mockData)
		return mockData
	}
}

/**
 * 保存目的地列表
 * @param {Array} destinations - 目的地列表
 * @returns {Boolean} 是否成功
 */
export function saveDestinations(destinations) {
	try {
		storage.set(STORAGE_KEYS.DESTINATIONS, destinations)
		return true
	} catch (e) {
		console.error('保存目的地数据失败:', e)
		return false
	}
}

/**
 * 搜索目的地
 * @param {String} keyword - 搜索关键词
 * @returns {Array} 匹配的目的地列表
 */
export function searchDestinations(keyword) {
	if (!keyword || !keyword.trim()) {
		return getDestinations()
	}

	const all = getDestinations()
	const lowerKeyword = keyword.toLowerCase().trim()

	return all.filter(dest => {
		const nameMatch = dest.name.toLowerCase().includes(lowerKeyword)
		const locationMatch = dest.location.toLowerCase().includes(lowerKeyword)
		const tagsMatch = dest.tags.some(tag => 
			tag.toLowerCase().includes(lowerKeyword)
		)
		return nameMatch || locationMatch || tagsMatch
	})
}

/**
 * 筛选目的地
 * @param {Array} activeFilters - 激活的筛选标签
 * @returns {Array} 筛选后的目的地列表
 */
export function filterDestinations(activeFilters) {
	if (!activeFilters || activeFilters.length === 0) {
		return getDestinations()
	}

	const all = getDestinations()
	return all.filter(dest => {
		return activeFilters.some(filter => dest.tags.includes(filter))
	})
}

/**
 * 搜索和筛选结合
 * @param {String} keyword - 搜索关键词
 * @param {Array} activeFilters - 激活的筛选标签
 * @returns {Array} 匹配的目的地列表
 */
export function searchAndFilter(keyword, activeFilters) {
	let results = getDestinations()

	if (keyword && keyword.trim()) {
		results = searchDestinations(keyword)
	}

	if (activeFilters && activeFilters.length > 0) {
		results = results.filter(dest => {
			return activeFilters.some(filter => dest.tags.includes(filter))
		})
	}

	return results
}

/**
 * 切换收藏状态
 * @param {String} destinationId - 目的地ID
 * @returns {Object} 更新后的目的地
 */
export function toggleFavorite(destinationId) {
	const all = getDestinations()
	const index = all.findIndex(d => d.id === destinationId)

	if (index !== -1) {
		all[index].isFavorite = !all[index].isFavorite
		saveDestinations(all)
		return all[index]
	}

	return null
}

/**
 * 获取收藏列表
 * @returns {Array} 收藏的目的地列表
 */
export function getFavorites() {
	const all = getDestinations()
	return all.filter(dest => dest.isFavorite)
}

/**
 * 获取目的地详情
 * @param {String} destinationId - 目的地ID
 * @returns {Object|null} 目的地详情
 */
export function getDestinationById(destinationId) {
	const all = getDestinations()
	return all.find(d => d.id === destinationId) || null
}

/**
 * 获取所有标签
 * @returns {Array} 标签列表（去重）
 */
export function getAllTags() {
	const all = getDestinations()
	const tags = new Set()
	all.forEach(dest => {
		dest.tags.forEach(tag => tags.add(tag))
	})
	return Array.from(tags)
}

/**
 * 获取推荐目的地
 * @param {Number} limit - 返回数量限制
 * @returns {Array} 推荐目的地列表
 */
export function getRecommendedDestinations(limit = 10) {
	const all = getDestinations()
	return all
		.filter(dest => dest.isTopPick)
		.slice(0, limit)
}

/**
 * 添加目的地
 * @param {Object} destination - 目的地对象
 * @returns {Object} 添加后的目的地
 */
export function addDestination(destination) {
	const all = getDestinations()
	const newDestination = {
		...destination,
		id: generateId(),
		isFavorite: false,
		isTopPick: false
	}
	all.push(newDestination)
	saveDestinations(all)
	return newDestination
}

/**
 * 删除目的地
 * @param {String} destinationId - 目的地ID
 * @returns {Boolean} 是否成功
 */
export function deleteDestination(destinationId) {
	const all = getDestinations()
	const index = all.findIndex(d => d.id === destinationId)

	if (index !== -1) {
		all.splice(index, 1)
		saveDestinations(all)
		return true
	}

	return false
}

/**
 * 生成唯一 ID
 * @returns {String} 唯一 ID
 */
function generateId() {
	return Date.now().toString(36) + Math.random().toString(36).substr(2, 5)
}

/**
 * 重置为默认数据
 * @returns {Boolean} 是否成功
 */
export function resetDestinations() {
	try {
		storage.remove(STORAGE_KEYS.DESTINATIONS)
		return true
	} catch (e) {
		console.error('重置目的地数据失败:', e)
		return false
	}
}

export const destinationService = {
	getDestinations,
	loadTrendingDestinations,
	saveDestinations,
	searchDestinations,
	filterDestinations,
	searchAndFilter,
	toggleFavorite,
	getFavorites,
	getDestinationById,
	getAllTags,
	getRecommendedDestinations,
	addDestination,
	deleteDestination,
	resetDestinations
}

export default destinationService
