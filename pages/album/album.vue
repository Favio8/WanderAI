<template>
	<view class="album-container">
		<!-- Android 适配：顶部状态栏占位（预留状态栏高度，避免内容被遮挡） -->
		<view class="status-bar-placeholder" :style="{ height: statusBarHeight + 'px' }"></view>

		<!-- 顶部导航栏 -->
		<view class="app-bar">
			<button class="bar-btn" @click="handleBack">
				<text class="bar-icon">←</text>
			</button>
			<text class="bar-title">智能相册</text>
			<view class="bar-actions">
				<button class="bar-btn" @click="handleSearch">
					<text class="bar-icon">🔍</text>
				</button>
				<button class="bar-btn" @click="handleAddPhoto">
					<text class="bar-icon">+</text>
				</button>
			</view>
		</view>

		<!-- 主内容区 -->
		<scroll-view class="content-scroll" scroll-y>
			<view class="content-area">
				<!-- 统计卡片 -->
				<view class="stats-card">
					<view class="stat-item">
						<text class="stat-value">{{ stats.totalMemories }}</text>
						<text class="stat-label">回忆</text>
					</view>
					<view class="stat-item">
						<text class="stat-value">{{ stats.totalPhotos }}</text>
						<text class="stat-label">照片</text>
					</view>
					<view class="stat-item">
						<text class="stat-value">{{ stats.totalNotes }}</text>
						<text class="stat-label">札记</text>
					</view>
				</view>

				<!-- 精彩回忆标题 -->
				<view class="section-header">
					<text class="section-title">精彩回忆</text>
					<button class="view-all-btn" @click="handleViewAllMemories">
						<text class="view-all-text">查看全部</text>
					</button>
				</view>

				<!-- 横向滚动的回忆卡片 -->
				<scroll-view class="memories-scroll" scroll-x>
					<view class="memories-list">
						<view
							v-for="mem in memories"
							:key="mem.id"
							class="memory-card"
							@click="handleMemoryClick(mem)"
						>
							<image class="memory-image" :src="mem.coverImage" mode="aspectFill" />
							<view class="memory-overlay">
								<view class="memory-info">
									<text class="memory-title">{{ mem.title }}</text>
									<view class="memory-meta">
										<text class="meta-icon">📅</text>
										<text class="meta-text">{{ mem.date }}</text>
									</view>
								</view>
								<view class="memory-badge">
									<text class="badge-text">{{ mem.photoCount }} 张照片</text>
								</view>
								<view v-if="mem.hasNote" class="note-indicator">
									<text class="note-icon">✏️</text>
								</view>
							</view>
						</view>
						<!-- 添加新回忆卡片 -->
						<view class="memory-card memory-card-add" @click="handleCreateMemory">
							<view class="add-content">
								<text class="add-icon">+</text>
								<text class="add-text">创建回忆</text>
							</view>
						</view>
					</view>
				</scroll-view>

				<!-- 照片网格 -->
				<view class="grid-section">
					<view class="grid-header">
						<view class="grid-title-area">
							<text class="grid-title">{{ selectedMemory ? selectedMemory.title : '最近照片' }}</text>
							<text class="grid-subtitle">{{ selectedMemory ? selectedMemory.date : '' }}</text>
						</view>
						<button class="grid-more-btn" @click="handleViewMemoryDetail">
							<text class="more-icon">⋯</text>
						</button>
					</view>
					<view class="photo-grid" v-if="selectedMemory">
						<view class="photo-item photo-item-large" @click="handlePhotoClick(0)">
							<image class="photo-image" :src="selectedMemory.coverImage" mode="aspectFill" />
						</view>
						<view
							v-for="(photo, index) in getDisplayPhotos().slice(0, 5)"
							:key="photo.id || index"
							class="photo-item"
							@click="handlePhotoClick(index + 1)"
						>
							<image class="photo-image" :src="photo.url || photo" mode="aspectFill" />
						</view>
					</view>
					<view class="photo-grid" v-else>
						<view
							v-for="(photo, index) in recentPhotos.slice(0, 6)"
							:key="photo.id || index"
							class="photo-item"
							:class="{ 'photo-item-large': index === 0 }"
							@click="handlePhotoClick(index)"
						>
							<image class="photo-image" :src="photo.url || photo" mode="aspectFill" />
						</view>
					</view>
					<view class="empty-photos" v-if="!selectedMemory && recentPhotos.length === 0">
						<text class="empty-text">暂无照片</text>
						<button class="empty-btn" @click="handleAddPhoto">
							<text class="empty-btn-text">添加照片</text>
						</button>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 底部浮动按钮 -->
		<view class="fab-container">
			<button class="fab-btn" @click="handleGenerateNote" :disabled="isGenerating || memories.length === 0">
				<text class="fab-icon">{{ isGenerating ? '⏳' : '✨' }}</text>
				<text class="fab-text">{{ isGenerating ? '生成中...' : '一键生成旅行札记' }}</text>
			</button>
		</view>

		<!-- 札记编辑弹窗 -->
		<view v-if="showNoteModal" class="modal-overlay" @click="closeNoteModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">{{ selectedMemory?.title || '编辑札记' }}</text>
					<button class="modal-close" @click="closeNoteModal">
						<text class="close-icon">✕</text>
					</button>
				</view>

				<view class="modal-form">
					<view class="form-group">
						<text class="form-label">旅行札记</text>
						<textarea
							v-model="noteContent"
							class="form-textarea"
							placeholder="记录您的旅行感受..."
							placeholder-class="form-placeholder"
							:maxlength="1000"
							:auto-height="true"
						/>
						<text class="char-count">{{ noteContent.length }}/1000</text>
					</view>

					<button class="form-submit" @click="saveNote">
						<text class="submit-text">保存</text>
					</button>
				</view>
			</view>
		</view>

		<!-- 创建回忆弹窗 -->
		<view v-if="showCreateModal" class="modal-overlay" @click="closeCreateModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">创建新回忆</text>
					<button class="modal-close" @click="closeCreateModal">
						<text class="close-icon">✕</text>
					</button>
				</view>

				<view class="modal-form">
					<view class="form-group">
						<text class="form-label">回忆标题</text>
						<input
							v-model="newMemory.title"
							class="form-input"
							placeholder="例如：周末在京都"
							placeholder-class="form-placeholder"
						/>
					</view>
					<view class="form-group">
						<text class="form-label">地点</text>
						<input
							v-model="newMemory.location"
							class="form-input"
							placeholder="例如：京都，日本"
							placeholder-class="form-placeholder"
						/>
					</view>
					<view class="form-group">
						<text class="form-label">时间</text>
						<input
							v-model="newMemory.date"
							class="form-input"
							placeholder="例如：2023年10月"
							placeholder-class="form-placeholder"
						/>
					</view>
					<view class="form-group">
						<text class="form-label">描述</text>
						<textarea
							v-model="newMemory.description"
							class="form-textarea"
							placeholder="描述这段回忆..."
							placeholder-class="form-placeholder"
							:maxlength="200"
							:auto-height="true"
						/>
					</view>

					<button class="form-submit" @click="createMemory">
						<text class="submit-text">创建</text>
					</button>
				</view>
			</view>
		</view>

		<!-- 添加照片弹窗 -->
		<view v-if="showAddPhotoModal" class="modal-overlay" @click="closeAddPhotoModal">
			<view class="modal-content modal-content-bottom" @click.stop>
				<view class="modal-header">
					<text class="modal-title">添加照片</text>
					<button class="modal-close" @click="closeAddPhotoModal">
						<text class="close-icon">✕</text>
					</button>
				</view>

				<view class="photo-options">
					<button class="photo-option-btn" @click="chooseFromAlbum">
						<text class="photo-option-icon">📷</text>
						<text class="photo-option-text">从相册选择</text>
					</button>
					<button class="photo-option-btn" @click="takePhoto">
						<text class="photo-option-icon">📸</text>
						<text class="photo-option-text">拍照</text>
					</button>
				</view>

				<view class="memory-selector" v-if="memories.length > 0">
					<text class="selector-label">选择回忆</text>
					<scroll-view class="memory-selector-scroll" scroll-x>
						<view
							v-for="mem in memories"
							:key="mem.id"
							class="memory-selector-item"
							:class="{ active: selectedMemory?.id === mem.id }"
							@click="selectMemoryForPhoto(mem)"
						>
							<text class="selector-item-text">{{ mem.title }}</text>
						</view>
					</scroll-view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { albumService } from '@/services/album.js'
