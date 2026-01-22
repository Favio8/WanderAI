<template>
	<view class="profile-container">
		<!-- Android 适配：顶部状态栏占位（预留状态栏高度，避免内容被遮挡） -->
		<view class="status-bar-placeholder" :style="{ height: statusBarHeight + 'px' }"></view>

		<!-- 头部导航 -->
		<view class="header">
			<button class="header-btn" @click="handleBack">
				<text class="btn-icon">←</text>
			</button>
			<text class="header-title">个人中心</text>
			<button class="header-btn" @click="openSettingsModal">
				<text class="btn-icon">⚙️</text>
			</button>
		</view>

		<!-- 主内容区 -->
		<scroll-view class="content-scroll" scroll-y>
			<view class="content-area">
				<!-- 用户信息区域 -->
				<view class="user-section">
					<view class="avatar-wrapper">
						<view class="avatar-container" @click="handleEditAvatar">
							<image
								class="avatar-image"
								:src="user.avatar"
								mode="aspectFill"
							/>
							<button class="avatar-edit-btn">
								<text class="edit-icon">✏️</text>
							</button>
						</view>
					</view>
					<view class="user-info-wrapper" @click="openEditModal">
						<text class="user-name">{{ user.name }}</text>
						<text class="user-level">{{ levelTitle }} {{ user.level }}级 • {{ user.joinYear }}年加入</text>
					</view>
				</view>

				<!-- 统计卡片 -->
				<view class="stats-grid">
					<view class="stat-card">
						<view class="stat-icon stat-icon-nature">
							<text class="icon">🌍</text>
						</view>
						<view class="stat-info">
							<text class="stat-label">去过的国家</text>
							<text class="stat-value">{{ user.countries }}</text>
						</view>
					</view>
					<view class="stat-card">
						<view class="stat-icon stat-icon-calendar">
							<text class="icon">📅</text>
						</view>
						<view class="stat-info">
							<text class="stat-label">累计旅行天数</text>
							<text class="stat-value">{{ user.days }}</text>
						</view>
					</view>
				</view>

				<!-- 账户菜单 -->
				<view class="menu-section">
					<text class="menu-title">我的账户</text>
					<view class="menu-list">
						<button
							v-for="(item, index) in menuItems"
							:key="index"
							class="menu-item"
							@click="handleMenuClick(item)"
						>
							<view class="menu-icon-bg">
								<text class="menu-icon">{{ item.icon }}</text>
							</view>
							<view class="menu-content">
								<text class="menu-item-title">{{ item.title }}</text>
								<text class="menu-item-sub">{{ item.sub }}</text>
							</view>
							<text class="menu-arrow">›</text>
						</button>
					</view>
				</view>

				<!-- 旅行足迹地图 -->
				<view class="map-section">
					<view class="map-header">
						<text class="map-title">旅行足迹</text>
						<button class="map-view-btn">
							<text class="map-view-text">查看完整地图</text>
						</button>
					</view>
					<view class="map-card">
						<image
							class="map-background"
							src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTP5IacWOAKclbfp8soJAZnjdAsOT8gXzEKl7I9eUkOvBtmTnZwCIl-nZhGZDc4R3IdlpsPb4rObWRFir7WkajYSSB4-SH3t_-XSH_QLzGQeumKYhwbh0dgtpZDVZFSinJlDWwug6tqnwasDZrUW8-JgmpKcbsUTVSJ8fm4J548eZOANi-B0VYsehLzMACffzBMBfAlcewNR-k7FbqsxQ-HSWmriU1kfi167B3kSDgA0LHNC0fD6zKRKeKZ63-lBO4vS82r2Bu6EI"
							mode="aspectFill"
						/>
						<view class="map-overlay">
							<view class="map-stats">
								<text class="map-stat-value">{{ user.continents }} 个大洲</text>
								<text class="map-stat-desc">您已走过世界的 {{ getTravelProgress() }}%！</text>
							</view>
							<button class="map-share-btn">
								<text class="share-icon">📍</text>
							</button>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 编辑资料弹窗 -->
		<view v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">编辑资料</text>
					<button class="modal-close" @click="closeEditModal">
						<text class="close-icon">✕</text>
					</button>
				</view>

				<view class="modal-form">
					<view class="form-group">
						<text class="form-label">昵称</text>
						<input
							v-model="editForm.name"
							class="form-input"
							placeholder="请输入昵称"
							placeholder-class="form-placeholder"
							maxlength="20"
						/>
					</view>

					<view class="form-group">
						<text class="form-label">加入年份</text>
						<picker mode="selector" :range="yearOptions" @change="onYearChange">
							<view class="form-input form-picker">
								{{ editForm.joinYear || '请选择' }}
								<text class="picker-arrow">▼</text>
							</view>
						</picker>
					</view>

					<button class="form-submit" @click="saveUserProfile">
						<text class="submit-text">保存</text>
					</button>
				</view>
			</view>
		</view>

		<!-- 设置弹窗 -->
		<view v-if="showSettingsModal" class="modal-overlay" @click="closeSettingsModal">
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">设置</text>
					<button class="modal-close" @click="closeSettingsModal">
						<text class="close-icon">✕</text>
					</button>
				</view>

				<view class="modal-form">
					<view class="settings-list">
						<view class="settings-item">
							<text class="settings-label">消息通知</text>
							<switch
								:checked="user.preferences.notifications"
								@change="onNotificationChange"
								color="#63ec13"
							/>
						</view>

						<view class="settings-item">
							<text class="settings-label">主题</text>
							<picker mode="selector" :range="themeOptions" @change="onThemeChange">
								<view class="theme-value">
									{{ getThemeLabel(user.preferences.theme) }}
								</view>
							</picker>
						</view>
					</view>

					<button class="form-submit-secondary" @click="handleClearData">
						<text class="submit-text-secondary">清空所有数据</text>
					</button>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { userService, getLevelTitle } from '@/services/user.js'

