/**
 * 相册数据服务
 * 提供相册、照片、回忆和旅行札记的增删改查功能
 */

import { storage, STORAGE_KEYS } from '@/utils/storage.js'

// Mock 回忆数据
export const MOCK_MEMORIES = [
	{
		id: '1',
		title: '周末在京都',
		date: '2023年10月',
		location: '京都，日本',
		photoCount: 3,
		coverImage: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop',
		description: '在古老的街道漫步，品尝传统美食，参观金阁寺和清水寺。',
		photos: [
			{
				id: 'p1',
				url: 'https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&auto=format&fit=crop',
				memoryId: '1',
				createdAt: '2023-10-15T10:00:00.000Z'
			},
			{
				id: 'p2',
				url: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&auto=format&fit=crop',
				memoryId: '1',
				createdAt: '2023-10-15T11:00:00.000Z'
			},
			{
				id: 'p3',
				url: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&auto=format&fit=crop',
				memoryId: '1',
				createdAt: '2023-10-15T12:00:00.000Z'
			}
		],
		createdAt: '2023-10-15T00:00:00.000Z',
		hasNote: false,
		travelNote: ''
	},
	{
		id: '2',
		title: '巴黎的夏天',
		date: '2023年7月',
		location: '巴黎，法国',
		photoCount: 3,
		coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop',
		description: '在埃菲尔铁塔下野餐，参观卢浮宫，漫步塞纳河畔。',
		photos: [
			{
				id: 'p4',
				url: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=800&auto=format&fit=crop',
				memoryId: '2',
				createdAt: '2023-07-20T14:00:00.000Z'
			},
			{
				id: 'p5',
				url: 'https://images.unsplash.com/photo-1431274172761-fca41d930114?w=800&auto=format&fit=crop',
				memoryId: '2',
				createdAt: '2023-07-20T15:00:00.000Z'
			},
			{
				id: 'p6',
				url: 'https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=800&auto=format&fit=crop',
				memoryId: '2',
				createdAt: '2023-07-20T16:00:00.000Z'
			}
		],
		createdAt: '2023-07-20T00:00:00.000Z',
		hasNote: true,
		travelNote: '在巴黎的那个夏天，我漫步在香榭丽舍大道上，感受着这座城市的浪漫气息。埃菲尔铁塔下，我遇到了来自世界各地的旅人，分享了彼此的故事。'
	},
	{
		id: '3',
		title: '西湖春游',
		date: '2024年3月',
		location: '杭州，中国',
		photoCount: 2,
		coverImage: 'https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=800&auto=format&fit=crop',
		description: '春暖花开时节，游览杭州西湖，欣赏苏堤春晓的美景。',
		photos: [
			{
				id: 'p7',
				url: 'https://images.unsplash.com/photo-1548266652-99cf277df8c2?w=800&auto=format&fit=crop',
				memoryId: '3',
				createdAt: '2024-03-15T09:00:00.000Z'
			},
			{
				id: 'p8',
				url: 'https://images.unsplash.com/photo-1528702748617-c64d49f918af?w=800&auto=format&fit=crop',
				memoryId: '3',
				createdAt: '2024-03-15T10:00:00.000Z'
			}
		],
		createdAt: '2024-03-15T00:00:00.000Z',
		hasNote: false,
		travelNote: ''
	}
]

