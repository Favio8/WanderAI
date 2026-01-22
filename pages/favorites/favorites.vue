<template>
	<view class="favorites-container">
		<!-- Android 适配：顶部状态栏占位（预留状态栏高度，避免内容被遮挡） -->
		<view class="status-bar-placeholder" :style="{ height: statusBarHeight + 'px' }"></view>
		<!-- 顶部导航栏 -->
		<view class="app-bar">
			<button class="bar-btn" @click="handleBack">
				<text class="bar-icon">←</text>
			</button>
			<text class="bar-title">我的收藏</text>
			<button class="bar-btn">
				<text class="bar-icon">⋯</text>
			</button>
		</view>

		<!-- 主内容区 -->
		<scroll-view class="content-scroll" scroll-y>
			<view class="content-area">
				<!-- 加载状态 -->
				<view v-if="isLoading" class="loading-container">
					<text class="loading-text">加载中...</text>
				</view>

				<!-- 空状态 -->
				<view v-else-if="favorites.length === 0" class="empty-state">
					<text class="empty-icon">❤️</text>
					<text class="empty-title">还没有收藏</text>
					<text class="empty-subtitle">去探索页发现更多精彩目的地</text>
					<button class="empty-btn" @click="goToExplore">
						<text class="empty-btn-text">去探索</text>
					</button>
				</view>

				<!-- 收藏列表 -->
				<view v-else class="favorites-list">
					<view
						v-for="item in favorites"
						:key="item.id"
						class="favorite-card"
						@click="handleCardClick(item)"
					>
						<image class="card-image" :src="item.image" mode="aspectFill" />
						<view class="card-overlay">
							<view class="card-info">
								<text class="card-title">{{ item.name }}</text>
								<view class="card-location">
									<text class="location-icon">📍</text>
									<text class="location-text">{{ item.location }}</text>
								</view>
								<view class="card-rating">
									<text class="rating-icon">★</text>
									<text class="rating-text">{{ item.rating }}</text>
								</view>
							</view>
							<button class="card-favorite-btn" @click.stop="toggleFavorite(item)">
								<text class="favorite-icon">{{ item.isFavorite ? '❤️' : '♡' }}</text>
							</button>
						</view>
						<view v-if="item.isTopPick" class="card-badge">
							<text class="badge-text">首选</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
import { destinationService } from '@/services/destination.js'

export default {
	data() {
		return {
			favorites: [],
			isLoading: false,
			// Android 适配：系统信息
			statusBarHeight: 44, // 默认值，会在 onLoad 中更新
			safeAreaInsetBottom: 0 // 底部安全区高度（px）
		}
	},

	onLoad() {
		// Android 适配：初始化系统信息
		this.initSystemInfo()
		this.loadFavorites()
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
				console.log('[Favorites] 系统信息:', {
					statusBarHeight: this.statusBarHeight,
					safeAreaInsetBottom: this.safeAreaInsetBottom
				})
			} catch (e) {
				console.error('[Favorites] 获取系统信息失败:', e)
			}
		},

		/**
		 * 加载收藏列表
		 */
		loadFavorites() {
			this.isLoading = true
			try {
				this.favorites = destinationService.getFavorites()
			} catch (e) {
				console.error('加载收藏失败:', e)
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
			} finally {
				this.isLoading = false
			}
		},

		/**
		 * 返回
		 */
		handleBack() {
			uni.navigateBack()
			},

		/**
		 * 点击卡片 - 跳转到详情页
		 */
		handleCardClick(item) {
			console.log('点击收藏:', item.name)
			uni.navigateTo({
				url: `/pages/destination/destination?id=${item.id}`
			})
		},

		/**
		 * 切换收藏状态
		 */
		toggleFavorite(item) {
			destinationService.toggleFavorite(item.id)
			this.loadFavorites()
		},

		/**
		 * 去探索页
		 */
		goToExplore() {
			uni.switchTab({
				url: '/pages/explore/explore'
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
 * 解决: content-area 添加 safe-area-inset-bottom 的 padding
 * =============================================================== */

.favorites-container {
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
	background-color: rgba(247, 248, 246, 0.8);
	backdrop-filter: blur(20rpx);
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

/* 加载状态 */
.loading-container {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 200rpx 0;
}

.loading-text {
	color: #708961;
	font-size: 28rpx;
}

/* 空状态 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 200rpx 0;
	text-align: center;
}

.empty-icon {
	font-size: 120rpx;
	margin-bottom: 32rpx;
	opacity: 0.4;
}

.empty-title {
	color: #131811;
	font-size: 28rpx;
	font-weight: 500;
	display: block;
	margin-bottom: 8rpx;
}

.empty-subtitle {
	color: #708961;
	font-size: 24rpx;
	display: block;
	margin-bottom: 48rpx;
}

.empty-btn {
	background-color: #63ec13;
	padding: 24rpx 48rpx;
	border-radius: 48rpx;
	box-shadow: 0 4px 16px rgba(99, 236, 19, 0.3);
}

.empty-btn-text {
	color: #131811;
	font-size: 28rpx;
	font-weight: 700;
}

/* 收藏列表 */
.favorites-list {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	gap: 32rpx;
}

.favorite-card {
	position: relative;
	background-color: #ffffff;
	border-radius: 48rpx;
	overflow: hidden;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	border: 1rpx solid rgba(0, 0, 0, 0.05);
	transition: transform 0.2s;
}

.favorite-card:active {
	transform: translateY(-8rpx);
}

.card-image {
	width: 100%;
	height: 300rpx;
	display: block;
}

.card-overlay {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: linear-gradient(to top, rgba(0, 0, 0, 0.6) 0%, transparent 60%);
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	padding: 32rpx;
}

.card-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.card-title {
	color: #131811;
	font-size: 32rpx;
	font-weight: 700;
	display: block;
}

.card-location {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.location-icon {
	font-size: 20rpx;
	color: #999999;
}

.location-text {
	color: #708961;
	font-size: 24rpx;
}

.card-rating {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.rating-icon {
	font-size: 20rpx;
	color: #63ec13;
}

.rating-text {
	color: #131811;
	font-size: 24rpx;
	font-weight: 700;
}

.card-favorite-btn {
	width: 64rpx;
	height: 64rpx;
	background-color: rgba(255, 255, 255, 0.9);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0;
	transition: transform 0.2s;
}

.card-favorite-btn:active {
	transform: scale(1.1);
}

.favorite-icon {
	font-size: 28rpx;
}

.card-badge {
	position: absolute;
	top: 16rpx;
	right: 16rpx;
	background-color: #63ec13;
	padding: 8rpx 16rpx;
	border-radius: 24rpx;
}

.badge-text {
	color: #131811;
	font-size: 16rpx;
	font-weight: 700;
}
</style>