export default {
	data() {
		return {
			// 用户数据
			user: {
				name: '漫游者',
				avatar: '',
				level: 1,
				joinYear: new Date().getFullYear(),
				countries: 0,
				days: 0,
				continents: 0,
				preferences: {
					theme: 'light',
					notifications: true
				}
			},

			// 编辑弹窗
			showEditModal: false,
			editForm: {
				name: '',
				joinYear: null
			},
			yearOptions: [],
			currentYear: new Date().getFullYear(),

			// 设置弹窗
			showSettingsModal: false,
			themeOptions: ['浅色', '深色', '跟随系统'],

			// 菜单项
			menuItems: [
				{ id: 'favorites', icon: '🔖', title: '我的收藏', sub: '24 个保存的地点' },
				{ id: 'orders', icon: '📋', title: '订单管理', sub: '3 个即将进行的行程' },
				{ id: 'settings', icon: '🎛️', title: 'AI 偏好设置', sub: '自定义您的推荐流' }
			],
			// Android 适配：系统信息
			statusBarHeight: 44, // 默认值，会在 onLoad 中更新
			safeAreaInsetBottom: 0, // 底部安全区高度（px）
			tabBarHeight: 60 // TabBar 高度（px）
		}
	},

	computed: {
		levelTitle() {
			return getLevelTitle(this.user.level)
		}
	},

	onLoad() {
		// Android 适配：初始化系统信息
		this.initSystemInfo()
		this.initYearOptions()
		this.loadUserProfile()
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

				console.log('[Profile] 系统信息:', {
					statusBarHeight: this.statusBarHeight,
					safeAreaInsetBottom: this.safeAreaInsetBottom
				})
			} catch (e) {
				console.error('[Profile] 获取系统信息失败:', e)
			}
		},

		/**
		 * 初始化年份选项
		 */
		initYearOptions() {
			const currentYear = new Date().getFullYear()
			 this.yearOptions = []
			 for (let i = 0; i < 10; i++) {
				 this.yearOptions.push(currentYear - i)
			 }
		},

		/**
		 * 加载用户数据
		 */
		loadUserProfile() {
			this.user = userService.getUserProfile()
		},

		/**
		 * 打开编辑弹窗
		 */
		openEditModal() {
			this.editForm = {
				name: this.user.name,
				joinYear: this.user.joinYear
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
		 * 年份选择变化
		 */
		onYearChange(e) {
			this.editForm.joinYear = this.yearOptions[e.detail.value]
		},

		/**
		 * 保存用户资料
		 */
		saveUserProfile() {
			if (!this.editForm.name || !this.editForm.name.trim()) {
				uni.showToast({
					title: '请输入昵称',
					icon: 'none'
				})
				return
			}

			// 更新用户信息
			this.user = userService.updateUserProfile({
				name: this.editForm.name.trim(),
				joinYear: this.editForm.joinYear
			})

			this.closeEditModal()
			uni.showToast({
				title: '保存成功',
				icon: 'success'
			})
		},

		/**
		 * 编辑头像
		 */
		async handleEditAvatar() {
			try {
				uni.showActionSheet({
					itemList: ['从相册选择', '拍照'],
					success: async (res) => {
						try {
							if (res.tapIndex === 0) {
								// 从相册选择
								uni.showLoading({
									title: '加载中...'
								})
								const avatarUrl = await userService.chooseAndUpdateAvatar()
								this.user.avatar = avatarUrl
								uni.hideLoading()
								uni.showToast({
									title: '头像已更新',
									icon: 'success'
								})
							} else if (res.tapIndex === 1) {
								// 拍照
								uni.showLoading({
									title: '拍照中...'
								})
								const avatarUrl = await userService.takeAndUpdateAvatar()
								this.user.avatar = avatarUrl
								uni.hideLoading()
								uni.showToast({
									title: '头像已更新',
									icon: 'success'
								})
							}
						} catch (e) {
							uni.hideLoading()
							console.error('更新头像失败:', e)
							uni.showToast({
								title: '更新失败，请重试',
								icon: 'none'
							})
						}
					}
				})
			} catch (e) {
				console.error('选择头像失败:', e)
			}
		},

		/**
		 * 打开设置弹窗
		 */
		openSettingsModal() {
			this.showSettingsModal = true
			this.loadUserProfile()
		},

		/**
		 * 关闭设置弹窗
		 */
		closeSettingsModal() {
			 this.showSettingsModal = false
		},

		/**
		 * 通知开关变化
		 */
		onNotificationChange(e) {
			this.user = userService.updatePreferences({
				notifications: e.detail.value
			})
			uni.showToast({
				title: e.detail.value ? '已开启通知' : '已关闭通知',
				icon: 'none'
			})
		},

		/**
		 * 主题选择变化
		 */
		onThemeChange(e) {
			const themes = ['light', 'dark', 'auto']
			const theme = themes[e.detail.value]
			this.user = userService.updatePreferences({ theme })
			uni.showToast({
				title: '主题已切换',
				icon: 'none'
			})
		},

		/**
		 * 获取主题标签
		 */
		getThemeLabel(theme) {
			const labels = {
				light: '浅色',
				dark: '深色',
				auto: '跟随系统'
			}
			return labels[theme] || '浅色'
		},

		/**
		 * 获取旅行进度百分比
		 */
		getTravelProgress() {
			// 假设总共有 7 个大洲
			return Math.round((this.user.continents / 7) * 100)
		},

		/**
		 * 清空所有数据
		 */
		handleClearData() {
			uni.showModal({
				title: '确认清空',
				content: '确定要清空所有数据吗？此操作不可恢复。',
				confirmColor: '#ff4d4f',
				success: (res) => {
					if (res.confirm) {
						userService.clearUserData()
						this.loadUserProfile()
						this.closeSettingsModal()
						uni.showToast({
							title: '已清空',
							icon: 'success'
						})
					}
				}
			})
		},

		/**
		 * 菜单点击
		 */
		handleMenuClick(item) {
			console.log('点击菜单项:', item.title)

			switch (item.id) {
				case 'favorites':
					uni.navigateTo({
						url: '/pages/favorites/favorites'
					})
					break
				case 'orders':
					uni.navigateTo({
						url: '/pages/orders/orders'
					})
					break
				case 'settings':
					uni.navigateTo({
						url: '/pages/settings/settings'
					})
					break
				default:
					uni.showToast({
						title: item.title + ' 即将上线',
						icon: 'none'
					})
			}
		},

		/**
		 * 返回
		 */
		handleBack() {
			// 如果是在 tabBar 中，不需要返回
			uni.switchTab({
				url: '/pages/chat/chat'
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
 * 问题3: 底部内容被 TabBar + 虚拟按键/安全区遮挡
 * 解决: 使用 CSS calc() 计算 TabBar 高度(60px = 120rpx) + 安全区
 * =============================================================== */

.profile-container {
	display: flex;
	flex-direction: column;
	/* Android 适配: 使用 100% 替代 100vh，避免 WebView 计算错误 */
	height: 100%;
	background-color: #f7f8f6;
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

/* 头部导航 */
.header {
	/* Android 适配: 移除 sticky 定位，状态栏占位已处理顶部间距 */
	position: relative;
	z-index: 50;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 32rpx;
	background-color: rgba(247, 248, 246, 0.8);
	backdrop-filter: blur(20rpx);
}

.header-btn {
	padding: 16rpx;
	background-color: #ffffff;
	border-radius: 50%;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.btn-icon {
	font-size: 28rpx;
	color: #131811;
}

.header-title {
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
	/* Android 适配: 底部预留安全区，避免内容被 TabBar 遮挡 */
	padding-bottom: calc(240rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(240rpx + env(safe-area-inset-bottom));
}

/* 用户信息区域 */
.user-section {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 48rpx;
}

.avatar-wrapper {
	margin-bottom: 48rpx;
}

.avatar-container {
	position: relative;
	width: 224rpx;
	height: 224rpx;
	border-radius: 50%;
	border: 8rpx solid #ffffff;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
	overflow: hidden;
}

.avatar-image {
	width: 100%;
	height: 100%;
}

.avatar-edit-btn {
	position: absolute;
	bottom: 0;
	right: 0;
	width: 64rpx;
	height: 64rpx;
	background-color: #63ec13;
	border: 4rpx solid #ffffff;
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0;
}

.edit-icon {
	font-size: 24rpx;
	font-weight: 700;
}

.user-info-wrapper {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 8rpx;
	padding: 16rpx;
	border-radius: 32rpx;
}

.user-info-wrapper:active {
	background-color: rgba(0, 0, 0, 0.03);
}

.user-name {
	color: #131811;
	font-size: 48rpx;
	font-weight: 700;
	display: block;
}

.user-level {
	color: #708961;
	font-size: 28rpx;
	display: block;
}

/* 统计卡片 */
.stats-grid {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 32rpx;
	padding: 0 48rpx 64rpx;
}

.stat-card {
	background-color: #eef2ec;
	border-radius: 48rpx;
	padding: 40rpx;
	display: flex;
	flex-direction: column;
	gap: 24rpx;
}

.stat-icon {
	width: 80rpx;
	height: 80rpx;
	background-color: rgba(139, 168, 142, 0.1);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.icon {
	font-size: 40rpx;
}

.stat-info {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.stat-label {
	color: #999999;
	font-size: 20rpx;
	font-weight: 700;
	text-transform: uppercase;
}

.stat-value {
	color: #131811;
	font-size: 48rpx;
	font-weight: 800;
}

/* 菜单区域 */
.menu-section {
	padding: 0 48rpx 64rpx;
}

.menu-title {
	color: #131811;
	font-size: 28rpx;
	font-weight: 700;
	display: block;
	margin-bottom: 32rpx;
}

.menu-list {
	display: flex;
	flex-direction: column;
	gap: 32rpx;
}

.menu-item {
	display: flex;
	align-items: center;
	gap: 32rpx;
	padding: 32rpx;
	background-color: #ffffff;
	border: 1rpx solid rgba(0, 0, 0, 0.05);
	border-radius: 32rpx;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.menu-icon-bg {
	width: 80rpx;
	height: 80rpx;
	background-color: #f4f7f2;
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
}

.menu-icon {
	font-size: 36rpx;
}

.menu-content {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 4rpx;
}

.menu-item-title {
	color: #131811;
	font-size: 28rpx;
	font-weight: 700;
}

.menu-item-sub {
	color: #999999;
	font-size: 24rpx;
}

.menu-arrow {
	color: #e0e0e0;
	font-size: 32rpx;
	font-weight: 300;
}

/* 地图区域 */
.map-section {
	padding: 0 48rpx 48rpx;
}

.map-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
	margin-bottom: 32rpx;
}

.map-title {
	color: #131811;
	font-size: 28rpx;
	font-weight: 700;
}

.map-view-btn {
	padding: 16rpx;
	background-color: transparent;
}

.map-view-text {
	color: #63ec13;
	font-size: 24rpx;
	font-weight: 700;
}

.map-card {
	position: relative;
	width: 100%;
	aspect-ratio: 2 / 1;
	border-radius: 48rpx;
	overflow: hidden;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
	background-color: #708961;
}

.map-background {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	width: 100%;
	height: 100%;
	opacity: 0.4;
	mix-blend-mode: overlay;
}

.map-overlay {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	padding: 32rpx;
	background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 100%);
	display: flex;
	justify-content: space-between;
	align-items: flex-end;
}

.map-stats {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.map-stat-value {
	color: #ffffff;
	font-size: 40rpx;
	font-weight: 800;
}

.map-stat-value::before {
	content: '';
	color: #63ec13;
}

.map-stat-desc {
	color: rgba(255, 255, 255, 0.8);
	font-size: 24rpx;
}

.map-share-btn {
	width: 80rpx;
	height: 80rpx;
	background-color: rgba(255, 255, 255, 0.2);
	backdrop-filter: blur(20rpx);
	border-radius: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0;
}

.share-icon {
	font-size: 32rpx;
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

.form-input {
	background-color: #f8f8f8;
	border: none;
	border-radius: 32rpx;
	padding: 24rpx 32rpx;
	font-size: 28rpx;
	color: #131811;
}

.form-picker {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.picker-arrow {
	font-size: 20rpx;
	color: #999999;
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

.form-submit:active {
	transform: scale(0.98);
}

.submit-text {
	color: #131811;
	font-size: 32rpx;
	font-weight: 700;
}

/* 设置列表 */
.settings-list {
	display: flex;
	flex-direction: column;
	gap: 32rpx;
}

.settings-item {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx 32rpx;
	background-color: #f8f8f8;
	border-radius: 32rpx;
}

.settings-label {
	color: #131811;
	font-size: 28rpx;
	font-weight: 500;
}

.theme-value {
	color: #63ec13;
	font-size: 28rpx;
	font-weight: 500;
}

.form-submit-secondary {
	background-color: #f8f8f8;
	padding: 32rpx;
	border-radius: 32rpx;
	margin-top: 32rpx;
}

.submit-text-secondary {
	color: #ff4d4f;
	font-size: 28rpx;
	font-weight: 500;
}
</style>
