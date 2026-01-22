/**
 * SVG 转 PNG 脚本
 * 使用方法：node convert-to-png.js
 * 依赖：npm install sharp svg2img
 */

const fs = require('fs');
const path = require('path');

// 方法1：使用在线转换（推荐 - 无需安装依赖）
const ONLINE_CONVERT_URL = 'https://cloudconvert.com/svg-to-png';

// 方法2：使用 Node.js 库（需要安装依赖）
// npm install sharp

const icons = [
  { name: 'home', svg: 'home.svg' },
  { name: 'home-active', svg: 'home-active.svg' },
  { name: 'explore', svg: 'explore.svg' },
  { name: 'explore-active', svg: 'explore-active.svg' },
  { name: 'album', svg: 'album.svg' },
  { name: 'album-active', svg: 'album-active.svg' },
  { name: 'profile', svg: 'profile.svg' },
  { name: 'profile-active', svg: 'profile-active.svg' }
];

console.log('='.repeat(50));
console.log('TabBar 图标转换指南');
console.log('='.repeat(50));
console.log('\n方法 1：在线转换（推荐）');
console.log('-------------------');
icons.forEach(icon => {
  console.log(`1. 访问 ${ONLINE_CONVERT_URL}`);
  console.log(`2. 上传 ${icon.svg}`);
  console.log(`3. 下载为 ${icon.name}.png`);
  console.log(`4. 设置输出尺寸：81x81 px\n`);
});

console.log('\n方法 2：使用 Figma/Sketch');
console.log('------------------------');
console.log('1. 打开 Figma 或 Sketch');
console.log('2. 导入所有 .svg 文件');
console.log('3. 批量导出为 PNG (81x81 px)');
console.log('4. 保存到 static/tabbar/ 目录');

console.log('\n方法 3：使用命令行工具（需安装）');
console.log('--------------------------------');
console.log('# 安装 ImageMagick');
console.log('choco install imagemagick  # Windows');
console.log('brew install imagemagick    # Mac');
console.log('\n# 批量转换');
icons.forEach(icon => {
  console.log(`magick ${icon.svg} -resize 81x81 ${icon.name}.png`);
});

console.log('\n' + '='.repeat(50));
console.log('转换完成后的文件清单：');
icons.forEach(icon => {
  console.log(`  ✓ ${icon.name}.png (81x81 px)`);
});
console.log('='.repeat(50));