// Mock 照片数据
export const MOCK_PHOTOS = [
	'https://lh3.googleusercontent.com/aida-public/AB6AXuAWpn0wEFPKPeeT0FvlicFPe6cd5VfWMYg2cYeBlHTFLAykbrVXEXlc12ueU-sBMfW-djPYMj_P2nMKAaDWLYKtKKn61H0C2yqUGiVGCb1mhw9_8e2tGVrFRIPepiY3bsK_aJUObOfFMEqHF0WlUutpbSW76xlTr67-6gcRMb3MIqrfN14hIBDJQZSos0I4eiye7jU4bzWERA43mWPGR1x1u8uLb4NoYtNvPeXcS2fFMbWI1ePpCmhd4Z3dp41YV-B0qa6lU8RGBU28YEKOA8sUz39JFCSjomxLSdifngoK5iW9prn_rFlv8',
	'https://lh3.googleusercontent.com/aida-public/AB6AXuDvJdbJmlf7kP7turKsi-y-FJtNCEqC5Qn4-Von0QmSoifiBAGGcmjYghA-vaXl3Qjg5prEPIJ38iYspUwiBoe5j9ReTH_2KEBh3kBwEutpbSW76xlTr67-6gcRMb3MIqrfN14hIBDJQZSos0I4eiye7jU4bzWERA43mWPGR1x1u8uLb4NoYtNvPeXcS2fFMbWI1ePpCmhd4Z3dp41YV-B0qa6lU8RGBU28YEKOA8sUz39JFCSjomxLSdifngoK5iW9prn_rFlv8',
	'https://lh3.googleusercontent.com/aida-public/AB6AXuBoLQPID18D6ajvBXuX-XxIQCl-akEaRlxtfe5WY6oNowdK7_kZolpbc7VllSfpWUaX_fuDzktIEx7kgJTsnU1Zsc1ik86Cl0cXqiBYAWMQ-RJki_TFizUu_3APPuWdKDoNf6gu7tTpoxS98DkExBO0JglTQW08JZhwbTlvBCuUDTAFqFZI90NNqtBatcB1bOOGGkGJqklFsfw_2qB1IL_FabhFX5GmwkAPp7PHnSVgQOap2381IJAap7eqtHoW_x2o6Zaz-o',
	'https://lh3.googleusercontent.com/aida-public/AB6AXuC6qJc-yrkkzR_9vrL8-BVtP3LQLdFjwk2KWwa66bdzDN6U4y_RNFaIOdR5cnlT1baonbFID0ihnnPaGltaThDXcIPMv04NIhjPMr4rGL-idVjGAyiqdwuzU4UF-pX-TC0_KpDEp_aFxxEMrIILKSudGf7F0Hs-IZOdb0OE355Br_0W49hU-tTCX0ZsHk_byhESViQ2puhhWE0ENMIQrxwN6h5QXr7Pyf-WdjbJglalsmtepocSYUq58cBhb3oJq7xAyb00',
	'https://lh3.googleusercontent.com/aida-public/AB6AXuDc41qf4dUSbvgr-m3UCYG_wjkJe9mCtCQc82_f2aDU8LsW68_Wp8yU37T-HUHcON_ICQ3KHkuYwTBePsxUxg0JepKC8ArDQebQ-xIeb8YlXMH3vZ7x90NQ612a55CFYZTbMClooJUO173_ngoEqGD4wlKHiWe4ijQBk2fbbLIO8oJtyuKc95j8-KZ97lfQBs4ZyRZwFOJGOp-sP7yJZW__wWXeqBCRBzm813qyPWYNMNLHv5X63a2NQPMf0l18nEBZ',
	'https://lh3.googleusercontent.com/aida-public/AB6AXuCnp-q8iICOWCFQ0hnJp28UDyu4K9Eks2jgidyvrqVqAAw0oSKyv5qnx1i2v6UFC0kyZR69P7R9DPHyplk90KE6rdt5FR1RHzmpLSfUp9Qf-SvJ30fPtPzUF36azTlHhhc1NPoRG6bcvRXnDm1u6rgW2nxYOcbfofXU2jPX4GuzlhHlDkUvNGsFQ89BbwIUc9v0wNI1_wfQSSbHJ6B1j1klIdYyg_RGtIK19N7r9IFID-GZ1mLkaKBquKG3AJVz-77Q0cF6Bu3TaRSyGP1A97v5kSDgA0LHNC0fD6zKRKeKZ63-lBO4v82r2Bu6EI',
	'https://lh3.googleusercontent.com/aida-public/AB6AXuDvJdbJmlf7kP7turKsi-y-FJtNCEqC5Qn4-Von0QmSoifiBAGGcmjYghA-vaXl3Qjg5prEPIJ38iYspUwiBoe5j9ReTH_2KEBh3kBwEutpbSW76xlTr67-6gcRMb3MIqrfN14hIBDJQZSos0I4eiye7jU4bzWERA43mWPGR1x1u8uLb4NoYtNvPeXcS2fFMbWI1ePpCmhd4Z3dp41YV-B0qa6lU8RGBU28YEKOA8sUz39JFCSjomxLSdifngoK5iW9prn_rFlv8'
]

/**
 * 获取所有回忆
 * @returns {Array} 回忆列表
 */
export function getMemories() {
	try {
		const stored = storage.get(STORAGE_KEYS.ALBUMS)
		if (stored && stored.length > 0) {
			return stored
		}
		return [...MOCK_MEMORIES]
	} catch (e) {
		console.error('获取回忆数据失败:', e)
		return [...MOCK_MEMORIES]
	}
}

/**
 * 保存回忆列表
 * @param {Array} memories - 回忆列表
 * @returns {Boolean} 是否成功
 */
export function saveMemories(memories) {
	try {
		storage.set(STORAGE_KEYS.ALBUMS, memories)
		return true
	} catch (e) {
		console.error('保存回忆数据失败:', e)
		return false
	}
}

/**
 * 获取回忆详情
 * @param {String} memoryId - 回忆ID
 * @returns {Object|null} 回忆详情
 */
export function getMemoryById(memoryId) {
	const all = getMemories()
	return all.find(m => m.id === memoryId) || null
}

/**
 * 添加回忆
 * @param {Object} memory - 回忆对象
 * @returns {Object} 添加后的回忆
 */
export function addMemory(memory) {
	const all = getMemories()
	const newMemory = {
		...memory,
		id: generateId(),
		photos: []
	}
	all.unshift(newMemory)
	saveMemories(all)
	return newMemory
}

