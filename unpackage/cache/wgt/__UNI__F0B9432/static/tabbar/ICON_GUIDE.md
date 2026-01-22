# TabBar 图标转换指南

## 📁 当前文件

已创建 8 个 SVG 格式的图标文件：

| 文件名 | 说明 | 颜色 |
|--------|------|------|
| home.svg | 首页（未选中） | #708961 |
| home-active.svg | 首页（选中） | #63ec13 |
| explore.svg | 探索（未选中） | #708961 |
| explore-active.svg | 探索（选中） | #63ec13 |
| album.svg | 相册（未选中） | #708961 |
| album-active.svg | 相册（选中） | #63ec13 |
| profile.svg | 我的（未选中） | #708961 |
| profile-active.svg | 我的（选中） | #63ec13 |

## 🎨 转换方法（3选1）

### 方法 1：使用 HTML 转换工具（最简单）⭐

1. 双击打开 `svg-to-png.html` 文件
2. 点击每个图标的"下载 PNG"按钮
3. 或点击"打包下载所有图标"
4. 将下载的 8 个 PNG 文件保存到 `static/tabbar/` 目录

### 方法 2：使用在线转换工具

访问以下任一网站：
- https://cloudconvert.com/svg-to-png
- https://convertio.co/zh/svg-png/
- https://www.aconvert.com/cn/image/svg-to-png/

步骤：
1. 上传 SVG 文件
2. 设置输出尺寸为 **81x81** px
3. 下载转换后的 PNG 文件

### 方法 3：使用命令行工具（需安装）

**使用 ImageMagick：**
```bash
# 安装 ImageMagick
choco install imagemagick  # Windows
brew install imagemagick    # macOS

# 批量转换
cd static/tabbar
for file in *.svg; do
  magick "$file" -resize 81x81 "${file%.svg}.png"
done
```

**使用 Node.js：**
```bash
npm install -g svg-to-png-converter
svg-to-png -i . -o . -s 81
```

## ✅ 转换完成后的文件清单

转换完成后，`static/tabbar/` 目录应包含以下文件：

```
static/tabbar/
├── home.png              (81x81 px)
├── home-active.png       (81x81 px)
├── explore.png           (81x81 px)
├── explore-active.png    (81x81 px)
├── album.png             (81x81 px)
├── album-active.png      (81x81 px)
├── profile.png           (81x81 px)
├── profile-active.png    (81x81 px)
├── *.svg                 (原始文件，可保留或删除)
├── svg-to-png.html       (转换工具)
├── convert-to-png.js     (转换脚本)
└── ICON_GUIDE.md         (本文件)
```

## 🚀 验证图标

1. 打开 HBuilderX
2. 运行项目到模拟器/真机
3. 检查底部 TabBar 是否正确显示图标
4. 切换 Tab 检查选中状态颜色变化

## ⚠️ 常见问题

**Q: 为什么必须用 PNG 格式？**
A: uni-app 的 tabBar 配置目前只支持 PNG 格式。

**Q: 图标尺寸必须是 81x81 吗？**
A: 建议使用 81x81 px（标准尺寸），也可以使用 162x162 px（2x 清晰度）。

**Q: 颜色可以自定义吗？**
A: 可以！编辑 SVG 文件中的 `stroke` 或 `fill` 颜色值后重新转换。

**Q: 转换后的图标不清晰怎么办？**
A: 使用更高倍数的尺寸（如 162x162）转换，或者使用矢量设计软件（Figma/Sketch）导出。

## 📞 需要帮助？

如果遇到问题，可以：
1. 检查 PNG 文件是否正确放置在 `static/tabbar/` 目录
2. 确认文件名与 `pages.json` 中的配置完全一致
3. 重新编译运行项目
