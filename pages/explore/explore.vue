<template>
	<view class="explore-container">
		<!-- Android 适配：顶部状态栏占位（预留状态栏高度，避免内容被遮挡） -->
		<view class="status-bar-placeholder" :style="{ height: statusBarHeight + 'px' }"></view>

		<!-- 搜索头部 -->
		<view class="search-header">
			<view class="header-row">
				<text class="header-title">为您推荐</text>
				<button class="refresh-btn" @click="refreshTrendingDestinations" :disabled="isRefreshing">
					<text class="refresh-icon" :class="{ rotating: isRefreshing }">🔄</text>
					<text class="refresh-text">{{ isRefreshing ? '更新中...' : '更新热门' }}</text>
				</button>
			</view>
			<view class="search-box">
				<text class="search-icon">🔍</text>
				<input
					v-model="searchKeyword"
					class="search-input"
					placeholder="搜寻您的下个目的地..."
					placeholder-class="search-placeholder"
					@input="onSearchInput"
					@confirm="handleSearch"
					confirm-type="search"
				/>
				<button v-if="searchKeyword" class="search-clear-btn" @click="clearSearch">
					<text class="clear-icon">✕</text>
				</button>
			</view>
			<!-- 最近搜索 -->
			<view v-if="recentSearches.length > 0 && !searchKeyword" class="recent-searches">
				<text class="recent-title">最近搜索</text>
				<view class="recent-list">
					<text
						v-for="(keyword, index) in recentSearches"
						:key="index"
						class="recent-item"
						@click="applyRecentSearch(keyword)"
					>
						{{ keyword }}
					</text>
					<text class="recent-item clear-recent" @click="clearRecentSearches">
						清空
					</text>
				</view>
			</view>
		</view>

		<!-- 筛选标签 -->
		<scroll-view class="filter-scroll" scroll-x show-scrollbar="false">
			<view class="filter-list">
				<button
					v-for="(filter, index) in filters"
					:key="index"
					class="filter-btn"
					:class="filter.active ? 'filter-btn-active' : ''"
					@click="toggleFilter(index)"
				>
					<text class="filter-text" :class="filter.active ? 'filter-text-active' : ''">
						{{ filter.name }}
					</text>
					<text v-if="filter.active && filter.name !== '全部'" class="filter-close">✕</text>
				</button>
			</view>
		</scroll-view>

		<!-- 结果统计 -->
		<view v-if="!isLoading && filteredDestinations.length > 0" class="result-count">
			<text class="count-text">找到 {{ filteredDestinations.length }} 个目的地</text>
		</view>

		<!-- 瀑布流内容 -->
		<scroll-view class="content-scroll" scroll-y @scrolltolower="loadMore">
			<!-- 加载状态 -->
			<view v-if="isLoading && allDestinations.length === 0" class="loading-container">
				<text class="loading-text">加载中...</text>
			</view>

			<!-- 空状态 -->
			<view v-else-if="filteredDestinations.length === 0" class="empty-state">
				<text class="empty-icon">🔍</text>
				<text class="empty-title">未找到相关目的地</text>
				<text class="empty-subtitle">试试其他关键词，或让 AI 为您推荐</text>
				<view class="empty-actions">
					<button class="empty-action-btn secondary" @click="resetFilters">
						<text class="empty-action-text">重置筛选</text>
					</button>
					<button class="empty-action-btn primary" @click="askAIAboutDestination">
						<text class="empty-action-icon">🤖</text>
						<text class="empty-action-text">询问 AI</text>
					</button>
				</view>
			</view>

			<!-- 目的地列表 -->
			<view v-else class="masonry-grid">
				<view
					v-for="dest in filteredDestinations"
					:key="dest.id"
					class="destination-card"
					@click="handleCardClick(dest)"
				>
					<view class="card-image-wrapper">
						<image
							class="card-image"
							:src="dest.image"
							mode="aspectFill"
							:lazy-load="true"
						/>
						<view
							class="card-favorite"
							:class="dest.isFavorite ? 'favorite-active' : ''"
							@click.stop="toggleFavorite(dest)"
						>
							<text class="favorite-icon">{{ dest.isFavorite ? '❤️' : '🤍' }}</text>
						</view>
						<view v-if="dest.isTopPick" class="card-badge">
							<text class="badge-text">⭐ 首选</text>
						</view>
						<view class="card-tags">
							<text
								v-for="(tag, tagIndex) in dest.tags.slice(0, 2)"
								:key="tagIndex"
								class="tag-item"
							>
								{{ tag }}
							</text>
						</view>
					</view>
					<view class="card-info">
						<text class="card-title">{{ dest.name }}</text>
						<view class="card-location">
							<text class="location-icon">📍</text>
							<text class="location-text">{{ dest.location }}</text>
						</view>
						<view class="card-footer">
							<view class="card-rating">
								<text class="rating-icon">★</text>
								<text class="rating-text">{{ dest.rating }}</text>
							</view>
							<text class="card-desc">{{ dest.description }}</text>
						</view>
					</view>
				</view>
			</view>

			<!-- 加载更多 -->
			<view v-if="isLoading && allDestinations.length > 0" class="load-more">
				<text class="load-more-text">加载更多...</text>
			</view>
		</scroll-view>

		<!-- 浮动操作按钮 -->
		<view class="fab-container">
			<button class="fab-btn" @click="handleGenerateItinerary">
				<text class="fab-icon">✨</text>
				<text class="fab-text">生成旅行行程</text>
			</button>
		</view>
	</view>
