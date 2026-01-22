<template>
	<view class="itinerary-container">
		<!-- Android 适配：顶部状态栏占位（预留状态栏高度，避免内容被遮挡） -->
		<view class="status-bar-placeholder" :style="{ height: statusBarHeight + 'px' }"></view>

		<!-- 头部 -->
		<!-- Android 兼容：添加条件 class，在 Android 下禁用 backdrop-filter -->
		<view class="header" :class="{ 'header-android': isAndroid }">
			<view class="header-top">
				<button class="header-btn" @click="handleBack">
					<text class="btn-icon">←</text>
				</button>
				<view class="header-center">
					<text class="header-title">{{ itineraryInfo.title || '行程计划' }}</text>
					<text class="header-subtitle">{{ itineraryInfo.startDate }} - {{ itineraryInfo.endDate }}</text>
				</view>
				<button class="header-btn" @click="showMoreMenu">
					<text class="btn-icon">⋯</text>
				</button>
			</view>

			<!-- 视图切换 -->
			<view class="view-toggle">
				<view
					class="toggle-option"
					:class="viewMode === 'timeline' ? 'toggle-active' : ''"
					@click="switchViewMode('timeline')"
				>
					<text class="toggle-icon">📋</text>
					<text class="toggle-text">时间轴</text>
				</view>
				<view
					class="toggle-option"
					:class="viewMode === 'calendar' ? 'toggle-active' : ''"
					@click="switchViewMode('calendar')"
				>
					<text class="toggle-icon">📅</text>
					<text class="toggle-text">日历</text>
				</view>
			</view>

			<!-- 日期选择器 -->
			<scroll-view v-if="viewMode === 'timeline'" class="day-selector" scroll-x>
				<view class="day-list">
					<button
						v-for="day in days"
						:key="day"
						class="day-btn"
						:class="selectedDay === day ? 'day-btn-active' : ''"
						@click="selectDay(day)"
					>
						<text class="day-label" :class="selectedDay === day ? 'day-label-active' : ''">第 {{ day }} 天</text>
						<text class="day-number" :class="selectedDay === day ? 'day-number-active' : ''">{{ getDayDate(day) }}</text>
					</button>
				</view>
			</scroll-view>
		</view>

		<!-- 时间轴视图 -->
		<scroll-view v-if="viewMode === 'timeline'" class="timeline-scroll" scroll-y>
			<view class="timeline-container">
				<!-- 时间轴线 -->
				<view v-if="filteredItems.length > 0" class="timeline-line"></view>

				<!-- 空状态 -->
				<view v-if="filteredItems.length === 0" class="empty-state">
					<text class="empty-icon">📅</text>
					<text class="empty-title">今天还没有计划哦</text>
					<text class="empty-subtitle">点击下方的 + 号开始添加</text>
				</view>

				<!-- 行程项列表 -->
				<view
					v-for="(item, index) in filteredItems"
					:key="item.id"
					class="timeline-item"
				>
					<!-- 时间标签 -->
					<view class="time-label">
						<text class="time-text">{{ item.time }}</text>
						<text class="period-text">{{ item.period === 'morning' ? '上午' : '下午' }}</text>
					</view>

					<!-- 行程卡片 -->
					<view
						class="item-card"
						:class="item.isAiSuggestion ? 'card-ai' : 'card-normal'"
					>
						<!-- AI 标签 -->
						<view v-if="item.isAiSuggestion" class="ai-badge">
							<text class="ai-badge-text">AI 建议</text>
						</view>

						<!-- 卡片内容 -->
						<view class="card-content">
							<view class="card-icon">
								<image
									v-if="item.image"
									class="icon-image"
									:src="item.image"
									mode="aspectFill"
								/>
								<text v-else class="icon-placeholder">{{ getCategoryIcon(item.category) }}</text>
							</view>
							<view class="card-info">
								<view class="card-header">
									<text class="card-title">{{ item.title }}</text>
									<view v-if="!item.isAiSuggestion" class="card-actions">
										<button class="action-btn" @click.stop="editItem(item)">
											<text class="action-icon">✏️</text>
										</button>
										<button class="action-btn" @click.stop="confirmDeleteItem(item)">
											<text class="action-icon">🗑️</text>
										</button>
									</view>
								</view>
								<text class="card-desc">{{ item.description }}</text>
								<view class="card-meta">
									<view class="meta-tag">
										<text class="tag-text">{{ item.category }}</text>
									</view>
									<text class="meta-duration">{{ item.duration }}</text>
								</view>
							</view>
						</view>

						<!-- AI 操作按钮 -->
						<view v-if="item.isAiSuggestion" class="ai-actions">
							<button class="ai-accept-btn" @click.stop="acceptSuggestion(item.id)">
								<text class="ai-btn-text">接受建议</text>
							</button>
							<button class="ai-reject-btn" @click.stop="confirmDeleteItem(item)">
								<text class="ai-reject-icon">✕</text>
							</button>
						</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 日历视图 -->
		<scroll-view v-else class="calendar-scroll" scroll-y>
			<view class="calendar-container">
				<!-- 月份导航 -->
				<view class="calendar-header">
					<button class="month-nav-btn" @click="prevMonth">
						<text class="nav-icon">‹</text>
					</button>
					<text class="month-title">{{ currentYear }}年 {{ currentMonth }}月</text>
					<button class="month-nav-btn" @click="nextMonth">
						<text class="nav-icon">›</text>
					</button>
				</view>

				<!-- 星期标题 -->
				<view class="weekdays">
					<text v-for="day in weekdays" :key="day" class="weekday">{{ day }}</text>
				</view>

				<!-- 日历网格 -->
				<view class="calendar-grid">
					<!-- 空白占位（月初） -->
					<view
						v-for="n in firstDayOfWeek"
						:key="'empty-' + n"
						class="calendar-day calendar-day-empty"
					></view>
					<!-- 日期 -->
					<view
						v-for="day in daysInMonth"
						:key="day"
						class="calendar-day"
						:class="{
							'day-has-items': hasItemsOnDay(day),
							'day-is-today': isToday(day),
							'day-is-selected': isCurrentDay(day)
						}"
						@click="selectCalendarDay(day)"
					>
						<text class="day-number-text">{{ day }}</text>
						<!-- 有行程的标记点 -->
						<view v-if="hasItemsOnDay(day)" class="day-dot"></view>
					</view>
				</view>

				<!-- 选中日期的行程摘要 -->
				<view v-if="selectedCalendarDate" class="day-summary">
					<view class="summary-header">
						<text class="summary-title">{{ currentMonth }}月{{ selectedCalendarDate }}日</text>
						<text class="summary-count">{{ getItemsForCalendarDay(selectedCalendarDate).length }} 项行程</text>
					</view>
					<scroll-view class="summary-list" scroll-y>
						<view
							v-for="item in getItemsForCalendarDay(selectedCalendarDate)"
							:key="item.id"
							class="summary-item"
						>
							<text class="summary-time">{{ item.time }}</text>
							<text class="summary-title-text">{{ item.title }}</text>
						</view>
					</scroll-view>
				</view>
			</view>
		</scroll-view>

		<!-- 浮动添加按钮 -->
		<button class="fab-add" @click="openAddModal">
			<text class="fab-add-icon">+</text>
		</button>

		<!-- AI 生成入口按钮 -->
		<button class="fab-ai" @click="openAiGenerateModal">
			<text class="fab-ai-icon">✨</text>
			<text class="fab-ai-text">AI 生成</text>
		</button>

		<!-- 添加/编辑弹窗 -->
		<!-- 遮罩层：点击空白处关闭弹窗 -->
		<!-- @click.stop：防止事件冒泡到页面其他地方 -->
		<view v-if="showModal" class="modal-overlay" @click="closeModal" @touchmove.stop.prevent>
			<!-- 弹窗内容：@click.stop 阻止冒泡，确保点击内容不会关闭弹窗 -->
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">{{ editingItem?.id ? '编辑行程' : '添加新行程' }}</text>
					<button class="modal-close" @click="closeModal">
						<text class="close-icon">✕</text>
					</button>
				</view>

				<!-- Android 关键修复：scroll-view 需要特殊属性才能正常传递点击事件到 input -->
				<scroll-view
					class="modal-form"
					scroll-y
					:scroll-with-animation="false"
					enable-flex
					@touchmove.stop
				>
					<view class="form-group" @click="focusInput('title')">
						<text class="form-label">行程名称 *</text>
						<!-- Android 兼容：添加 focus 事件监听，确保输入框能获得焦点 -->
						<!-- 关键修复：移除 @click.stop，让 input 能正常获得焦点 -->
						<input
							v-model="form.title"
							type="text"
							class="form-input"
							placeholder="例: 岚山小火车"
							placeholder-class="form-placeholder"
							:cursor-spacing="20"
							adjust-position
							confirm-type="next"
							data-field="title"
							@focus="onInputFocus"
							@blur="onInputBlur"
							:focus="inputFocus === 'title'"
						/>
					</view>

					<view class="form-row">
						<view class="form-group flex-1" @click="focusInput('timeStart')">
							<text class="form-label">开始时间 *</text>
							<picker mode="time" :value="form.timeStart" @change="onStartTimeChange">
								<view class="picker-trigger">
									<text class="picker-text">{{ form.timeStart || '09:00' }}</text>
									<text class="picker-arrow">▼</text>
								</view>
							</picker>
						</view>
						<view class="form-group flex-1" @click="focusInput('timeEnd')">
							<text class="form-label">结束时间</text>
							<picker mode="time" :value="form.timeEnd" @change="onEndTimeChange">
								<view class="picker-trigger">
									<text class="picker-text">{{ form.timeEnd || '未设置' }}</text>
									<text class="picker-arrow">▼</text>
								</view>
							</picker>
						</view>
					</view>

					<view class="form-group" @click="focusInput('duration')">
						<text class="form-label">大概时长</text>
						<!-- 关键修复：移除 @click.stop，让 input 能正常获得焦点 -->
						<input
							v-model="form.duration"
							type="text"
							class="form-input"
							placeholder="2小时"
							placeholder-class="form-placeholder"
							:cursor-spacing="20"
							adjust-position
							data-field="duration"
							@focus="onInputFocus"
							@blur="onInputBlur"
							:focus="inputFocus === 'duration'"
						/>
					</view>

					<view class="form-group" @click="focusInput('location')">
						<text class="form-label">地点（可选）</text>
						<!-- 关键修复：移除 @click.stop，让 input 能正常获得焦点 -->
						<input
							v-model="form.location"
							type="text"
							class="form-input"
							placeholder="详细地址或地标"
							placeholder-class="form-placeholder"
							:cursor-spacing="20"
							adjust-position
							data-field="location"
							@focus="onInputFocus"
							@blur="onInputBlur"
							:focus="inputFocus === 'location'"
						/>
					</view>

					<view class="form-group" @click="focusInput('description')">
						<text class="form-label">描述/备注</text>
						<!-- textarea 不受影响，但为了一致性也移除 @click.stop -->
						<textarea
							v-model="form.description"
							class="form-textarea"
							placeholder="具体的内容或注意事项..."
							placeholder-class="form-placeholder"
							:cursor-spacing="20"
							adjust-position
							:maxlength="500"
							:auto-height="false"
							data-field="description"
							@focus="onInputFocus"
							@blur="onInputBlur"
							:focus="inputFocus === 'description'"
						/>
					</view>

					<view class="form-group">
						<text class="form-label">分类</text>
						<view class="category-list">
							<button
								v-for="cat in categories"
								:key="cat"
								class="category-btn"
								:class="form.category === cat ? 'category-btn-active' : ''"
								@click="selectCategory(cat)"
							>
								<text class="category-text" :class="form.category === cat ? 'category-text-active' : ''">{{ cat }}</text>
							</button>
						</view>
					</view>
				</scroll-view>

				<!-- 保存按钮固定在弹窗底部，不随滚动移动 -->
				<button class="form-submit" @click="saveItem">
					<text class="submit-text">保存行程</text>
				</button>
			</view>
		</view>

		<!-- AI 生成行程弹窗 -->
		<!-- 遮罩层：点击空白处关闭弹窗 -->
		<view v-if="showAiModal" class="modal-overlay" @click="closeAiModal" @touchmove.stop.prevent>
			<!-- 弹窗内容：@click.stop 阻止冒泡，确保点击内容不会关闭弹窗 -->
			<view class="modal-content" @click.stop>
				<view class="modal-header">
					<text class="modal-title">AI 生成行程</text>
					<button class="modal-close" @click="closeAiModal">
						<text class="close-icon">✕</text>
					</button>
				</view>

				<!-- AI 生成表单内容（可滚动） -->
				<view class="ai-form">
					<view class="form-group">
						<text class="form-label">生成范围</text>
						<view class="ai-options">
							<button
								class="ai-option-btn"
								:class="aiGenerateRange === 'today' ? 'ai-option-active' : ''"
								@click="selectAiRange('today')"
							>
								<text class="ai-option-text">仅今天</text>
							</button>
							<button
								class="ai-option-btn"
								:class="aiGenerateRange === '3days' ? 'ai-option-active' : ''"
								@click="selectAiRange('3days')"
							>
								<text class="ai-option-text">未来3天</text>
							</button>
						</view>
					</view>

					<view class="form-group">
						<text class="form-label">目的地城市</text>
						<input
							v-model="aiForm.city"
							type="text"
							class="form-input"
							placeholder="例: 京都"
							placeholder-class="form-placeholder"
						/>
					</view>

					<view class="form-group">
						<text class="form-label">偏好描述（可选）</text>
						<textarea
							v-model="aiForm.preferences"
							class="form-textarea"
							placeholder="例: 喜欢历史文化，想体验当地美食..."
							placeholder-class="form-placeholder"
							:maxlength="200"
						/>
					</view>

					<view class="ai-tips">
						<text class="tips-icon">💡</text>
						<text class="tips-text">AI 将根据您的偏好生成合适的行程建议</text>
					</view>
				</view>

				<!-- 生成按钮固定在弹窗底部，不随滚动移动 -->
				<button class="form-submit" @click="generateWithAI">
					<text class="submit-text">开始生成</text>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
