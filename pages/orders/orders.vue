<template>
	<view class="orders-container">
		<!-- Android 适配：顶部状态栏占位（预留状态栏高度，避免内容被遮挡） -->
		<view class="status-bar-placeholder" :style="{ height: statusBarHeight + 'px' }"></view>
		<!-- 顶部导航栏 -->
		<view class="app-bar">
			<button class="bar-btn" @click="handleBack">
				<text class="bar-icon">←</text>
			</button>
			<text class="bar-title">我的订单</text>
			<button class="bar-btn">
				<text class="bar-icon">⋯</text>
			</button>
		</view>

		<!-- 订单标签 -->
		<view class="tabs-container">
			<view class="tabs-list">
				<button
					v-for="tab in tabs"
					:key="tab.id"
					class="tab-btn"
					:class="activeTab === tab.id ? 'tab-btn-active' : ''"
					@click="switchTab(tab.id)"
				>
					<text class="tab-text" :class="activeTab === tab.id ? 'tab-text-active' : ''">
						{{ tab.name }}
					</text>
					<view v-if="tab.count > 0" class="tab-badge">
						<text class="badge-text">{{ tab.count }}</text>
					</view>
				</button>
			</view>
		</view>

		<!-- 主内容区 -->
		<scroll-view class="content-scroll" scroll-y>
			<view class="content-area">
				<!-- 加载状态 -->
				<view v-if="isLoading" class="loading-container">
					<text class="loading-text">加载中...</text>
				</view>

				<!-- 空状态 -->
				<view v-else-if="filteredOrders.length === 0" class="empty-state">
					<text class="empty-icon">📋</text>
					<text class="empty-title">暂无订单</text>
					<text class="empty-subtitle">去探索页发现更多精彩目的地</text>
					<button class="empty-btn" @click="goToExplore">
						<text class="empty-btn-text">去探索</text>
					</button>
				</view>

				<!-- 订单列表 -->
				<view v-else class="orders-list">
					<view
						v-for="order in filteredOrders"
						:key="order.id"
						class="order-card"
						@click="handleOrderClick(order)"
					>
						<view class="order-header">
							<view class="order-id">
								<text class="id-text">订单号: {{ order.orderId }}</text>
							</view>
							<view class="order-status" :class="'status-' + order.status">
								<text class="status-text">{{ order.statusText }}</text>
							</view>
						</view>

						<view class="order-content">
							<image class="order-image" :src="order.image" mode="aspectFill" />
							<view class="order-info">
								<text class="order-title">{{ order.title }}</text>
								<view class="order-meta">
									<view class="meta-item">
										<text class="meta-icon">📍</text>
										<text class="meta-text">{{ order.location }}</text>
									</view>
									<view class="meta-item">
										<text class="meta-icon">📅</text>
										<text class="meta-text">{{ order.date }}</text>
									</view>
								</view>
								<view class="order-price">
									<text class="price-text">¥{{ order.price }}</text>
								</view>
							</view>
						</view>

						<view class="order-footer">
							<text class="order-time">下单时间: {{ order.createTime }}</text>
							<button class="order-action-btn" @click.stop="handleAction(order)">
								<text class="action-text">{{ getActionText(order.status) }}</text>
							</button>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			activeTab: 'all',
			isLoading: false,
			// Android 适配：系统信息
			statusBarHeight: 44, // 默认值，会在 onLoad 中更新
			safeAreaInsetBottom: 0, // 底部安全区高度（px）
			tabs: [
				{ id: 'all', name: '全部', count: 0 },
				{ id: 'pending', name: '待付款', count: 0 },
				{ id: 'paid', name: '待出行', count: 0 },
				{ id: 'completed', name: '已完成', count: 0 }
			],
			orders: [
				{
					id: '1',
					orderId: 'ORD20240120001',
					title: '京都一日游',
					location: '京都，日本',
					date: '2024-02-15',
					price: '299',
					status: 'pending',
					statusText: '待付款',
					image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDlmAISi5g0qEXTGgHKpNLeCHJxXVh0-dOZ8mijTk5mLHDNabYPxmr5VK5c5K4onCYRO7gXth28yYwKzPQ1mSrg13GxtR6UVqR6ipe6EBS127BYOiqcoByALm6qQWPgymAqNMVsTD-vUCOJS9pTrmya-N-UpMI7xUYv3FY0TbyZm118QiSWUIJj1mytu9jSGp7vA_JfQKGwPFS556RdylhNN92_NZYX--84fyJ4jklv6t8iaEiZyJTmbKm_s8Q7peEc2TFquuMOlI1ePpCmhd4Z3dp41YV-B0qa6lU8RGBU28YEKOA8sUz39JFCSjomxLSdifngoK5iW9prn_rFlv8',
					createTime: '2024-01-20 14:30'
				},
				{
					id: '2',
					orderId: 'ORD20240119002',
					title: '巴黎浪漫之旅',
					location: '巴黎，法国',
					date: '2024-03-01',
					price: '599',
					status: 'paid',
					statusText: '待出行',
					image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDH7TK7nJ6DMr-i6dtmlyaESDklR5cKDXNuhuFnTg138c0NsLnOmA3PzGnNr0qaC9jeCpTuQPDI-AhdUkKvE2YRTM7gpZen1CL9DMBqzMynsmhNVf5EKGf5VTixbeSKeKsn5hVJchwXbGDGYYM0rH-JoB6_JwTsN0mkZunsEwLd_pTK_6Tn5MIyNPi9nGJ1rGjybSZFiSATcQlOSEI1PNuba3gTFanpfX80gjrF8dA-YO1KOCVQUk6mmebFwRb-tUP3hr6T2W6Vl',
					createTime: '2024-01-19 10:15'
				},
				{
					id: '3',
					orderId: 'ORD20240118003',
					title: '东京自由行',
					location: '东京，日本',
					date: '2024-01-10',
					price: '399',
					status: 'completed',
					statusText: '已完成',
					image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWpn0wEFPKPeeT0FvlicFPe6cd5VfWMYg2cYeBlHTFLAykbrVXEXlc12ueU-sBMfW-djPYMj_P2nMKAaDWLYKtKKn61H0C2yqUGiVGCb1mhw9_8e2tGVrFRIPepiY3bsK_aJUObOfFMEqHF0WlUutpbSW76xlTr67-6gcRMb3MIqrfN14hIBDJQZSos0I4eiye7jU4bzWERA43mWPGR1x1u8uLb4NoYtNvPeXcS2fFMbWI1ePpCmhd4Z3dp41YV-B0qa6lU8RGBU28YEKOA8sUz39JFCSjomxLSdifngoK5iW9prn_rFlv8',
					createTime: '2024-01-18 16:45'
				}
			]
		}
	},

	computed: {
		filteredOrders() {
			if (this.activeTab === 'all') {
				return this.orders
			}
			return this.orders.filter(order => order.status === this.activeTab)
		}
	},

	onLoad() {
		// Android 适配：初始化系统信息
		this.initSystemInfo()
		this.loadOrders()
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
				console.log('[Orders] 系统信息:', {
					statusBarHeight: this.statusBarHeight,
					safeAreaInsetBottom: this.safeAreaInsetBottom
				})
			} catch (e) {
				console.error('[Orders] 获取系统信息失败:', e)
			}
		},

		/**
		 * 加载订单
		 */
		loadOrders() {
			this.isLoading = true
			this.updateTabCounts()
			setTimeout(() => {
				this.isLoading = false
			}, 500)
		},

		/**
		 * 更新标签计数
		 */
		updateTabCounts() {
			this.tabs.forEach(tab => {
				if (tab.id === 'all') {
					tab.count = this.orders.length
				} else {
					tab.count = this.orders.filter(order => order.status === tab.id).length
				}
			})
		},

		/**
		 * 切换标签
		 */
		switchTab(tabId) {
			this.activeTab = tabId
		},

		/**
		 * 返回
		 */
		handleBack() {
			uni.navigateBack()
		},

		/**
		 * 点击订单
		 */
		handleOrderClick(order) {
			console.log('点击订单:', order.orderId)
			uni.showToast({
				title: `查看订单详情`,
				icon: 'none'
			})
		},

		/**
		 * 订单操作
		 */
		handleAction(order) {
			if (order.status === 'pending') {
				uni.showModal({
					title: '确认付款',
					content: '确认支付 ¥' + order.price + ' 吗？',
					success: (res) => {
						if (res.confirm) {
							this.payOrder(order.id)
						}
					}
				})
			} else if (order.status === 'paid') {
				uni.showToast({
					title: '即将出发，请做好准备',
					icon: 'none'
				})
			} else if (order.status === 'completed') {
				uni.showToast({
					title: '订单已完成',
					icon: 'none'
				})
			}
		},

		/**
		 * 支付订单
		 */
		payOrder(orderId) {
			uni.showLoading({
				title: '支付中...'
			})

			setTimeout(() => {
				uni.hideLoading()
				const order = this.orders.find(o => o.id === orderId)
				if (order) {
					order.status = 'paid'
					order.statusText = '待出行'
					this.updateTabCounts()
					uni.showToast({
						title: '支付成功',
						icon: 'success'
					})
				}
			}, 1500)
		},

		/**
		 * 获取操作按钮文字
		 */
		getActionText(status) {
			const map = {
				pending: '去支付',
				paid: '查看详情',
				completed: '再次预订'
			}
			return map[status] || '查看详情'
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

.orders-container {
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

/* 标签栏 */
.tabs-container {
	background-color: #ffffff;
	padding: 0 32rpx;
	border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
}

.tabs-list {
	display: flex;
	gap: 32rpx;
}

.tab-btn {
	position: relative;
	padding: 32rpx 0;
	background-color: transparent;
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.tab-text {
	color: #708961;
	font-size: 28rpx;
	font-weight: 500;
}

.tab-btn-active .tab-text {
	color: #131811;
	font-weight: 700;
}

.tab-badge {
	background-color: #63ec13;
	padding: 4rpx 12rpx;
	border-radius: 12rpx;
	min-width: 24rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.badge-text {
	color: #131811;
	font-size: 20rpx;
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

/* 订单列表 */
.orders-list {
	display: flex;
	flex-direction: column;
	gap: 32rpx;
}

.order-card {
	background-color: #ffffff;
	border-radius: 48rpx;
	padding: 32rpx;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	border: 1rpx solid rgba(0, 0, 0, 0.05);
}

.order-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
}

.order-id {
	display: flex;
	align-items: center;
}

.id-text {
	color: #708961;
	font-size: 24rpx;
}

.order-status {
	padding: 8rpx 16rpx;
	border-radius: 16rpx;
}

.status-pending {
	background-color: #fff7e6;
}

.status-paid {
	background-color: #e6f7ff;
}

.status-completed {
	background-color: #f6ffed;
}

.status-text {
	font-size: 20rpx;
	font-weight: 700;
}

.status-pending .status-text {
	color: #fa8c16;
}

.status-paid .status-text {
	color: #1890ff;
}

.status-completed .status-text {
	color: #52c41a;
}

.order-content {
	display: flex;
	gap: 24rpx;
	margin-bottom: 24rpx;
}

.order-image {
	width: 160rpx;
	height: 160rpx;
	border-radius: 24rpx;
	flex-shrink: 0;
}

.order-info {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 12rpx;
}

.order-title {
	color: #131811;
	font-size: 28rpx;
	font-weight: 700;
	display: block;
}

.order-meta {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
}

.meta-item {
	display: flex;
	align-items: center;
	gap: 8rpx;
}

.meta-icon {
	font-size: 20rpx;
	color: #708961;
}

.meta-text {
	color: #708961;
	font-size: 24rpx;
}

.order-price {
	margin-top: auto;
}

.price-text {
	color: #ff4d4f;
	font-size: 32rpx;
	font-weight: 700;
}

.order-footer {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding-top: 24rpx;
	border-top: 1rpx solid rgba(0, 0, 0, 0.05);
}

.order-time {
	color: #999999;
	font-size: 24rpx;
}

.order-action-btn {
	background-color: #63ec13;
	padding: 16rpx 32rpx;
	border-radius: 48rpx;
	box-shadow: 0 4px 16px rgba(99, 236, 19, 0.3);
}

.order-action-btn:active {
	transform: scale(0.98);
}

.action-text {
	color: #131811;
	font-size: 24rpx;
	font-weight: 700;
}
</style>
