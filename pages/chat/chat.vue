<template>
	<view class="chat-container">
		<!-- 顶部状态栏占位：Android 适配，自定义导航栏需要预留状态栏高度 -->
		<view class="status-bar-placeholder" :style="{ height: statusBarHeight + 'px' }"></view>

		<!-- 头部导航 -->
		<view class="chat-header">
			<view class="header-avatar">
				<text class="avatar-icon">🤖</text>
			</view>
			<text class="header-title">漫游向导</text>
			<view class="header-actions">
				<button class="more-btn" @click="handleClearHistory">
					<text class="more-icon">🗑️</text>
				</button>
			</view>
		</view>

		<!-- 消息列表区域 -->
		<scroll-view
			class="messages-area"
			scroll-y
			:scroll-into-view="scrollIntoView"
			:scroll-with-animation="true"
		>
			<view
				v-for="(msg, index) in messages"
				:key="index"
				:id="'msg-' + index"
				class="message-item"
				:class="msg.role === 'user' ? 'message-user' : 'message-ai'"
			>
				<!-- AI 头像 -->
				<view v-if="msg.role === 'ai'" class="avatar ai-avatar">
					<image
						class="avatar-img"
						src="https://lh3.googleusercontent.com/aida-public/AB6AXuDaTFVAvVtBpKaaOqBQc-6GryNABnseE_0y4ShxE_YSqYhPz7x9sPlVgy5iDqUUNibsFdSmFoPoMruSXFoJzNurQ21EhhWspGUex08lhoWM9FCS9Nuy1a9egaW7ejH5Z9p_nDG_Pu1FtUKgnu7FF5H4U4gVA1OlaY4Yybma_sceytFJYsQz0kn5MN9QYqvIh8QagxOlRxh-puJSzC9Jsu5Zv9No_c3uPzrKzna-kX6wbjY7YlyZnK2LYAF4cAVKgkp6r82r49cL8iM"
						mode="aspectFill"
					/>
				</view>

				<!-- 消息内容 -->
				<view class="message-content" :class="msg.role === 'user' ? 'content-user' : 'content-ai'">
					<text v-if="msg.role === 'ai'" class="message-name">漫游向导</text>
					<view class="message-bubble" :class="msg.role === 'user' ? 'bubble-user' : 'bubble-ai'">
						<!-- AI 消息使用 rich-text 渲染 Markdown -->
						<rich-text v-if="msg.role === 'ai'" class="message-text" :nodes="renderMarkdown(msg.content)"></rich-text>
						<!-- 用户消息保持纯文本 -->
						<text v-else class="message-text">{{ msg.content }}</text>
					</view>
				</view>

				<!-- 用户头像 -->
				<view v-if="msg.role === 'user'" class="avatar user-avatar">
					<image
						class="avatar-img"
						src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0aSiQauxMI8oZc-PIhq1fHCKDqXbw17x6zHEJqLLitjl5RgWj3svyV7wlWNgS_M5YCK7H07qF6eICeqh-ISaEypGA3UV9kdaNJt2_8K769hC5DvSAqkbqcKww_DEJDhoSzQers3WHUYPwaGvWGHdV-gF88iZyhDVmuyXR2HeVenFpoq5A8lsIZLeGUaBZBlMHOFXaMQQWCoZi6rGVCytqGV3-1SIuIReECcgvdEu_bZQRBiGrs8fCnGAEGr87Z3RiGZ9cl2GEITU"
						mode="aspectFill"
					/>
				</view>
			</view>

			<!-- AI 思考中提示 -->
			<view v-if="isTyping" class="typing-indicator">
				<text class="typing-text">漫游向导正在思考...</text>
			</view>

			<!-- 错误提示 -->
			<view v-if="errorMessage" class="error-message">
				<text class="error-text">{{ errorMessage }}</text>
			</view>
		</scroll-view>

		<!-- 输入区域 -->
		<view class="input-area" :style="{ paddingBottom: safeAreaInsetBottom + 'px' }">
			<view class="input-box">
				<input
					v-model="inputValue"
					class="message-input"
					placeholder="输入您想去的地方..."
					placeholder-class="input-placeholder"
					@confirm="handleSendMessage"
				/>
				<button class="send-btn" @click="handleSendMessage" :disabled="isTyping">
					<text class="send-icon">➤</text>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
import { sendTravelMessage, trimHistory, parseMessageContent } from '@/api/deepseek.js'
import { storage, STORAGE_KEYS } from '@/utils/storage.js'
import { themeService, onThemeChange, offThemeChange } from '@/services/theme.js'
import { simpleMarkdown } from '@/utils/markdown.js'

const WELCOME_MESSAGE = {
	role: 'ai',
	content: '您好！您梦想中的下一个目的地是哪里？我可以帮您规划完美的旅行。',
	timestamp: new Date()
}

