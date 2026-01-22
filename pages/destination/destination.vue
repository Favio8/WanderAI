<template>
	<view class="destination-container">
		<!-- Android 适配：顶部状态栏占位（预留状态栏高度，避免内容被遮挡） -->
		<view class="status-bar-placeholder" :style="{ height: statusBarHeight + 'px' }"></view>
		<!-- 加载状态 -->
		<view v-if="isLoading" class="loading-container">
			<text class="loading-text">加载中...</text>
		</view>

		<!-- 未找到 -->
		<view v-else-if="!destination" class="not-found">
			<text class="not-found-icon">😕</text>
			<text class="not-found-text">未找到该目的地</text>
			<button class="back-btn" @click="goBack">
				<text class="back-text">返回</text>
			</button>
		</view>

		<!-- 详情内容 -->
		<scroll-view v-else class="detail-scroll" scroll-y>
			<!-- 头部图片 -->
			<view class="header-image-wrapper">
				<image
					class="header-image"
					:src="destination.image"
					mode="aspectFill"
				/>
				<!-- 渐变遮罩 -->
				<view class="image-gradient"></view>
				<!-- 返回按钮 -->
				<view class="header-actions">
					<button class="action-btn back-action" @click="goBack">
						<text class="action-icon">←</text>
					</button>
					<button
						class="action-btn favorite-action"
						:class="{ 'is-favorite': destination.isFavorite }"
						@click="toggleFavorite"
					>
						<text class="action-icon">{{ destination.isFavorite ? '❤️' : '🤍' }}</text>
					</button>
					<button class="action-btn share-action" @click="handleShare">
						<text class="action-icon">↗</text>
					</button>
				</view>
				<!-- 首选标签 -->
				<view v-if="destination.isTopPick" class="top-pick-badge">
					<text class="top-pick-text">⭐ 首选推荐</text>
				</view>
			</view>

			<!-- 内容区域 -->
			<view class="content-area">
				<!-- 标题和位置 -->
				<view class="title-section">
					<text class="destination-title">{{ destination.name }}</text>
					<view class="location-row">
						<text class="location-icon">📍</text>
						<text class="location-text">{{ destination.location }}</text>
					</view>
				</view>

				<!-- 评分和标签 -->
				<view class="meta-section">
					<view class="rating-box">
						<text class="rating-star">★</text>
						<text class="rating-score">{{ destination.rating }}</text>
						<text class="rating-label">评分</text>
					</view>
					<view class="tags-box">
						<text
							v-for="(tag, index) in destination.tags"
							:key="index"
							class="tag-item"
						>
							{{ tag }}
						</text>
					</view>
				</view>

				<!-- 简介 -->
				<view class="description-section">
					<text class="section-title">📝 简介</text>
					<text class="description-text">{{ destination.description }}</text>
				</view>

				<!-- 推荐理由 -->
				<view class="reasons-section">
					<text class="section-title">✨ 推荐理由</text>
					<view class="reasons-list">
						<view v-for="(reason, index) in recommendReasons" :key="index" class="reason-item">
							<text class="reason-icon">{{ reason.icon }}</text>
							<text class="reason-text">{{ reason.text }}</text>
						</view>
					</view>
				</view>

				<!-- 最佳旅行时间 -->
				<view class="time-section">
					<text class="section-title">📅 最佳旅行时间</text>
					<text class="time-text">{{ bestTimeToVisit }}</text>
				</view>

				<!-- 预计费用 -->
				<view class="cost-section">
					<text class="section-title">💰 预计费用</text>
					<view class="cost-list">
						<view class="cost-item">
							<text class="cost-label">人均预算</text>
							<text class="cost-value">{{ estimatedCost.budget }}</text>
						</view>
						<view class="cost-item">
							<text class="cost-label">建议天数</text>
							<text class="cost-value">{{ estimatedCost.days }}</text>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 底部操作栏 -->
		<view class="bottom-actions">
			<button class="action-card-btn" @click="handleAddToItinerary">
				<text class="action-card-icon">📋</text>
				<text class="action-card-text">加入行程</text>
			</button>
			<button class="primary-action-btn" @click="handlePlanTrip">
				<text class="primary-action-icon">✨</text>
				<text class="primary-action-text">开始规划</text>
			</button>
		</view>
	</view>
