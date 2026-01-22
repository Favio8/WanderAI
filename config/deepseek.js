/**
 * DeepSeek API 配置
 *
 * 重要提示:
 * - 请勿将 API Key 提交到公共代码仓库
 * - 建议使用 .gitignore 忽略此文件或使用环境变量
 * - 如需部署到生产环境，请使用后端代理 API 调用
 */

export const DEEPSEEK_CONFIG = {
	// API 基础地址
	baseURL: 'https://api.deepseek.com/v1',

	// API 密钥 - 请妥善保管
	apiKey: 'sk-9c6e390cd0c9410aa24e98ccb0cd1bad',

	// 使用的模型
	// 可选值: 'deepseek-chat' (通用对话), 'deepseek-coder' (代码专用)
	model: 'deepseek-chat',

	// 默认参数
	defaultParams: {
		// 温度 (0-2): 越高输出越随机，越低越确定
		temperature: 0.7,

		// 最大输出 token 数
		max_tokens: 2000,

		// 是否启用流式输出
		stream: false
	},

	// 请求超时时间 (毫秒) - AI 响应较慢，设置更长超时
	timeout: 90000
}

/**
 * 旅行向导系统提示词
 */
export const TRAVEL_SYSTEM_PROMPT = `你是"漫游奇点"的 AI 旅行向导助手。

你的职责：
1. 帮助用户规划旅行行程，推荐合适的目的地
2. 提供实用的旅行建议和注意事项
3. 介绍当地文化、美食、景点等信息
4. 解答用户关于旅行的各种问题

回复风格：
- 友好、专业、热情
- 信息准确且实用
- 适当使用表情符号增加亲和力
- 回复简洁明了，避免过长

请注意：
- 如果遇到不确定的信息，诚实告知用户
- 尊重不同文化和习俗
- 关注用户的安全和预算`