import { sendTravelMessage, parseMessageContent } from '@/api/deepseek.js'
import { storage, STORAGE_KEYS } from '@/utils/storage.js'

export default {
	data() {
		return {
			memories: [],
			photos: [],
			recentPhotos: [],
			isLoading: false,
			isGenerating: false,
			selectedMemory: null,
			showNoteModal: false,
			showCreateModal: false,
			showAddPhotoModal: false,
			noteContent: '',
			currentMemoryId: null,
			stats: {
				totalMemories: 0,
				totalPhotos: 0,
				totalNotes: 0
			},
			newMemory: {
				title: '',
				location: '',
				date: '',
				description: ''
			},
			// Android 适配：系统信息
			statusBarHeight: 44, // 默认值，会在 onLoad 中更新
			safeAreaInsetBottom: 0, // 底部安全区高度（px）
			tabBarHeight: 60 // TabBar 高度（px）
		}
	},

	onLoad() {
		// Android 适配：初始化系统信息
		this.initSystemInfo()
		this.loadData()
	},

	onShow() {
		// 刷新数据（从详情页返回时）
		this.loadData()
	},

	methods: {
		/**
		 * Android 适配：初始化系统信息
		 * 获取状态栏高度、安全区域等，用于布局适配
		 */
		initSystemInfo() {
			try {
				const systemInfo = uni.getSystemInfoSync()
				this.statusBarHeight = systemInfo.statusBarHeight || 44
				// 计算底部安全区高度（从安全区域到底部的距离）
				this.safeAreaInsetBottom = systemInfo.screenHeight - (systemInfo.safeArea?.bottom || systemInfo.screenHeight)

				console.log('[Album] 系统信息:', {
					statusBarHeight: this.statusBarHeight,
					safeAreaInsetBottom: this.safeAreaInsetBottom
				})
			} catch (e) {
				console.error('[Album] 获取系统信息失败:', e)
			}
		},

		/**
		 * 加载所有数据
		 */
		loadData() {
			console.log('[相册] 开始加载数据...')
			this.memories = albumService.getMemories()
			this.photos = albumService.getPhotos()

			// 获取最新回忆的照片作为最近照片
			this.loadRecentPhotos()
			this.updateStats()

			// 默认选择第一个回忆
			if (this.memories.length > 0 && !this.selectedMemory) {
				this.selectedMemory = this.memories[0]
			}

			console.log('[相册] 数据加载完成:', {
				memories: this.memories.length,
				photos: this.photos.length,
				selectedMemory: this.selectedMemory?.title
			})
		},

		/**
		 * 加载最近照片
		 */
		loadRecentPhotos() {
			const allPhotos = []

			// 收集所有回忆中的照片
			this.memories.forEach(mem => {
				if (mem.photos && mem.photos.length > 0) {
					mem.photos.forEach(photo => {
						allPhotos.push({
							...photo,
							memoryTitle: mem.title,
							memoryId: mem.id
						})
					})
				}
				// 也添加封面图
				if (mem.coverImage) {
					allPhotos.push({
						id: `cover-${mem.id}`,
						url: mem.coverImage,
						memoryTitle: mem.title,
						memoryId: mem.id
					})
				}
			})

			// 按时间排序，取最新的
			allPhotos.sort((a, b) => {
				const timeA = new Date(a.createdAt || 0).getTime()
				const timeB = new Date(b.createdAt || 0).getTime()
				return timeB - timeA
			})

			this.recentPhotos = allPhotos.slice(0, 20)
		},

		/**
		 * 更新统计信息
		 */
		updateStats() {
			this.stats = albumService.getAlbumStats()
		},

		/**
		 * 获取显示的照片列表
		 */
		getDisplayPhotos() {
			if (!this.selectedMemory) return []
			const photos = this.selectedMemory.photos || []
			// 如果有封面图且不在照片列表中，添加进去
			if (this.selectedMemory.coverImage) {
				const hasCover = photos.some(p => p.url === this.selectedMemory.coverImage)
				if (!hasCover) {
					return [{ id: 'cover', url: this.selectedMemory.coverImage }, ...photos]
				}
			}
			return photos
		},

		/**
		 * 返回
		 */
		handleBack() {
			uni.switchTab({
				url: '/pages/chat/chat'
			})
		},

		/**
		 * 搜索
		 */
		handleSearch() {
			uni.showToast({
				title: '搜索功能开发中',
				icon: 'none'
			})
		},

		/**
		 * 查看所有回忆
		 */
		handleViewAllMemories() {
			// 显示所有回忆的选择器
			const items = this.memories.map(m => m.title)
			uni.showActionSheet({
				itemList: items,
				success: (res) => {
					this.selectedMemory = this.memories[res.tapIndex]
					this.handleViewMemoryDetail()
				}
			})
		},

		/**
		 * 点击回忆卡片
		 */
		handleMemoryClick(mem) {
			this.selectedMemory = mem
			this.currentMemoryId = mem.id

			// 跳转到回忆详情页
			uni.navigateTo({
				url: `/pages/album/memory-detail?id=${mem.id}`
			})
		},

		/**
		 * 查看回忆详情
		 */
		handleViewMemoryDetail() {
			if (this.selectedMemory) {
				uni.navigateTo({
					url: `/pages/album/memory-detail?id=${this.selectedMemory.id}`
				})
			}
		},

		/**
		 * 点击照片
		 */
		handlePhotoClick(index) {
			const photos = this.getDisplayPhotos()
			const urls = photos.map(p => p.url || p)

			// 预览图片
			uni.previewImage({
				urls: urls,
				current: index
			})
		},

		/**
		 * 创建回忆
		 */
		handleCreateMemory() {
			this.newMemory = {
				title: '',
				location: '',
				date: this.getDefaultDate(),
				description: ''
			}
			this.showCreateModal = true
		},

		/**
		 * 获取默认日期
		 */
		getDefaultDate() {
			const now = new Date()
			return `${now.getFullYear()}年${now.getMonth() + 1}月`
		},

		/**
		 * 关闭创建弹窗
		 */
		closeCreateModal() {
			this.showCreateModal = false
		},

		/**
		 * 创建新回忆
		 */
		createMemory() {
			if (!this.newMemory.title || !this.newMemory.title.trim()) {
				uni.showToast({
					title: '请输入回忆标题',
					icon: 'none'
				})
				return
			}

			const coverImage = `https://images.unsplash.com/photo-${Date.now()}?w=800&auto=format&fit=crop`

			const memory = {
				title: this.newMemory.title.trim(),
				location: this.newMemory.location.trim() || '未知地点',
				date: this.newMemory.date.trim() || this.getDefaultDate(),
				description: this.newMemory.description.trim(),
				coverImage: coverImage,
				photoCount: 0,
				hasNote: false
			}

			const newMemory = albumService.addMemory(memory)

			this.loadData()
			this.closeCreateModal()

			uni.showToast({
				title: '创建成功',
				icon: 'success'
			})

			// 选中新创建的回忆
			this.selectedMemory = newMemory
		},

		/**
		 * 添加照片
		 */
		handleAddPhoto() {
			if (this.memories.length === 0) {
				// 没有回忆，先创建
				this.handleCreateMemory()
				uni.showToast({
					title: '请先创建回忆',
					icon: 'none'
				})
				return
			}
			this.showAddPhotoModal = true
		},

		/**
		 * 关闭添加照片弹窗
		 */
		closeAddPhotoModal() {
			this.showAddPhotoModal = false
		},

		/**
		 * 选择回忆用于添加照片
		 */
		selectMemoryForPhoto(mem) {
			this.selectedMemory = mem
		},

		/**
		 * 从相册选择照片
		 */
		chooseFromAlbum() {
			uni.chooseImage({
				count: 9,
				sizeType: ['compressed'],
				sourceType: ['album'],
				success: (res) => {
					this.handleSelectedPhotos(res.tempFilePaths)
				},
				fail: (err) => {
					console.error('[相册] 选择照片失败:', err)
					uni.showToast({
						title: '选择照片失败',
						icon: 'none'
					})
				}
			})
		},

		/**
		 * 拍照
		 */
		takePhoto() {
			uni.chooseImage({
				count: 1,
				sizeType: ['compressed'],
				sourceType: ['camera'],
				success: (res) => {
					this.handleSelectedPhotos(res.tempFilePaths)
				},
				fail: (err) => {
					console.error('[相册] 拍照失败:', err)
					uni.showToast({
						title: '拍照失败',
						icon: 'none'
					})
				}
			})
		},

		/**
		 * 处理选中的照片
		 */
		handleSelectedPhotos(filePaths) {
			if (!this.selectedMemory) {
				uni.showToast({
					title: '请先选择回忆',
					icon: 'none'
				})
				return
			}

			let successCount = 0

			filePaths.forEach(filePath => {
				const photo = albumService.addPhoto(this.selectedMemory.id, filePath)
				if (photo) {
					successCount++
				}
			})

			this.closeAddPhotoModal()
			this.loadData()

			uni.showToast({
				title: `成功添加 ${successCount} 张照片`,
				icon: 'success'
			})
		},

		/**
		 * 生成旅行札记
		 */
		async handleGenerateNote() {
			if (this.memories.length === 0) {
				uni.showToast({
					title: '请先创建回忆',
					icon: 'none'
				})
				return
			}

			// 使用选中的回忆，如果没有则使用最新的
			const targetMemory = this.selectedMemory || this.memories[0]

			this.isGenerating = true

			uni.showLoading({
				title: '生成中...',
				mask: true
			})

			try {
				const prompt = `请根据以下旅行信息生成一篇生动的旅行札记：

地点：${targetMemory.location}
时间：${targetMemory.date}
标题：${targetMemory.title}
描述：${targetMemory.description || '暂无描述'}
照片数量：${targetMemory.photoCount} 张

要求：
1. 用第一人称叙述，充满感情色彩
2. 描述当时的感受和心情
3. 提及有趣的细节和见闻
4. 语言生动有趣，约 300-500 字
5. 可以适当使用表情符号增加亲和力
6. 只返回札记内容，不要其他说明`

				const response = await sendTravelMessage(prompt, [], {
					temperature: 0.8,
					max_tokens: 1000
				})

				const note = parseMessageContent(response)

				if (note && targetMemory) {
					albumService.saveTravelNote(targetMemory.id, note)
					this.loadData()

					uni.hideLoading()

					// 显示生成的札记
					this.selectedMemory = targetMemory
					this.currentMemoryId = targetMemory.id
					this.noteContent = note
					this.showNoteModal = true
				} else {
					throw new Error('生成内容为空')
				}
			} catch (error) {
				console.error('[相册] 生成札记失败:', error)
				uni.hideLoading()

				// 网络错误时使用默认模板
				const fallbackNote = `# ${targetMemory.title}\n\n在${targetMemory.location}的${targetMemory.date}，我度过了一段难忘的时光。\n\n${targetMemory.description || '这段回忆深深地印在了我的脑海里。'}\n\n期待下一次的旅程！✨`

				albumService.saveTravelNote(targetMemory.id, fallbackNote)
				this.loadData()

				this.selectedMemory = targetMemory
				this.currentMemoryId = targetMemory.id
				this.noteContent = fallbackNote
				this.showNoteModal = true

				uni.showToast({
					title: '网络失败，已生成模板',
					icon: 'none'
				})
			} finally {
				this.isGenerating = false
			}
		},

		/**
		 * 打开札记编辑弹窗
		 */
		openNoteModal() {
			this.showNoteModal = true
			this.noteContent = this.selectedMemory?.travelNote || ''
		},

		/**
		 * 关闭札记弹窗
		 */
		closeNoteModal() {
			this.showNoteModal = false
			this.noteContent = ''
		},

		/**
		 * 保存札记
		 */
		saveNote() {
			if (!this.noteContent || !this.noteContent.trim()) {
				uni.showToast({
					title: '请输入札记内容',
					icon: 'none'
				})
				return
			}

			if (this.currentMemoryId) {
				albumService.saveTravelNote(this.currentMemoryId, this.noteContent.trim())
				this.loadData()
				this.closeNoteModal()

				uni.showToast({
					title: '保存成功',
					icon: 'success'
				})
			}
		}
	}
}
</script>

