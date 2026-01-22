<template>
	<view class="settings-container">
		<!-- Android 适配：顶部状态栏占位（预留状态栏高度，避免内容被遮挡） -->
		<view class="status-bar-placeholder" :style="{ height: statusBarHeight + 'px' }"></view>

		<!-- 顶部导航栏 -->
		<view class="app-bar">
			<button class="bar-btn" @click="handleBack">
				<text class="bar-icon">←</text>
			</button>
			<text class="bar-title">设置</text>
			<button class="bar-btn">
				<text class="bar-icon">⋯</text>
			</button>
		</view>

		<!-- 主内容区 -->
		<scroll-view class="content-scroll" scroll-y>
			<view class="content-area">
				<!-- 主题设置 -->
				<view class="section">
					<text class="section-title">外观设置</text>
					<view class="setting-item">
						<view class="item-left">
							<text class="item-icon">🎨</text>
							<view class="item-info">
								<text class="item-title">主题模式</text>
								<text class="item-desc">选择您喜欢的主题</text>
							</view>
						</view>
						<view class="item-right">
							<button
								v-for="theme in themes"
								:key="theme.id"
								class="theme-btn"
								:class="currentTheme === theme.id ? 'theme-btn-active' : ''"
								@click="switchTheme(theme.id)"
							>
								<text class="theme-icon">{{ theme.icon }}</text>
								<text class="theme-name">{{ theme.name }}</text>
							</button>
						</view>
					</view>
				</view>

				<!-- AI 设置 -->
				<view class="section">
					<text class="section-title">AI 设置</text>
					<view class="setting-item">
						<view class="item-left">
							<text class="item-icon">🤖</text>
							<view class="item-info">
								<text class="item-title">AI 回复风格</text>
								<text class="item-desc">调整 AI 的回复语气</text>
							</view>
						</view>
						<picker
							:value="aiStyle"
							:range="aiStyleOptions"
							range-key="name"
							@change="handleAiStyleChange"
						>
							<view class="picker-trigger">
								<text class="picker-text">{{ aiStyleOptions[aiStyle].name }}</text>
								<text class="picker-arrow">▼</text>
							</view>
						</picker>
					</view>

					<view class="setting-item">
						<view class="item-left">
							<text class="item-icon">📝</text>
							<view class="item-info">
								<text class="item-title">札记生成风格</text>
								<text class="item-desc">选择旅行札记的写作风格</text>
							</view>
						</view>
						<picker
							:value="noteStyle"
							:range="noteStyleOptions"
							range-key="name"
							@change="handleNoteStyleChange"
						>
							<view class="picker-trigger">
								<text class="picker-text">{{ noteStyleOptions[noteStyle].name }}</text>
								<text class="picker-arrow">▼</text>
							</view>
						</picker>
					</view>
				</view>

				<!-- 通知设置 -->
				<view class="section">
					<text class="section-title">通知设置</text>
					<view class="setting-item">
						<view class="item-left">
							<text class="item-icon">🔔</text>
							<view class="item-info">
								<text class="item-title">推送通知</text>
								<text class="item-desc">接收行程提醒和推荐</text>
							</view>
						</view>
						<switch
							:checked="pushNotification"
							@change="handlePushNotificationChange"
							color="#63ec13"
						/>
					</view>

					<view class="setting-item">
						<view class="item-left">
							<text class="item-icon">📧</text>
							<view class="item-info">
								<text class="item-title">邮件通知</text>
								<text class="item-desc">接收重要更新通知</text>
							</view>
						</view>
						<switch
							:checked="emailNotification"
							@change="handleEmailNotificationChange"
							color="#63ec13"
						/>
					</view>
				</view>

				<!-- 隐私设置 -->
				<view class="section">
					<text class="section-title">隐私设置</text>
					<view class="setting-item">
						<view class="item-left">
							<text class="item-icon">🔒</text>
							<view class="item-info">
								<text class="item-title">隐私模式</text>
								<text class="item-desc">隐藏敏感信息</text>
							</view>
						</view>
						<switch
							:checked="privacyMode"
							@change="handlePrivacyModeChange"
							color="#63ec13"
						/>
					</view>
				</view>

				<!-- 其他设置 -->
				<view class="section">
					<text class="section-title">其他</text>
					<view class="setting-item" @click="handleClearCache">
						<view class="item-left">
							<text class="item-icon">🗑️</text>
							<view class="item-info">
								<text class="item-title">清除缓存</text>
								<text class="item-desc">释放存储空间</text>
							</view>
						</view>
						<text class="cache-size">{{ cacheSize }}</text>
					</view>

					<view class="setting-item" @click="handleAbout">
						<view class="item-left">
							<text class="item-icon">ℹ️</text>
							<view class="item-info">
								<text class="item-title">关于我们</text>
								<text class="item-desc">版本信息</text>
							</view>
						</view>
						<text class="arrow">›</text>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { storage, STORAGE_KEYS } from '@/utils/storage.js'
