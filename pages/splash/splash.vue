<template>
	<view class="splash-container">
		<!-- 背景装饰元素 -->
		<view class="bg-decoration">
			<view class="bg-circle"></view>
		</view>

		<!-- 顶部占位 -->
		<view class="flex-1"></view>

		<!-- 中央内容区 -->
		<view class="content-area">
			<view class="logo-container">
				<view class="logo-box">
					<!-- TODO: 需要替换为实际图标，这里用 emoji 代替 -->
					<text class="logo-icon">🌍</text>
					<view class="logo-dot"></view>
				</view>
			</view>
			<text class="app-title">漫游奇点</text>
			<text class="app-subtitle">为您的心灵之旅而设计。</text>
		</view>

		<!-- 中部占位 -->
		<view class="flex-2"></view>

		<!-- 底部加载动画 -->
		<view class="bottom-area">
			<view class="loading-dots">
				<view class="dot dot-1"></view>
				<view class="dot dot-2"></view>
				<view class="dot dot-3"></view>
			</view>
			<text class="version-text">v1.0.2</text>
		</view>

		<!-- 噪点纹理 -->
		<view class="noise-texture"></view>
	</view>
</template>


<script>
export default {
	data() {
		return {
			hasNavigated: false
		}
	},
	onLoad() {
		// 页面加载时启动计时器
		this.startNavigationTimer()
	},
	onShow() {
		// 防止页面重新显示时再次跳转
		if (!this.hasNavigated) {
			this.startNavigationTimer()
		}
	},
	methods: {
		startNavigationTimer() {
			setTimeout(() => {
				this.navigateToHome()
			}, 2500)
		},
		navigateToHome() {
			if (this.hasNavigated) return
			this.hasNavigated = true

			uni.switchTab({
				url: '/pages/chat/chat',
				fail: (err) => {
					console.error('跳转失败:', err)
					// 如果 switchTab 失败，尝试使用 reLaunch
					uni.reLaunch({
						url: '/pages/chat/chat'
					})
				}
			})
		}
	}
}
</script>


<style lang="scss" scoped>
.splash-container {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: space-between;
	width: 100vw;
	height: 100vh;
	background-color: #ffffff;
	overflow: hidden;
}

.flex-1 {
	flex: 1;
}

.flex-2 {
	flex: 1;
	max-height: 20vh;
}

/* 背景装饰 */
.bg-decoration {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 33%;
	width: 100%;
	z-index: 0;
	pointer-events: none;
}

.bg-circle {
	position: absolute;
	bottom: 0;
	width: 150%;
	left: -25%;
	height: 100%;
	background-color: rgba(253, 246, 227, 0.8);
	border-radius: 100% 100% 0 0;
	opacity: 0.8;
	filter: blur(40px);
	transform: translateY(25%);
}

/* 中央内容区 */
.content-area {
	position: relative;
	z-index: 10;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 0 48rpx;
}

.logo-container {
	margin-bottom: 64rpx;
	display: flex;
	align-items: center;
	justify-content: center;
}

.logo-box {
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 192rpx;
	height: 192rpx;
	background-color: #f7f8f6;
	border-radius: 48rpx;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	border: 2rpx solid rgba(0, 0, 0, 0.05);
}

.logo-icon {
	font-size: 120rpx;
	animation: pulse 3s infinite ease-in-out;
}

.logo-dot {
	position: absolute;
	top: -8rpx;
	right: -8rpx;
	width: 16rpx;
	height: 16rpx;
	background-color: #63ec13;
	border-radius: 50%;
	border: 8rpx solid #ffffff;
}

.app-title {
	color: #131811;
	font-size: 80rpx;
	font-weight: 800;
	text-align: center;
	line-height: 1.2;
	margin-bottom: 8rpx;
	letter-spacing: -0.02em;
}

.app-subtitle {
	color: rgba(19, 24, 17, 0.7);
	font-size: 36rpx;
	font-weight: 500;
	text-align: center;
	max-width: 520rpx;
	letter-spacing: 0.02em;
}

/* 底部区域 */
.bottom-area {
	position: relative;
	z-index: 10;
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-bottom: 96rpx;
	width: 100%;
}

.loading-dots {
	display: flex;
	align-items: center;
	gap: 16rpx;
	margin-bottom: 48rpx;
}

.dot {
	width: 12rpx;
	height: 12rpx;
	background-color: #63ec13;
	border-radius: 50%;
	animation: bounce 1.4s infinite ease-in-out;
}

.dot-1 {
	animation-delay: -0.3s;
}

.dot-2 {
	animation-delay: -0.15s;
}

.version-text {
	color: rgba(19, 24, 17, 0.4);
	font-size: 24rpx;
	font-weight: 500;
	text-transform: uppercase;
	letter-spacing: 0.1em;
}

/* 噪点纹理 */
.noise-texture {
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 0;
	opacity: 0.03;
	pointer-events: none;
	// TODO: 需要添加噪点纹理图片或使用CSS实现
	background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noise)"/></svg>');
}

/* 动画 */
@keyframes pulse {
	0%, 100% {
		opacity: 0.6;
		transform: scale(1);
	}
	50% {
		opacity: 1;
		transform: scale(1.05);
	}
}

@keyframes bounce {
	0%, 80%, 100% {
		transform: translateY(0);
	}
	40% {
		transform: translateY(-20rpx);
	}
}
</style>
