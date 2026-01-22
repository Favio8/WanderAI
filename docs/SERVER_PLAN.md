# WanderAI 漫游奇点 - 服务器架构与上线计划

## 📋 目录

- [一、功能分析](#一功能分析)
- [二、服务器架构设计](#二服务器架构设计)
- [三、数据库设计](#三数据库设计)
- [四、API设计](#四api设计)
- [五、开发阶段规划](#五开发阶段规划)
- [六、部署方案](#六部署方案)
- [七、成本预算](#七成本预算)
- [八、安全与合规](#八安全与合规)
- [九、监控与运维](#九监控与运维)
- [十、风险与应对](#十风险与应对)
- [十一、后续优化方向](#十一后续优化方向)
- [十二、总结](#十二总结)
- [十三、变更日志](#十三变更日志)

---

## 一、功能分析

### 1.1 当前功能矩阵（v1.1.0 - Android App 适配完成）

| 功能模块 | 客户端实现 | 服务器需求 | 优先级 | 状态 |
|---------|-----------|-----------|--------|------|
| **Android 适配** | ✅ 完成 | - | P0 | ✅ 完成 |
| - 10个页面布局适配 | ✅ 完成 | - | P0 | ✅ 完成 |
| - 状态栏/安全区适配 | ✅ 完成 | - | P0 | ✅ 完成 |
| - 滚动区域修复 | ✅ 完成 | - | P0 | ✅ 完成 |
| **用户管理** | 本地存储 | ✅ 需要 | P0 | 🔄 待开发 |
| - 用户注册/登录 | ❌ 无 | ✅ 需要 | P0 | 🔄 待开发 |
| - 用户资料 | 本地 | ✅ 需要 | P0 | 🔄 待开发 |
| - 收藏同步 | 本地 | ✅ 需要 | P1 | 🔄 待开发 |
| - 旅行统计 | 本地 | ✅ 需要 | P1 | 🔄 待开发 |
| **目的地服务** | Mock数据 | ✅ 需要 | P0 | 🔄 待开发 |
| - 目的地数据 | Mock | ✅ 需要 | P0 | 🔄 待开发 |
| - 热门推荐 | AI生成 | ✅ 需要 | P1 | 🔄 待开发 |
| - 用户评价 | ❌ 无 | ✅ 需要 | P2 | 🔄 待开发 |
| **AI聊天助手** | DeepSeek API | ✅ 需要 | P0 | ✅ 完成 |
| - 对话功能 | ✅ 有 | ✅ 需要 | P0 | ✅ 完成 |
| - 历史记录 | 本地 | ✅ 需要 | P1 | 🔄 待开发 |
| - 上下文记忆 | 无 | ✅ 需要 | P1 | 🔄 待开发 |
| **行程规划** | 本地 | ✅ 需要 | P1 | ✅ 完成 |
| - 行程创建 | ✅ 有 | ✅ 需要 | P1 | ✅ 完成 |
| - 行程同步 | 本地 | ✅ 需要 | P1 | 🔄 待开发 |
| - 行程分享 | ❌ 无 | ✅ 需要 | P2 | 🔄 待开发 |
| **智能相册** | 本地 | ✅ 需要 | P2 | ✅ 完成 |
| - 照片存储 | 本地 | ✅ 需要 | P2 | ✅ 完成 |
| - AI日记 | ❌ 无 | ✅ 需要 | P2 | 🔄 待开发 |
| **订单系统** | ❌ 无 | ✅ 需要 | P3 | 🔄 待开发 |
| **社交功能** | ❌ 无 | ✅ 需要 | P3 | 🔄 待开发 |

### 1.2 必须上线的核心功能

#### P0 - 第一期（必须）
- ✅ 用户注册/登录（手机号/微信）
- ✅ 目的地数据管理
- ✅ AI聊天服务（API代理）
- ✅ 基础用户资料

#### P1 - 第二期（重要）
- ✅ 收藏同步
- ✅ 行程云同步
- ✅ 聊天历史记录
- ✅ 热门目的地推荐

#### P2 - 第三期（增强）
- ✅ 照片云存储
- ✅ 用户评价系统
- ✅ 行程分享
- ✅ AI旅行日记

#### P3 - 第四期（扩展）
- ✅ 订单预订系统
- ✅ 社交功能
- ✅ 积分/会员体系

---

## 二、服务器架构设计

### 2.1 整体架构

```
┌─────────────────────────────────────────────────────────────┐
│                         客户端层                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  小程序   │ │ Android │ │  H5网页  │ │ 管理后台  │      │
│  │  (开发中) │ │  ✅完成  │ │ (开发中) │ │  (待开发) │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       CDN + 负载均衡                          │
│                    (阿里云 CDN / SLB)                        │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         API网关层                            │
│              (Kong / API Gateway / Nginx)                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  鉴权     │ │  限流     │ │  日志     │ │  监控     │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        应用服务层                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  用户服务     │  │  目的地服务   │  │  行程服务     │     │
│  │  (Node.js)   │  │  (Node.js)   │  │  (Node.js)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  AI聊天服务   │  │  相册服务     │  │  社交服务     │     │
│  │  (Node.js)   │  │  (Node.js)   │  │  (Node.js)   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         数据层                               │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ MySQL    │  │  Redis   │  │  MongoDB │  │ OSS存储  │  │
│  │ (主数据)  │  │  (缓存)   │  │  (日志)   │  │ (文件)    │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                       第三方服务                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ DeepSeek │  │  微信API  │  │  短信API  │  │  支付API  │  │
│  │   AI     │  │           │  │           │  │           │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 技术栈选型

#### 后端框架
```javascript
推荐：Node.js + Nest.js + TypeScript

优势：
✅ 类型安全，减少运行时错误
✅ 模块化架构，易于维护
✅ 与前端技术栈统一
✅ 丰富的生态系统
✅ 支持微服务架构
```

#### 数据库选择
```
MySQL 8.0      - 主数据库（用户、目的地、订单等）
Redis 7.0      - 缓存、会话、限流
MongoDB        - 日志、聊天历史（可选）
Elasticsearch  - 全文搜索（后期优化）
```

#### 云服务商
```
推荐：阿里云

备选：
- 腾讯云（微信小程序生态）
- 华为云（政企项目）
- AWS（海外用户）
```

### 2.3 Android App 客户端特定考虑

#### 2.3.1 客户端存储与服务器同步策略

```
当前架构（v1.1.0）：
┌─────────────────────────────────────────────────────────────┐
│                   Android App 本地存储                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ uni.Storage│ │ 用户资料  │ │ 收藏列表  │ │ 聊天记录  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ 行程数据  │ │ 相册照片  │ │ 目的地缓存 │ │ 用户设置  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      数据同步服务层（待开发）                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  增量同步  │ │  冲突解决  │ │  离线优先  │ │  后台上传  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        服务器存储                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │   MySQL   │ │  Redis   │ │   OSS    │ │ MongoDB  │      │
│  │  (持久化)  │ │  (缓存)   │ │  (文件)   │ │  (日志)   │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘
```

#### 2.3.2 API 设计考虑

```
Android App 特定需求：

1. 网络状态处理
   - 离线模式支持（本地优先）
   - 网络切换重连机制
   - 请求失败重试策略

2. 数据同步策略
   - 增量同步（仅传输变更数据）
   - 时间戳版本控制
   - 冲突解决策略（服务器优先 / 客户端优先 / 用户选择）

3. 性能优化
   - 图片压缩上传（Android 端压缩）
   - 分页加载（每页 20-50 条）
   - CDN 加速图片资源
   - 接口响应时间 < 500ms（P95）

4. 安全考虑
   - Token 刷新机制
   - 设备指纹识别
   - API 签名验证
   - 敏感数据加密传输
```

#### 2.3.3 已完成的 Android 客户端功能

```
✅ 10个页面布局适配（v1.1.0）
   - chat.vue（聊天页面，TabBar）
   - explore.vue（探索页面，TabBar）
   - itinerary.vue（行程页面，TabBar）
   - album.vue（相册页面，TabBar）
   - profile.vue（个人中心，TabBar）
   - settings.vue（设置页面，非TabBar）
   - favorites.vue（收藏页面，非TabBar）
   - orders.vue（订单页面，非TabBar）
   - destination.vue（目的地详情，非TabBar）
   - memory-detail.vue（回忆详情，非TabBar）

✅ 布局适配要点
   - 状态栏高度动态计算
   - 安全区域（safe-area-inset）适配
   - TabBar 底部安全区适配
   - scroll-view 滚动修复
   - 100vh → 100% flex 布局
   - 主题切换服务

✅ 本地数据管理
   - 用户资料本地存储
   - 收藏列表本地存储
   - 聊天记录本地存储
   - 行程数据本地存储
   - 相册照片本地存储
   - 目的地数据 Mock + 缓存
```

---

## 三、数据库设计

### 3.1 用户表 (users)

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    openid VARCHAR(128) UNIQUE COMMENT '微信openid',
    phone VARCHAR(20) UNIQUE COMMENT '手机号',
    nickname VARCHAR(50) COMMENT '昵称',
    avatar_url VARCHAR(500) COMMENT '头像URL',
    gender TINYINT DEFAULT 0 COMMENT '性别:0未知,1男,2女',
    birthday DATE COMMENT '生日',
    bio TEXT COMMENT '个人简介',
    travel_days INT DEFAULT 0 COMMENT '旅行天数',
    countries_count INT DEFAULT 0 COMMENT '去过国家数',
    level INT DEFAULT 1 COMMENT '用户等级',
    exp_points INT DEFAULT 0 COMMENT '经验值',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_openid (openid),
    INDEX idx_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
```

### 3.2 目的地表 (destinations)

```sql
CREATE TABLE destinations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL COMMENT '目的地名称',
    location VARCHAR(100) COMMENT '位置',
    country VARCHAR(50) COMMENT '国家',
    province VARCHAR(50) COMMENT '省份',
    city VARCHAR(50) COMMENT '城市',
    latitude DECIMAL(10,7) COMMENT '纬度',
    longitude DECIMAL(11,7) COMMENT '经度',
    cover_image VARCHAR(500) COMMENT '封面图',
    images JSON COMMENT '图片数组',
    description TEXT COMMENT '简介',
    tags JSON COMMENT '标签数组',
    rating DECIMAL(3,2) DEFAULT 0.00 COMMENT '评分',
    review_count INT DEFAULT 0 COMMENT '评论数',
    view_count INT DEFAULT 0 COMMENT '浏览数',
    favorite_count INT DEFAULT 0 COMMENT '收藏数',
    is_top_pick BOOLEAN DEFAULT FALSE COMMENT '是否精选',
    is_published BOOLEAN DEFAULT TRUE COMMENT '是否发布',
    sort_order INT DEFAULT 0 COMMENT '排序',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_location (location),
    INDEX idx_country (country),
    INDEX idx_rating (rating),
    INDEX idx_tags ((CAST(tags AS CHAR(255)))),
    FULLTEXT INDEX ft_search (name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='目的地表';
```

### 3.3 收藏表 (user_favorites)

```sql
CREATE TABLE user_favorites (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    destination_id BIGINT NOT NULL COMMENT '目的地ID',
    note TEXT COMMENT '备注',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_dest (user_id, destination_id),
    INDEX idx_user_id (user_id),
    INDEX idx_destination_id (destination_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户收藏表';
```

### 3.4 行程表 (itineraries)

```sql
CREATE TABLE itineraries (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    title VARCHAR(200) NOT NULL COMMENT '行程标题',
    cover_image VARCHAR(500) COMMENT '封面图',
    destination_ids JSON COMMENT '目的地ID数组',
    start_date DATE COMMENT '开始日期',
    end_date DATE COMMENT '结束日期',
    days_count INT DEFAULT 1 COMMENT '天数',
    budget INT DEFAULT 0 COMMENT '预算(分)',
    actual_cost INT DEFAULT 0 COMMENT '实际花费(分)',
    notes TEXT COMMENT '备注',
    is_public BOOLEAN DEFAULT FALSE COMMENT '是否公开',
    view_count INT DEFAULT 0 COMMENT '浏览数',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    copy_count INT DEFAULT 0 COMMENT '被复制数',
    status TINYINT DEFAULT 0 COMMENT '状态:0草稿,1已确认,2已完成,3已取消',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='行程表';
```

### 3.5 聊天记录表 (chat_messages)

```sql
CREATE TABLE chat_messages (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    session_id VARCHAR(64) NOT NULL COMMENT '会话ID',
    role ENUM('user','assistant','system') NOT NULL COMMENT '角色',
    content TEXT NOT NULL COMMENT '内容',
    tokens INT DEFAULT 0 COMMENT 'token数',
    model VARCHAR(50) DEFAULT 'deepseek-chat' COMMENT '模型',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_session (user_id, session_id),
    INDEX idx_session_id (session_id),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='聊天记录表';
```

### 3.6 照片表 (photos)

```sql
CREATE TABLE photos (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    itinerary_id BIGINT COMMENT '行程ID',
    destination_id BIGINT COMMENT '目的地ID',
    file_url VARCHAR(500) NOT NULL COMMENT '文件URL',
    file_size INT COMMENT '文件大小(字节)',
    width INT COMMENT '宽度',
    height INT COMMENT '高度',
    description TEXT COMMENT '描述',
    ai_diary TEXT COMMENT 'AI生成的日记',
    location_name VARCHAR(100) COMMENT '位置名称',
    taken_at TIMESTAMP COMMENT '拍摄时间',
    is_public BOOLEAN DEFAULT FALSE COMMENT '是否公开',
    view_count INT DEFAULT 0 COMMENT '浏览数',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_itinerary_id (itinerary_id),
    INDEX idx_destination_id (destination_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='照片表';
```

### 3.7 评价表 (reviews)

```sql
CREATE TABLE reviews (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL COMMENT '用户ID',
    destination_id BIGINT NOT NULL COMMENT '目的地ID',
    itinerary_id BIGINT COMMENT '关联行程ID',
    rating TINYINT NOT NULL COMMENT '评分1-5',
    content TEXT COMMENT '评价内容',
    images JSON COMMENT '图片数组',
    like_count INT DEFAULT 0 COMMENT '点赞数',
    reply TEXT COMMENT '商家回复',
    replied_at TIMESTAMP NULL COMMENT '回复时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uk_user_dest (user_id, destination_id, itinerary_id),
    INDEX idx_destination_id (destination_id),
    INDEX idx_rating (rating),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评价表';
```

### 3.8 热门目的地缓存表 (trending_destinations)

```sql
CREATE TABLE trending_destinations (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    season VARCHAR(20) NOT NULL COMMENT '季节',
    year INT NOT NULL COMMENT '年份',
    month TINYINT NOT NULL COMMENT '月份',
    domestic_ids JSON COMMENT '国内目的地ID数组',
    international_ids JSON COMMENT '国际目的地ID数组',
    ai_response TEXT COMMENT 'AI原始响应',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL COMMENT '过期时间',
    INDEX idx_season (season, year, month),
    INDEX idx_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='热门目的地缓存';
```

---

## 四、API设计

### 4.1 用户认证模块

```
POST   /api/v1/auth/send-code         # 发送验证码
POST   /api/v1/auth/verify-code       # 验证码登录
POST   /api/v1/auth/wechat-login      # 微信登录
POST   /api/v1/auth/refresh-token     # 刷新token
POST   /api/v1/auth/logout            # 退出登录
GET    /api/v1/auth/profile           # 获取用户信息
PUT    /api/v1/auth/profile           # 更新用户信息
POST   /api/v1/auth/avatar            # 上传头像
```

### 4.2 目的地模块

```
GET    /api/v1/destinations           # 获取目的地列表
GET    /api/v1/destinations/:id       # 获取目的地详情
GET    /api/v1/destinations/search    # 搜索目的地
GET    /api/v1/destinations/trending  # 获取热门目的地
GET    /api/v1/destinations/:id/reviews  # 获取目的地评价
POST   /api/v1/destinations/:id/reviews  # 添加评价
```

### 4.3 收藏模块

```
GET    /api/v1/favorites              # 获取收藏列表
POST   /api/v1/favorites              # 添加收藏
DELETE /api/v1/favorites/:id          # 取消收藏
POST   /api/v1/favorites/sync         # 收藏同步
```

### 4.4 行程模块

```
GET    /api/v1/itineraries            # 获取行程列表
POST   /api/v1/itineraries            # 创建行程
GET    /api/v1/itineraries/:id        # 获取行程详情
PUT    /api/v1/itineraries/:id        # 更新行程
DELETE /api/v1/itineraries/:id        # 删除行程
POST   /api/v1/itineraries/:id/share  # 分享行程
GET    /api/v1/itineraries/:id/share  # 获取分享的行程
```

### 4.5 AI聊天模块

```
POST   /api/v1/chat/completions       # AI对话
GET    /api/v1/chat/sessions          # 获取会话列表
GET    /api/v1/chat/sessions/:id      # 获取会话详情
DELETE /api/v1/chat/sessions/:id      # 删除会话
POST   /api/v1/chat/feedback          # 反馈
```

### 4.6 相册模块

```
GET    /api/v1/photos                 # 获取照片列表
POST   /api/v1/photos/upload          # 上传照片
GET    /api/v1/photos/:id             # 获取照片详情
DELETE /api/v1/photos/:id             # 删除照片
POST   /api/v1/photos/:id/ai-diary    # 生成AI日记
```

### 4.7 热门推荐模块

```
GET    /api/v1/trending/refresh        # 刷新热门目的地
GET    /api/v1/trending/status         # 获取更新状态
```

### 4.8 Android App 数据同步模块（待开发）

```
POST   /api/v1/sync/pull               # 拉取服务器数据（增量）
POST   /api/v1/sync/push               # 推送本地数据到服务器
POST   /api/v1/sync/full               # 全量同步
GET    /api/v1/sync/status             # 获取同步状态
POST   /api/v1/sync/resolve-conflict   # 解决数据冲突

# 数据变更时间戳查询
GET    /api/v1/sync/timestamps         # 获取各类数据最新更新时间
# 参数: types=favorites,itineraries,chat_messages,photos,user_profile
```

**同步策略说明**:
```json
// POST /api/v1/sync/pull 请求示例
{
  "last_sync_at": "2026-01-21T10:00:00Z",
  "device_id": "android_xxxxx",
  "data_types": ["favorites", "itineraries", "chat_messages", "user_profile"]
}

// POST /api/v1/sync/push 请求示例
{
  "device_id": "android_xxxxx",
  "data": {
    "favorites": [...],
    "itineraries": [...],
    "chat_messages": [...]
  },
  "client_timestamps": {
    "favorites": "2026-01-21T10:05:00Z",
    "itineraries": "2026-01-21T10:06:00Z"
  }
}
```

---

## 五、开发阶段规划

### 已完成阶段（v1.1.0 - 2026-01-21）

**Android App 客户端开发（已完成）**

```
✅ 10个页面布局适配（4周）
   ✅ TabBar 页面（5个）
      ├── chat.vue（聊天页面）
      ├── explore.vue（探索页面）
      ├── itinerary.vue（行程页面）
      ├── album.vue（相册页面）
      └── profile.vue（个人中心）

   ✅ 非 TabBar 页面（5个）
      ├── settings.vue（设置页面）
      ├── favorites.vue（收藏页面）
      ├── orders.vue（订单页面）
      ├── destination.vue（目的地详情）
      └── memory-detail.vue（回忆详情）

✅ 核心功能实现
   ├── DeepSeek AI 聊天集成
   ├── 目的地推荐（AI生成）
   ├── 行程规划功能
   ├── 智能相册管理
   ├── 用户资料管理
   └── 主题切换服务

✅ Android 布局适配
   ├── 状态栏占位适配
   ├── 安全区域（safe-area）适配
   ├── TabBar 底部安全区适配
   ├── scroll-view 滚动修复
   └── 100vh → 100% flex 布局转换
```

---

### 第一阶段：服务器核心功能（4-6周）

**目标**：实现云端数据同步和用户认证

#### Week 1-2: 基础架构
- [ ] 搭建服务器框架（Nest.js）
- [ ] 配置数据库（MySQL + Redis）
- [ ] 实现用户认证系统
  - [ ] 手机号验证码登录
  - [ ] 微信小程序登录
  - [ ] JWT token管理
- [ ] API网关配置
- [ ] 日志系统

#### Week 3-4: 核心业务
- [ ] 目的地服务
  - [ ] CRUD接口
  - [ ] 搜索功能
  - [ ] 热门推荐（定时任务）
- [ ] 收藏服务
  - [ ] 收藏CRUD
  - [ ] 云同步
- [ ] AI聊天服务
  - [ ] DeepSeek API代理（已完成客户端）
  - [ ] 对话历史存储
  - [ ] 上下文管理

#### Week 5-6: 数据同步
- [ ] Android App 数据同步服务
  - [ ] 增量同步（pull/push）
  - [ ] 时间戳版本控制
  - [ ] 冲突解决策略
- [ ] 单元测试
- [ ] 接口测试
- [ ] 性能优化

---

### 第二阶段：增强功能（4-6周）

#### Week 7-8: 行程与相册
- [ ] 行程服务
  - [ ] 行程CRUD
  - [ ] 行程分享
  - [ ] 行程模板
- [ ] 相册服务
  - [ ] OSS集成
  - [ ] 图片上传
  - [ ] AI日记生成

#### Week 9-10: 社交功能
- [ ] 评价系统
  - [ ] 评价CRUD
  - [ ] 点赞/回复
- [ ] 用户社区
  - [ ] 动态发布
  - [ ] 关注/粉丝

---

### 第三阶段：完善与上线（4-6周）

#### Week 11-12: 运营功能
- [ ] 管理后台
  - [ ] 目的地管理
  - [ ] 用户管理
  - [ ] 内容审核
  - [ ] 数据统计

#### Week 13-14: 上线准备
- [ ] 安全加固
- [ ] 备案流程
- [ ] 性能调优
- [ ] 监控告警
- [ ] 灰度发布

---

## 六、部署方案

### 6.1 服务器配置

#### 开发环境
```
1台 ECS（2核4G）
- 应用服务
- MySQL 8.0
- Redis 6.0
```

#### 生产环境
```
负载均衡层:
├── SLB (1台)

应用服务层:
├── 应用服务器 × 3 (4核8G)
│   ├── Node.js 服务
│   └── PM2 进程管理

数据库层:
├── MySQL 主从 × 2 (4核16G，500G SSD)
│   ├── 主库：写入
│   └── 从库：读取
├── Redis 哨兵 × 3 (2核4G)
│   ├── Master
│   └── 2× Slave

存储层:
├── OSS (对象存储)
├── CDN (内容分发)

其他服务:
├── 短信服务 (阿里云SMS)
├── 支付服务 (微信支付)
└── 监控服务 (云监控)
```

### 6.2 CI/CD流程

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  代码提交  │ -> │  自动测试  │ -> │  自动构建  │ -> │  自动部署  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘
                     │              │              │
                ┌────▼────┐    ┌────▼────┐    ┌────▼────┐
                │ 单元测试  │    │ Docker  │    │  灰度发布 │
                │ 接口测试  │    │ 镜像构建 │    │  全量发布 │
                └─────────┘    └─────────┘    └─────────┘
```

---

## 七、成本预算

### 7.1 初期成本（月度）

| 项目 | 配置 | 数量 | 单价 | 小计 |
|------|------|------|------|------|
| **ECS** | 4核8G | 3台 | ¥800/月 | ¥2,400 |
| **RDS MySQL** | 4核16G | 2台 | ¥1,500/月 | ¥3,000 |
| **Redis** | 2核4G | 3台 | ¥400/月 | ¥1,200 |
| **SLB** | 标准版 | 1台 | ¥300/月 | ¥300 |
| **OSS** | 100GB | - | ¥0.12/GB | ¥12 |
| **CDN** | 流量 | - | ¥0.24/GB | ¥200 |
| **短信** | 0.045/条 | 10000条 | ¥0.045 | ¥450 |
| **DeepSeek API** | Token | - | ¥1/M | ¥500 |
| **域名+SSL** | - | 1年 | ¥100/年 | ¥10 |
| **总计** | - | - | - | **¥8,072/月** |

### 7.2 年度预算

```
基础设施：¥96,864/年
人工成本：
  - 后端开发 × 2：¥30万/年
  - 前端开发 × 1：¥15万/年
  - 运维 × 1：¥12万/年
  - 产品经理 × 1：¥15万/年
人工小计：¥72万/年

总计：约82万/年（首年）
```

---

## 八、安全与合规

### 8.1 安全措施

```
┌─────────────────────────────────────┐
│            应用层安全                │
│  ┌──────────┐  ┌──────────┐        │
│  │ XSS防护  │  │ SQL注入  │        │
│  │ CSRF防护 │  │ 参数验证  │        │
│  └──────────┘  └──────────┘        │
└─────────────────────────────────────┘
              ▲
┌─────────────────────────────────────┐
│            网络层安全                │
│  ┌──────────┐  ┌──────────┐        │
│  │ HTTPS/SSL│  │ DDoS防护  │        │
│  │ 防火墙   │  │ WAF      │        │
│  └──────────┘  └──────────┘        │
└─────────────────────────────────────┘
              ▲
┌─────────────────────────────────────┐
│            数据层安全                │
│  ┌──────────┐  ┌──────────┐        │
│  │ 数据加密  │  │ 敏感信息  │        │
│  │ 备份恢复  │  │ 脱敏处理  │        │
│  └──────────┘  └──────────┘        │
└─────────────────────────────────────┘
```

### 8.2 合规要求

#### ICP备案
```
所需材料：
- 营业执照
- 法人身份证
- 域名证书
- 服务器合同
- 网站负责人身份证

周期：20-30个工作日
```

#### 隐私政策
```
必需内容：
- 数据收集范围
- 数据使用目的
- 数据存储期限
- 用户权利说明
- 第三方共享规则
- 联系方式
```

#### 用户协议
```
必需内容：
- 服务条款
- 用户行为规范
- 知识产权声明
- 免责条款
- 争议解决方式
```

---

## 九、监控与运维

### 9.1 监控指标

```
业务指标：
- DAU/MAU
- 注册转化率
- 留存率
- 功能使用率

技术指标：
- API响应时间
- 错误率
- QPS
- 服务器负载
- 数据库连接数

业务告警：
- API错误率 > 1%
- 响应时间 > 1s
- 服务器负载 > 80%
```

### 9.2 日志管理

```
┌─────────────────────────────────────┐
│            日志分类                  │
├─────────────────────────────────────┤
│  访问日志      - Nginx访问日志       │
│  应用日志      - 业务逻辑日志         │
│  错误日志      - 异常错误日志         │
│  慢查询日志    - 数据库慢查询         │
│  安全日志      - 安全事件日志         │
└─────────────────────────────────────┘

存储方案：
- 实时日志：ELK (Elasticsearch + Logstash + Kibana)
- 归档日志：OSS (7天热存储，30天冷存储)
```

---

## 十、风险与应对

### 10.1 技术风险

| 风险 | 影响 | 应对措施 |
|------|------|---------|
| API不稳定 | 高 | 多备选API提供商，熔断降级 |
| 数据泄露 | 高 | 数据加密，定期安全审计 |
| 服务器宕机 | 中 | 负载均衡，主备切换 |
| DDOS攻击 | 中 | 阿里云DDoS防护 |

### 10.2 业务风险

| 风险 | 影响 | 应对措施 |
|------|------|---------|
| 用户增长慢 | 中 | 市场推广，优化产品体验 |
| 内容违规 | 高 | 机器审核 + 人工审核 |
| 竞品抄袭 | 低 | 快速迭代，建立护城河 |

---

## 十一、后续优化方向

### 11.1 智能化升级
```
- 推荐算法优化
  - 基于用户行为的协同过滤
  - 基于内容的推荐
  - 深度学习模型

- AI功能增强
  - 智能行程规划
  - 实时翻译
  - AR导览
```

### 11.2 商业化探索
```
- 会员体系
- 增值服务
- 旅游产品分销
- 广告收入
```

---

## 十二、总结

### 开发优先级

```
P0 (立即开发):
├── 用户认证系统
├── 目的地服务
└── AI聊天服务

P1 (近期开发):
├── 收藏云同步
├── 行程管理
└── 聊天历史

P2 (中期开发):
├── 照片云存储
├── 评价系统
└── 行程分享

P3 (长期规划):
├── 订单系统
├── 社交功能
└── 会员体系
```

### 里程碑

```
第1个月：完成核心架构和用户系统
第2个月：完成目的地和AI聊天服务
第3个月：完成收藏和行程服务
第4个月：测试和优化
第5个月：灰度发布
第6个月：正式上线
```

---

## 十三、变更日志

### v1.1.0 (2026-01-21)

**Android App 客户端适配完成**

#### 新增内容
- 新增「2.3 Android App 客户端特定考虑」章节
  - 客户端存储与服务器同步策略
  - API 设计考虑（网络状态、数据同步、性能优化、安全）
  - 已完成的 Android 客户端功能清单

- 新增「4.8 Android App 数据同步模块」API 设计
  - 增量同步接口（pull/push）
  - 全量同步接口
  - 冲突解决接口
  - 数据变更时间戳查询接口

- 新增「已完成阶段」章节（v1.1.0）
  - 10个页面布局适配清单
  - 核心功能实现状态
  - Android 布局适配要点

#### 更新内容
- 更新「1.1 当前功能矩阵」
  - 新增 Android 适配功能行
  - 更新各功能状态列（✅ 完成 / 🔄 待开发）
  - 完善客户端实现列信息

- 更新「2.1 整体架构」客户端层
  - 标注 Android App 状态为 ✅ 完成
  - 标注其他客户端状态

- 更新「五、开发阶段规划」
  - 新增已完成阶段章节
  - 更新第一阶段服务器开发内容（基于已完成的客户端）

#### 技术总结
```
✅ 10个页面 Android 布局适配完成
✅ DeepSeek AI 聊天功能集成
✅ 本地数据存储体系建立
✅ 主题切换服务实现
✅ 状态栏/安全区/滚动区域全部修复
✅ 数据同步 API 设计完成（待开发）
```

---

### v1.0.0 (2026-01-21)

**初始版本**

- 完成服务器架构基础设计
- 数据库表结构设计
- 核心 API 接口设计
- 开发阶段规划
- 部署方案和成本预算

---

**文档版本**: v1.1.0
**更新日期**: 2026-01-21
**负责人**: [待定]
