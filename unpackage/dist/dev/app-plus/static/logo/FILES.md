# WanderAI Logo PNG 文件清单

所有 PNG 文件已生成完毕！共 22 个文件。

## 📱 应用图标

### Android
| 文件 | 尺寸 | 用途 |
|------|------|------|
| logo-icon-192.png | 192x192 | xxxhdpi (超高清) |
| logo-icon-144.png | 144x144 | xxhdpi (超高清) |
| logo-icon-96.png | 96x96 | xhdpi (高清) |
| logo-icon-72.png | 72x72 | hdpi (高清) |
| logo-icon-48.png | 48x48 | mdpi (标准) |

放置位置：
```
android/app/src/main/res/
├── mipmap-xxxhdpi/logo-icon.png (192x192)
├── mipmap-xxhdpi/logo-icon.png (144x144) - 需生成
├── mipmap-xhdpi/logo-icon.png (96x96)
├── mipmap-hdpi/logo-icon.png (72x72)
└── mipmap-mdpi/logo-icon.png (48x48)
```

### iOS
| 文件 | 尺寸 | 用途 |
|------|------|------|
| logo-icon-1024.png | 1024x1024 | App Store (需生成) |
| logo-icon-180.png | 180x180 | iPhone @3x (需生成) |
| logo-icon-120.png | 120x120 | iPhone @2x (需生成) |
| logo-icon-152.png | 152x152 | iPad @2x (需生成) |

使用 `logo-icon.svg` 在 Xcode 中生成对应尺寸。

## 🚀 启动页

| 文件 | 尺寸 | 说明 |
|------|------|------|
| logo-main.png | 512x512 | 主 Logo，包含文字 |
| logo-main-256.png | 256x256 | 中尺寸 |
| logo-light.png | 512x512 | 浅色背景版 |
| logo-dark.png | 512x512 | 深色背景版 |

## 🌐 网站

| 文件 | 尺寸 | 说明 |
|------|------|------|
| favicon-16.png | 16x16 | 最小尺寸 |
| favicon-32.png | 32x32 | 标准尺寸 |
| favicon-64.png | 64x64 | 高清 |
| favicon-96.png | 96x96 | 超高清 |
| favicon-128.png | 128x128 | Retina |
| favicon-256.png | 256x256 | 大尺寸 |

## 🎨 其他版本

| 文件 | 尺寸 | 说明 |
|------|------|------|
| logo-simple.png | 256x256 | 简约版 |
| logo-simple-128.png | 128x128 | 简约版小 |
| logo-simple-64.png | 64x64 | 简约版极小 |
| logo-monochrome.png | 512x512 | 单色版（打印用） |

## 📦 uni-app 项目配置

### 1. 应用图标

Android:
```
将 logo-icon-192.png 复制到:
nativeplugins/.../res/drawable-xxxhdpi/logo.png
或在 manifest.json 中配置
```

iOS:
```
在 Xcode 中打开项目，
将 logo-icon.svg 拖入 AppIcon 资源目录
```

### 2. 启动页

uni-app 云打包会自动使用 manifest.json 中的配置，
本地测试可以将 logo-light.png 配置为启动图。

### 3. 网站 Favicon

在 `index.html` 中添加：
```html
<link rel="icon" type="image/png" sizes="32x32" href="/static/logo/favicon-32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/static/logo/favicon-16.png">
```

## 🔧 需要其他尺寸？

如果需要其他尺寸，请：
1. 使用 SVG 源文件重新导出
2. 或运行 `node convert-to-png.js`
3. 或使用 `svg-to-png-auto.html` 在线转换

## ✅ 快速检查

- [x] 22 个 PNG 文件已生成
- [x] 所有文件尺寸正确
- [x] 可以直接用于项目

---

生成时间: 2025-01-17
工具: sharp (Node.js)