export default {
	data() {
		return {
			messages: [],
			inputValue: '',
			isTyping: false,
			scrollIntoView: '',
			errorMessage: '',
			chatHistory: [], // API 格式的对话历史
			// Android 适配：系统信息
			statusBarHeight: 44, // 默认值，会在 onLoad 中更新
			safeAreaInsets: { top: 0, right: 0, bottom: 0, left: 0 },
			safeAreaInsetBottom: 0, // 底部安全区高度（px）
			tabBarHeight: 60 // TabBar 高度（px）
		}
	},

	onLoad(options) {
		console.log('聊天页加载，参数:', options)
		// 加载聊天历史
		this.loadChatHistory()
		// 监听主题变化
		onThemeChange(this.handleThemeChange)

		// Android 适配：获取系统信息
		this.initSystemInfo()

		// 处理从其他页面跳转过来的 prompt
		if (options && options.prompt) {
			// 延迟发送，确保页面已加载
			this.$nextTick(() => {
				setTimeout(() => {
					this.handlePromptFromUrl(decodeURIComponent(options.prompt))
				}, 500)
			})
		}
	},

	onUnload() {
		// 移除主题监听
		offThemeChange(this.handleThemeChange)
	},

	methods: {
		/**
		 * 初始化系统信息（Android 适配）
		 * 获取状态栏高度、安全区域等，用于布局适配
		 */
		initSystemInfo() {
			try {
				const systemInfo = uni.getSystemInfoSync()
				this.statusBarHeight = systemInfo.statusBarHeight || 44
				this.safeAreaInsets = systemInfo.safeArea || { top: 0, right: 0, bottom: 0, left: 0 }
				// 计算底部安全区高度（从安全区域到底部的距离）
				this.safeAreaInsetBottom = systemInfo.screenHeight - (systemInfo.safeArea?.bottom || systemInfo.screenHeight)

				console.log('[Chat] 系统信息:', {
					statusBarHeight: this.statusBarHeight,
					safeAreaInsets: this.safeAreaInsets,
					safeAreaInsetBottom: this.safeAreaInsetBottom
				})
			} catch (e) {
				console.error('[Chat] 获取系统信息失败:', e)
			}
		},

		/**
		 * 加载聊天历史
		 */
		loadChatHistory() {
			try {
				const savedMessages = storage.get(STORAGE_KEYS.CHAT_MESSAGES)
				const savedHistory = storage.get(STORAGE_KEYS.CHAT_HISTORY)

				if (savedMessages && savedMessages.length > 0) {
					this.messages = savedMessages
				} else {
					this.messages = [WELCOME_MESSAGE]
				}

				if (savedHistory) {
					this.chatHistory = savedHistory
				}

				// 滚动到底部
				this.$nextTick(() => {
					this.scrollToBottom()
				})
			} catch (e) {
				console.error('加载历史失败:', e)
				this.messages = [WELCOME_MESSAGE]
			}
		},

		/**
		 * 保存聊天历史
		 */
		saveChatHistory() {
			try {
				storage.set(STORAGE_KEYS.CHAT_MESSAGES, this.messages)
				storage.set(STORAGE_KEYS.CHAT_HISTORY, this.chatHistory)
			} catch (e) {
				console.error('保存历史失败:', e)
			}
		},

		/**
		 * 清空聊天历史
		 */
		handleClearHistory() {
			uni.showModal({
				title: '确认清空',
				content: '确定要清空所有聊天记录吗？',
				success: (res) => {
					if (res.confirm) {
						this.messages = [WELCOME_MESSAGE]
						this.chatHistory = []
						this.saveChatHistory()
						uni.showToast({
							title: '已清空',
							icon: 'success'
						})
					}
				}
			})
		},

		/**
		 * 发送消息
		 */
		async handleSendMessage() {
			const content = this.inputValue.trim()
			if (!content || this.isTyping) return

			// 清空输入框
			this.inputValue = ''
			this.errorMessage = ''

			// 添加用户消息到界面
			this.addMessage('user', content)

			// 添加到历史（用于 API 调用）
			this.chatHistory.push({
				role: 'user',
				content: content
			})

			// 保存状态
			this.saveChatHistory()

			// 显示加载状态
			this.isTyping = true

			try {
				// 截断历史以防 token 超限（保留最近的对话）
				const trimmedHistory = trimHistory(this.chatHistory, 6000)

				// 调用 DeepSeek API
				const response = await sendTravelMessage(content, trimmedHistory)

				// 解析 AI 回复
				const aiContent = parseMessageContent(response)

				// 添加 AI 消息到界面
				this.addMessage('ai', aiContent)

				// 添加到历史
				this.chatHistory.push({
					role: 'assistant',
					content: aiContent
				})

				// 保存状态
				this.saveChatHistory()

			} catch (error) {
				console.error('API 调用失败:', error)
				this.errorMessage = this.getErrorMessage(error)
				this.addMessage('ai', '抱歉，我暂时无法回复。请检查网络连接后重试。')

				// 移除失败的用户消息历史
				this.chatHistory.pop()
			} finally {
				this.isTyping = false
			}
		},

		/**
		 * 添加消息到界面
		 */
		addMessage(role, content) {
			this.messages.push({
				role,
				content,
				timestamp: new Date()
			})
			this.$nextTick(() => {
				this.scrollToBottom()
			})
		},

		/**
		 * 滚动到底部
		 */
		scrollToBottom() {
			if (this.messages.length > 0) {
				this.scrollIntoView = 'msg-' + (this.messages.length - 1)
			}
		},

		/**
		 * 获取错误信息
		 */
		getErrorMessage(error) {
			if (error.statusCode === 401) {
				return 'API 密钥无效，请检查配置'
			} else if (error.statusCode === 429) {
				return '请求过于频繁，请稍后再试'
			} else if (error.statusCode === -1) {
				return '网络连接失败，请检查网络'
			}
			return error.message || '请求失败'
		},

		/**
		 * 处理主题变化
		 */
		handleThemeChange(themeId) {
			console.log('主题变化:', themeId)
			// 这里可以添加主题变化时的逻辑
			// 例如更新某些组件的样式
		},

		/**
		 * 处理从 URL 传递过来的 prompt
		 */
		handlePromptFromUrl(prompt) {
			console.log('处理 URL prompt:', prompt)
			if (!prompt || !prompt.trim()) return

			// 设置输入框内容
			this.inputValue = prompt

			// 自动发送消息
			this.handleSendMessage()
		},

		/**
		 * 将 Markdown 转换为 HTML
		 */
		renderMarkdown(content) {
			return simpleMarkdown(content)
		}
	}
}
</script>

