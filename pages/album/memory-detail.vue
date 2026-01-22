<template>
	<view class="memory-detail-container">
		<!-- Android 适配：顶部状态栏占位（预留状态栏高度，避免内容被遮挡） -->
		<view class="status-bar-placeholder" :style="{ height: statusBarHeight + 'px' }"></view>
		<!-- 顶部导航栏 -->
		<view class="app-bar">
			<button class="bar-btn" @click="handleBack">
				<text class="bar-icon">←</text>
			</button>
			<text class="bar-title">回忆详情</text>
			<button class="bar-btn" @click="handleMoreOptions">
				<text class="bar-icon">⋯</text>
			</button>
		</view>

		<!-- 主内容区 -->
		<scroll-view class="content-scroll" scroll-y>
			<view class="content-area" v-if="memory">
				<!-- 封面图片 -->
				<view class="cover-section">
					<image class="cover-image" :src="memory.coverImage" mode="aspectFill" />
					<view class="cover-overlay">
						<text class="cover-title">{{ memory.title }}</text>
						<view class="cover-meta">
							<text class="meta-item">📍 {{ memory.location }}</text>
							<text class="meta-item">📅 {{ memory.date }}</text>
						</view>
					</view>
				</view>

				<!-- 统计信息 -->
				<view class="stats-row">
					<view class="stat-row-item">
						<text class="stat-row-value">{{ memory.photoCount }}</text>
						<text class="stat-row-label">张照片</text>
					</view>
					<view class="stat-row-item" v-if="memory.hasNote">
						<text class="stat-row-icon">✏️</text>
						<text class="stat-row-label">有札记</text>
					</view>
					<view class="stat-row-item">
						<text class="stat-row-label">{{ formatDate(memory.createdAt) }}</text>
					</view>
				</view>

				<!-- 描述 -->
				<view class="description-section" v-if="memory.description">
					<text class="description-text">{{ memory.description }}</text>
				</view>

				<!-- 旅行札记 -->
				<view class="note-section" v-if="memory.hasNote || showNoteEditor">
					<view class="note-header">
						<text class="note-title">旅行札记</text>
						<button class="note-edit-btn" @click="toggleNoteEditor" v-if="memory.hasNote && !showNoteEditor">
							<text class="edit-btn-text">编辑</text>
						</button>
					</view>

					<!-- 显示札记 -->
					<view class="note-content" v-if="memory.hasNote && !showNoteEditor">
						<text class="note-text">{{ memory.travelNote }}</text>
					</view>

					<!-- 编辑札记 -->
					<view class="note-editor" v-if="showNoteEditor">
						<textarea
							v-model="editingNote"
							class="note-textarea"
							placeholder="记录您的旅行感受..."
							placeholder-class="note-placeholder"
							:maxlength="1000"
							:auto-height="true"
						/>
						<view class="note-actions">
							<button class="note-btn note-btn-cancel" @click="cancelEditNote">
								<text class="btn-text">取消</text>
							</button>
							<button class="note-btn note-btn-save" @click="saveNote">
								<text class="btn-text">保存</text>
							</button>
						</view>
					</view>
				</view>

				<!-- 照片网格 -->
				<view class="photos-section">
					<view class="photos-header">
						<text class="photos-title">全部照片 ({{ memory.photoCount }})</text>
					</view>

					<view class="photos-grid" v-if="photos.length > 0">
						<view
							v-for="(photo, index) in photos"
							:key="photo.id"
							class="photo-grid-item"
							@click="previewPhoto(index)"
						>
							<image class="photo-grid-image" :src="photo.url" mode="aspectFill" />
							<button class="photo-delete-btn" @click.stop="deletePhoto(photo.id)" v-if="!photo.isCover">
								<text class="delete-icon">×</text>
							</button>
						</view>
					</view>

					<view class="empty-photos" v-else>
						<text class="empty-photos-text">暂无照片</text>
					</view>

					<!-- 添加照片按钮 -->
					<button class="add-photos-btn" @click="handleAddPhotos">
						<text class="add-photos-icon">+</text>
						<text class="add-photos-text">添加照片</text>
					</button>
				</view>
			</view>

			<view class="loading-area" v-else-if="isLoading">
				<text class="loading-text">加载中...</text>
			</view>

			<view class="error-area" v-else>
				<text class="error-text">回忆不存在</text>
				<button class="error-btn" @click="handleBack">
					<text class="error-btn-text">返回</text>
				</button>
			</view>
		</scroll-view>

		<!-- 底部操作栏 -->
		<view class="bottom-actions" v-if="memory">
			<button class="action-btn action-btn-secondary" @click="handleShare">
				<text class="action-btn-text">分享</text>
			</button>
			<button class="action-btn action-btn-primary" @click="handleGenerateNote" :disabled="isGenerating">
				<text class="action-btn-text">{{ isGenerating ? '生成中...' : 'AI生成札记' }}</text>
			</button>
		</view>

		<!-- 更多选项弹窗 -->
		<view v-if="showOptionsModal" class="modal-overlay" @click="closeOptionsModal">
			<view class="options-modal" @click.stop>
				<button class="option-item" @click="handleEdit">
					<text class="option-text">编辑回忆</text>
				</button>
				<button class="option-item" @click="handleDelete">
					<text class="option-text option-text-danger">删除回忆</text>
				</button>
				<button class="option-item option-item-cancel" @click="closeOptionsModal">
					<text class="option-text">取消</text>
				</button>
			</view>
		</view>

		<!-- 编辑回忆弹窗 -->
		<view v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">编辑回忆</text>
					<button class="modal-close" @click="closeEditModal">
						<text class="close-icon">✕</text>
					</button>
				</view>

				<view class="modal-form">
					<view class="form-group">
						<text class="form-label">回忆标题</text>
						<input
							v-model="editingMemory.title"
							class="form-input"
							placeholder="例如：周末在京都"
							placeholder-class="form-placeholder"
						/>
					</view>
					<view class="form-group">
						<text class="form-label">地点</text>
						<input
							v-model="editingMemory.location"
							class="form-input"
							placeholder="例如：京都，日本"
							placeholder-class="form-placeholder"
						/>
					</view>
					<view class="form-group">
						<text class="form-label">时间</text>
						<input
							v-model="editingMemory.date"
							class="form-input"
							placeholder="例如：2023年10月"
							placeholder-class="form-placeholder"
						/>
					</view>
					<view class="form-group">
						<text class="form-label">描述</text>
						<textarea
							v-model="editingMemory.description"
							class="form-textarea"
							placeholder="描述这段回忆..."
							placeholder-class="form-placeholder"
							:maxlength="200"
							:auto-height="true"
						/>
					</view>

					<button class="form-submit" @click="saveEditMemory">
						<text class="submit-text">保存</text>
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { albumService } from '@/services/album.js'
import { sendTravelMessage, parseMessageContent } from '@/api/deepseek.js'