/**
 * 删除回忆
 * @param {String} memoryId - 回忆ID
 * @returns {Boolean} 是否成功
 */
export function deleteMemory(memoryId) {
	const all = getMemories()
	const index = all.findIndex(m => m.id === memoryId)

	if (index !== -1) {
		all.splice(index, 1)
		saveMemories(all)
		return true
	}

	return false
}

/**
 * 获取所有照片
 * @returns {Array} 照片列表
 */
export function getPhotos() {
	try {
		const stored = storage.get(STORAGE_KEYS.PHOTOS)
		if (stored && stored.length > 0) {
			return stored
		}
		return [...MOCK_PHOTOS]
	} catch (e) {
		console.error('获取照片数据失败:', e)
		return [...MOCK_PHOTOS]
	}
}

/**
 * 保存照片列表
 * @param {Array} photos - 照片列表
 * @returns {Boolean} 是否成功
 */
export function savePhotos(photos) {
	try {
		storage.set(STORAGE_KEYS.PHOTOS, photos)
		return true
	} catch (e) {
		console.error('保存照片数据失败:', e)
		return false
	}
}

/**
 * 添加照片
 * @param {String} memoryId - 回忆ID
 * @param {String} photoUrl - 照片URL
 * @returns {Object} 添加的照片
 */
export function addPhoto(memoryId, photoUrl) {
	const all = getMemories()
	const memory = all.find(m => m.id === memoryId)

	if (memory) {
		const photo = {
			id: generateId(),
			url: photoUrl,
			memoryId,
			createdAt: new Date().toISOString()
		}

		if (!memory.photos) {
			memory.photos = []
		}

		memory.photos.unshift(photo)
		memory.photoCount = memory.photos.length
		saveMemories(all)
		return photo
	}

	return null
}

/**
 * 删除照片
 * @param {String} memoryId - 回忆ID
 * @param {String} photoId - 照片ID
 * @returns {Boolean} 是否成功
 */
export function deletePhoto(memoryId, photoId) {
	const all = getMemories()
	const memory = all.find(m => m.id === memoryId)

	if (memory && memory.photos) {
		const index = memory.photos.findIndex(p => p.id === photoId)
		if (index !== -1) {
			memory.photos.splice(index, 1)
			memory.photoCount = memory.photos.length
			saveMemories(all)
			return true
		}
	}

	return false
}

/**
 * 获取旅行札记
 * @param {String} memoryId - 回忆ID
 * @returns {String|null} 旅行札记内容
 */
export function getTravelNote(memoryId) {
	const all = getMemories()
	const memory = all.find(m => m.id === memoryId)
	return memory ? memory.travelNote : null
}

/**
 * 保存旅行札记
 * @param {String} memoryId - 回忆ID
 * @param {String} note - 札记内容
 * @returns {Boolean} 是否成功
 */
export function saveTravelNote(memoryId, note) {
	const all = getMemories()
	const memory = all.find(m => m.id === memoryId)

	if (memory) {
		memory.travelNote = note
		memory.hasNote = true
		saveMemories(all)
		return true
	}

	return false
}

/**
 * 更新回忆信息
 * @param {String} memoryId - 回忆ID
 * @param {Object} updates - 更新的字段
 * @returns {Object|null} 更新后的回忆
 */
export function updateMemory(memoryId, updates) {
	const all = getMemories()
	const index = all.findIndex(m => m.id === memoryId)

	if (index !== -1) {
		all[index] = { ...all[index], ...updates }
		saveMemories(all)
		return all[index]
	}

	return null
}

/**
 * 获取统计信息
 * @returns {Object} 统计数据
 */
export function getAlbumStats() {
	const memories = getMemories()
	const photos = getPhotos()

	// 计算总照片数（包括所有回忆中的照片）
	let totalPhotoCount = 0
	memories.forEach(mem => {
		totalPhotoCount += (mem.photos?.length || 0)
	})

	return {
		totalMemories: memories.length,
		totalPhotos: totalPhotoCount || photos.length,
		totalNotes: memories.filter(m => m.hasNote).length,
		recentMemory: memories[0] || null
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
 * 重置为默认数据
 * @returns {Boolean} 是否成功
 */
export function resetAlbumData() {
	try {
		storage.remove(STORAGE_KEYS.ALBUMS)
		storage.remove(STORAGE_KEYS.PHOTOS)
		return true
	} catch (e) {
		console.error('重置相册数据失败:', e)
		return false
	}
}

export const albumService = {
	getMemories,
	saveMemories,
	getMemoryById,
	addMemory,
	deleteMemory,
	getPhotos,
	savePhotos,
	addPhoto,
	deletePhoto,
	getTravelNote,
	saveTravelNote,
	updateMemory,
	getAlbumStats,
	resetAlbumData
}

export default albumService