</template>

<script>
import { destinationService } from '@/services/destination.js'

export default {
	data() {
		return {
			isLoading: true,
			destinationId: '',
			destination: null,
			// Android 适配：系统信息
			statusBarHeight: 44, // 默认值，会在 onLoad 中更新
			safeAreaInsetBottom: 0, // 底部安全区高度（px）
			recommendReasons: [],
			bestTimeToVisit: '',
			estimatedCost: {
				budget: '',
				days: ''
			}
		}
	},

	onLoad(options) {
		// Android 适配：初始化系统信息
		this.initSystemInfo()
		console.log('目的地详情页加载，参数:', options)
		this.destinationId = options.id || ''
		this.loadDestination()
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
				console.log('[Destination] 系统信息:', {
					statusBarHeight: this.statusBarHeight,
					safeAreaInsetBottom: this.safeAreaInsetBottom
				})
			} catch (e) {
				console.error('[Destination] 获取系统信息失败:', e)
			}
		},

		/**
		 * 加载目的地详情
		 */
		loadDestination() {
			this.isLoading = true

			try {
				this.destination = destinationService.getDestinationById(this.destinationId)

				if (this.destination) {
					// 生成推荐理由
					this.generateRecommendReasons()
					// 生成旅行信息
					this.generateTravelInfo()
				} else {
					console.error('未找到目的地:', this.destinationId)
				}
			} catch (e) {
				console.error('加载详情失败:', e)
				uni.showToast({
					title: '加载失败',
					icon: 'none'
				})
			} finally {
				this.isLoading = false
			}
		},

		/**
		 * 生成推荐理由
		 */
		generateRecommendReasons() {
			const reasons = []

			// 根据标签生成推荐理由
			if (this.destination.tags.includes('自然')) {
				reasons.push({ icon: '🌿', text: '壮丽的自然风光，令人心旷神怡' })
			}
			if (this.destination.tags.includes('宁静海滩')) {
				reasons.push({ icon: '🏖️', text: '宁静优美的海滩，远离喧嚣' })
			}
			if (this.destination.tags.includes('超值')) {
				reasons.push({ icon: '💎', text: '性价比超高，物超所值' })
			}
			if (this.destination.tags.includes('文化')) {
				reasons.push({ icon: '🎭', text: '丰富的文化体验，深度旅行' })
			}

			// 根据评分添加
			if (this.destination.rating >= 4.8) {
				reasons.push({ icon: '⭐', text: '游客好评如潮，值得信赖' })
			}

			// 根据是否是首选
			if (this.destination.isTopPick) {
				reasons.push({ icon: '🏆', text: '平台精选推荐，品质保证' })
			}

			// 默认推荐理由
			if (reasons.length === 0) {
				reasons.push({ icon: '❤️', text: '独特的旅行体验，不容错过' })
			}

			this.recommendReasons = reasons
		},

		/**
		 * 生成旅行信息
		 */
		generateTravelInfo() {
			// 根据目的地生成最佳旅行时间
			const timeOptions = [
				'11月 - 4月（旱季，天气晴朗）',
				'5月 - 10月（雨季，绿意盎然）',
				'全年适宜（热带气候）',
				'3月 - 5月，9月 - 11月（春秋最佳）'
			]
			this.bestTimeToVisit = timeOptions[Math.floor(Math.random() * timeOptions.length)]

			// 根据是否是超值决定费用
			const isBudget = this.destination.tags.includes('超值')
			const budgetOptions = isBudget
				? ['¥3,000 - ¥5,000', '¥2,000 - ¥4,000', '¥4,000 - ¥6,000']
				: ['¥5,000 - ¥8,000', '¥6,000 - ¥10,000', '¥8,000 - ¥12,000']
			this.estimatedCost.budget = budgetOptions[Math.floor(Math.random() * budgetOptions.length)]

			// 建议天数
			const daysOptions = ['3-5 天', '5-7 天', '7-10 天']
			this.estimatedCost.days = daysOptions[Math.floor(Math.random() * daysOptions.length)]
		},

		/**
		 * 切换收藏状态
		 */
		toggleFavorite() {
			const updated = destinationService.toggleFavorite(this.destination.id)
			if (updated) {
				this.destination.isFavorite = updated.isFavorite
				uni.showToast({
					title: updated.isFavorite ? '已添加到收藏' : '已取消收藏',
					icon: 'none',
					duration: 1500
				})
			}
		},

		/**
		 * 分享
		 */
		handleShare() {
			uni.showShareMenu({
				withShareTicket: true
			})
		},

		/**
		 * 加入行程
		 */
		handleAddToItinerary() {
			uni.showToast({
				title: '已加入待选行程',
				icon: 'success'
			})
			// TODO: 实现加入行程逻辑
		},

		/**
		 * 开始规划
		 */
		handlePlanTrip() {
			uni.navigateTo({
				url: `/pages/chat/chat?prompt=帮我规划一个去${this.destination.name}的旅行行程，${this.destination.description}`
			})
		},

		/**
		 * 返回
		 */
		goBack() {
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
 * 解决: content-area 和 bottom-actions 添加 safe-area-inset-bottom
 * =============================================================== */

.destination-container {
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

/* 加载状态 */
.loading-container {
	display: flex;
	align-items: center;
	justify-content: center;
	height: 100%;
}

.loading-text {
	color: #708961;
	font-size: 28rpx;
}

/* 未找到 */
.not-found {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	/* Android 适配: 使用 100% 替代 100vh */
	height: 100%;
	gap: 32rpx;
}

.not-found-icon {
	font-size: 120rpx;
	opacity: 0.5;
}

.not-found-text {
	color: #999999;
	font-size: 28rpx;
}

.back-btn {
	padding: 20rpx 48rpx;
	background-color: #63ec13;
	border-radius: 50rpx;
	border: none;
}

.back-text {
	color: #131811;
	font-size: 28rpx;
	font-weight: 600;
}

/* 头部图片 */
.header-image-wrapper {
	position: relative;
	width: 100%;
	height: 500rpx;
}

.header-image {
	width: 100%;
	height: 100%;
}

.image-gradient {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 200rpx;
	background: linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent);
	pointer-events: none;
}

.header-actions {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	display: flex;
	justify-content: space-between;
	/* Android 适配: 顶部间距已由状态栏占位处理，调整 padding */
	padding: 32rpx;
}

.action-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 64rpx;
	height: 64rpx;
	background-color: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(20rpx);
	border-radius: 50%;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	border: none;
	padding: 0;
}