</template>

<script>
import { destinationService } from '@/services/destination.js'

// 存储键名常量
const STORAGE_KEY_RECENT_SEARCHES = 'explore_recent_searches'
const MAX_RECENT_SEARCHES = 10

export default {
	data() {
		return {
			searchKeyword: '',
			isLoading: false,
			isRefreshing: false,    // 是否正在刷新热门目的地
			allDestinations: [],      // 所有目的地数据
			filteredDestinations: [], // 筛选后的数据
			recentSearches: [],       // 最近搜索关键词
			filters: [
				{ name: '全部', active: true, type: 'all' },
				{ name: '自然', active: false, type: 'tag' },
				{ name: '城市', active: false, type: 'tag' },
				{ name: '美食', active: false, type: 'tag' },
				{ name: '超值', active: false, type: 'tag' },
				{ name: '宁静海滩', active: false, type: 'tag' },
				{ name: '文化', active: false, type: 'tag' },
				{ name: '只看收藏', active: false, type: 'favorite' }
			],
			// Android 适配：系统信息
			statusBarHeight: 44, // 默认值，会在 onLoad 中更新
			safeAreaInsetBottom: 0, // 底部安全区高度（px）
			tabBarHeight: 60 // TabBar 高度（px）
		}
	},

	computed: {
		// 获取激活的筛选标签（排除"全部"和"只看收藏"）
		activeTagFilters() {
			return this.filters
				.filter(f => f.active && f.type === 'tag')
				.map(f => f.name)
		},

		// 是否只看收藏
		isFavoritesOnly() {
			return this.filters.some(f => f.type === 'favorite' && f.active)
		}
	},

	onLoad() {
		// Android 适配：初始化系统信息
		this.initSystemInfo()
		console.log('探索页面加载')
		this.loadRecentSearches()
		this.loadDestinations()
		// 尝试加载热门目的地（异步，不阻塞页面）
		this.tryLoadTrending()
	},

	onShow() {
		// 页面显示时刷新数据（可能从详情页返回，收藏状态可能变化）
		this.refreshData()
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

				console.log('[Explore] 系统信息:', {
					statusBarHeight: this.statusBarHeight,
					safeAreaInsetBottom: this.safeAreaInsetBottom
				})
			} catch (e) {
				console.error('[Explore] 获取系统信息失败:', e)
			}
		},

		/**
		 * 加载目的地数据
		 */
		loadDestinations() {
			this.isLoading = true
			console.log('开始加载目的地数据...')

			try {
				// 从服务获取数据（优先使用热门目的地）
				this.allDestinations = destinationService.getDestinations(true)
				console.log('加载到目的地数量:', this.allDestinations.length)

				// 应用初始筛选
				this.applyFilters()

			} catch (e) {
				console.error('加载目的地失败:', e)
				uni.showToast({
					title: '加载失败，请重试',
					icon: 'none',
					duration: 2000
				})
			} finally {
				this.isLoading = false
			}
		},

		/**
		 * 尝试加载热门目的地（异步，不阻塞页面）
		 */
		async tryLoadTrending() {
				try {
					console.log('[热门目的地] 尝试加载...')
					const destinations = await destinationService.loadTrendingDestinations(false)

					if (destinations && destinations.length > 0) {
						this.allDestinations = destinations
						this.applyFilters()
						console.log('[热门目的地] 数据已更新，共', destinations.length, '个')

						// 不显示提示，避免打扰用户
						// 如果是从 AI 获取的新数据，才显示提示
						const isAIMock = destinations.some(d => d.id === '1' || d.id === '9')
						if (!isAIMock) {
							uni.showToast({
								title: `已更新热门目的地 (${destinations.length}个)`,
								icon: 'success',
								duration: 1500
							})
						}
					}
				} catch (e) {
					// 静默失败，使用默认数据
					console.log('[热门目的地] 使用默认数据')
				}
			},

			/**
			 * 刷新热门目的地（用户手动触发）
			 */
			async refreshTrendingDestinations() {
				if (this.isRefreshing) {
					return
				}

				this.isRefreshing = true

				try {
					uni.showLoading({
						title: '正在获取热门目的地...',
						mask: true
					})

					const destinations = await destinationService.loadTrendingDestinations(true)

					// 无论成功失败，只要有数据就更新
					if (destinations && destinations.length > 0) {
						this.allDestinations = destinations
						this.applyFilters()

						uni.hideLoading()
						uni.showToast({
							title: `更新成功！${destinations.length}个目的地`,
							icon: 'success',
							duration: 2000
						})
					} else {
						uni.hideLoading()
						uni.showToast({
							title: '获取失败，使用默认数据',
							icon: 'none'
						})
					}
				} catch (e) {
					console.error('[热门目的地] 刷新失败:', e)
					uni.hideLoading()

					// 判断错误类型，给出提示
					if (e.statusCode === -1 || e.message?.includes('Socket closed')) {
						uni.showToast({
							title: '网络连接失败，已使用默认数据',
							icon: 'none',
							duration: 2000
						})
					} else {
						uni.showToast({
							title: '获取失败，请稍后重试',
							icon: 'none',
							duration: 2000
						})
					}

					// 即使失败，也尝试加载默认数据
					try {
						const mockData = destinationService.getDestinations(false)
						this.allDestinations = mockData
						this.applyFilters()
					} catch (updateError) {
						console.error('[热门目的地] 更新UI失败:', updateError)
					}
				} finally {
					this.isRefreshing = false
				}
			},

		/**
		 * 刷新数据
		 */
		refreshData() {
			try {
				this.allDestinations = destinationService.getDestinations()
				this.applyFilters()
			} catch (e) {
				console.error('刷新数据失败:', e)
			}
		},

		/**
		 * 应用搜索和筛选
		 */
		applyFilters() {
			const keyword = this.searchKeyword.trim()
			const activeTags = this.activeTagFilters
			const favoritesOnly = this.isFavoritesOnly

			console.log('=== 开始应用筛选 ===')
			console.log('搜索词:', keyword)
			console.log('筛选标签:', activeTags)
			console.log('只看收藏:', favoritesOnly)
			console.log('原始数据数量:', this.allDestinations.length)

			// 步骤1: 先获取基础数据
			let results = [...this.allDestinations]
			console.log('步骤1: 基础数据数量:', results.length)

			// 步骤2: 如果是"全部"标签且没有其他筛选，显示所有
			const isAllActive = this.filters.some(f => f.type === 'all' && f.active)
			const hasTagFilter = activeTags.length > 0

			// 步骤3: 应用标签筛选
			if (!isAllActive && hasTagFilter) {
				const beforeTagFilter = results.length
				results = results.filter(dest => {
					return activeTags.some(tag => dest.tags.includes(tag))
				})
				console.log('步骤3: 标签筛选后数量:', results.length, '(过滤掉', beforeTagFilter - results.length, '个)')
			} else {
				console.log('步骤3: 跳过标签筛选 (isAllActive:', isAllActive, ', hasTagFilter:', hasTagFilter, ')')
			}

			// 步骤4: 应用收藏筛选
			if (favoritesOnly) {
				const beforeFavoriteFilter = results.length
				results = results.filter(dest => dest.isFavorite)
				console.log('步骤4: 收藏筛选后数量:', results.length, '(过滤掉', beforeFavoriteFilter - results.length, '个)')
			} else {
				console.log('步骤4: 跳过收藏筛选')
			}

			// 步骤5: 应用搜索关键词
			if (keyword) {
				const beforeSearch = results.length
				const lowerKeyword = keyword.toLowerCase()
				console.log('步骤5: 开始搜索关键词 "', lowerKeyword, '"')

				results = results.filter(dest => {
					const nameMatch = dest.name.toLowerCase().includes(lowerKeyword)
					const locationMatch = dest.location.toLowerCase().includes(lowerKeyword)
					const tagsMatch = dest.tags.some(tag =>
						tag.toLowerCase().includes(lowerKeyword)
					)

					// 打印匹配详情
					if (nameMatch || locationMatch || tagsMatch) {
						console.log('  匹配:', dest.name, '- name:', nameMatch, 'location:', locationMatch, 'tags:', tagsMatch)
					}

					return nameMatch || locationMatch || tagsMatch
				})
				console.log('步骤5: 搜索后数量:', results.length, '(过滤掉', beforeSearch - results.length, '个)')
			} else {
				console.log('步骤5: 跳过关键词搜索 (无搜索词)')
			}

			// 使用 Vue 3 的方式确保响应式更新
			this.filteredDestinations = []

			// 使用 nextTick 确保 DOM 更新
			this.$nextTick(() => {
				this.filteredDestinations = results
				console.log('=== 筛选完成，最终结果数量:', this.filteredDestinations.length, '===')

				// 打印结果列表详情（调试用）
				if (this.filteredDestinations.length > 0) {
					console.log('结果列表:', this.filteredDestinations.map(d => d.name).join(', '))
				} else {
					console.log('结果列表: 空 (应显示空状态)')
				}
			})
		},

		/**
		 * 搜索输入事件（实时搜索）
		 * 注意：由于 v-model 已双向绑定，使用 setTimeout 确保 DOM 更新后再执行筛选
		 */
		onSearchInput(e) {
			// 获取输入值（v-model 会自动更新 searchKeyword）
			const inputValue = e.detail.value
			console.log('搜索输入事件触发:', inputValue)

			// 使用 setTimeout 确保 v-model 双向绑定完成后再执行筛选
			setTimeout(() => {
				this.applyFilters()
			}, 10)
		},

		/**
		 * 搜索确认事件
		 */
		handleSearch() {
			console.log('确认搜索:', this.searchKeyword)
			const keyword = this.searchKeyword.trim()
			if (keyword) {
				this.saveRecentSearch(keyword)
			}
			this.applyFilters()
			uni.hideKeyboard()
		},

		/**
		 * 清空搜索
		 */
		clearSearch() {
			console.log('清空搜索')
			this.searchKeyword = ''
			this.applyFilters()
		},

		/**
		 * 切换筛选标签
		 */
		toggleFilter(index) {
			const clickedFilter = this.filters[index]
			const previousState = clickedFilter.active

			// 处理"全部"标签：点击时取消其他所有标签
			if (clickedFilter.type === 'all') {
				if (!previousState) {
					// 激活"全部"，取消其他所有标签
					this.filters.forEach(f => f.active = false)
					clickedFilter.active = true
				}
				// 如果"全部"已激活，再次点击不做任何事（保持激活状态）
			}
			// 处理其他标签：点击时取消"全部"
			else {
				// 取消"全部"标签
				const allFilter = this.filters.find(f => f.type === 'all')
				if (allFilter) {
					allFilter.active = false
				}

				// 切换当前标签状态
				clickedFilter.active = !previousState

				// 如果没有激活的标签了，重新激活"全部"
				const hasActiveFilter = this.filters.some(f => f.active)
				if (!hasActiveFilter && allFilter) {
					allFilter.active = true
				}
			}

			console.log('切换筛选:', clickedFilter.name, '->', clickedFilter.active)
			this.applyFilters()
		},

		/**
		 * 重置所有筛选
		 */
		resetFilters() {
			console.log('重置筛选')
			this.searchKeyword = ''
			this.filters.forEach(f => {
				if (f.type === 'all') {
					f.active = true
				} else {
					f.active = false
				}
			})
			this.applyFilters()
		},

		/**
		 * 询问 AI 关于搜索的目的地
		 */
		askAIAboutDestination() {
			const keyword = this.searchKeyword.trim()
			const prompt = keyword
				? `我想了解关于${keyword}的旅行信息，请帮我推荐相关的目的地和行程安排`
				: '请为我推荐一些值得去的旅行目的地'

			// 跳转到聊天页面，携带 prompt
			uni.navigateTo({
				url: `/pages/chat/chat?prompt=${encodeURIComponent(prompt)}`
			})
		},

		/**
		 * 切换收藏状态
		 */
		toggleFavorite(dest) {
			console.log('切换收藏:', dest.name, '当前状态:', dest.isFavorite)

			const updated = destinationService.toggleFavorite(dest.id)
			if (updated) {
				// 更新本地数据
				const index = this.allDestinations.findIndex(d => d.id === dest.id)
				if (index !== -1) {
					this.allDestinations[index].isFavorite = updated.isFavorite
				}

				// 更新筛选后数据
				const filteredIndex = this.filteredDestinations.findIndex(d => d.id === dest.id)
				if (filteredIndex !== -1) {
					this.filteredDestinations[filteredIndex].isFavorite = updated.isFavorite
				}

				// 如果当前是"只看收藏"模式，重新应用筛选
				if (this.isFavoritesOnly) {
					this.applyFilters()
				}

				// 显示提示
				uni.showToast({
					title: updated.isFavorite ? '已添加到收藏' : '已取消收藏',
					icon: 'none',
					duration: 1500
				})
			} else {
				uni.showToast({
					title: '操作失败',
					icon: 'none'
				})
			}
		},

		/**
		 * 点击目的地卡片
		 */
		handleCardClick(dest) {
			console.log('点击目的地:', dest.name)
			// 跳转到详情页
			uni.navigateTo({
				url: `/pages/destination/destination?id=${dest.id}`
			})
		},

		/**
		 * 加载更多（分页）
		 */
		loadMore() {
			console.log('加载更多')
			// TODO: 实现分页加载
		},

		/**
		 * 生成旅行行程
		 */
		handleGenerateItinerary() {
			// 获取当前筛选的目的地数量
			const count = this.filteredDestinations.length

			if (count === 0) {
				uni.showToast({
					title: '请先选择目的地',
					icon: 'none'
				})
				return
			}

			// 构建筛选条件描述
			const conditions = []
			if (this.searchKeyword) {
				conditions.push(`搜索"${this.searchKeyword}"`)
			}
			if (this.activeTagFilters.length > 0) {
				conditions.push(`筛选${this.activeTagFilters.join('、')}`)
			}
			if (this.isFavoritesOnly) {
				conditions.push('收藏的目的地')
			}

			const conditionText = conditions.length > 0 ? conditions.join('，') : '全部目的地'
			const destinationNames = this.filteredDestinations.map(d => d.name).join('、')

			uni.showModal({
				title: '生成行程',
				content: `基于当前 ${count} 个目的地（${conditionText}）生成行程计划？`,
				confirmText: '生成',
				cancelText: '取消',
				success: (res) => {
					if (res.confirm) {
						// 跳转到聊天页面，携带详细的行程生成意图
						const prompt = `请帮我规划一个旅行行程，目的地包括：${destinationNames}。${this.activeTagFilters.length > 0 ? `我偏好${this.activeTagFilters.join('、')}类型的目的地。` : ''}`
						uni.navigateTo({
							url: `/pages/chat/chat?prompt=${encodeURIComponent(prompt)}&intent=generate_itinerary`
						})
					}
				}
			})
		},

		// ==================== 最近搜索相关方法 ====================

		/**
		 * 加载最近搜索记录
		 */
		loadRecentSearches() {
			try {
				const stored = uni.getStorageSync(STORAGE_KEY_RECENT_SEARCHES)
				if (stored && Array.isArray(stored)) {
					this.recentSearches = stored
				}
			} catch (e) {
				console.error('加载最近搜索失败:', e)
			}
		},

		/**
		 * 保存最近搜索记录
		 */
		saveRecentSearch(keyword) {
			try {
				// 去重：先删除已存在的相同关键词
				const index = this.recentSearches.indexOf(keyword)
				if (index !== -1) {
					this.recentSearches.splice(index, 1)
				}

				// 添加到开头
				this.recentSearches.unshift(keyword)

				// 限制最大数量
				if (this.recentSearches.length > MAX_RECENT_SEARCHES) {
					this.recentSearches = this.recentSearches.slice(0, MAX_RECENT_SEARCHES)
				}

				// 保存到本地存储
				uni.setStorageSync(STORAGE_KEY_RECENT_SEARCHES, this.recentSearches)
			} catch (e) {
				console.error('保存最近搜索失败:', e)
			}
		},

		/**
		 * 应用最近搜索
		 */
		applyRecentSearch(keyword) {
			this.searchKeyword = keyword
			this.applyFilters()
		},

		/**
		 * 清空最近搜索记录
		 */
		clearRecentSearches() {
			uni.showModal({
				title: '清空搜索历史',
				content: '确定要清空所有搜索历史吗？',
				confirmText: '清空',
				cancelText: '取消',
				success: (res) => {
					if (res.confirm) {
						this.recentSearches = []
						try {
							uni.removeStorageSync(STORAGE_KEY_RECENT_SEARCHES)
							uni.showToast({
								title: '已清空',
								icon: 'success',
								duration: 1500
							})
						} catch (e) {
							console.error('清空最近搜索失败:', e)
						}
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
 * 解决: 添加 status-bar-placeholder 动态占位，移除硬编码的 padding-top
 *
 * 问题3: 底部内容被 TabBar + 虚拟按键/安全区遮挡
 * 解决: 使用 CSS calc() 计算 TabBar 高度(60px) + 安全区
 * =============================================================== */

.explore-container {
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
	/* 高度由 JavaScript 动态设置（uni.getSystemInfoSync().statusBarHeight） */
}

/* 搜索头部 */
.search-header {
	padding: 48rpx;
	/* Android 适配: 移除硬编码的 padding-top: 100rpx，状态栏占位已处理 */
	background-color: #ffffff;
	border-bottom: 1rpx solid rgba(0, 0, 0, 0.05);
}

.header-row {
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 32rpx;
}

.header-title {
	color: #131811;
	font-size: 48rpx;
	font-weight: 800;
	letter-spacing: -0.02em;
}

.refresh-btn {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 16rpx 24rpx;
	background-color: rgba(99, 236, 19, 0.1);
	border-radius: 50rpx;
	border: none;
	transition: all 0.3s;
}

.refresh-btn:active {
	transform: scale(0.95);
}

.refresh-btn[disabled] {
	opacity: 0.6;
}

.refresh-icon {
	font-size: 28rpx;
	transition: transform 0.5s;
}

.refresh-icon.rotating {
	animation: rotate 1s linear infinite;
}

@keyframes rotate {
	from {
		transform: rotate(0deg);
	}
	to {
		transform: rotate(360deg);
	}
}

.refresh-text {
	color: #63ec13;
	font-size: 24rpx;
	font-weight: 600;
}

.search-box {
	position: relative;
	display: flex;
	align-items: center;
}

.search-icon {
	position: absolute;
	left: 32rpx;
	top: 50%;
	transform: translateY(-50%);
	font-size: 32rpx;
	z-index: 1;
	pointer-events: none;
}

.search-input {
	width: 100%;
	height: 88rpx;
	padding: 0 80rpx;
	background-color: #f8f8f8;
	border-radius: 50rpx;
	font-size: 28rpx;
	color: #131811;
	border: 2rpx solid transparent;
	transition: all 0.3s;
}

.search-input:focus {
	background-color: #ffffff;
	border-color: #63ec13;
}

.search-placeholder {
	color: #999999;
}

.search-clear-btn {
	position: absolute;
	right: 16rpx;
	top: 50%;
	transform: translateY(-50%);
	width: 48rpx;
	height: 48rpx;
	background-color: rgba(0, 0, 0, 0.1);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 0;
	border: none;
}

.clear-icon {
	font-size: 24rpx;
	color: #666666;
}

/* 最近搜索 */
.recent-searches {
	margin-top: 24rpx;
}

.recent-title {
	color: #999999;
	font-size: 24rpx;
	display: block;
	margin-bottom: 16rpx;
}

.recent-list {
	display: flex;
	flex-wrap: wrap;
	gap: 12rpx;
}

.recent-item {
	display: inline-block;
	padding: 12rpx 24rpx;
	background-color: #f8f8f8;
	border-radius: 50rpx;
	color: #708961;
	font-size: 24rpx;
	transition: all 0.2s;
}

.recent-item:active {
	background-color: #e8e8e8;
	transform: scale(0.95);
}

.recent-item.clear-recent {
	color: #999999;
	background-color: transparent;
	padding: 12rpx 16rpx;
}

/* 筛选标签 */
.filter-scroll {
	white-space: nowrap;
	padding: 24rpx 48rpx;
	background-color: #ffffff;
}

.filter-list {
	display: inline-flex;
	gap: 16rpx;
}

.filter-btn {
	display: flex;
	align-items: center;
	gap: 8rpx;
	height: 64rpx;
	padding: 0 28rpx;
	background-color: #ffffff;
	border: 2rpx solid rgba(0, 0, 0, 0.1);
	border-radius: 50rpx;
	flex-shrink: 0;
	transition: all 0.3s;
}

.filter-btn:active {
	transform: scale(0.95);
}

.filter-btn-active {
	background-color: rgba(99, 236, 19, 0.15);
	border-color: #63ec13;
}

.filter-text {
	color: #131811;
	font-size: 26rpx;
	font-weight: 500;
}

.filter-text-active {
	color: #425736;
	font-weight: 700;
}

.filter-close {
	font-size: 20rpx;
	color: #425736;
	font-weight: bold;
}

/* 结果统计 */
.result-count {
	padding: 16rpx 48rpx;
	background-color: #f7f8f6;
}

.count-text {
	color: #708961;
	font-size: 24rpx;
	display: block;
}

/* 内容区域 */
.content-scroll {
	flex: 1;
	height: 100%;
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
	padding: 200rpx 48rpx;
	text-align: center;
}

.empty-icon {
	font-size: 120rpx;
	margin-bottom: 32rpx;
	opacity: 0.4;
	display: block;
}

.empty-title {
	color: #131811;
	font-size: 32rpx;
	font-weight: 600;
	display: block;
	margin-bottom: 16rpx;
}

.empty-subtitle {
	color: #999999;
	font-size: 26rpx;
	display: block;
	margin-bottom: 48rpx;
}

.empty-actions {
	display: flex;
	gap: 16rpx;
}

.empty-action-btn {
	display: flex;
	align-items: center;
	gap: 8rpx;
	padding: 20rpx 32rpx;
	border-radius: 50rpx;
	border: none;
}

.empty-action-btn.secondary {
	background-color: #f0f0f0;
}

.empty-action-btn.primary {
	background-color: #63ec13;
}

.empty-action-icon {
	font-size: 28rpx;
}

.empty-action-text {
	color: #131811;
	font-size: 26rpx;
	font-weight: 600;
}

/* 瀑布流网格 */
.masonry-grid {
	display: flex;
	flex-wrap: wrap;
	gap: 24rpx;
	padding: 32rpx 48rpx;
	/* Android 适配: 底部预留额外空间，确保最后一行不被 TabBar 遮挡 */
	padding-bottom: calc(120rpx + constant(safe-area-inset-bottom));
	padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.destination-card {
	width: calc(50% - 12rpx);
	background-color: #ffffff;
	border-radius: 24rpx;
	overflow: hidden;
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
	border: 1rpx solid rgba(0, 0, 0, 0.05);
	transition: all 0.3s;
}

.destination-card:active {
	transform: translateY(-4rpx);
	box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-image-wrapper {
	position: relative;
	width: 100%;
}

.card-image {
	width: 100%;
	height: 220rpx;
	display: block;
}

.card-favorite {
	position: absolute;
	top: 12rpx;
	right: 12rpx;
	display: flex;
	align-items: center;
	justify-content: center;
	width: 56rpx;
	height: 56rpx;
	background-color: rgba(255, 255, 255, 0.9);
	backdrop-filter: blur(20rpx);
	border-radius: 50%;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	transition: all 0.3s;
}

.card-favorite:active {
	transform: scale(0.9);
}

.favorite-active {
	background-color: rgba(255, 255, 255, 1);
}

.favorite-icon {
	font-size: 28rpx;
	transition: transform 0.3s;
}

.card-favorite:active .favorite-icon {
	transform: scale(1.2);
}

.card-badge {
	position: absolute;
	bottom: 12rpx;
	left: 12rpx;
	background: linear-gradient(135deg, #63ec13, #4db80e);
	padding: 8rpx 16rpx;
	border-radius: 20rpx;
	box-shadow: 0 2px 8px rgba(99, 236, 19, 0.3);
}

.badge-text {
	color: #131811;
	font-size: 18rpx;
	font-weight: 700;
}

.card-tags {
	position: absolute;
	top: 12rpx;
	left: 12rpx;
	display: flex;
	gap: 8rpx;
}

.tag-item {
	background-color: rgba(0, 0, 0, 0.5);
	color: #ffffff;
	font-size: 18rpx;
	padding: 6rpx 12rpx;
	border-radius: 12rpx;
	backdrop-filter: blur(10rpx);
}

.card-info {
	padding: 20rpx;
}

.card-title {
	color: #131811;
	font-size: 28rpx;
	font-weight: 700;
	margin-bottom: 8rpx;
	display: block;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.card-location {
	display: flex;
	align-items: center;
	gap: 6rpx;
	margin-bottom: 12rpx;
}

.location-icon {
	font-size: 22rpx;
	color: #999999;
}

.location-text {
	color: #999999;
	font-size: 22rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.card-footer {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12rpx;
}

.card-rating {
	display: flex;
	align-items: center;
	gap: 4rpx;
	flex-shrink: 0;
}

.rating-icon {
	font-size: 24rpx;
	color: #63ec13;
}

.rating-text {
	color: #131811;
	font-size: 24rpx;
	font-weight: 700;
}

.card-desc {
	flex: 1;
	color: #708961;
	font-size: 20rpx;
	line-height: 1.4;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

/* 加载更多 */
.load-more {
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 32rpx;
}

.load-more-text {
	color: #999999;
	font-size: 24rpx;
}

/* 浮动操作按钮 */
.fab-container {
	position: fixed;
	/* Android 适配: bottom = TabBar(60px = 120rpx) + 额外间距(100rpx) + 安全区 */
	bottom: calc(220rpx + constant(safe-area-inset-bottom));
	bottom: calc(220rpx + env(safe-area-inset-bottom));
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	padding: 0 32rpx;
	pointer-events: none;
	z-index: 100;
}

.fab-btn {
	pointer-events: auto;
	display: flex;
	align-items: center;
	gap: 12rpx;
	padding: 0 40rpx;
	height: 96rpx;
	background: linear-gradient(135deg, #FBF6D9, #F5EDC0);
	border: 2rpx solid rgba(255, 235, 153, 0.5);
	border-radius: 50rpx;
	box-shadow: 0 8px 32px rgba(251, 246, 217, 0.5);
	transition: all 0.3s;
}

.fab-btn:active {
	transform: scale(0.95);
	box-shadow: 0 4px 16px rgba(251, 246, 217, 0.3);
}

.fab-icon {
	font-size: 32rpx;
}

.fab-text {
	color: #131811;
	font-size: 26rpx;
	font-weight: 700;
}
</style>