import { themeService, THEMES } from '@/services/theme.js'

export default {
	data() {
		return {
			currentTheme: 'light',
			themes: Object.values(THEMES),
			aiStyle: 0,
			aiStyleOptions: [
				{ id: 'friendly', name: '友好亲切' },
				{ id: 'professional', name: '专业严谨' },
				{ id: 'humorous', name: '幽默风趣' }
			],
			noteStyle: 0,
			noteStyleOptions: [
				{ id: 'emotional', name: '情感丰富' },
				{ id: 'concise', name: '简洁明了' },
				{ id: 'detailed', name: '详细描述' }
			],
			pushNotification: true,
			emailNotification: false,
			privacyMode: false,
			cacheSize: '0 MB',
			// Android 适配：系统信息
			statusBarHeight: 44, // 默认值，会在 onLoad 中更新
			safeAreaInsetBottom: 0 // 底部安全区高度（px）
		}
	},

	onLoad() {
		// Android 适配：初始化系统信息
		this.initSystemInfo()
		this.loadSettings()
		this.calculateCacheSize()
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

				console.log('[Settings] 系统信息:', {
					statusBarHeight: this.statusBarHeight,
					safeAreaInsetBottom: this.safeAreaInsetBottom
				})
			} catch (e) {
				console.error('[Settings] 获取系统信息失败:', e)
			}
		},

		/**
		 * 加载设置
		 */
		loadSettings() {
			try {
				const settings = storage.get(STORAGE_KEYS.SETTINGS) || {}
				this.currentTheme = themeService.getCurrentTheme()
				this.aiStyle = this.aiStyleOptions.findIndex(opt => opt.id === settings.aiStyle) || 0
				this.noteStyle = this.noteStyleOptions.findIndex(opt => opt.id === settings.noteStyle) || 0
				this.pushNotification = settings.pushNotification !== false
				this.emailNotification = settings.emailNotification || false
				this.privacyMode = settings.privacyMode || false
			} catch (e) {
				console.error('加载设置失败:', e)
			}
		},

		/**
		 * 保存设置
		 */
		saveSettings() {
			try {
				const settings = {
					aiStyle: this.aiStyleOptions[this.aiStyle].id,
					noteStyle: this.noteStyleOptions[this.noteStyle].id,
					pushNotification: this.pushNotification,
					emailNotification: this.emailNotification,
					privacyMode: this.privacyMode
				}
				storage.set(STORAGE_KEYS.SETTINGS, settings)
			} catch (e) {
				console.error('保存设置失败:', e)
			}
		},

		/**
		 * 切换主题
		 */
		switchTheme(themeId) {
			this.currentTheme = themeId
			themeService.toggleTheme(themeId)
			this.saveSettings()
		},

		/**
		 * AI 风格改变
		 */
		handleAiStyleChange(e) {
			this.aiStyle = e.detail.value
			this.saveSettings()
		},

		/**
		 * 札记风格改变
		 */
		handleNoteStyleChange(e) {
			this.noteStyle = e.detail.value
			this.saveSettings()
		},

		/**
		 * 推送通知改变
		 */
		handlePushNotificationChange(e) {
			this.pushNotification = e.detail.value
			this.saveSettings()
		},

		/**
		 * 邮件通知改变
		 */
		handleEmailNotificationChange(e) {
			this.emailNotification = e.detail.value
			this.saveSettings()
		},

		/**
		 * 隐私模式改变
		 */
		handlePrivacyModeChange(e) {
			this.privacyMode = e.detail.value
			this.saveSettings()
		},

		/**
		 * 清除缓存/重置数据
		 */
		handleClearCache() {
			uni.showModal({
				title: '确认清除',
				content: '确定要清除所有缓存和数据吗？\n\n这将清除：\n- 聊天记录\n- 收藏列表\n- 相册照片\n- 行程计划\n- 热门目的地\n（用户设置和个人资料将保留）',
				confirmText: '清除',
				confirmColor: '#ff4d4f',
				success: (res) => {
					if (res.confirm) {
						uni.showLoading({
							title: '清除中...'
						})

						try {
							// 清除业务数据（保留用户设置和个人资料）
							const keysToKeep = [
								STORAGE_KEYS.USER_PROFILE,
								STORAGE_KEYS.SETTINGS,
								STORAGE_KEYS.THEME
							]

							// 获取所有存储的键
							const allKeys = [STORAGE_KEYS.CHAT_HISTORY, STORAGE_KEYS.CHAT_MESSAGES, STORAGE_KEYS.FAVORITES, STORAGE_KEYS.DESTINATIONS, STORAGE_KEYS.ALBUMS, STORAGE_KEYS.PHOTOS, STORAGE_KEYS.ITINERARIES]

							// 清除业务数据
							allKeys.forEach(key => {
								try {
									storage.remove(key)
								} catch (e) {
									console.error('清除', key, '失败:', e)
								}
							})

							// 清除热门目的地缓存
							try {
								const { clearTrendingCache } = require('@/services/trendingDestinations.js')
								clearTrendingCache()
							} catch (e) {
								console.error('清除热门目的地缓存失败:', e)
							}

							// 重置相册数据
							try {
								const { resetAlbumData } = require('@/services/album.js')
								resetAlbumData()
							} catch (e) {
								console.error('重置相册数据失败:', e)
							}

							setTimeout(() => {
								uni.hideLoading()
								this.calculateCacheSize()
								uni.showToast({
									title: '数据已清除',
									icon: 'success'
								})
							}, 500)
						} catch (e) {
							console.error('清除数据失败:', e)
							uni.hideLoading()
							uni.showToast({
								title: '清除失败',
								icon: 'none'
							})
						}
					}
				}
			})
		},

		/**
		 * 关于我们
		 */
		handleAbout() {
			// TODO: 动态读取 manifest.json 的版本号
			const version = 'v1.0.2' // 从 manifest.json versionName 读取
			uni.showModal({
				title: '关于我们',
				content: `WanderAI ${version}\n\n智能旅行伴侣，让您的旅行更加精彩。\n\n© 2024 WanderAI`,
				showCancel: false
			})
		},

		/**
		 * 计算缓存大小
		 */
		calculateCacheSize() {
			try {
				const info = uni.getStorageInfoSync()
				const size = (info.currentSize / 1024 / 1024).toFixed(2)
				this.cacheSize = size + ' MB'
			} catch (e) {
				console.error('计算缓存失败:', e)
			}
		},

		/**
		 * 返回
		 */
		handleBack() {
			uni.navigateBack()
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
 * 解决: 添加 status-bar-placeholder 动态占位
 *
 * 问题3: 底部内容被虚拟按键/安全区遮挡（非 TabBar 页面）
 * 解决: content-area 添加 safe-area-inset-bottom 的 padding
 * =============================================================== */

.settings-container {
	display: flex;
	flex-direction: column;
	/* Android 适配: 使用 100% 替代 100vh，避免 WebView 计算错误 */
	height: 100%;
	background-color: #f7f8f6;
}

/* 顶部状态栏占位（Android 适配：预留状态栏高度，避免内容被遮挡） */
.status-bar-placeholder {
	width: 100%;
	flex-shrink: 0;
	/* 高度由 JavaScript 动态设置（uni.getSystemInfoSync().statusBarHeight） */
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
	background-color: rgba(247, 248, 246, 0.8);
	backdrop-filter: blur(20rpx);
	flex-shrink: 0;
}

.bar-btn {
	padding: 16rpx;
	background-color: #ffffff;
	border-radius: 50%;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.bar-icon {
	font-size: 28rpx;
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
	padding: 48rpx;
	/* Android 适配: 使用 CSS 环境变量添加底部安全区，避免内容被虚拟按键遮挡 */
	padding-bottom: calc(240rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(240rpx + env(safe-area-inset-bottom));
}

/* 分区 */
.section {
	margin-bottom: 64rpx;
}

.section-title {
	color: #708961;
	font-size: 24rpx;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.1em;
	display: block;
	margin-bottom: 24rpx;
}

/* 设置项 */
.setting-item {
	background-color: #ffffff;
	border-radius: 32rpx;
	padding: 32rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 16rpx;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	border: 1rpx solid rgba(0, 0, 0, 0.05);
}

.item-left {
	display: flex;
	align-items: center;
	gap: 24rpx;
	flex: 1;
}

.item-icon {
	font-size: 32rpx;
}

.item-info {
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.item-title {
	color: #131811;
	font-size: 28rpx;
	font-weight: 700;
	display: block;
}

.item-desc {
	color: #708961;
	font-size: 24rpx;
	display: block;
}

.item-right {
	display: flex;
	gap: 16rpx;
}

/* 主题按钮 */
.theme-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	padding: 16rpx 24rpx;
	background-color: #f8f8f8;
	border-radius: 24rpx;
	border: 2rpx solid transparent;
	transition: all 0.2s;
}

.theme-btn-active {
	background-color: #63ec13;
	border-color: #63ec13;
}

.theme-icon {
	font-size: 28rpx;
}

.theme-name {
	font-size: 20rpx;
	color: #131811;
	font-weight: 700;
}

.theme-btn-active .theme-name {
	color: #ffffff;
}

/* 选择器 */
.picker-trigger {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 12rpx 24rpx;
	background-color: #f8f8f8;
	border-radius: 24rpx;
}

.picker-text {
	color: #131811;
	font-size: 24rpx;
	font-weight: 700;
}

.picker-arrow {
	color: #708961;
	font-size: 16rpx;
}

/* 缓存大小 */
.cache-size {
	color: #708961;
	font-size: 24rpx;
}

/* 箭头 */
.arrow {
	color: #708961;
	font-size: 32rpx;
}
</style>
