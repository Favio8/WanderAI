# WanderAI 漫游奇点 - 开发文档

> 项目版本: v1.1.0 | 更新时间: 2025-01-21

---

## 目录

- [一、项目概述](#一项目概述)
- [二、技术栈](#二技术栈)
- [三、项目结构](#三项目结构)
- [四、页面功能状态](#四页面功能状态)
- [五、Android App 布局适配](#五android-app-布局适配)
- [六、开发步骤计划](#六开发步骤计划)
- [七、DeepSeek API 集成指南](#七deepseek-api-集成指南)
- [八、样式规范](#八样式规范)
- [九、开发检查清单](#九开发检查清单)

---

## 一、项目概述

### 基本信息

| 项目 | 说明 |
|------|------|
| 项目名称 | 漫游奇点 (WanderAI) |
| AppID | `__UNI__F0B9432` |
| 版本号 | v1.1.0 (versionCode: 110) |
| 描述 | 您的智能旅行伴侣 |
| 框架 | uni-app (Vue 3) |
| 编译平台 | H5 / 小程序 / Android App |

### 功能定位

AI 驱动的智能旅行助手应用，提供：
- AI 对话式旅行规划
- 目的地探索推荐
- 智能相册管理
- 行程计划管理
- 个人旅行足迹
- 收藏和订单管理

---

## 二、技术栈

| 技术 | 版本/说明 |
|------|-----------|
| 前端框架 | uni-app (Vue 3) |
| 样式预处理 | SCSS |
| AI 模型 | DeepSeek API |
| 存储 | uni.storage 本地存储 |
| 开发工具 | HBuilderX 4.87 |
| 编译目标 | H5 / 微信小程序 / Android App |

---

## 三、项目结构

```
WanderAI/
├── App.vue                    # 应用入口，全局样式，安全区适配
├── main.js                    # 主入口文件
├── manifest.json             # 应用配置清单
├── pages.json                # 页面路由配置（全部自定义导航）
├── uni.scss                  # 全局样式变量和工具类
│
├── pages/                    # 页面目录
│   ├── splash/splash.vue         # 启动页 ✅
│   │
│   ├── chat/chat.vue             # AI聊天向导页 ✅
│   ├── explore/explore.vue       # 探索推荐页 ✅
│   ├── itinerary/itinerary.vue   # 行程计划页 ✅
│   ├── album/album.vue           # 智能相册页 ✅
│   ├── profile/profile.vue       # 个人中心页 ✅
│   │
│   ├── settings/settings.vue     # 设置页 ✅
│   ├── favorites/favorites.vue   # 我的收藏页 ✅
│   ├── orders/orders.vue         # 我的订单页 ✅
│   ├── destination/destination.vue # 目的地详情页 ✅
│   └── album/memory-detail.vue   # 回忆详情页 ✅
│
├── static/                   # 静态资源
│   ├── tabbar/               # 底部导航图标
│   └── logo/                 # Logo 资源
│
├── components/               # 公共组件
├── utils/                    # 工具函数
│   ├── storage.js            # 本地存储封装 ✅
│   └── markdown.js           # Markdown 渲染工具 ✅
│
├── api/                      # API 接口
│   └── deepseek.js           # DeepSeek API ✅
│
├── config/                   # 配置文件
│   └── deepseek.js           # DeepSeek 配置 ✅
│
└── services/                 # 服务层
    ├── theme.js              # 主题服务 ✅
    ├── destination.js        # 目的地服务 ✅
    └── album.js              # 相册服务 ✅
```

**图例**: ✅ 已完成 | 🟡 部分完成 | ⏳ 待开发 | 🟢 功能较完整

---

## 四、页面功能状态

### 4.1 启动页 (splash) ✅

**路径**: `pages/splash/splash.vue`

**已实现功能**:
- 应用 Logo 和品牌展示
- 2.5 秒后自动跳转到聊天页
- 脉冲和弹跳动画效果
- 防止重复跳转逻辑

**状态**: 完成，无需修改

---

### 4.2 AI 聊天向导页 (chat) ✅

**路径**: `pages/chat/chat.vue`

**已实现功能**:
- 聊天界面 UI
- 消息气泡样式（用户/AI 区分）
- 输入框和发送按钮
- 消息滚动功能
- DeepSeek API 真实调用
- 消息持久化存储
- 上下文对话管理
- Markdown 渲染（简单版）
- 清空历史功能
- Android 布局适配（状态栏、TabBar、安全区）

**状态**: 功能完整

---

### 4.3 探索推荐页 (explore) ✅

**路径**: `pages/explore/explore.vue`

**已实现功能**:
- 搜索框 UI
- 筛选标签（横向滚动）
- 推荐目的地卡片
- "生成旅行行程"浮动按钮
- 实际搜索功能
- 筛选逻辑实现
- 目的地详情页导航
- 收藏功能
- 热门目的地（AI 生成/缓存）
- 最近搜索记录
- Android 布局适配

**状态**: 功能完整

---

### 4.4 智能相册页 (album) ✅

**路径**: `pages/album/album.vue`

**已实现功能**:
- 精彩回忆横向滚动卡片
- 照片网格布局
- "一键生成旅行札记"按钮
- 照片真实数据加载
- 回忆详情查看
- 照片上传/管理
- 创建新回忆
- 添加照片到回忆
- Android 布局适配

**状态**: 功能完整

---

### 4.5 个人中心页 (profile) ✅

**路径**: `pages/profile/profile.vue`

**已实现功能**:
- 用户信息展示（头像、名称、等级）
- 统计卡片（国家数、旅行天数）
- 账户菜单（收藏、订单、设置）
- 用户数据持久化
- 菜单功能页面导航
- 用户编辑功能
- Android 布局适配

**状态**: 功能完整

---

### 4.6 行程计划页 (itinerary) ✅

**路径**: `pages/itinerary/itinerary.vue`

**已实现功能**:
- 视图切换（时间轴/日历）
- 日期选择器（横向滚动）
- 时间轴行程展示
- 添加/编辑/删除行程
- AI 建议标记和接受/拒绝功能
- 本地存储持久化
- 日历视图实现
- AI 生成行程（调用 DeepSeek）
- Android 兼容修复（backdrop-filter）
- Android 布局适配（含滚动修复）
- Android 输入框尺寸和焦点修复

**状态**: 功能完整

---

### 4.7 设置页 (settings) ✅

**路径**: `pages/settings/settings.vue`

**已实现功能**:
- 主题模式切换（浅色/深色/跟随系统）
- AI 回复风格设置
- 札记生成风格设置
- 通知设置
- 隐私模式设置
- 清除缓存/数据
- 关于我们
- Android 布局适配

**状态**: 功能完整

---

### 4.8 我的收藏页 (favorites) ✅

**路径**: `pages/favorites/favorites.vue`

**已实现功能**:
- 收藏列表展示
- 取消收藏功能
- 跳转到目的地详情
- 空状态处理
- Android 布局适配

**状态**: 功能完整

---

### 4.9 我的订单页 (orders) ✅

**路径**: `pages/orders/orders.vue`

**已实现功能**:
- 订单列表展示
- 订单状态筛选
- 订单详情查看
- 空状态处理
- Android 布局适配

**状态**: 功能完整

---

### 4.10 目的地详情页 (destination) ✅

**路径**: `pages/destination/destination.vue`

**已实现功能**:
- 目的地详细信息展示
- 图片轮播
- 收藏功能
- 询问 AI 按钮
- 跳转到聊天页
- 加载状态
- Android 布局适配

**状态**: 功能完整

---

### 4.11 回忆详情页 (memory-detail) ✅

**路径**: `pages/album/memory-detail.vue`

**已实现功能**:
- 回忆详细信息展示
- 照片网格展示
- 备注/札记显示
- 添加照片
- 删除照片
- Android 布局适配

**状态**: 功能完整

---

## 五、Android App 布局适配

### 5.1 适配背景

在 HBuilderX 编译 Android App 时，出现以下布局问题：
- 页面整体偏移
- 顶部被状态栏遮挡
- 底部被虚拟导航键/安全区遮挡
- 滚动区域高度错误
- TabBar/导航栏与内容重叠

### 5.2 核心问题

| 问题 | 原因 | 解决方案 |
|------|------|----------|
| 100vh 计算错误 | Android WebView 包含浏览器 UI 高度 | 改用 `height: 100%` + flex 布局 |
| 顶部被状态栏遮挡 | 自定义导航栏未预留状态栏高度 | 添加动态状态栏占位元素 |
| 底部被 TabBar 遮挡 | TabBar 页面未预留 TabBar 高度 | 添加 `calc(120rpx + 安全区)` |
| 底部被虚拟按键遮挡 | 未处理安全区域 | 使用 `env(safe-area-inset-bottom)` |
| scroll-view 无法滚动 | flex: 1 缺少高度约束 | 添加 `height: 0` + `min-height: 0` |
| 输入框无法聚焦 | backdrop-filter 导致 z-index 异常 | Android 平台禁用 backdrop-filter |
| 输入框太小/无光标 | padding 和 font-size 过小 | 增大至 28rpx/30rpx，添加 min-height |

### 5.3 适配方案

#### 5.3.1 模板修改

每个页面添加状态栏占位：

```vue
<template>
  <view class="page-container">
    <!-- Android 适配：顶部状态栏占位 -->
    <view class="status-bar-placeholder" :style="{ height: statusBarHeight + 'px' }"></view>

    <!-- 页面内容 -->
    ...
  </view>
</template>
```

#### 5.3.2 脚本修改

```javascript
export default {
  data() {
    return {
      // Android 适配：系统信息
      statusBarHeight: 44,        // 状态栏高度
      safeAreaInsetBottom: 0,     // 底部安全区高度
      tabBarHeight: 60            // TabBar 高度（仅 TabBar 页面）
    }
  },

  onLoad() {
    // Android 适配：初始化系统信息
    this.initSystemInfo()
    // ... 其他初始化代码
  },

  methods: {
    /**
     * Android 适配：初始化系统信息
     */
    initSystemInfo() {
      const systemInfo = uni.getSystemInfoSync()
      this.statusBarHeight = systemInfo.statusBarHeight || 44
      this.safeAreaInsetBottom = systemInfo.screenHeight -
        (systemInfo.safeArea?.bottom || systemInfo.screenHeight)
    }
  }
}
```

#### 5.3.3 样式修改

```scss
/* 页面容器 */
.page-container {
  display: flex;
  flex-direction: column;
  /* Android 适配: 使用 100% 替代 100vh */
  height: 100%;
  background-color: #f7f8f6;
}

/* 状态栏占位 */
.status-bar-placeholder {
  width: 100%;
  flex-shrink: 0;
}

/* 头部导航 */
.header {
  /* Android 适配: 移除 sticky 定位 */
  position: relative;
  z-index: 50;
  flex-shrink: 0;  /* 防止被压缩 */
}

/* 滚动容器 */
.content-scroll {
  flex: 1;
  /* uni-app scroll-view 滚动修复 */
  min-height: 0;
  height: 0;
}

/* TabBar 页面底部适配 */
.tabbar-page .content-area {
  padding-bottom: calc(120rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

/* 非 TabBar 页面底部适配 */
.normal-page .content-area {
  padding-bottom: calc(240rpx + constant(safe-area-inset-bottom));
  padding-bottom: calc(240rpx + env(safe-area-inset-bottom));
}
```

### 5.4 已适配页面清单

#### TabBar 页面（5 个）
| 页面 | 文件 | 状态 |
|------|------|------|
| 首页聊天 | pages/chat/chat.vue | ✅ |
| 探索 | pages/explore/explore.vue | ✅ |
| 行程 | pages/itinerary/itinerary.vue | ✅ |
| 相册 | pages/album/album.vue | ✅ |
| 个人中心 | pages/profile/profile.vue | ✅ |

#### 非 TabBar 页面（5 个）
| 页面 | 文件 | 状态 |
|------|------|------|
| 设置 | pages/settings/settings.vue | ✅ |
| 收藏 | pages/favorites/favorites.vue | ✅ |
| 订单 | pages/orders/orders.vue | ✅ |
| 目的地详情 | pages/destination/destination.vue | ✅ |
| 回忆详情 | pages/album/memory-detail.vue | ✅ |

### 5.5 特殊修复记录

#### 行程页输入框问题（已解决）

**问题**：
- 输入框无法点击/聚焦
- 输入框太小，光标和文字不显示

**解决方案**：
1. 移除 `@click.stop` 阻止默认行为
2. 增加输入框尺寸：padding 28rpx、font-size 30rpx、min-height 88rpx
3. 添加焦点状态样式
4. Android 平台禁用 `backdrop-filter`

**代码位置**：`pages/itinerary/itinerary.vue:390-480`

#### 行程页滚动问题（已解决）

**问题**：页面无法正常滚动

**解决方案**：
1. Header 添加 `flex-shrink: 0`
2. Scroll-view 添加 `height: 0` + `min-height: 0`

**代码位置**：`pages/itinerary/itinerary.vue:1523-1530`

### 5.6 自测清单

- [ ] 所有页面顶部不被状态栏遮挡
- [ ] TabBar 页面底部不被 TabBar 遮挡
- [ ] 非 TabBar 页面底部不被虚拟按键遮挡
- [ ] 所有页面可以正常滚动
- [ ] 行程页输入框可以正常点击和输入
- [ ] 全面屏手势导航页面适配正常
- [ ] 控制台无报错

---

## 六、开发步骤计划

### 阶段一：基础设施搭建（第 1-2 周）

#### Step 1.1 - 创建项目架构

创建以下目录结构：

```
├── components/           # 公共组件
│   └── README.md        # 组件使用说明
├── utils/               # 工具函数
│   ├── storage.js      # 本地存储封装
│   ├── request.js      # 网络请求封装
│   └── helpers.js      # 辅助函数
├── api/                 # API 接口
│   └── deepseek.js     # DeepSeek API
└── services/            # 服务层
    └── chat.js         # 聊天服务
```

#### Step 1.2 - 本地存储封装

**文件**: `utils/storage.js`

```javascript
/**
 * 本地存储封装
 */
export const storage = {
  get(key) {
    return uni.getStorageSync(key)
  },

  set(key, value) {
    uni.setStorageSync(key, value)
  },

  remove(key) {
    uni.removeStorageSync(key)
  },

  clear() {
    uni.clearStorageSync()
  }
}
```

#### Step 1.3 - 网络请求封装

**文件**: `utils/request.js`

```javascript
/**
 * 网络请求封装
 */
export function request(options) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: reject
    })
  })
}
```

---

### 阶段二：DeepSeek API 集成（第 3-4 周）

#### Step 2.1 - 创建 DeepSeek API 服务

**文件**: `api/deepseek.js`

```javascript
import { request } from '@/utils/request.js'

// DeepSeek API 配置
const DEEPSEEK_CONFIG = {
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: 'YOUR_API_KEY', // 替换为你的 API Key
  model: 'deepseek-chat'
}

/**
 * DeepSeek API 聊天接口
 * @param {Array} messages - 消息数组
 * @param {Object} options - 可选参数
 */
export function chat(messages, options = {}) {
  return request({
    url: `${DEEPSEEK_CONFIG.baseURL}/chat/completions`,
    method: 'POST',
    header: {
      'Authorization': `Bearer ${DEEPSEEK_CONFIG.apiKey}`
    },
    data: {
      model: options.model || DEEPSEEK_CONFIG.model,
      messages: messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.max_tokens || 2000,
      stream: options.stream || false
    }
  })
}

/**
 * 发送旅行咨询消息
 * @param {String} content - 用户消息内容
 * @param {Array} history - 对话历史
 */
export function sendTravelMessage(content, history = []) {
  const systemPrompt = {
    role: 'system',
    content: '你是漫游奇点的 AI 旅行向导，专门帮助用户规划旅行、推荐目的地、提供旅行建议。请用友好、专业的语气回复。'
  }

  const messages = [
    systemPrompt,
    ...history,
    { role: 'user', content }
  ]

  return chat(messages)
}
```

#### Step 2.2 - 完善 Chat 页面

**修改文件**: `pages/chat/chat.vue`

```javascript
import { sendTravelMessage } from '@/api/deepseek.js'
import { storage } from '@/utils/storage.js'

export default {
  data() {
    return {
      messages: [],
      inputValue: '',
      isTyping: false,
      chatHistory: [] // 对话历史
    }
  },

  onLoad() {
    // 加载历史记录
    this.loadChatHistory()
  },

  methods: {
    async handleSendMessage() {
      if (!this.inputValue.trim()) return

      const userContent = this.inputValue
      this.inputValue = ''

      // 添加用户消息
      this.addMessage('user', userContent)
      this.isTyping = true

      try {
        // 调用 DeepSeek API
        const response = await sendTravelMessage(userContent, this.chatHistory)

        // 添加 AI 回复
        const aiContent = response.choices[0].message.content
        this.addMessage('ai', aiContent)

        // 保存历史
        this.saveChatHistory('user', userContent)
        this.saveChatHistory('assistant', aiContent)

      } catch (error) {
        console.error('API 调用失败:', error)
        this.addMessage('ai', '抱歉，我暂时无法回复。请稍后再试。')
      } finally {
        this.isTyping = false
      }
    },

    addMessage(role, content) {
      this.messages.push({
        role,
        content,
        timestamp: new Date()
      })
      this.$nextTick(() => this.scrollToBottom())
    },

    loadChatHistory() {
      const history = storage.get('chat_history')
      if (history) {
        this.chatHistory = history
        this.messages = history.map(msg => ({
          role: msg.role === 'assistant' ? 'ai' : 'user',
          content: msg.content,
          timestamp: new Date()
        }))
      }
    },

    saveChatHistory(role, content) {
      this.chatHistory.push({ role, content })
      // 限制历史记录数量
      if (this.chatHistory.length > 50) {
        this.chatHistory = this.chatHistory.slice(-50)
      }
      storage.set('chat_history', this.chatHistory)
    },

    scrollToBottom() {
      this.scrollIntoView = 'msg-' + (this.messages.length - 1)
    }
  }
}
```

---

### 阶段三：数据层完善（第 5-6 周）

#### Step 3.1 - 探索页数据接入

**创建文件**: `services/destination.js`

```javascript
import { storage } from '@/utils/storage.js'

// Mock 目的地数据
export const mockDestinations = [
  {
    id: '1',
    name: '佩尼达岛',
    location: '印度尼西亚',
    rating: 4.9,
    image: 'https://example.com/penida.jpg',
    tags: ['自然', '超值'],
    isFavorite: false
  },
  // ... 更多数据
]

/**
 * 获取目的地列表
 */
export function getDestinations(filters = {}) {
  // 从本地存储获取或使用 Mock 数据
  const stored = storage.get('destinations')
  return stored || mockDestinations
}

/**
 * 搜索目的地
 */
export function searchDestinations(keyword) {
  const all = getDestinations()
  return all.filter(dest =>
    dest.name.includes(keyword) ||
    dest.location.includes(keyword)
  )
}

/**
 * 切换收藏状态
 */
export function toggleFavorite(destinationId) {
  const all = getDestinations()
  const dest = all.find(d => d.id === destinationId)
  if (dest) {
    dest.isFavorite = !dest.isFavorite
    storage.set('destinations', all)
  }
  return dest
}
```

#### Step 3.2 - 行程页数据持久化

**修改文件**: `pages/itinerary/itinerary.vue`

```javascript
import { storage } from '@/utils/storage.js'

export default {
  data() {
    return {
      itineraries: {}
    }
  },

  onLoad() {
    this.loadItineraries()
  },

  methods: {
    loadItineraries() {
      const stored = storage.get('itineraries')
      this.itineraries = stored || this.getDefaultItineraries()
    },

    saveItineraries() {
      storage.set('itineraries', this.itineraries)
    },

    addItinerary(date, item) {
      if (!this.itineraries[date]) {
        this.itineraries[date] = []
      }
      this.itineraries[date].push(item)
      this.saveItineraries()
    },

    deleteItinerary(date, index) {
      this.itineraries[date].splice(index, 1)
      this.saveItineraries()
    }
  }
}
```

---

### 阶段四：用户系统完善（第 7 周）

#### Step 4.1 - 用户数据管理

**创建文件**: `services/user.js`

```javascript
import { storage } from '@/utils/storage.js'

const USER_KEY = 'user_profile'

/**
 * 获取用户信息
 */
export function getUserProfile() {
  return storage.get(USER_KEY) || {
    name: '漫游者',
    avatar: '',
    level: 1,
    countries: 0,
    days: 0,
    favorites: []
  }
}

/**
 * 更新用户信息
 */
export function updateUserProfile(data) {
  const current = getUserProfile()
  const updated = { ...current, ...data }
  storage.set(USER_KEY, updated)
  return updated
}

/**
 * 增加旅行统计
 */
export function addTravelStats(countries = 0, days = 0) {
  const current = getUserProfile()
  return updateUserProfile({
    countries: current.countries + countries,
    days: current.days + days
  })
}
```

---

### 阶段五：优化与测试（第 8 周）

#### Step 5.1 - 性能优化清单

- [ ] 图片懒加载
- [ ] 列表虚拟滚动（长列表）
- [ ] 代码分包
- [ ] 资源压缩

#### Step 5.2 - 用户体验优化

- [ ] 加载骨架屏
- [ ] 空状态页面
- [ ] 错误提示优化
- [ ] 操作反馈动画

---

## 六、开发步骤计划

### 阶段一：基础设施搭建（第 1-2 周）

#### Step 1.1 - 创建项目架构

创建以下目录结构：

```
├── components/           # 公共组件
│   └── README.md        # 组件使用说明
├── utils/               # 工具函数
│   ├── storage.js      # 本地存储封装 ✅
│   ├── request.js      # 网络请求封装
│   └── markdown.js     # Markdown 渲染工具 ✅
├── api/                 # API 接口
│   └── deepseek.js     # DeepSeek API ✅
├── config/              # 配置文件
│   └── deepseek.js     # DeepSeek 配置 ✅
└── services/            # 服务层
    ├── theme.js        # 主题服务 ✅
    ├── destination.js  # 目的地服务 ✅
    └── album.js        # 相册服务 ✅
```

#### Step 1.2 - 本地存储封装 ✅

**文件**: `utils/storage.js`

```javascript
/**
 * 本地存储封装
 */
export const storage = {
  get(key) {
    return uni.getStorageSync(key)
  },

  set(key, value) {
    uni.setStorageSync(key, value)
  },

  remove(key) {
    uni.removeStorageSync(key)
  },

  clear() {
    uni.clearStorageSync()
  }
}

// 存储键名常量
export const STORAGE_KEYS = {
  USER_PROFILE: 'user_profile',
  CHAT_MESSAGES: 'chat_messages',
  CHAT_HISTORY: 'chat_history',
  FAVORITES: 'favorites',
  DESTINATIONS: 'destinations',
  ITINERARIES: 'itineraries',
  ALBUMS: 'albums',
  PHOTOS: 'photos',
  SETTINGS: 'settings',
  THEME: 'theme'
}
```

#### Step 1.3 - 网络请求封装

**文件**: `utils/request.js`

```javascript
/**
 * 网络请求封装
 */
export function request(options) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: options.url,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...options.header
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: reject
    })
  })
}
```

---

### 阶段二：DeepSeek API 集成（第 3-4 周）✅

#### Step 2.1 - 创建 DeepSeek API 服务 ✅

**文件**: `api/deepseek.js`

```javascript
import { request } from '@/utils/request.js'

// 存储最近的对话，避免频繁调用 API
const MAX_HISTORY_LENGTH = 6000

/**
 * 截断历史以防 token 超限
 */
export function trimHistory(history, maxLength) {
  let totalLength = 0
  const result = []

  for (let i = history.length - 1; i >= 0; i--) {
    const msgLength = JSON.stringify(history[i]).length
    if (totalLength + msgLength > maxLength) {
      break
    }
    result.unshift(history[i])
    totalLength += msgLength
  }

  return result
}

/**
 * 发送旅行咨询消息
 */
export async function sendTravelMessage(content, history = []) {
  const systemPrompt = {
    role: 'system',
    content: '你是漫游奇点的 AI 旅行向导，专门帮助用户规划旅行、推荐目的地、提供旅行建议。请用友好、专业的语气回复。'
  }

  const messages = [
    systemPrompt,
    ...history,
    { role: 'user', content }
  ]

  const response = await request({
    url: 'https://api.deepseek.com/v1/chat/completions',
    method: 'POST',
    header: {
      'Authorization': 'Bearer sk-9c6e390cd0c9410aa24e98ccb0cd1bad'
    },
    data: {
      model: 'deepseek-chat',
      messages,
      temperature: 0.7,
      max_tokens: 2000
    }
  })

  return response.choices[0].message.content
}

/**
 * 解析 AI 回复内容
 */
export function parseMessageContent(content) {
  // 这里可以添加自定义解析逻辑
  return content
}
```

#### Step 2.2 - 完善 Chat 页面 ✅

**文件**: `pages/chat/chat.vue`

已实现：
- DeepSeek API 真实调用
- 消息持久化存储
- 上下文对话管理
- 清空历史功能
- Markdown 渲染
- 错误处理和加载状态

---

### 阶段三：数据层完善（第 5-6 周）✅

#### Step 3.1 - 目的地服务 ✅

**文件**: `services/destination.js`

已实现：
- 目的地 Mock 数据
- 收藏功能
- 热门目的地 AI 生成
- 本地缓存
- 搜索和筛选

#### Step 3.2 - 行程页数据持久化 ✅

**文件**: `pages/itinerary/itinerary.vue`

已实现：
- 本地存储持久化
- 添加/编辑/删除行程
- AI 生成行程
- 日历视图

---

### 阶段四：用户系统完善（第 7 周）

#### Step 4.1 - 用户数据管理 ✅

**文件**: `services/user.js`

```javascript
import { storage, STORAGE_KEYS } from '@/utils/storage.js'

/**
 * 获取用户信息
 */
export function getUserProfile() {
  return storage.get(STORAGE_KEYS.USER_PROFILE) || {
    name: '漫游者',
    avatar: 'https://lh3.googleusercontent.com/...',
    level: 1,
    countries: 0,
    days: 0,
    joinYear: new Date().getFullYear()
  }
}

/**
 * 更新用户信息
 */
export function updateUserProfile(data) {
  const current = getUserProfile()
  const updated = { ...current, ...data }
  storage.set(STORAGE_KEYS.USER_PROFILE, updated)
  return updated
}
```

---

### 阶段五：优化与测试（第 8 周）✅

#### Step 5.1 - Android App 布局适配 ✅

已完成：
- [x] 所有页面状态栏适配
- [x] 所有页面 TabBar 适配
- [x] 所有页面安全区适配
- [x] scroll-view 滚动修复
- [x] 输入框焦点和尺寸修复
- [x] backdrop-filter 兼容处理

#### Step 5.2 - 性能优化清单

- [ ] 图片懒加载
- [ ] 列表虚拟滚动（长列表）
- [ ] 代码分包
- [ ] 资源压缩

#### Step 5.3 - 用户体验优化

- [x] 加载骨架屏
- [x] 空状态页面
- [x] 错误提示优化
- [x] 操作反馈动画

---

## 七、DeepSeek API 集成指南

### 6.1 获取 API Key

1. 访问 [DeepSeek 开放平台](https://platform.deepseek.com/)
2. 注册/登录账号
3. 进入 API Keys 页面创建新的 API Key
4. 复制 API Key 用于配置

### 6.2 API 配置

在项目中创建配置文件 `config/deepseek.js`:

```javascript
export const DEEPSEEK_CONFIG = {
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: 'sk-xxxxxxxxxxxxxxxx', // 替换为你的 API Key
  model: 'deepseek-chat',
  defaultParams: {
    temperature: 0.7,
    max_tokens: 2000
  }
}
```

### 6.3 API 调用示例

```javascript
import { request } from '@/utils/request.js'
import { DEEPSEEK_CONFIG } from '@/config/deepseek.js'

export async function chat(messages, options = {}) {
  return request({
    url: `${DEEPSEEK_CONFIG.baseURL}/chat/completions`,
    method: 'POST',
    header: {
      'Authorization': `Bearer ${DEEPSEEK_CONFIG.apiKey}`
    },
    data: {
      model: options.model || DEEPSEEK_CONFIG.model,
      messages,
      temperature: options.temperature || DEEPSEEK_CONFIG.defaultParams.temperature,
      max_tokens: options.max_tokens || DEEPSEEK_CONFIG.defaultParams.max_tokens
    }
  })
}
```

### 6.4 消息格式

```javascript
const messages = [
  {
    role: 'system',
    content: '你是漫游奇点的 AI 旅行向导...'
  },
  {
    role: 'user',
    content: '我想去日本旅游，有什么推荐吗？'
  }
  // ... 更多对话历史
]
```

### 6.5 流式响应（可选）

如需流式响应，设置 `stream: true`:

```javascript
export async function chatStream(messages, onChunk) {
  // 使用 uni.request 的 stream 模式
  // 需要处理 SSE (Server-Sent Events) 格式
}
```

---

## 八、样式规范

### 7.1 颜色变量

```scss
// 主色调
$uni-color-primary: #63ec13;        // 品牌绿色
$uni-color-primary-dark: #4db80e;
$uni-color-primary-light: #8bf54d;

// 辅助色 - 鼠尾草绿系列
$uni-color-sage: #8BA88E;
$uni-color-sage-500: #708961;

// 中性色
$uni-color-deep-forest: #131811;    // 深林色（文字）
$uni-color-background: #f7f8f6;     // 浅色背景
$uni-color-cream: #FDF6E3;          // 奶油黄
$uni-color-white: #ffffff;
```

### 7.2 间距规范

```scss
$uni-spacing-base: 8rpx;
$uni-spacing-sm: 16rpx;
$uni-spacing-md: 24rpx;
$uni-spacing-lg: 32rpx;
$uni-spacing-xl: 48rpx;
```

### 7.3 圆角规范

```scss
$uni-radius-sm: 8rpx;
$uni-radius-md: 16rpx;
$uni-radius-lg: 24rpx;
$uni-radius-xl: 32rpx;
$uni-radius-round: 50%;
```

### 7.4 工具类

```scss
// 安全区域适配
.safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}

// 无滚动条
.no-scrollbar {
  &::-webkit-scrollbar { display: none; }
  scrollbar-width: none;
}

// 文本省略
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

## 九、开发检查清单

### 阶段一检查清单

- [ ] 创建 components 目录
- [ ] 创建 utils 目录
- [ ] 创建 api 目录
- [ ] 创建 services 目录
- [ ] 实现 utils/storage.js
- [ ] 实现 utils/request.js
- [ ] 实现 utils/helpers.js

### 阶段二检查清单

- [ ] 注册 DeepSeek 账号并获取 API Key
- [ ] 创建 config/deepseek.js 配置文件
- [ ] 实现 api/deepseek.js
- [ ] 实现 services/chat.js
- [ ] 修改 pages/chat/chat.vue 接入真实 API
- [ ] 测试聊天功能
- [ ] 实现聊天历史持久化

### 阶段三检查清单

- [ ] 实现 services/destination.js
- [ ] 修改 pages/explore/explore.vue 接入数据
- [ ] 实现搜索功能
- [ ] 实现筛选功能
- [ ] 修改 pages/itinerary/itinerary.vue 添加持久化
- [ ] 修改 pages/album/album.vue 加载照片数据

### 阶段四检查清单

- [ ] 实现 services/user.js
- [ ] 修改 pages/profile/profile.vue 绑定真实数据
- [ ] 实现设置功能
- [ ] 实现用户编辑功能

### 阶段五检查清单

- [ ] 添加加载骨架屏
- [ ] 添加空状态页面
- [ ] 优化错误提示
- [ ] 性能优化
- [ ] 全面测试

---

## 附录

### A. DeepSeek API 文档

- 官方文档: https://platform.deepseek.com/api-docs/
- 模型列表: deepseek-chat, deepseek-coder
- 限制: 免费版有速率限制

### B. uni-app 文档

- 官方文档: https://uniapp.dcloud.net.cn/
- API 参考: https://uniapp.dcloud.net.cn/api/

### C. 项目进度追踪

建议使用 Git 或项目管理工具追踪进度：

```bash
# 创建开发分支
git checkout -b feature/deepseek-integration

# 提交代码
git add .
git commit -m "feat: 集成 DeepSeek API"

# 推送到远程
git push origin feature/deepseek-integration
```

---

**文档版本**: v1.1
**最后更新**: 2025-01-21
**维护者**: WanderAI Team

---

## 十、版本更新日志

### v1.1.0 (2025-01-21)

#### 新增功能
- 收藏页面（我的收藏）
- 订单页面（我的订单）
- 目的地详情页
- 回忆详情页

#### Android App 布局适配
- 修复所有页面状态栏遮挡问题
- 修复所有页面 TabBar 遮挡问题
- 修复所有页面虚拟按键遮挡问题
- 修复 scroll-view 滚动问题
- 修复行程页输入框焦点和尺寸问题
- 移除 Android 平台 backdrop-filter（避免 z-index 异常）

#### 技术改进
- 完成 DeepSeek API 集成
- 实现消息持久化存储
- 实现上下文对话管理
- 实现主题切换功能
- 实现目的地收藏和搜索
- 实现相册管理功能
- 实现行程 AI 生成功能

#### Bug 修复
- 修复行程页输入框无法点击问题
- 修复行程页输入框太小、无光标显示问题
- 修复行程页页面无法滚动问题
- 修复所有页面在 Android App 中的布局偏移问题

---

### v1.0.2 (2025-01-18)

- 初始版本发布
- 基础页面框架搭建完成