.action-icon {
	font-size: 32rpx;
}

.favorite-action.is-favorite {
	background-color: rgba(255, 255, 255, 1);
}

.top-pick-badge {
	position: absolute;
	bottom: 32rpx;
	left: 32rpx;
	background: linear-gradient(135deg, #63ec13, #4db80e);
	padding: 12rpx 24rpx;
	border-radius: 50rpx;
	box-shadow: 0 4px 16px rgba(99, 236, 19, 0.3);
}

.top-pick-text {
	color: #131811;
	font-size: 24rpx;
	font-weight: 700;
}

/* 滚动内容 */
.detail-scroll {
	/* Android 适配: scroll-view 需要明确的高度才能滚动，使用 flex: 1 获取剩余空间 */
	flex: 1;
	/* 确保 scroll-view 有最小高度，防止内容为空时无法滚动 */
	min-height: 0;
	/* uni-app scroll-view 滚动修复 */
	height: 0;
}

.content-area {
	padding: 32rpx;
	/* Android 适配: 使用 CSS 环境变量添加底部安全区，避免内容被虚拟按键遮挡 */
	padding-bottom: calc(180rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(180rpx + env(safe-area-inset-bottom));
}

/* 标题区域 */
.title-section {
	margin-bottom: 32rpx;
}

.destination-title {
	color: #131811;
	font-size: 48rpx;
	font-weight: 800;
	display: block;
	margin-bottom: 16rpx;
}

.location-row {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.location-icon {
	font-size: 24rpx;
}

.location-text {
	color: #708961;
	font-size: 26rpx;
}

/* 元数据区域 */
.meta-section {
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 24rpx;
	background-color: #ffffff;
	border-radius: 24rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.rating-box {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.rating-star {
	font-size: 32rpx;
	color: #63ec13;
}

.rating-score {
	color: #131811;
	font-size: 32rpx;
	font-weight: 700;
}

.rating-label {
	color: #999999;
	font-size: 22rpx;
}

.tags-box {
	display: flex;
	gap: 12rpx;
}

.tag-item {
	background-color: rgba(99, 236, 19, 0.1);
	color: #425736;
	font-size: 22rpx;
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	font-weight: 500;
}

/* 简介区域 */
.description-section {
	padding: 24rpx;
	background-color: #ffffff;
	border-radius: 24rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
	color: #131811;
	font-size: 32rpx;
	font-weight: 700;
	display: block;
	margin-bottom: 16rpx;
}

.description-text {
	color: #708961;
	font-size: 28rpx;
	line-height: 1.8;
	display: block;
}

/* 推荐理由 */
.reasons-section {
	padding: 24rpx;
	background-color: #ffffff;
	border-radius: 24rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.reasons-list {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
}

.reason-item {
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding: 16rpx;
	background-color: #f7f8f6;
	border-radius: 16rpx;
}

.reason-icon {
	font-size: 32rpx;
	flex-shrink: 0;
}

.reason-text {
	color: #708961;
	font-size: 26rpx;
	flex: 1;
}

/* 最佳旅行时间 */
.time-section {
	padding: 24rpx;
	background-color: #ffffff;
	border-radius: 24rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.time-text {
	color: #708961;
	font-size: 28rpx;
	display: block;
}

/* 预计费用 */
.cost-section {
	padding: 24rpx;
	background-color: #ffffff;
	border-radius: 24rpx;
	margin-bottom: 24rpx;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.cost-list {
	display: flex;
	gap: 24rpx;
}

.cost-item {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
	padding: 20rpx;
	background-color: #f7f8f6;
	border-radius: 16rpx;
	align-items: center;
}

.cost-label {
	color: #999999;
	font-size: 24rpx;
}

.cost-value {
	color: #63ec13;
	font-size: 32rpx;
	font-weight: 700;
}

/* 底部操作栏 */
.bottom-actions {
	position: fixed;
	bottom: 0;
	left: 0;
	right: 0;
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding: 24rpx 32rpx;
	padding-bottom: calc(24rpx + env(safe-area-inset-bottom));
	background-color: #ffffff;
	border-top: 1rpx solid rgba(0, 0, 0, 0.05);
}

.action-card-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4rpx;
	padding: 16rpx 32rpx;
	background-color: #f7f8f6;
	border-radius: 50rpx;
	border: none;
	flex-shrink: 0;
}

.action-card-icon {
	font-size: 28rpx;
}

.action-card-text {
	color: #131811;
	font-size: 22rpx;
	font-weight: 500;
}

.primary-action-btn {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	height: 88rpx;
	background: linear-gradient(135deg, #63ec13, #4db80e);
	border-radius: 50rpx;
	border: none;
	box-shadow: 0 4px 16px rgba(99, 236, 19, 0.3);
}

.primary-action-icon {
	font-size: 32rpx;
}

.primary-action-text {
	color: #131811;
	font-size: 28rpx;
	font-weight: 700;
}
</style>
