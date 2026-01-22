/**
 * 简单的 Markdown 转 HTML 解析器
 * 适用于 uni-app 的 rich-text 组件
 */

/**
 * Markdown 转 HTML
 * @param {String} markdown - Markdown 文本
 * @returns {String} HTML 文本
 */
export function markdownToHtml(markdown) {
	if (!markdown) return ''

	let html = markdown

	// 1. 处理代码块 ```code```
	html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
		return `<pre class="code-block"><code>${escapeHtml(code.trim())}</code></pre>`
	})

	// 2. 处理行内代码 `code`
	html = html.replace(/`([^`]+)`/g, '<code class="inline-code">$1</code>')

	// 3. 处理标题 # ## ###
	html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>')
	html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>')
	html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>')

	// 4. 处理粗体 **text**
	html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

	// 5. 处理斜体 *text*
	html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>')

	// 6. 处理无序列表 - item
	html = html.replace(/^\- (.*$)/gm, '<li>$1</li>')
	html = html.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')

	// 7. 处理有序列表 1. item
	html = html.replace(/^\d+\. (.*$)/gm, '<oli>$1</oli>')
	html = html.replace(/(<oli>.*<\/oli>)/s, '<ol>$1</ol>')
	html = html.replace(/<\/?oli>/g, 'li')

	// 8. 处理链接 [text](url)
	html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

	// 9. 处理图片 ![alt](url)
	html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" />')

	// 10. 处理引用 > text
	html = html.replace(/^> (.*$)/gm, '<blockquote>$1</blockquote>')

	// 11. 处理分割线 ---
	html = html.replace(/^---$/gm, '<hr />')

	// 12. 处理换行 (两个空格或换行符)
	html = html.replace(/\n\n/g, '</p><p>')
	html = html.replace(/\n/g, '<br />')

	// 包装段落
	html = '<p>' + html + '</p>'

	// 清理多余的 p 标签
	html = html.replace(/<p>(<h[1-6]>)/g, '$1')
	html = html.replace(/(<\/h[1-6]>)<\/p>/g, '$1')
	html = html.replace(/<p>(<pre>)/g, '$1')
	html = html.replace(/(<\/pre>)<\/p>/g, '$1')
	html = html.replace(/<p>(<ul>)/g, '$1')
	html = html.replace(/(<\/ul>)<\/p>/g, '$1')
	html = html.replace(/<p>(<ol>)/g, '$1')
	html = html.replace(/(<\/ol>)<\/p>/g, '$1')
	html = html.replace(/<p>(<blockquote>)/g, '$1')
	html = html.replace(/(<\/blockquote>)<\/p>/g, '$1')
	html = html.replace(/<p>(<hr \/>)<\/p>/g, '$1')
	html = html.replace(/<p><\/p>/g, '')

	return html
}

/**
 * HTML 转义，防止 XSS
 * @param {String} text - 原始文本
 * @returns {String} 转义后的文本
 */
function escapeHtml(text) {
	if (!text) return ''
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#039;'
	}
	return text.replace(/[&<>"']/g, m => map[m])
}

/**
 * 简化版 Markdown 转 HTML (只处理常用格式)
 * @param {String} markdown - Markdown 文本
 * @returns {String} HTML 文本
 */
export function simpleMarkdown(markdown) {
	if (!markdown) return ''

	let html = markdown

	// 先处理代码块（避免被其他规则影响）
	html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
		return `<pre style="background:#f5f5f5;padding:16rpx;border-radius:8rpx;overflow-x:auto;"><code style="font-family:monospace;">${escapeHtml(code.trim())}</code></pre>`
	})

	// 行内代码（使用回调函数确保正确替换）
	html = html.replace(/`([^`]+)`/g, (match, code) => {
		return `<code style="background:#f0f0f0;padding:4rpx 8rpx;border-radius:4rpx;font-family:monospace;color:#e83e8c;">${code}</code>`
	})

	// 粗体（使用回调函数）
	html = html.replace(/\*\*([^*]+)\*\*/g, (match, text) => {
		return `<strong>${text}</strong>`
	})

	// 斜体（使用回调函数）
	html = html.replace(/\*([^*]+)\*/g, (match, text) => {
		return `<em>${text}</em>`
	})

	// 标题（使用回调函数）
	html = html.replace(/^### (.*$)/gm, (match, text) => {
		return `<h3 style="font-size:32rpx;font-weight:bold;margin:24rpx 0 16rpx;">${text}</h3>`
	})
	html = html.replace(/^## (.*$)/gm, (match, text) => {
		return `<h2 style="font-size:36rpx;font-weight:bold;margin:24rpx 0 16rpx;">${text}</h2>`
	})
	html = html.replace(/^# (.*$)/gm, (match, text) => {
		return `<h1 style="font-size:40rpx;font-weight:bold;margin:24rpx 0 16rpx;">${text}</h1>`
	})

	// 无序列表处理（逐行处理）
	const lines = html.split('\n')
	let inList = false
	let result = []

	for (let i = 0; i < lines.length; i++) {
		const line = lines[i]
		const listMatch = line.match(/^[\-\*]\s+(.+)$/)

		if (listMatch) {
			if (!inList) {
				result.push('<ul style="margin:16rpx 0;padding-left:32rpx;">')
				inList = true
			}
			// 使用捕获组的内容 listMatch[1]
			result.push(`<li style="margin:8rpx 0;">${listMatch[1]}</li>`)
		} else {
			if (inList) {
				result.push('</ul>')
				inList = false
			}
			result.push(line)
		}
	}

	if (inList) {
		result.push('</ul>')
	}

	html = result.join('\n')

	// 链接（使用回调函数）
	html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
		return `<a href="${url}" style="color:#63ec13;">${text}</a>`
	})

	// 换行处理
	html = html.replace(/\n\n/g, '</p><p style="margin:16rpx 0;">')
	html = html.replace(/\n/g, '<br />')

	html = '<p style="margin:16rpx 0;">' + html + '</p>'

	// 清理多余的 p 标签
	html = html.replace(/<p style="margin:16rpx 0;">(<h[1-3]>)/g, '$1')
	html = html.replace(/(<\/h[1-3]>)<\/p>/g, '$1')
	html = html.replace(/<p style="margin:16rpx 0;">(<pre>)/g, '$1')
	html = html.replace(/(<\/pre>)<\/p>/g, '$1')
	html = html.replace(/<p style="margin:16rpx 0;">(<ul>)/g, '$1')
	html = html.replace(/(<\/ul>)<\/p>/g, '$1')
	html = html.replace(/<p style="margin:16rpx 0;"><\/p>/g, '')

	return html
}

export default {
	markdownToHtml,
	simpleMarkdown,
	escapeHtml
}
