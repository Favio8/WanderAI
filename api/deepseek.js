/**
 * DeepSeek API 接口封装
 * 文档: https://platform.deepseek.com/api-docs/
 */

import { request } from '@/utils/request.js'
import { DEEPSEEK_CONFIG, TRAVEL_SYSTEM_PROMPT } from '@/config/deepseek.js'

/**
 * DeepSeek 聊天接口
 * @param {Array} messages - 消息数组
 * @param {Object} options - 可选参数
 * @returns {Promise<Object>} API 响应
 */
export function chat(messages, options = {}) {
	return request({
		url: `${DEEPSEEK_CONFIG.baseURL}/chat/completions`,
		method: 'POST',
		header: {
			'Authorization': `Bearer ${DEEPSEEK_CONFIG.apiKey}`,
			'Content-Type': 'application/json'
		},
		data: {
			model: options.model || DEEPSEEK_CONFIG.model,
			messages: messages,
			temperature: options.temperature !== undefined ? options.temperature : DEEPSEEK_CONFIG.defaultParams.temperature,
			max_tokens: options.max_tokens || DEEPSEEK_CONFIG.defaultParams.max_tokens,
			stream: options.stream || DEEPSEEK_CONFIG.defaultParams.stream
		},
		timeout: options.timeout || DEEPSEEK_CONFIG.timeout
	})
}

/**
 * 发送旅行咨询消息
 * @param {String} content - 用户消息内容
 * @param {Array} history - 对话历史 (可选)
 * @param {Object} options - 额外参数 (可选)
 * @returns {Promise<Object>} API 响应
 */
export function sendTravelMessage(content, history = [], options = {}) {
	// 构建消息数组
	const messages = [
		{
			role: 'system',
			content: options.systemPrompt || TRAVEL_SYSTEM_PROMPT
		},
		...history,
		{
			role: 'user',
			content: content
		}
	]

	return chat(messages, options)
}

/**
 * 解析 API 响应，提取消息内容
 * @param {Object} response - API 响应
 * @returns {String} 消息内容
 */
export function parseMessageContent(response) {
	if (response && response.choices && response.choices.length > 0) {
		return response.choices[0].message.content
	}
	return ''
}

/**
 * 将历史记录转换为 API 消息格式
 * @param {Array} history - 本地存储的历史记录
 * @returns {Array} API 消息格式
 */
export function formatHistoryToMessages(history) {
	return history.map(item => ({
		role: item.role,
		content: item.content
	}))
}

/**
 * 估算 token 数量 (粗略估算: 1 token ≈ 0.75 个中文字)
 * @param {String} text - 文本内容
 * @returns {Number} 估算的 token 数量
 */
export function estimateTokens(text) {
	// 中文字符
	const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length
	// 英文单词
	const englishWords = (text.match(/[a-zA-Z]+/g) || []).length
	// 其他字符
	const otherChars = text.length - chineseChars - englishWords

	return Math.ceil(chineseChars * 1.5 + englishWords * 1.3 + otherChars * 0.5)
}

/**
 * 检查消息是否超长
 * @param {Array} messages - 消息数组
 * @param {Number} maxTokens - 最大 token 数
 * @returns {Boolean} 是否超长
 */
export function isMessagesTooLong(messages, maxTokens = 8000) {
	const totalTokens = messages.reduce((sum, msg) => {
		return sum + estimateTokens(msg.content || '')
	}, 0)
	return totalTokens > maxTokens
}

/**
 * 截断历史记录以适应 token 限制
 * @param {Array} history - 历史记录
 * @param {Number} maxTokens - 最大 token 数
 * @returns {Array} 截断后的历史记录
 */
export function trimHistory(history, maxTokens = 6000) {
	const reversed = [...history].reverse()
	const result = []
	let usedTokens = 0

	for (const msg of reversed) {
		const tokens = estimateTokens(msg.content)
		if (usedTokens + tokens > maxTokens) {
			break
		}
		result.unshift(msg)
		usedTokens += tokens
	}

	return result
}

export default {
	chat,
	sendTravelMessage,
	parseMessageContent,
	formatHistoryToMessages,
	estimateTokens,
	isMessagesTooLong,
	trimHistory
}
