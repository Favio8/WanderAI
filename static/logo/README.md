# WanderAI Logo

## 📁 文件清单

| 文件名 | 尺寸 | 用途 |
|--------|------|------|
| logo-main.svg | 512x512 | 主 Logo，包含文字 |
| logo-icon.svg | 512x512 | 应用图标版 |
| logo-simple.svg | 256x256 | 简约版，小尺寸 |
| logo-dark.svg | 512x512 | 深色背景版 |
| logo-light.svg | 512x512 | 浅色背景版 |
| logo-monochrome.svg | 512x512 | 单色版，打印用 |
| favicon.svg | 64x64 | 网站图标 |
| logo-preview.html | - | Logo 预览页面 |

## 🎨 设计理念

- **核心元素**：地球（圆形）+ 航线（曲线）+ 星点（AI 智能）
- **色彩系统**：
  - 品牌绿 `#63ec13` - 主色调
  - 鼠尾草绿 `#708961` - 辅助色
  - 深林色 `#131811` - 文字色
- **设计风格**：简约、现代、科技感
- **象征意义**：
  - 圆形代表地球和全球化
  - 航线代表旅行和探索
  - 中心点代表"奇点"和 AI 核心
  - 星点代表智能推荐和数据洞察

## 📱 使用场景

### Android 应用图标

需要的尺寸：
```
- mipmap-mdpi: 48x48
- mipmap-hdpi: 72x72
- mipmap-xhdpi: 96x96
- mipmap-xxhdpi: 144x144
- mipmap-xxxhdpi: 192x192
- Play Store: 512x512
```

使用 `logo-icon.svg`，导出为上述尺寸的 PNG 文件。

### iOS 应用图标

需要的尺寸：
```
- iPhone: 60x60 @2x, @3x
- iPad: 76x76 @2x
- App Store: 1024x1024
```

使用 `logo-icon.svg`，导出为 PNG 格式。

### 启动页

- 使用 `logo-light.svg` 或 `logo-main.svg`
- 建议尺寸：512x512 或 1024x1024
- 导出为 PNG 格式

### 网站 Favicon

- 直接使用 `favicon.svg`（现代浏览器支持）
- 或导出为 32x32, 16x16 的 favicon.ico

## 🛠️ 导出工具

### 方法 1：在线转换
- https://cloudconvert.com/svg-to-png
- https://convertio.co/zh/svg-png/

### 方法 2：使用 Figma/Sketch
1. 导入 SVG 文件
2. 设置导出尺寸
3. 批量导出为 PNG

### 方法 3：命令行工具
```bash
# ImageMagick
magick logo-icon.svg -resize 192x192 android-icon.png

# Node.js
npm install -g svg2png
svg2png logo-icon.svg 512 512 > output.png
```

## 📐 尺寸建议

| 使用场景 | 建议尺寸 | 格式 |
|----------|----------|------|
| Android App Icon | 192x192 | PNG |
| iOS App Icon | 1024x1024 | PNG |
| 启动页 | 512x512+ | PNG |
| 网站 Logo | 256x256 | SVG/PNG |
| 打印 | 300DPI+ | PDF/PNG |
| 社交分享 | 1200x630 | PNG |

## ⚠️ 使用规范

1. **保持比例**：不要拉伸或压缩 Logo
2. **留白空间**：Logo 周围至少保留 10% 的留白空间
3. **最小尺寸**：印刷品不小于 20mm 宽，数字媒体不小于 64px 宽
4. **背景选择**：
   - 浅色背景使用 logo-main.svg 或 logo-light.svg
   - 深色背景使用 logo-dark.svg
5. **禁止修改**：不要修改 Logo 的颜色、比例或设计元素

## 🎯 快速开始

1. **查看效果**：双击打开 `logo-preview.html`
2. **导出 PNG**：使用在线工具或设计软件导出所需尺寸
3. **应用到项目**：将导出的 PNG 文件放置到对应目录

## 📞 需要其他尺寸？

如需其他尺寸或格式的 Logo，请：
1. 从 SVG 源文件导出（保持矢量质量）
2. 确保使用正确的颜色模式（RGB 用于屏幕，CMYK 用于印刷）