import { itineraryService } from '@/services/itinerary.js'
import { storage, STORAGE_KEYS } from '@/utils/storage.js'

// TODO: 未来可抽离到 utils/storage 或 services
const STORAGE_KEYS_ITINERARY = {
	ITINERARIES: 'itineraries',           // 行程数据
	SELECTED_DAY: 'itinerary_selected_day', // 选中的天数
	SELECTED_DATE: 'itinerary_selected_date' // 选中的日期 (YYYY-MM-DD)
}

export default {
	data() {
		return {
			// 视图模式
			viewMode: 'timeline', // 'timeline' | 'calendar'

			// 行程信息
			itineraryInfo: {
				title: '京都之旅计划',
				startDate: '10月12日',
				endDate: '10月20日'
			},

			// 天数列表
			selectedDay: 1,
			days: [1, 2, 3, 4, 5, 6, 7, 8, 9],

			// 行程项列表
			items: [],

			// 弹窗状态
			showModal: false,
			showAiModal: false,
			editingItem: null,

			// 平台标识（用于 Android 兼容处理）
			isAndroid: false,

			// 输入框焦点控制（用于 Android 强制聚焦）
			inputFocus: '',

			// 当前真正聚焦的输入框（用于防止焦点循环）
			focusedField: '',

			// 表单数据
			form: {
				day: 1,
				timeStart: '09:00',
				timeEnd: '',
				category: '景点',
				duration: '1小时',
				location: '',
				title: '',
				description: '',
				source: 'user',
				status: 'confirmed'
			},

			// AI 生成表单
			aiGenerateRange: 'today',
			aiForm: {
				city: '京都',
				preferences: ''
			},

			// 分类选项
			categories: ['景点', '餐饮', '文化', '交通', '购物'],

			// 日历相关
			weekdays: ['日', '一', '二', '三', '四', '五', '六'],
			currentYear: new Date().getFullYear(),
			currentMonth: new Date().getMonth() + 1,
			selectedCalendarDate: null,

			// 行程按日期索引（用于日历视图）
			itemsByDate: {}, // '2024-10-15': [items]

			// Android 适配：系统信息
			statusBarHeight: 44, // 默认值，会在 onLoad 中更新
			safeAreaInsetBottom: 0, // 底部安全区高度（px）
			tabBarHeight: 60 // TabBar 高度（px）
		}
	},

	computed: {
		/**
		 * 过滤当前选中天的行程
		 */
		filteredItems() {
			return this.items
				.filter(item => item.day === this.selectedDay)
				.sort((a, b) => (a.timeStart || a.time).localeCompare(b.timeStart || b.time))
		},

		/**
		 * 当月第一天是星期几
		 */
		firstDayOfWeek() {
			return new Date(this.currentYear, this.currentMonth - 1, 1).getDay()
		},

		/**
		 * 当月天数
		 */
		daysInMonth() {
			return new Date(this.currentYear, this.currentMonth, 0).getDate()
		}
	},

	onLoad() {
		// Android 适配：初始化系统信息（获取状态栏高度、安全区域等）
		this.initSystemInfo()

		// 检测平台（Android 需要特殊处理 backdrop-filter 导致的 z-index 问题）
		// #ifdef APP-PLUS
		const systemInfo = uni.getSystemInfoSync()
		this.isAndroid = systemInfo.platform === 'android'
		// #endif

		this.loadItinerary()
		this.loadSelectedDay()
		this.initCalendar()
	},

	onShow() {
		// 从其他页面返回时刷新数据
		this.loadItinerary()
	},

	onUnload() {
		this.saveSelectedDay()
	},

	methods: {
		// ==================== Android 适配 ====================

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

				console.log('[Itinerary] 系统信息:', {
					statusBarHeight: this.statusBarHeight,
					safeAreaInsetBottom: this.safeAreaInsetBottom
				})
			} catch (e) {
				console.error('[Itinerary] 获取系统信息失败:', e)
			}
		},

		// ==================== 数据加载与保存 ====================

		/**
		 * 加载行程数据
		 */
		loadItinerary() {
			console.log('[行程] 加载数据...')
			try {
				const itinerary = itineraryService.getItinerary()
				console.log('[行程] 获取到的数据:', itinerary)

				this.items = itinerary.items || []
				this.itineraryInfo = {
					title: itinerary.title || '行程计划',
					startDate: itinerary.startDate || '',
					endDate: itinerary.endDate || ''
				}

				// 构建日期索引（用于日历视图）
				this.buildDateIndex()

				console.log('[行程] 当前行程数量:', this.items.length)
			} catch (e) {
				console.error('[行程] 加载失败:', e)
			}
		},

		/**
		 * 保存选中的天数
		 */
		saveSelectedDay() {
			try {
				storage.set(STORAGE_KEYS_ITINERARY.SELECTED_DAY, this.selectedDay)
			} catch (e) {
				console.error('[行程] 保存选中天数失败:', e)
			}
		},

		/**
		 * 加载选中的天数
		 */
		loadSelectedDay() {
			try {
				const savedDay = storage.get(STORAGE_KEYS_ITINERARY.SELECTED_DAY)
				if (savedDay && this.days.includes(savedDay)) {
					this.selectedDay = savedDay
				}
			} catch (e) {
				console.error('[行程] 加载选中天数失败:', e)
			}
		},

		/**
		 * 构建日期索引（用于日历视图快速查询）
		 */
		buildDateIndex() {
			this.itemsByDate = {}
				// 假设行程从 10月12日开始，根据 day 计算实际日期
				// 这里简化处理，按 day 号分组
				this.items.forEach(item => {
					const dateKey = `10-${String(11 + item.day).padStart(2, '0')}` // 10月12日+day
					if (!this.itemsByDate[dateKey]) {
						this.itemsByDate[dateKey] = []
					}
					this.itemsByDate[dateKey].push(item)
				})
			},

		// ==================== 视图切换 ====================

		/**
		 * 切换视图模式
		 */
		switchViewMode(mode) {
			this.viewMode = mode
			if (mode === 'calendar') {
				this.initCalendar()
			}
		},

		/**
		 * 初始化日历
		 */
		initCalendar() {
			const now = new Date()
			this.currentYear = now.getFullYear()
			this.currentMonth = now.getMonth() + 1
			this.selectedCalendarDate = now.getDate()
		},

		/**
		 * 上一月
		 */
		prevMonth() {
			if (this.currentMonth === 1) {
				this.currentMonth = 12
				this.currentYear--
			} else {
				this.currentMonth--
			}
		},

		/**
		 * 下一月
		 */
		nextMonth() {
			if (this.currentMonth === 12) {
				this.currentMonth = 1
				this.currentYear++
			} else {
				this.currentMonth++
			}
		},

		/**
		 * 检查某天是否有行程
		 */
		hasItemsOnDay(day) {
			// 简化处理：假设行程都在 10 月，12+day
			const dateKey = `10-${String(11 + day).padStart(2, '0')}`
			// 在实际项目中，应该根据真实的日期来匹配
			// 这里简化为：如果在行程天数范围内就认为可能有行程
			return day >= 12 && day <= 20
		},

		/**
		 * 判断是否是今天
		 */
		isToday(day) {
			const now = new Date()
			return day === now.getDate() &&
				   this.currentMonth === now.getMonth() + 1 &&
				   this.currentYear === now.getFullYear()
		},

		/**
		 * 判断是否是当前选中的日期（时间轴模式下选中的天对应的日期）
		 */
		isCurrentDay(day) {
			// 简化处理：selectedDay + 11 = 实际日期
			const actualDay = 11 + this.selectedDay
			return day === actualDay && this.selectedCalendarDate === day
		},

		/**
		 * 选择日历中的某一天
		 */
		selectCalendarDay(day) {
			this.selectedCalendarDate = day
			// 计算这是第几天（假设从 12 日开始）
			const dayNum = day - 11
			if (dayNum >= 1 && dayNum <= this.days.length) {
				this.selectedDay = dayNum
			}
		},

		/**
		 * 获取日历日期的行程项
		 */
		getItemsForCalendarDay(day) {
			const dayNum = day - 11
			return this.items.filter(item => item.day === dayNum)
				.sort((a, b) => (a.timeStart || a.time).localeCompare(b.timeStart || b.time))
		},

		// ==================== 时间轴视图 ====================

		/**
		 * 选择天数
		 */
		selectDay(day) {
			this.selectedDay = day
			this.saveSelectedDay()
		},

		/**
		 * 获取某天对应的日期
		 */
		getDayDate(day) {
			return 11 + day // 假设从 12 日开始
		},

		/**
		 * 返回
		 */
		handleBack() {
			uni.navigateBack()
		},

		/**
		 * 显示更多菜单
		 */
		showMoreMenu() {
			const items = ['分享行程', '清空行程', '取消']
			uni.showActionSheet({
				itemList: items,
				success: (res) => {
					if (res.tapIndex === 0) {
						this.shareItinerary()
					} else if (res.tapIndex === 1) {
						this.clearAllItinerary()
					}
				}
			})
		},

		// ==================== 添加/编辑/删除 ====================

		/**
		 * 打开添加行程弹窗
		 */
		openAddModal() {
			this.editingItem = null
			const now = new Date()
			const hours = String(now.getHours()).padStart(2, '0')
			const minutes = String(now.getMinutes()).padStart(2, '0')

			this.form = {
				day: this.selectedDay,
				timeStart: `${hours}:${minutes}`,
				timeEnd: '',
				category: '景点',
				duration: '1小时',
				location: '',
				title: '',
				description: '',
				source: 'user',
				status: 'confirmed'
			}

			// 清除之前的焦点状态
			this.inputFocus = ''
			this.focusedField = ''

			this.showModal = true
		},

		/**
		 * 编辑行程项
		 */
		editItem(item) {
			this.editingItem = item
			this.form = {
				day: item.day,
				timeStart: item.timeStart || item.time,
				timeEnd: item.timeEnd || '',
				category: item.category,
				duration: item.duration,
				location: item.location || '',
				title: item.title,
				description: item.description,
				source: item.source || 'user',
				status: item.status || 'confirmed'
			}

			// 清除之前的焦点状态
			this.inputFocus = ''
			this.focusedField = ''

			this.showModal = true
		},

		/**
		 * 确认删除行程项
		 */
		confirmDeleteItem(item) {
			uni.showModal({
				title: '确认删除',
				content: `确定要删除「${item.title}」吗？`,
				confirmColor: '#ff4d4f',
				success: (res) => {
					if (res.confirm) {
						this.deleteItem(item.id)
					}
				}
			})
		},

		/**
		 * 删除行程项
		 */
		deleteItem(id) {
			itineraryService.deleteItem(id)
			this.loadItinerary()
			uni.showToast({
				title: '已删除',
				icon: 'success'
			})
		},

		/**
		 * 关闭弹窗
		 */
		closeModal() {
			this.showModal = false
			this.editingItem = null
			// 关闭弹窗时清除焦点状态
			this.inputFocus = ''
			this.focusedField = ''
		},

		/**
		 * 开始时间变化
		 */
		onStartTimeChange(e) {
			this.form.timeStart = e.detail.value
			// 自动计算 period
			const hour = parseInt(this.form.timeStart.split(':')[0])
			this.form.period = hour < 12 ? 'morning' : 'afternoon'
		},

		/**
		 * 输入框获得焦点（Android 兼容）
		 */
		onInputFocus(e) {
			// 关键修复：记录当前真正聚焦的字段，防止循环
			// 从事件对象中获取字段名
			const fieldName = e.target?.dataset?.field || this.inputFocus
			if (fieldName) {
				this.focusedField = fieldName
				console.log('[输入框] 获得焦点:', fieldName)
			}
		},

		/**
		 * 输入框失去焦点（Android 兼容）
		 */
		onInputBlur(e) {
			// 关键修复：不要清除 inputFocus，只清除 focusedField
			// 这可以防止焦点循环问题
			const fieldName = e.target?.dataset?.field || this.focusedField
			console.log('[输入框] 失去焦点:', fieldName)
			this.focusedField = ''
			// 注意：不要清空 this.inputFocus，让焦点状态保持
		},

		/**
		 * 手动触发输入框聚焦（Android 兼容）
		 * 当点击输入框外层容器时，通过编程方式触发输入框聚焦
		 */
		focusInput(fieldName) {
			console.log('[手动聚焦] 字段:', fieldName, '当前聚焦:', this.focusedField)

			// 关键修复：如果目标字段已经聚焦，不做任何操作
			if (this.focusedField === fieldName) {
				console.log('[手动聚焦] 字段已聚焦，跳过')
				return
			}

			// 设置新的焦点
			this.inputFocus = ''
			this.$nextTick(() => {
				this.inputFocus = fieldName
			})
		},

		/**
		 * 结束时间变化
		 */
		onEndTimeChange(e) {
			this.form.timeEnd = e.detail.value
		},

		/**
		 * 选择分类
		 */
		selectCategory(category) {
			this.form.category = category
		},

		/**
		 * 保存行程项
		 */
		saveItem() {
			// 校验
			if (!this.form.title || !this.form.title.trim()) {
				uni.showToast({
					title: '请输入行程名称',
					icon: 'none'
				})
				return
			}

			if (!this.form.timeStart) {
				uni.showToast({
					title: '请选择开始时间',
					icon: 'none'
				})
				return
			}

			// 时间格式校验 (HH:mm)
			const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/
			if (!timeRegex.test(this.form.timeStart)) {
				uni.showToast({
					title: '时间格式错误',
					icon: 'none'
				})
				return
			}

			// 计算上午/下午
			const hour = parseInt(this.form.timeStart.split(':')[0])
			this.form.period = hour < 12 ? 'morning' : 'afternoon'

			// 构建保存数据
			const saveData = {
				...this.form,
				time: this.form.timeStart, // 兼容旧字段
				period: this.form.period
			}

			if (this.editingItem?.id) {
				// 更新
				itineraryService.updateItem(this.editingItem.id, saveData)
			} else {
				// 新增
				itineraryService.addItem(saveData)
			}

			this.loadItinerary()
			this.closeModal()
			uni.showToast({
				title: '保存成功',
				icon: 'success'
			})
		},

		/**
		 * 接受 AI 建议
		 */
		acceptSuggestion(id) {
			itineraryService.acceptAiSuggestion(id)
			this.loadItinerary()
			uni.showToast({
				title: '已接受建议',
				icon: 'success'
			})
		},

		/**
		 * 获取分类图标
		 */
		getCategoryIcon(category) {
			const icons = {
				'餐饮': '🍽️',
				'交通': '🚗',
				'文化': '🏛️',
				'景点': '📍',
				'购物': '🛍️'
			}
			return icons[category] || '📍'
		},

		// ==================== AI 生成行程 ====================

		/**
		 * 打开 AI 生成弹窗
		 */
		openAiGenerateModal() {
			this.aiForm = {
				city: this.itineraryInfo.title.replace('之旅计划', '') || '京都',
				preferences: ''
			}
				this.aiGenerateRange = 'today'
			this.showAiModal = true
		},

		/**
		 * 关闭 AI 弹窗
		 */
		closeAiModal() {
			this.showAiModal = false
		},

		/**
		 * 选择 AI 生成范围
		 */
		selectAiRange(range) {
			this.aiGenerateRange = range
		},

		/**
		 * 使用 AI 生成行程
		 */
		async generateWithAI() {
			const city = this.aiForm.city.trim()
			if (!city) {
				uni.showToast({
					title: '请输入目的地',
					icon: 'none'
				})
				return
			}

			// 关闭弹窗
			this.closeAiModal()

			// 构建 prompt 文本
			const days = this.aiGenerateRange === '3days' ? 3 : 1
			const startDay = this.selectedDay
			const existingItems = this.items.filter(item =>
				item.day >= startDay && item.day < startDay + days
			)

			const promptText = `请为我规划${days}天${city}的旅行行程。
${this.aiForm.preferences ? '偏好：' + this.aiForm.preferences : ''}
${existingItems.length > 0 ? '已有安排：\n' + existingItems.map(i => `- 第${i.day}天 ${i.time}: ${i.title}`).join('\n') : ''}

请按以下JSON格式返回（只返回JSON，不要其他文字）：
[
  {
    "day": ${startDay},
    "timeStart": "09:00",
    "title": "景点名称",
    "description": "描述",
    "category": "景点",
    "duration": "2小时",
    "location": "详细地址"
  }
]`

			// 显示加载提示
			uni.showLoading({
				title: 'AI 正在生成行程...'
			})

			try {
				// 调用 DeepSeek API 生成行程
				const { chat } = await import('@/api/deepseek.js')
				const messages = [
					{ role: 'user', content: promptText }
				]

				const response = await chat(messages, {
					temperature: 0.7,
					max_tokens: 2000,
					timeout: 60000
				})

				// 提取返回的内容
				const content = response?.choices?.[0]?.message?.content || response?.content || ''

				if (!content) {
					throw new Error('AI 返回为空')
				}

				// 解析 AI 返回的 JSON
				let aiItems
				try {
					// 尝试直接解析
					aiItems = JSON.parse(content)
				} catch (e) {
					// 如果直接解析失败，尝试提取 JSON 部分
					const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/)
					if (jsonMatch) {
						aiItems = JSON.parse(jsonMatch[0])
					} else {
						throw new Error('无法解析 AI 返回的数据')
					}
				}

				// 确保是数组格式
				if (!Array.isArray(aiItems)) {
					// 如果返回的是对象，尝试转换为数组
					if (aiItems.domestic || aiItems.international) {
						aiItems = [...(aiItems.domestic || []), ...(aiItems.international || [])]
					} else {
						aiItems = [aiItems]
					}
				}

				// 添加 AI 建议到行程列表
				let addedCount = 0
				aiItems.forEach(item => {
					if (item.title && item.timeStart) {
						itineraryService.addAiSuggestion({
							day: item.day || startDay,
							timeStart: item.timeStart,
							title: item.title,
							description: item.description || 'AI 生成的行程建议',
							category: item.category || '景点',
							duration: item.duration || '2小时',
							location: item.location || city,
							isAiSuggestion: true
						})
						addedCount++
					}
				})

				// 刷新行程列表
				this.loadItinerary()

				uni.hideLoading()

				if (addedCount > 0) {
					uni.showToast({
						title: `已生成 ${addedCount} 条建议`,
						icon: 'success',
						duration: 2000
					})
				} else {
					uni.showToast({
						title: '生成失败，请重试',
						icon: 'none'
					})
				}

			} catch (e) {
				console.error('[AI 生成] 失败:', e)
				uni.hideLoading()

				// 如果 AI 调用失败，使用 mock 数据兜底
				uni.showModal({
					title: 'AI 生成失败',
					content: '无法连接到 AI 服务，是否使用示例数据？',
					confirmText: '使用示例',
					cancelText: '取消',
					success: (res) => {
						if (res.confirm) {
							this.generateMockItinerary(days, city)
						}
					}
				})
			}
		},

		/**
		 * 生成模拟行程（AI 调用失败时的兜底方案）
		 * TODO: 未来可移除，当 AI 联动完全实现后
		 */
		generateMockItinerary(days, city) {
			uni.showLoading({
				title: '生成中...'
			})

			// 模拟延迟
			setTimeout(() => {
				const mockItems = this.getMockAiItems(days, city)

				mockItems.forEach(item => {
					itineraryService.addAiSuggestion(item)
				})

				this.loadItinerary()
				uni.hideLoading()
				uni.showToast({
					title: `已生成 ${mockItems.length} 条建议`,
					icon: 'success'
				})
			}, 1500)
		},

		/**
		 * 获取模拟 AI 建议数据
		 */
		getMockAiItems(days, city) {
			const suggestions = []
			const startDay = this.selectedDay

			for (let d = 0; d < days; d++) {
				const day = startDay + d
				// 每天生成 2-3 条建议
				const count = 2 + Math.floor(Math.random() * 2)

				for (let i = 0; i < count; i++) {
					const hour = 9 + i * 4
					suggestions.push({
						day,
						timeStart: `${String(hour).padStart(2, '0')}:00`,
						title: `${city}推荐景点 ${i + 1}`,
						description: 'AI 根据您的偏好生成的建议',
						category: ['景点', '餐饮', '文化'][Math.floor(Math.random() * 3)],
						duration: '2小时',
						location: `${city}市中心`,
						isAiSuggestion: true
					})
				}
			}

			return suggestions
		},

		// ==================== 分享功能 ====================

		/**
		 * 分享行程
		 */
		shareItinerary() {
			// 生成当前选中日期的行程摘要
			const dayItems = this.filteredItems.sort((a, b) =>
				(a.timeStart || a.time).localeCompare(b.timeStart || b.time)
			)

			if (dayItems.length === 0) {
				uni.showToast({
					title: '当前日期没有行程',
					icon: 'none'
				})
				return
			}

			// 构建分享文本
			let shareText = `${this.itineraryInfo.title}\n`
			shareText += `${this.itineraryInfo.startDate} - ${this.itineraryInfo.endDate}\n`
			shareText += `第 ${this.selectedDay} 天行程：\n\n`

			dayItems.forEach(item => {
				const time = item.timeStart || item.time
				shareText += `${time} ${item.title}`
				if (item.location) {
					shareText += ` @${item.location}`
				}
				if (item.description) {
					shareText += `\n    ${item.description}`
				}
				shareText += '\n'
			})

			shareText += `\n——来自 WanderAI 漫游奇点`

			// 复制到剪贴板
			uni.setClipboardData({
				data: shareText,
				success: () => {
					uni.showToast({
						title: '行程已复制',
						icon: 'success'
					})
				}
			})
		},

		/**
		 * 清空所有行程
		 */
		clearAllItinerary() {
			uni.showModal({
				title: '确认清空',
				content: '确定要清空所有行程吗？此操作不可恢复。',
				confirmColor: '#ff4d4f',
				success: (res) => {
					if (res.confirm) {
						itineraryService.clearItinerary()
						this.loadItinerary()
						uni.showToast({
							title: '已清空',
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
 * 问题3: 底部内容被 TabBar + 虚拟按键/安全区遮挡
 * 解决: 使用 CSS calc() 计算 TabBar 高度(60px) + 安全区
 * =============================================================== */

.itinerary-container {
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

/* 头部 */
.header {
	/* Android 适配: 移除 sticky 定位，状态栏占位已处理顶部间距 */
	position: relative;
	z-index: 30;
	background-color: rgba(247, 248, 246, 0.95);
	/* Android 兼容修复：backdrop-filter 在 Android WebView 中会导致 z-index 层叠上下文异常 */
	backdrop-filter: blur(20rpx); /* 非 Android 平台生效 */
	padding: 32rpx;
	padding-top: 48rpx;
	/* Android 适配: 确保 header 不会被压缩，让 scroll-view 获得正确高度 */
	flex-shrink: 0;
}

/* Android 专用：禁用 backdrop-filter，使用纯色背景 */
/* #ifdef APP-PLUS */
.header-android {
	background-color: #f7f8f6; /* 纯色替代半透明+模糊 */
}
/* #endif */

.header-top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 32rpx;
}

.header-btn {
	padding: 16rpx;
	background-color: transparent;
	border-radius: 50%;
}

.header-btn:active {
	background-color: rgba(0, 0, 0, 0.05);
}

.btn-icon {
	font-size: 32rpx;
	color: #131811;
}

.header-center {
	text-align: center;
}

.header-title {
	display: block;
	color: #131811;
	font-size: 36rpx;
	font-weight: 700;
}

.header-subtitle {
	display: block;
	color: #708961;
	font-size: 24rpx;
	font-weight: 500;
	margin-top: 4rpx;
}

/* 视图切换 */
.view-toggle {
	display: flex;
	height: 96rpx;
	background-color: #e5eadf;
	border-radius: 32rpx;
	padding: 8rpx;
	margin-bottom: 32rpx;
}

.toggle-option {
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 16rpx;
	border-radius: 24rpx;
}

.toggle-active {
	background-color: #ffffff;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.toggle-icon {
	font-size: 32rpx;
}

.toggle-text {
	font-size: 28rpx;
	font-weight: 500;
}

.toggle-active .toggle-text {
	color: #131811;
	font-weight: 700;
}

.toggle-option:not(.toggle-active) {
	color: #708961;
}

/* 日期选择器 */
.day-selector {
	white-space: nowrap;
	padding-bottom: 16rpx;
}

.day-list {
	display: inline-flex;
	gap: 24rpx;
}

.day-btn {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 8rpx;
	width: 128rpx;
	height: 144rpx;
	background-color: #ffffff;
	border-radius: 32rpx;
	flex-shrink: 0;
}

.day-btn-active {
	background-color: #63ec13;
	box-shadow: 0 4px 16px rgba(99, 236, 19, 0.3);
}

.day-label {
	font-size: 20rpx;
	font-weight: 700;
	color: #708961;
}

.day-label-active {
	color: #131811;
}

.day-number {
	font-size: 36rpx;
	font-weight: 800;
	color: #708961;
}

.day-number-active {
	color: #131811;
}

/* 时间轴 */
.timeline-scroll {
	/* Android 适配: scroll-view 需要明确的高度才能滚动，使用 flex: 1 获取剩余空间 */
	flex: 1;
	/* 确保 scroll-view 有最小高度，防止内容为空时无法滚动 */
	min-height: 0;
	/* uni-app scroll-view 滚动修复 */
	height: 0;
}

.timeline-container {
	padding: 32rpx 48rpx;
	/* Android 适配: 底部预留 TabBar(60px = 120rpx) + 安全区 + 额外间距 */
	padding-bottom: calc(220rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(220rpx + env(safe-area-inset-bottom));
	position: relative;
}

.timeline-line {
	position: absolute;
	left: 94rpx;
	top: 32rpx;
	bottom: 32rpx;
	width: 4rpx;
	border-left: 4rpx dashed rgba(0, 0, 0, 0.1);
}

.timeline-item {
	display: grid;
	grid-template-columns: auto 1fr;
	gap: 24rpx;
	margin-bottom: 40rpx;
	position: relative;
}

.time-label {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding-top: 16rpx;
	width: 80rpx;
	flex-shrink: 0;
}

.time-text {
	color: #131811;
	font-size: 24rpx;
	font-weight: 700;
}

.period-text {
	color: #708961;
	font-size: 20rpx;
	font-weight: 500;
	text-transform: uppercase;
	margin-top: 4rpx;
}

/* 行程卡片 */
.item-card {
	padding: 24rpx;
	background-color: #ffffff;
	border-radius: 32rpx;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
	border: 1rpx solid rgba(0, 0, 0, 0.05);
}

.card-ai {
	background: linear-gradient(135deg, #ffffff 0%, rgba(99, 236, 19, 0.1) 100%);
	border-color: rgba(99, 236, 19, 0.3);
	position: relative;
}

.ai-badge {
	position: absolute;
	top: 0;
	right: 0;
	background-color: rgba(99, 236, 19, 0.2);
	padding: 6rpx 12rpx;
	border-bottom-left-radius: 12rpx;
}

.ai-badge-text {
	color: #63ec13;
	font-size: 14rpx;
	font-weight: 700;
}

.card-content {
	display: flex;
	gap: 20rpx;
}

.card-icon {
	width: 72rpx;
	height: 72rpx;
	background-color: #f4f7f2;
	border-radius: 16rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	overflow: hidden;
}

.icon-image {
	width: 100%;
	height: 100%;
}

.icon-placeholder {
	font-size: 36rpx;
}

.card-info {
	flex: 1;
	min-width: 0;
}

.card-header {
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 6rpx;
}

.card-title {
	color: #131811;
	font-size: 28rpx;
	font-weight: 700;
	flex: 1;
}

.card-actions {
	display: flex;
	gap: 8rpx;
}

.action-btn {
	padding: 8rpx;
	background-color: transparent;
	border-radius: 8rpx;
}

.action-btn:active {
	background-color: rgba(0, 0, 0, 0.05);
}

.action-icon {
	font-size: 24rpx;
}

.card-desc {
	color: #708961;
	font-size: 22rpx;
	display: block;
	margin-bottom: 10rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.card-meta {
	display: flex;
	align-items: center;
	gap: 16rpx;
}

.meta-tag {
	background-color: rgba(255, 152, 0, 0.1);
	padding: 8rpx 16rpx;
	border-radius: 8rpx;
}

.tag-text {
	color: #ff9800;
	font-size: 18rpx;
	font-weight: 700;
}

.meta-duration {
	color: #999999;
	font-size: 18rpx;
}

/* AI 操作按钮 */
.ai-actions {
	display: flex;
	gap: 12rpx;
	margin-top: 20rpx;
}

.ai-accept-btn {
	flex: 1;
	background-color: #63ec13;
	padding: 18rpx;
	border-radius: 20rpx;
}

.ai-btn-text {
	color: #131811;
	font-size: 20rpx;
	font-weight: 700;
}

.ai-reject-btn {
	padding: 12rpx 18rpx;
	border: 1rpx solid rgba(0, 0, 0, 0.05);
	border-radius: 20rpx;
	background-color: transparent;
}

.ai-reject-icon {
	color: #999999;
	font-size: 24rpx;
}

/* 空状态 */
.empty-state {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 200rpx 0;
	text-align: center;
	opacity: 0.4;
}

.empty-icon {
	font-size: 120rpx;
	margin-bottom: 32rpx;
}

.empty-title {
	font-size: 28rpx;
	font-weight: 500;
	color: #131811;
	display: block;
	margin-bottom: 8rpx;
}

.empty-subtitle {
	font-size: 24rpx;
	color: #131811;
}

/* ==================== 日历视图 ==================== */
.calendar-scroll {
	/* Android 适配: scroll-view 需要明确的高度才能滚动，使用 flex: 1 获取剩余空间 */
	flex: 1;
	/* 确保 scroll-view 有最小高度，防止内容为空时无法滚动 */
	min-height: 0;
	/* uni-app scroll-view 滚动修复 */
	height: 0;
}

.calendar-container {
	padding: 32rpx 48rpx;
}

/* 月份导航 */
.calendar-header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 32rpx;
}

.month-nav-btn {
	padding: 16rpx 24rpx;
	background-color: #ffffff;
	border-radius: 24rpx;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.nav-icon {
	font-size: 32rpx;
	color: #131811;
}

.month-title {
	color: #131811;
	font-size: 32rpx;
	font-weight: 700;
}

/* 星期标题 */
.weekdays {
	display: flex;
	margin-bottom: 16rpx;
}

.weekday {
	flex: 1;
	text-align: center;
	color: #708961;
	font-size: 20rpx;
	font-weight: 700;
}

/* 日历网格 */
.calendar-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 8rpx;
}

.calendar-day {
	width: calc((100% - 48rpx) / 7);
	aspect-ratio: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	background-color: #ffffff;
	border-radius: 16rpx;
	position: relative;
}

.calendar-day-empty {
	background-color: transparent;
}

.day-number-text {
	color: #131811;
	font-size: 24rpx;
	font-weight: 500;
}

.day-has-items {
	background-color: #f4f7f2;
}

.day-has-items .day-number-text {
	color: #63ec13;
	font-weight: 700;
}

.day-is-today {
	border: 2rpx solid #63ec13;
}

.day-is-selected {
	background-color: #63ec13;
}

.day-is-selected .day-number-text {
	color: #ffffff;
}

/* 有行程的标记点 */
.day-dot {
	position: absolute;
	bottom: 8rpx;
	width: 8rpx;
	height: 8rpx;
	background-color: #63ec13;
	border-radius: 50%;
}

/* 行程摘要 */
.day-summary {
	margin-top: 48rpx;
	padding: 32rpx;
	background-color: #ffffff;
	border-radius: 32rpx;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.summary-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24rpx;
	padding-bottom: 16rpx;
	border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
}

.summary-title {
	color: #131811;
	font-size: 28rpx;
	font-weight: 700;
}

.summary-count {
	color: #708961;
	font-size: 20rpx;
}

.summary-list {
	max-height: 400rpx;
}

.summary-item {
	display: flex;
	align-items: center;
	gap: 24rpx;
	padding: 16rpx 0;
	border-bottom: 1rpx solid rgba(0, 0, 0, 0.03);
}

.summary-item:last-child {
	border-bottom: none;
}

.summary-time {
	color: #708961;
	font-size: 20rpx;
	font-weight: 700;
	min-width: 80rpx;
}

.summary-title-text {
	color: #131811;
	font-size: 24rpx;
	flex: 1;
}

/* ==================== 浮动按钮 ==================== */
.fab-add {
	position: fixed;
	/* Android 适配: bottom = 原值(200rpx) + TabBar(60px = 120rpx) + 安全区 */
	bottom: calc(320rpx + constant(safe-area-inset-bottom));
	bottom: calc(320rpx + env(safe-area-inset-bottom));
	right: 48rpx;
	width: 112rpx;
	height: 112rpx;
	background-color: #63ec13;
	border-radius: 50%;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 50;
}

.fab-add:active {
	transform: scale(0.95);
}

.fab-add-icon {
	font-size: 48rpx;
	color: #131811;
	font-weight: 300;
}

/* AI 生成按钮 */
.fab-ai {
	position: fixed;
	/* Android 适配: bottom = 原值(200rpx) + TabBar(60px = 120rpx) + 安全区 */
	bottom: calc(320rpx + constant(safe-area-inset-bottom));
	bottom: calc(320rpx + env(safe-area-inset-bottom));
	right: 180rpx;
	height: 112rpx;
	background: linear-gradient(135deg, #63ec13 0%, #4cd964 100%);
	border-radius: 56rpx;
	box-shadow: 0 4px 16px rgba(99, 236, 19, 0.2);
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12rpx;
	padding: 0 24rpx;
	z-index: 50;
}

.fab-ai:active {
	transform: scale(0.95);
}

.fab-ai-icon {
	font-size: 28rpx;
}

.fab-ai-text {
	color: #131811;
	font-size: 24rpx;
	font-weight: 700;
}

/* ==================== 弹窗 ==================== */
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
	/* Android 兼容修复：提高 z-index，确保在 header（z-index: 30）之上 */
	z-index: 999;
	padding: 32rpx;
	/* 确保遮罩层可接收点击事件（用于关闭弹窗） */
	pointer-events: auto;
}

.modal-content {
	width: 100%;
	max-width: 600rpx;
	background-color: #ffffff;
	border-top-left-radius: 64rpx;
	border-top-right-radius: 64rpx;
	padding: 64rpx 48rpx;
	padding-bottom: 48rpx; /* 减少底部 padding，为保存按钮留空间 */
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
	/* 关键修复：确保弹窗内容可接收点击/输入事件 */
	pointer-events: auto;
	/* Android 兼容：调整高度计算方式，确保保存按钮可见 */
	max-height: 80vh;
	display: flex;
	flex-direction: column;
	/* 防止内容区域的事件穿透到遮罩层 */
	position: relative;
	/* Android 兼容：使用 box-sizing 确保高度计算正确 */
	box-sizing: border-box;
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

/* 表单 */
.modal-form {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 32rpx;
	overflow-y: auto;
	/* Android 兼容：确保表单容器可接收事件 */
	pointer-events: auto;
	/* 关键修复：确保 scroll-view 内容不会被截断 */
	min-height: 0;
	/* 减少最大高度，为保存按钮留出空间 */
	max-height: calc(80vh - 160rpx);
	/* 添加内边距，让内容不贴边 */
	padding: 8rpx 0;
}

/* AI 表单（按钮已移出，确保内容不溢出） */
.ai-form {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 32rpx;
	/* 关键修复：移除 overflow-y，让内容自然排列 */
	/* AI 表单内容不多，不需要滚动 */
	pointer-events: auto;
	/* 添加内边距，让内容不贴边 */
	padding: 8rpx 0;
	/* 确保表单不会太高，按钮始终可见 */
	max-height: calc(80vh - 200rpx);
}

.form-group {
	display: flex;
	flex-direction: column;
	gap: 16rpx;
	/* Android 兼容：确保表单组可接收事件 */
	pointer-events: auto;
}

.form-row {
	display: flex;
	gap: 32rpx;
}

.flex-1 {
	flex: 1;
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
	/* 关键修复：增加 padding 和最小高度，让输入框更大更易用 */
	padding: 28rpx 32rpx;
	font-size: 30rpx;
	color: #131811;
	line-height: 1.5;
	min-height: 88rpx; /* 确保输入框有足够高度 */
	/* Android 兼容：确保输入框可聚焦 */
	pointer-events: auto;
	/* 确保输入框能完整显示内容 */
	box-sizing: border-box;
	/* 添加过渡效果，聚焦时平滑变化 */
	transition: all 0.2s;
}

/* 聚焦状态：给输入框添加明显的边框和背景变化 */
.form-input:focus {
	background-color: #ffffff;
	border: 2rpx solid #63ec13;
	/* 确保聚焦时边框不会导致布局变化 */
	box-sizing: border-box;
}

.picker-trigger {
	background-color: #f8f8f8;
	border: none;
	border-radius: 32rpx;
	/* 关键修复：增加 padding 和最小高度，与 input 保持一致 */
	padding: 28rpx 32rpx;
	min-height: 88rpx;
	display: flex;
	align-items: center;
	justify-content: space-between;
	/* Android 兼容：确保 picker 可点击 */
	pointer-events: auto;
	position: relative;
	/* 添加过渡效果 */
	transition: all 0.2s;
}

.picker-text {
	font-size: 30rpx;
	color: #131811;
	/* 确保文本不拦截点击事件 */
	pointer-events: none;
}

/* Picker 聚焦/按下状态 */
.picker-trigger:active {
	background-color: #ffffff;
	border: 2rpx solid #63ec13;
	box-sizing: border-box;
}

.picker-arrow {
	font-size: 24rpx;
	color: #999999;
	/* 确保箭头不拦截点击事件 */
	pointer-events: none;
}

.form-textarea {
	background-color: #f8f8f8;
	border: none;
	border-radius: 32rpx;
	/* 关键修复：增加 padding 和高度，让文本域更大更易用 */
	padding: 28rpx 32rpx;
	font-size: 30rpx;
	color: #131811;
	line-height: 1.6;
	min-height: 160rpx;
	height: 160rpx;
	resize: none;
	/* Android 兼容：确保文本域可聚焦 */
	pointer-events: auto;
	/* 确保文本域能完整显示内容 */
	box-sizing: border-box;
	/* 添加过渡效果，聚焦时平滑变化 */
	transition: all 0.2s;
}

/* 聚焦状态：给文本域添加明显的边框和背景变化 */
.form-textarea:focus {
	background-color: #ffffff;
	border: 2rpx solid #63ec13;
	/* 确保聚焦时边框不会导致布局变化 */
	box-sizing: border-box;
}

.form-placeholder {
	color: #999999;
	/* 确保 placeholder 文本大小与输入文本一致 */
	font-size: 30rpx;
}

.category-list {
	display: flex;
	flex-wrap: wrap;
	gap: 16rpx;
	/* Android 兼容：确保分类列表可接收事件 */
	pointer-events: auto;
}

.category-btn {
	padding: 16rpx 32rpx;
	background-color: #f8f8f8;
	border-radius: 50rpx;
	/* Android 兼容：确保分类按钮可点击 */
	pointer-events: auto;
}

.category-btn-active {
	background-color: #63ec13;
}

.category-text {
	color: #999999;
	font-size: 24rpx;
	font-weight: 500;
}

.category-text-active {
	color: #131811;
	font-weight: 700;
}

/* AI 选项 */
.ai-options {
	display: flex;
	gap: 16rpx;
}

.ai-option-btn {
	flex: 1;
	/* 关键修复：增加 padding 和最小高度，让按钮更易点击 */
	padding: 28rpx 24rpx;
	min-height: 88rpx;
	background-color: #f8f8f8;
	border-radius: 24rpx;
	border: 2rpx solid transparent;
	/* 添加过渡效果 */
	transition: all 0.2s;
}

.ai-option-active {
	background-color: rgba(99, 236, 19, 0.1);
	border-color: #63ec13;
}

.ai-option-text {
	color: #131811;
	font-size: 28rpx; /* 增大字体 */
	font-weight: 500;
}

.ai-option-active .ai-option-text {
	color: #63ec13;
	font-weight: 700;
}

/* 按钮按下反馈 */
.ai-option-btn:active {
	transform: scale(0.98);
}

.ai-tips {
	display: flex;
	gap: 16rpx;
	padding: 24rpx;
	background-color: rgba(99, 236, 19, 0.1);
	border-radius: 24rpx;
	/* 确保提示框不拦截点击事件 */
	pointer-events: none;
}

.tips-icon {
	font-size: 28rpx; /* 增大图标 */
}

.tips-text {
	color: #708961;
	font-size: 22rpx; /* 增大字体 */
	flex: 1;
}

.form-submit {
	background-color: #63ec13;
	padding: 32rpx;
	border-radius: 32rpx;
	margin-top: 16rpx; /* 减少 margin，因为按钮现在在 scroll-view 外面 */
	margin-bottom: 0; /* 确保底部贴紧 */
	box-shadow: 0 4px 16px rgba(99, 236, 19, 0.3);
	/* Android 兼容：确保提交按钮可点击 */
	pointer-events: auto;
	position: relative;
	/* 关键修复：固定在底部，不随滚动移动 */
	flex-shrink: 0;
	/* 确保按钮始终可见 */
	align-self: flex-start;
	width: 100%;
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