<style lang="scss" scoped>
/* ==================== Android App 布局适配说明 ====================
 * 问题1: 100vh 在 Android WebView 中计算错误（包含了浏览器 UI 高度）
 * 解决: 使用 height: 100% + flex 布局替代
 *
 * 问题2: 顶部被状态栏遮挡（自定义导航栏需要预留状态栏高度）
 * 解决: 添加 status-bar-placeholder 动态占位，通过 JavaScript 设置高度
 *
 * 问题3: 底部输入区域被 TabBar + 虚拟按键遮挡
 * 解决: 输入区域使用 fixed 定位，bottom 偏移量 = TabBar高度(60px) + 安全区高度
 *
 * 问题4: backdrop-filter 在 Android 中创建异常堆叠上下文
 * 解决: 保留效果（chat 页面已验证无交互冲突）
 * =============================================================== */

.chat-container {
	display: flex;
	flex-direction: column;
	/* Android 适配: 使用 100% 替代 100vh，避免 WebView 计算错误 */
	height: 100%;
	background-color: #ffffff;
	position: relative;
}

/* 顶部状态栏占位（Android 适配：预留状态栏高度，避免内容被遮挡） */
.status-bar-placeholder {
	width: 100%;
	flex-shrink: 0;
	/* 高度由 JavaScript 动态设置（uni.getSystemInfoSync().statusBarHeight） */
}

/* 头部导航 */
.chat-header {
	/* Android 适配: 移除 sticky 定位，状态栏占位已处理顶部间距 */
	position: relative;
	z-index: 20;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 32rpx;
	background-color: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(20rpx);
	border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
	flex-shrink: 0;
}

.header-avatar {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 80rpx;
	height: 80rpx;
	background-color: #e5eadf;
	border-radius: 50%;
	flex-shrink: 0;
}

.avatar-icon {
	font-size: 48rpx;
}

.header-title {
	flex: 1;
	color: #131811;
	font-size: 36rpx;
	font-weight: 700;
	text-align: center;
}

.header-actions {
	width: 80rpx;
	display: flex;
	justify-content: flex-end;
}

.more-btn {
	padding: 16rpx;
	background-color: transparent;
	border-radius: 50%;
}

.more-btn:active {
	background-color: rgba(0, 0, 0, 0.05);
}

.more-icon {
	font-size: 36rpx;
}

/* 消息列表区域 */
.messages-area {
	flex: 1;
	padding: 32rpx;
	/* Android 适配: 为底部固定的输入区域预留空间，避免最后一条消息被遮挡 */
	/* 输入区域高度约 140rpx (input-box) + 64rpx (padding) = 204rpx，加上安全余量 */
	padding-bottom: 220rpx;
	overflow-y: auto;
}

.message-item {
	display: flex;
	align-items: flex-end;
	margin-bottom: 32rpx;
	gap: 24rpx;
}

.message-user {
	justify-content: flex-end;
}