<style lang="scss" scoped>
/* ==================== Android App 布局适配说明 ====================
 * 问题1: 100vh 在 Android WebView 中计算错误
 * 解决: 使用 height: 100% + flex 布局替代
 *
 * 问题2: 顶部被状态栏遮挡（自定义导航栏需要预留状态栏高度）
 * 解决: 添加 status-bar-placeholder 动态占位，移除 sticky 定位
 *
 * 问题3: 底部内容被 TabBar + 虚拟按键/安全区遮挡
 * 解决: 使用 CSS calc() 计算 TabBar 高度(60px = 120rpx) + 安全区
 * =============================================================== */

.album-container {
	display: flex;
	flex-direction: column;
	/* Android 适配: 使用 100% 替代 100vh，避免 WebView 计算错误 */
	height: 100%;
	background-color: #ffffff;
	/* Android 适配: 底部预留 TabBar(60px = 120rpx) + 安全区 */
	padding-bottom: calc(120rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

/* 顶部状态栏占位（Android 适配：预留状态栏高度，避免内容被遮挡） */
.status-bar-placeholder {
	width: 100%;
	flex-shrink: 0;
	/* 高度由 JavaScript 动态设置 */
}

/* 顶部导航栏 */
.app-bar {
	/* Android 适配: 移除 sticky 定位，状态栏占位已处理顶部间距 */
	position: relative;
	z-index: 50;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 32rpx;
	background-color: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(20rpx);
}

.bar-actions {
	display: flex;
	gap: 8rpx;
}

.bar-btn {
	padding: 16rpx;
	background-color: transparent;
}

.bar-icon {
	font-size: 32rpx;
	color: #131811;
}

.bar-title {
	color: #131811;
	font-size: 36rpx;
	font-weight: 700;
}

/* 统计卡片 */
.stats-card {
	display: flex;
	gap: 16rpx;
	margin-bottom: 48rpx;
	padding: 32rpx;
	background: linear-gradient(135deg, #f4f7f2 0%, #e8f0e3 100%);
	border-radius: 32rpx;
}

.stat-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
}

.stat-value {
	color: #63ec13;
	font-size: 48rpx;
	font-weight: 800;
}

.stat-label {
	color: #708961;
	font-size: 20rpx;
	font-weight: 700;
	text-transform: uppercase;
}

/* 添加回忆卡片 */
.memory-card-add {
	background-color: #f4f7f2;
	border: 2rpx dashed #708961;
	display: flex;
	align-items: center;
	justify-content: center;
}

.add-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
}

.add-icon {
	font-size: 48rpx;
	color: #708961;
}

.add-text {
	color: #708961;
	font-size: 24rpx;
	font-weight: 700;
}

/* 空状态 */
.empty-photos {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 24rpx;
	padding: 80rpx 0;
}

.empty-text {
	color: #999999;
	font-size: 28rpx;
}

.empty-btn {
	background-color: #63ec13;
	padding: 24rpx 48rpx;
	border-radius: 50rpx;
	box-shadow: 0 4px 16px rgba(99, 236, 19, 0.3);
}

.empty-btn-text {
	color: #131811;
	font-size: 28rpx;
	font-weight: 700;
}

/* 表单输入 */
.form-input {
	background-color: #f8f8f8;
	border: none;
	border-radius: 32rpx;
	padding: 24rpx 32rpx;
	font-size: 28rpx;
	color: #131811;
	min-height: 88rpx;
}

/* 底部弹窗样式 */
.modal-content-bottom {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	border-top-left-radius: 64rpx;
	border-top-right-radius: 64rpx;
	margin: 0;
	max-width: none;
}

/* 照片选项 */
.photo-options {
	display: flex;
	gap: 16rpx;
	margin-bottom: 32rpx;
}

.photo-option-btn {
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16rpx;
	padding: 32rpx;
	background-color: #f4f7f2;
	border-radius: 24rpx;
}

.photo-option-icon {
	font-size: 48rpx;
}

.photo-option-text {
	color: #131811;
	font-size: 24rpx;
	font-weight: 700;
}

/* 回忆选择器 */
.memory-selector {
	margin-top: 32rpx;
}

.selector-label {
	display: block;
	color: #999999;
	font-size: 20rpx;
	font-weight: 700;
	text-transform: uppercase;
	margin-bottom: 16rpx;
}

.memory-selector-scroll {
	white-space: nowrap;
}

.memory-selector-item {
	display: inline-block;
	padding: 16rpx 24rpx;
	margin-right: 16rpx;
	background-color: #f8f8f8;
	border-radius: 50rpx;
	transition: all 0.3s;
}

.memory-selector-item.active {
	background-color: #63ec13;
}

.selector-item-text {
	color: #131811;
	font-size: 24rpx;
	font-weight: 700;
	white-space: nowrap;
}

/* 内容滚动区 */
.content-scroll {
	/* Android 适配: scroll-view 需要明确的高度才能滚动，使用 flex: 1 获取剩余空间 */
	flex: 1;
	/* 确保 scroll-view 有最小高度，防止内容为空时无法滚动 */
	min-height: 0;
	/* uni-app scroll-view 滚动修复 */
	height: 0;
}

.content-area {
	padding: 48rpx;
	/* Android 适配: 底部预留安全区，避免内容被 TabBar 遮挡 */
	padding-bottom: calc(240rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(240rpx + env(safe-area-inset-bottom));
}

/* 精彩回忆区域 */
.section-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 48rpx;
}

.section-title {
	color: #131811;
	font-size: 48rpx;
	font-weight: 800;
}

.view-all-btn {
	padding: 16rpx;
	background-color: transparent;
}

.view-all-text {
	color: #708961;
	font-size: 28rpx;
	font-weight: 700;
}

/* 横向滚动回忆卡片 */
.memories-scroll {
	white-space: nowrap;
	margin-bottom: 48rpx;
}

.memories-list {
	display: inline-flex;
	gap: 32rpx;
	padding-right: 48rpx;
}

.memory-card {
	position: relative;
	width: 544rpx;
	height: 408rpx;
	flex-shrink: 0;
	border-radius: 48rpx;
	overflow: hidden;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.memory-image {
	width: 100%;
	height: 100%;
}

.memory-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 50%);
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	padding: 40rpx;
}

