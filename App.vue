<script>
import { applyTheme, getCurrentTheme } from '@/services/theme.js'

export default {
	data() {
		return {
			currentTheme: 'light',
			// 系统信息，用于安全区适配
			systemInfo: {
				statusBarHeight: 0,
				windowHeight: 0,
				windowWidth: 0,
				pixelRatio: 1,
				platform: '',
				safeArea: { top: 0, right: 0, bottom: 0, left: 0 }
			}
		}
	},
	onLaunch: function() {
		console.log('WanderAI App Launch')
		// 初始化主题
		const themeId = getCurrentTheme()
		this.currentTheme = themeId
		applyTheme(themeId)

		// 获取系统信息用于安全区适配
		this.getSystemInfo()
	},
	onShow: function() {
		console.log('App Show')
	},
	onHide: function() {
		console.log('App Hide')
	},
	methods: {
		/**
		 * 获取系统信息，用于安全区适配
		 * Android App 适配：获取状态栏高度、安全区域等
		 */
		getSystemInfo() {
			try {
				const systemInfo = uni.getSystemInfoSync()
				this.systemInfo = {
					statusBarHeight: systemInfo.statusBarHeight || 0,
					windowHeight: systemInfo.windowHeight || 0,
					windowWidth: systemInfo.windowWidth || 0,
					pixelRatio: systemInfo.pixelRatio || 1,
					platform: systemInfo.platform || '',
					safeArea: systemInfo.safeArea || { top: 0, right: 0, bottom: 0, left: 0 }
				}
				// 将系统信息存储到全局，方便其他页面使用
				uni.$emit('systemInfoReady', this.systemInfo)
				console.log('[App] 系统信息:', this.systemInfo)
			} catch (e) {
				console.error('[App] 获取系统信息失败:', e)
			}
		}
	}
}
</script>

<template>
	<view class="app-wrapper" :data-theme="currentTheme">
		<slot></slot>
	</view>
</template>

<style lang="scss">
/* ==================== 全局样式 ==================== */

/* 导入全局样式变量 */
@import '@/uni.scss';

/* 全局重置 */
page {
	background-color: #f7f8f6;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
	color: #131811;
	line-height: 1.5;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	/* Android 适配：确保 page 占满整个屏幕 */
	height: 100%;
	overflow: hidden;
}

/* 清除默认样式 */
* {
	box-sizing: border-box;
}

/* 全局链接样式 */
a {
	text-decoration: none;
	color: inherit;
}

/* 全局图片样式 */
image {
	display: block;
	width: 100%;
	height: 100%;
}

/* 全局按钮重置 */
button {
	padding: 0;
	margin: 0;
	border: none;
	background: none;
	font: inherit;
	color: inherit;

	&::after {
		border: none;
	}
}

/* 全局输入框重置 */
input,
textarea {
	font-family: inherit;
}

/* ==================== 通用工具类 ==================== */

/* 弹性布局 */
.flex {
	display: flex;
}

.flex-col {
	display: flex;
	flex-direction: column;
}

.flex-center {
	display: flex;
	align-items: center;
	justify-content: center;
}

.flex-between {
	display: flex;
	align-items: center;
	justify-content: space-between;
}

/* 文本对齐 */
.text-left {
	text-align: left;
}

.text-center {
	text-align: center;
}

.text-right {
	text-align: right;
}

/* 文本省略 */
.text-ellipsis {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

/* 滚动容器 */
.scroll-container {
	overflow-y: auto;
	-webkit-overflow-scrolling: touch;
}

/* 无滚动条 */
.no-scrollbar {
	&::-webkit-scrollbar {
		display: none;
	}
	scrollbar-width: none;
}

/* ==================== 安全区适配工具类 ==================== */

/* 底部安全区适配 */
.safe-area-bottom {
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
}

/* 顶部安全区适配 */
.safe-area-top {
	padding-top: constant(safe-area-inset-top);
	padding-top: env(safe-area-inset-top);
}

/* 上下安全区同时适配 */
.safe-area-inset {
	padding-top: constant(safe-area-inset-top);
	padding-top: env(safe-area-inset-top);
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
}

/* 全屏容器（用于替代 100vh）*/
.full-height-container {
	display: flex;
	flex-direction: column;
	/* 使用 flex + height: 100% 替代 100vh，避免 Android WebView 计算错误 */
	height: 100%;
	position: relative;
}

/* TabBar 页面容器（预留底部空间）*/
.tabbar-page-container {
	display: flex;
	flex-direction: column;
	height: 100%;
	position: relative;
	/* 内容区域底部预留 TabBar 高度（60px = tabBar 配置的高度）+ 安全区 */
	padding-bottom: calc(60px + constant(safe-area-inset-bottom));
	padding-bottom: calc(60px + env(safe-area-inset-bottom));
	box-sizing: border-box;
}

/* 非 TabBar 页面容器 */
.normal-page-container {
	display: flex;
	flex-direction: column;
	height: 100%;
	position: relative;
	/* 内容区域底部预留安全区 */
	padding-bottom: constant(safe-area-inset-bottom);
	padding-bottom: env(safe-area-inset-bottom);
	box-sizing: border-box;
}

/* 顶部状态栏占位（用于自定义导航栏页面）*/
.status-bar-placeholder {
	width: 100%;
	/* 高度由 JavaScript 动态设置，这里只设置默认值 */
	height: 44rpx;
	/* Android 适配：不同设备状态栏高度不同 */
}
</style>