.avatar {
	width: 64rpx;
	height: 64rpx;
	border-radius: 50%;
	overflow: hidden;
	flex-shrink: 0;
	background-color: #cdd9c2;
}

.avatar-img {
	width: 100%;
	height: 100%;
}

.message-content {
	display: flex;
	flex-direction: column;
	gap: 8rpx;
	max-width: 85%;
}

.content-ai {
	align-items: flex-start;
}

.content-user {
	align-items: flex-end;
}

.message-name {
	color: #708961;
	font-size: 20rpx;
	font-weight: 500;
	padding-left: 8rpx;
}

.message-bubble {
	padding: 24rpx 32rpx;
	border-radius: 32rpx;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.bubble-ai {
	background-color: #e5eadf;
	border-top-left-radius: 8rpx;
}

.bubble-user {
	background-color: #63ec13;
	border-top-right-radius: 8rpx;
}

.message-text {
	color: #131811;
	font-size: 28rpx;
	line-height: 1.6;
	word-wrap: break-word;
}

/* Markdown 渲染样式 */
.message-text ::v-deep p {
	margin: 8rpx 0;
}

.message-text ::v-deep h1,
.message-text ::v-deep h2,
.message-text ::v-deep h3 {
	font-weight: bold;
	margin: 16rpx 0 8rpx;
}

.message-text ::v-deep strong {
	font-weight: bold;
}

.message-text ::v-deep em {
	font-style: italic;
}

.message-text ::v-deep code {
	background-color: rgba(0, 0, 0, 0.05);
	padding: 4rpx 8rpx;
	border-radius: 4rpx;
	font-family: monospace;
}

.message-text ::v-deep pre {
	background-color: rgba(0, 0, 0, 0.05);
	padding: 16rpx;
	border-radius: 8rpx;
	overflow-x: auto;
	margin: 12rpx 0;
}

.message-text ::v-deep pre code {
	background-color: transparent;
	padding: 0;
}

.message-text ::v-deep ul,
.message-text ::v-deep ol {
	padding-left: 32rpx;
	margin: 8rpx 0;
}

.message-text ::v-deep li {
	margin: 4rpx 0;
}

.message-text ::v-deep a {
	color: #63ec13;
	text-decoration: underline;
}

.message-text ::v-deep blockquote {
	border-left: 4rpx solid #708961;
	padding-left: 16rpx;
	margin: 12rpx 0;
	color: #708961;
	font-style: italic;
}

.message-text ::v-deep hr {
	border: none;
	border-top: 1rpx solid rgba(0, 0, 0, 0.1);
	margin: 16rpx 0;
}

/* 输入中提示 */
.typing-indicator {
	display: flex;
	align-items: center;
	gap: 16rpx;
	padding: 16rpx;
}

.typing-text {
	color: #708961;
	font-size: 24rpx;
	font-style: italic;
}

/* 错误提示 */
.error-message {
	display: flex;
	justify-content: center;
	padding: 16rpx;
	margin: 16rpx 0;
}

.error-text {
	color: #ff4d4f;
	font-size: 24rpx;
	background-color: #fff1f0;
	padding: 16rpx 24rpx;
	border-radius: 16rpx;
}

/* 输入区域 */
.input-area {
	position: fixed;
	/* Android 适配: bottom 偏移量 = TabBar高度(60px) + 安全区高度 */
	/* TabBar 配置在 pages.json 中，height: "60px" */
	bottom: calc(60px + constant(safe-area-inset-bottom));
	bottom: calc(60px + env(safe-area-inset-bottom));
	left: 0;
	right: 0;
	padding: 32rpx;
	background-color: #ffffff;
	z-index: 30;
	/* 额外的内边距由 JavaScript 动态添加（通过 :style="{ paddingBottom: safeAreaInsetBottom + 'px' }"） */
}

.input-box {
	display: flex;
	align-items: center;
	gap: 16rpx;
	background-color: #ffffff;
	border-radius: 50rpx;
	border: 1rpx solid rgba(0, 0, 0, 0.05);
	padding: 8rpx 16rpx;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.message-input {
	flex: 1;
	height: 72rpx;
	line-height: 1.4;
	padding: 0 32rpx;
	font-size: 28rpx;
	color: #131811;
	border: none;
	background: transparent;
}

.input-placeholder {
	color: #999999;
}

.send-btn {
	display: flex;
	align-items: center;
	justify-content: center;
	width: 72rpx;
	height: 72rpx;
	background-color: #63ec13;
	border-radius: 50%;
	transition: transform 0.2s;
}

.send-btn:active {
	transform: scale(0.95);
}

.send-btn[disabled] {
	background-color: #cccccc;
	opacity: 0.6;
}

.send-icon {
	font-size: 32rpx;
	color: #131811;
	font-weight: bold;
}
</style>