.memory-info {
	flex: 1;
}

.memory-title {
	display: block;
	color: #ffffff;
	font-size: 40rpx;
	font-weight: 700;
	margin-bottom: 8rpx;
}

.memory-meta {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.meta-icon {
	font-size: 24rpx;
}

.meta-text {
	color: rgba(255, 255, 255, 0.8);
	font-size: 24rpx;
}

.memory-badge {
	background-color: #63ec13;
	padding: 16rpx 24rpx;
	border-radius: 50rpx;
}

.badge-text {
	color: #131811;
	font-size: 20rpx;
	font-weight: 700;
}

.note-indicator {
	position: absolute;
	top: 16rpx;
	right: 16rpx;
	background-color: #63ec13;
	padding: 8rpx;
	border-radius: 50%;
}

.note-icon {
	font-size: 20rpx;
}

/* 照片网格区域 */
.grid-section {
	margin-top: 64rpx;
}

.grid-header {
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	margin-bottom: 32rpx;
}

.grid-title-area {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.grid-title {
	color: #131811;
	font-size: 40rpx;
	font-weight: 700;
}

.grid-subtitle {
	color: #708961;
	font-size: 20rpx;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.1em;
}

.grid-more-btn {
	padding: 16rpx;
	background-color: #f4f7f2;
	border-radius: 50%;
}

.more-icon {
	font-size: 28rpx;
	color: #131811;
}

.photo-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	grid-template-rows: repeat(2, 200rpx);
	gap: 8rpx;
}

.photo-item {
	border-radius: 24rpx;
	overflow: hidden;
	background-color: #f8f8f8;
}

.photo-item-large {
	grid-column: 1 / 3;
	grid-row: 1 / 3;
}

.photo-image {
	width: 100%;
	height: 100%;
}

/* 底部浮动按钮 */
.fab-container {
	position: fixed;
	/* Android 适配: 底部预留 TabBar + 安全区 */
	bottom: calc(220rpx + constant(safe-area-inset-bottom));
	bottom: calc(220rpx + env(safe-area-inset-bottom));
	left: 0;
	right: 0;
	padding: 0 48rpx;
	pointer-events: none;
}

.fab-btn {
	pointer-events: auto;
	width: 100%;
	height: 112rpx;
	background-color: #faedcd;
	border: 1rpx solid rgba(255, 238, 205, 0.5);
	border-radius: 48rpx;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 24rpx;
}

.fab-btn:active {
	transform: scale(0.98);
}

.fab-btn[disabled] {
	opacity: 0.6;
}

.fab-icon {
	font-size: 32rpx;
}

.fab-text {
	color: #425736;
	font-size: 28rpx;
	font-weight: 700;
}

/* 弹窗通用样式 */
.modal-overlay {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: rgba(0, 0, 0, 0.4);
	display: flex;
	align-items: flex-end;
	justify-content: center;
	z-index: 100;
	padding: 32rpx;
}

.modal-content {
	width: 100%;
	max-width: 600rpx;
	background-color: #ffffff;
	border-top-left-radius: 64rpx;
	border-top-right-radius: 64rpx;
	padding: 64rpx 48rpx;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 48rpx;
}

.modal-title {
	color: #131811;
	font-size: 40rpx;
	font-weight: 700;
}

.modal-close {
	padding: 16rpx;
	background-color: transparent;
}

.close-icon {
	font-size: 32rpx;
	color: #999999;
}

/* 表单样式 */
.modal-form {
	display: flex;
	flex-direction: column;
	gap: 32rpx;
}

.form-group {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.form-label {
	color: #999999;
	font-size: 20rpx;
	font-weight: 700;
	text-transform: uppercase;
}

.form-textarea {
	background-color: #f8f8f8;
	border: none;
	border-radius: 32rpx;
	padding: 24rpx 32rpx;
	font-size: 28rpx;
	color: #131811;
	min-height: 300rpx;
	line-height: 1.6;
}

.form-placeholder {
	color: #999999;
}

.char-count {
	color: #999999;
	font-size: 20rpx;
	text-align: right;
	margin-top: 8rpx;
}

.form-submit {
	background-color: #63ec13;
	padding: 32rpx;
	border-radius: 32rpx;
	margin-top: 32rpx;
	box-shadow: 0 4px 16px rgba(99, 236, 19, 0.3);
}

.form-submit:active {
	transform: scale(0.98);
}

.submit-text {
	color: #131811;
	font-size: 32rpx;
	font-weight: 700;
}
</style>