export default {
	data() {
		return {
			memoryId: '',
			memory: null,
			photos: [],
			isLoading: true,
			isGenerating: false,
			showOptionsModal: false,
			showEditModal: false,
			showNoteEditor: false,
			editingNote: '',
			// Android 适配：系统信息
			statusBarHeight: 44, // 默认值，会在 onLoad 中更新
			safeAreaInsetBottom: 0, // 底部安全区高度（px）
			editingMemory: {
				title: '',
				location: '',
				date: '',
				description: ''
			}
		}
	},

	onLoad(options) {
		// Android 适配：初始化系统信息
		this.initSystemInfo()
		this.memoryId = options.id || ''
		this.loadMemory()
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
				this.safeAreaInsetBottom = systemInfo.screenHeight - (systemInfo.safeArea?.bottom || systemInfo.screenHeight)
				console.log('[MemoryDetail] 系统信息:', {
					statusBarHeight: this.statusBarHeight,
					safeAreaInsetBottom: this.safeAreaInsetBottom
				})
			} catch (e) {
				console.error('[MemoryDetail] 获取系统信息失败:', e)
			}
		},

		/**
		 * 加载回忆详情
		 */
		loadMemory() {
			console.log('[回忆详情] 加载回忆:', this.memoryId)
			this.isLoading = true

			const memory = albumService.getMemoryById(this.memoryId)

			if (memory) {
				this.memory = memory
				// 收集照片（包括封面）
				this.photos = this.collectPhotos()
				console.log('[回忆详情] 加载成功:', {
					title: memory.title,
					photos: this.photos.length
				})
			} else {
				console.error('[回忆详情] 回忆不存在')
			}

			this.isLoading = false
		},

		/**
		 * 收集所有照片
		 */
		collectPhotos() {
			const photos = []

			// 添加封面图
			if (this.memory.coverImage) {
				photos.push({
					id: 'cover',
					url: this.memory.coverImage,
					isCover: true
				})
			}

			// 添加回忆中的照片
			if (this.memory.photos && this.memory.photos.length > 0) {
				photos.push(...this.memory.photos)
			}

			return photos
		},

		/**
		 * 格式化日期
		 */
		formatDate(dateString) {
			if (!dateString) return ''
			const date = new Date(dateString)
			return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
		},

		/**
		 * 返回
		 */
		handleBack() {
			uni.navigateBack()
		},

		/**
		 * 更多选项
		 */
		handleMoreOptions() {
			this.showOptionsModal = true
		},

		/**
		 * 关闭选项弹窗
		 */
		closeOptionsModal() {
			this.showOptionsModal = false
		},

		/**
		 * 编辑回忆
		 */
		handleEdit() {
			this.closeOptionsModal()
			this.editingMemory = {
				title: this.memory.title,
				location: this.memory.location,
				date: this.memory.date,
				description: this.memory.description || ''
			}
			this.showEditModal = true
		},

		/**
		 * 关闭编辑弹窗
		 */
		closeEditModal() {
			this.showEditModal = false
		},

		/**
		 * 保存编辑
		 */
		saveEditMemory() {
			if (!this.editingMemory.title || !this.editingMemory.title.trim()) {
				uni.showToast({
					title: '请输入回忆标题',
					icon: 'none'
				})
				return
			}

			const updated = albumService.updateMemory(this.memoryId, {
				title: this.editingMemory.title.trim(),
				location: this.editingMemory.location.trim() || this.memory.location,
				date: this.editingMemory.date.trim() || this.memory.date,
				description: this.editingMemory.description.trim()
			})

			if (updated) {
				this.memory = updated
				this.closeEditModal()
				uni.showToast({
					title: '保存成功',
					icon: 'success'
				})
			}
		},

		/**
		 * 删除回忆
		 */
		handleDelete() {
			this.closeOptionsModal()

			uni.showModal({
				title: '确认删除',
				content: '删除后将无法恢复，确定要删除这个回忆吗？',
				confirmText: '删除',
				confirmColor: '#ff4444',
				success: (res) => {
					if (res.confirm) {
						const success = albumService.deleteMemory(this.memoryId)
						if (success) {
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							})
							setTimeout(() => {
								uni.navigateBack()
							}, 500)
						}
					}
				}
			})
		},

		/**
		 * 分享
		 */
		handleShare() {
			uni.showToast({
				title: '分享功能开发中',
				icon: 'none'
			})
		},

		/**
		 * 切换札记编辑器
		 */
		toggleNoteEditor() {
			this.showNoteEditor = true
			this.editingNote = this.memory.travelNote || ''
		},

		/**
		 * 取消编辑札记
		 */
		cancelEditNote() {
			this.showNoteEditor = false
			this.editingNote = ''
		},

		/**
		 * 保存札记
		 */
		saveNote() {
			if (!this.editingNote || !this.editingNote.trim()) {
				uni.showToast({
					title: '请输入札记内容',
					icon: 'none'
				})
				return
			}

			albumService.saveTravelNote(this.memoryId, this.editingNote.trim())
			this.memory = albumService.getMemoryById(this.memoryId)
			this.showNoteEditor = false

			uni.showToast({
				title: '保存成功',
				icon: 'success'
			})
		},

		/**
		 * 生成旅行札记
		 */
		async handleGenerateNote() {
			this.isGenerating = true

			uni.showLoading({
				title: '生成中...',
				mask: true
			})

			try {
				const prompt = `请根据以下旅行信息生成一篇生动的旅行札记：

地点：${this.memory.location}
时间：${this.memory.date}
标题：${this.memory.title}
描述：${this.memory.description || '暂无描述'}
照片数量：${this.memory.photoCount} 张

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

				if (note) {
					albumService.saveTravelNote(this.memoryId, note)
					this.memory = albumService.getMemoryById(this.memoryId)

					uni.hideLoading()
					uni.showToast({
						title: '生成成功',
						icon: 'success'
					})
				} else {
					throw new Error('生成内容为空')
				}
			} catch (error) {
				console.error('[回忆详情] 生成札记失败:', error)
				uni.hideLoading()

				// 网络错误时使用默认模板
				const fallbackNote = `# ${this.memory.title}\n\n在${this.memory.location}的${this.memory.date}，我度过了一段难忘的时光。\n\n${this.memory.description || '这段回忆深深地印在了我的脑海里。'}\n\n期待下一次的旅程！✨`

				albumService.saveTravelNote(this.memoryId, fallbackNote)
				this.memory = albumService.getMemoryById(this.memoryId)

				uni.showToast({
					title: '网络失败，已生成模板',
					icon: 'none'
				})
			} finally {
				this.isGenerating = false
			}
		},

		/**
		 * 预览照片
		 */
		previewPhoto(index) {
			const urls = this.photos.map(p => p.url)
			uni.previewImage({
				urls: urls,
				current: index
			})
		},

		/**
		 * 删除照片
		 */
		deletePhoto(photoId) {
			if (photoId === 'cover') {
				uni.showToast({
					title: '封面图无法删除',
					icon: 'none'
				})
				return
			}

			uni.showModal({
				title: '确认删除',
				content: '确定要删除这张照片吗？',
				confirmColor: '#ff4444',
				success: (res) => {
					if (res.confirm) {
						const success = albumService.deletePhoto(this.memoryId, photoId)
						if (success) {
							this.memory = albumService.getMemoryById(this.memoryId)
							this.photos = this.collectPhotos()
							uni.showToast({
								title: '删除成功',
								icon: 'success'
							})
						}
					}
				}
			})
		},

		/**
		 * 添加照片
		 */
		handleAddPhotos() {
			uni.chooseImage({
				count: 9,
				sizeType: ['compressed'],
				sourceType: ['album', 'camera'],
				success: (res) => {
					let successCount = 0
					res.tempFilePaths.forEach(filePath => {
						const photo = albumService.addPhoto(this.memoryId, filePath)
						if (photo) successCount++
					})

					if (successCount > 0) {
						this.memory = albumService.getMemoryById(this.memoryId)
						this.photos = this.collectPhotos()
						uni.showToast({
							title: `成功添加 ${successCount} 张照片`,
							icon: 'success'
						})
					}
				}
			})
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
 * 问题3: 底部内容被虚拟按键/安全区遮挡（非 TabBar 页面）
 * 解决: content-area 和 bottom-actions 添加 safe-area-inset-bottom
 * =============================================================== */

.memory-detail-container {
	display: flex;
	flex-direction: column;
	/* Android 适配: 使用 100% 替代 100vh，避免 WebView 计算错误 */
	height: 100%;
	background-color: #ffffff;
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
	/* Android 适配: 使用 CSS 环境变量添加底部安全区，避免内容被虚拟按键遮挡 */
	padding-bottom: calc(160rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(160rpx + env(safe-area-inset-bottom));
}

/* 封面区域 */
.cover-section {
	position: relative;
	height: 480rpx;
	overflow: hidden;
}

.cover-image {
	width: 100%;
	height: 100%;
}

.cover-overlay {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background: linear-gradient(to top, rgba(0, 0, 0, 0.8) 0%, transparent 100%);
	padding: 48rpx;
}

.cover-title {
	display: block;
	color: #ffffff;
	font-size: 48rpx;
	font-weight: 700;
	margin-bottom: 16rpx;
}

.cover-meta {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.meta-item {
	color: rgba(255, 255, 255, 0.8);
	font-size: 24rpx;
}

/* 统计行 */
.stats-row {
	display: flex;
	gap: 24rpx;
	padding: 32rpx;
	margin-top: -32rpx;
	position: relative;
	z-index: 10;
}

.stat-row-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
	background-color: #ffffff;
	padding: 16rpx 24rpx;
	border-radius: 50rpx;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.stat-row-value {
	color: #63ec13;
	font-size: 28rpx;
	font-weight: 700;
}

.stat-row-icon {
	font-size: 24rpx;
}

.stat-row-label {
	color: #708961;
	font-size: 20rpx;
	font-weight: 700;
}

/* 描述区域 */
.description-section {
	padding: 32rpx;
}

.description-text {
	color: #666666;
	font-size: 28rpx;
	line-height: 1.8;
}

/* 札记区域 */
.note-section {
	padding: 32rpx;
	background-color: #f8f8f8;
	margin: 32rpx;
	border-radius: 32rpx;
}

.note-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 24rpx;
}

.note-title {
	color: #131811;
	font-size: 32rpx;
	font-weight: 700;
}

.note-edit-btn {
	padding: 8rpx 16rpx;
	background-color: transparent;
}

.edit-btn-text {
	color: #708961;
	font-size: 24rpx;
	font-weight: 700;
}

.note-content {
	background-color: #ffffff;
	padding: 32rpx;
	border-radius: 24rpx;
}

.note-text {
	color: #333333;
	font-size: 28rpx;
	line-height: 1.8;
	white-space: pre-wrap;
}

.note-editor {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.note-textarea {
	background-color: #ffffff;
	border: none;
	border-radius: 24rpx;
	padding: 24rpx;
	font-size: 28rpx;
	color: #131811;
	min-height: 300rpx;
	line-height: 1.8;
}

.note-placeholder {
	color: #999999;
}

.note-actions {
	display: flex;
	gap: 16rpx;
}

.note-btn {
	flex: 1;
	padding: 24rpx;
	border-radius: 24rpx;
}

.note-btn-cancel {
	background-color: #f8f8f8;
}

.note-btn-save {
	background-color: #63ec13;
}

.btn-text {
	color: #131811;
	font-size: 28rpx;
	font-weight: 700;
}

/* 照片区域 */
.photos-section {
	padding: 32rpx;
}

.photos-header {
	margin-bottom: 24rpx;
}

.photos-title {
	color: #131811;
	font-size: 32rpx;
	font-weight: 700;
}

.photos-grid {
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 8rpx;
}

.photo-grid-item {
	position: relative;
	aspect-ratio: 1;
	border-radius: 16rpx;
	overflow: hidden;
	background-color: #f8f8f8;
}

.photo-grid-image {
	width: 100%;
	height: 100%;
}

.photo-delete-btn {
	position: absolute;
	top: 8rpx;
	right: 8rpx;
	width: 48rpx;
	height: 48rpx;
	background-color: rgba(0, 0, 0, 0.6);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.delete-icon {
	color: #ffffff;
	font-size: 32rpx;
	line-height: 1;
}

.empty-photos {
	text-align: center;
	padding: 80rpx 0;
}

.empty-photos-text {
	color: #999999;
	font-size: 28rpx;
}

.add-photos-btn {
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16rpx;
	padding: 32rpx;
	margin-top: 32rpx;
	background-color: #f4f7f2;
	border-radius: 24rpx;
	border: 2rpx dashed #708961;
}

.add-photos-icon {
	font-size: 32rpx;
	color: #708961;
}

.add-photos-text {
	color: #708961;
	font-size: 28rpx;
	font-weight: 700;
}

/* 底部操作栏 */
.bottom-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	gap: 16rpx;
	padding: 24rpx 32rpx;
	padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
	background-color: #ffffff;
	border-top: 1rpx solid #f0f0f0;
}

.action-btn {
	flex: 1;
	height: 88rpx;
	border-radius: 44rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.action-btn-secondary {
	background-color: #f8f8f8;
}

.action-btn-primary {
	background-color: #63ec13;
}

.action-btn[disabled] {
	opacity: 0.5;
}

.action-btn-text {
	color: #131811;
	font-size: 28rpx;
	font-weight: 700;
}

/* 加载和错误状态 */
.loading-area,
.error-area {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 32rpx;
	padding: 120rpx 0;
}

.loading-text,
.error-text {
	color: #999999;
	font-size: 28rpx;
}

.error-btn {
	padding: 24rpx 48rpx;
	background-color: #63ec13;
	border-radius: 50rpx;
}

.error-btn-text {
	color: #131811;
	font-size: 28rpx;
	font-weight: 700;
}

/* 选项弹窗 */
.options-modal {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #ffffff;
	border-top-left-radius: 32rpx;
	border-top-right-radius: 32rpx;
	padding: 32rpx;
	padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
}

.option-item {
	width: 100%;
	padding: 32rpx;
	border-radius: 24rpx;
	margin-bottom: 16rpx;
	background-color: #f8f8f8;
}

.option-item-cancel {
	background-color: #f4f7f2;
}

.option-text {
	color: #131811;
	font-size: 32rpx;
	font-weight: 700;
}

.option-text-danger {
	color: #ff4444;
}

/* 编辑弹窗 */
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
}

.modal-content {
	width: 100%;
	max-width: 600rpx;
	background-color: #ffffff;
	border-top-left-radius: 64rpx;
	border-top-right-radius: 64rpx;
	padding: 64rpx 48rpx;
	padding-bottom: calc(64rpx + env(safe-area-inset-bottom));
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

.form-input {
	background-color: #f8f8f8;
	border: none;
	border-radius: 32rpx;
	padding: 24rpx 32rpx;
	font-size: 28rpx;
	color: #131811;
	min-height: 88rpx;
}

.form-textarea {
	background-color: #f8f8f8;
	border: none;
	border-radius: 32rpx;
	padding: 24rpx 32rpx;
	font-size: 28rpx;
	color: #131811;
	min-height: 200rpx;
	line-height: 1.6;
}

.form-placeholder {
	color: #999999;
}

.form-submit {
	background-color: #63ec13;
	padding: 32rpx;
	border-radius: 32rpx;
	margin-top: 32rpx;
	box-shadow: 0 4px 16px rgba(99, 236, 19, 0.3);
}

.submit-text {
	color: #131811;
	font-size: 32rpx;
	font-weight: 700;
}
</style>
