if (typeof Promise !== "undefined" && !Promise.prototype.finally) {
  Promise.prototype.finally = function(callback) {
    const promise = this.constructor;
    return this.then(
      (value) => promise.resolve(callback()).then(() => value),
      (reason) => promise.resolve(callback()).then(() => {
        throw reason;
      })
    );
  };
}
;
if (typeof uni !== "undefined" && uni && uni.requireGlobal) {
  const global = uni.requireGlobal();
  ArrayBuffer = global.ArrayBuffer;
  Int8Array = global.Int8Array;
  Uint8Array = global.Uint8Array;
  Uint8ClampedArray = global.Uint8ClampedArray;
  Int16Array = global.Int16Array;
  Uint16Array = global.Uint16Array;
  Int32Array = global.Int32Array;
  Uint32Array = global.Uint32Array;
  Float32Array = global.Float32Array;
  Float64Array = global.Float64Array;
  BigInt64Array = global.BigInt64Array;
  BigUint64Array = global.BigUint64Array;
}
;
if (uni.restoreGlobal) {
  uni.restoreGlobal(Vue, weex, plus, setTimeout, clearTimeout, setInterval, clearInterval);
}
(function(vue) {
  "use strict";
  function formatAppLog(type, filename, ...args) {
    if (uni.__log__) {
      uni.__log__(type, filename, ...args);
    } else {
      console[type].apply(console, [...args, filename]);
    }
  }
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _sfc_main$b = {
    data() {
      return {
        hasNavigated: false
      };
    },
    onLoad() {
      this.startNavigationTimer();
    },
    onShow() {
      if (!this.hasNavigated) {
        this.startNavigationTimer();
      }
    },
    methods: {
      startNavigationTimer() {
        setTimeout(() => {
          this.navigateToHome();
        }, 2500);
      },
      navigateToHome() {
        if (this.hasNavigated)
          return;
        this.hasNavigated = true;
        uni.switchTab({
          url: "/pages/chat/chat",
          fail: (err) => {
            formatAppLog("error", "at pages/splash/splash.vue:73", "跳转失败:", err);
            uni.reLaunch({
              url: "/pages/chat/chat"
            });
          }
        });
      }
    }
  };
  function _sfc_render$b(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "splash-container" }, [
      vue.createElementVNode("view", { class: "bg-decoration" }, [
        vue.createElementVNode("view", { class: "bg-circle" })
      ]),
      vue.createElementVNode("view", { class: "flex-1" }),
      vue.createElementVNode("view", { class: "content-area" }, [
        vue.createElementVNode("view", { class: "logo-container" }, [
          vue.createElementVNode("view", { class: "logo-box" }, [
            vue.createElementVNode("text", { class: "logo-icon" }, "🌍"),
            vue.createElementVNode("view", { class: "logo-dot" })
          ])
        ]),
        vue.createElementVNode("text", { class: "app-title" }, "漫游奇点"),
        vue.createElementVNode("text", { class: "app-subtitle" }, "为您的心灵之旅而设计。")
      ]),
      vue.createElementVNode("view", { class: "flex-2" }),
      vue.createElementVNode("view", { class: "bottom-area" }, [
        vue.createElementVNode("view", { class: "loading-dots" }, [
          vue.createElementVNode("view", { class: "dot dot-1" }),
          vue.createElementVNode("view", { class: "dot dot-2" }),
          vue.createElementVNode("view", { class: "dot dot-3" })
        ]),
        vue.createElementVNode("text", { class: "version-text" }, "v1.0.2")
      ]),
      vue.createElementVNode("view", { class: "noise-texture" })
    ]);
  }
  const PagesSplashSplash = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", _sfc_render$b], ["__scopeId", "data-v-b5d3b004"], ["__file", "D:/2026_all_Favio/AI_exploring/personal/WanderAI/pages/splash/splash.vue"]]);
  function request(options) {
    return new Promise((resolve, reject) => {
      uni.request({
        url: options.url,
        method: options.method || "GET",
        data: options.data || {},
        header: {
          "Content-Type": "application/json",
          ...options.header
        },
        timeout: options.timeout || 6e4,
        // 默认 60 秒超时
        sslVerify: options.sslVerify !== void 0 ? options.sslVerify : false,
        // 默认不验证 SSL（解决证书问题）
        dataType: "json",
        success: (res) => {
          var _a, _b, _c;
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(res.data);
          } else {
            reject({
              statusCode: res.statusCode,
              message: ((_a = res.data) == null ? void 0 : _a.message) || ((_c = (_b = res.data) == null ? void 0 : _b.error) == null ? void 0 : _c.message) || "请求失败",
              data: res.data
            });
          }
        },
        fail: (err) => {
          formatAppLog("error", "at utils/request.js:43", "[请求失败]", options.url, err);
          reject({
            statusCode: -1,
            message: err.errMsg || "网络请求失败",
            error: err
          });
        }
      });
    });
  }
  const DEEPSEEK_CONFIG = {
    // API 基础地址
    baseURL: "https://api.deepseek.com/v1",
    // API 密钥 - 请妥善保管
    apiKey: "sk-9c6e390cd0c9410aa24e98ccb0cd1bad",
    // 使用的模型
    // 可选值: 'deepseek-chat' (通用对话), 'deepseek-coder' (代码专用)
    model: "deepseek-chat",
    // 默认参数
    defaultParams: {
      // 温度 (0-2): 越高输出越随机，越低越确定
      temperature: 0.7,
      // 最大输出 token 数
      max_tokens: 2e3,
      // 是否启用流式输出
      stream: false
    },
    // 请求超时时间 (毫秒) - AI 响应较慢，设置更长超时
    timeout: 9e4
  };
  const TRAVEL_SYSTEM_PROMPT = `你是"漫游奇点"的 AI 旅行向导助手。

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
- 关注用户的安全和预算`;
  function chat(messages, options = {}) {
    return request({
      url: `${DEEPSEEK_CONFIG.baseURL}/chat/completions`,
      method: "POST",
      header: {
        "Authorization": `Bearer ${DEEPSEEK_CONFIG.apiKey}`,
        "Content-Type": "application/json"
      },
      data: {
        model: options.model || DEEPSEEK_CONFIG.model,
        messages,
        temperature: options.temperature !== void 0 ? options.temperature : DEEPSEEK_CONFIG.defaultParams.temperature,
        max_tokens: options.max_tokens || DEEPSEEK_CONFIG.defaultParams.max_tokens,
        stream: options.stream || DEEPSEEK_CONFIG.defaultParams.stream
      },
      timeout: options.timeout || DEEPSEEK_CONFIG.timeout
    });
  }
  function sendTravelMessage(content, history = [], options = {}) {
    const messages = [
      {
        role: "system",
        content: options.systemPrompt || TRAVEL_SYSTEM_PROMPT
      },
      ...history,
      {
        role: "user",
        content
      }
    ];
    return chat(messages, options);
  }
  function parseMessageContent(response) {
    if (response && response.choices && response.choices.length > 0) {
      return response.choices[0].message.content;
    }
    return "";
  }
  function formatHistoryToMessages(history) {
    return history.map((item) => ({
      role: item.role,
      content: item.content
    }));
  }
  function estimateTokens(text) {
    const chineseChars = (text.match(/[\u4e00-\u9fa5]/g) || []).length;
    const englishWords = (text.match(/[a-zA-Z]+/g) || []).length;
    const otherChars = text.length - chineseChars - englishWords;
    return Math.ceil(chineseChars * 1.5 + englishWords * 1.3 + otherChars * 0.5);
  }
  function isMessagesTooLong(messages, maxTokens = 8e3) {
    const totalTokens = messages.reduce((sum, msg) => {
      return sum + estimateTokens(msg.content || "");
    }, 0);
    return totalTokens > maxTokens;
  }
  function trimHistory(history, maxTokens = 6e3) {
    const reversed = [...history].reverse();
    const result = [];
    let usedTokens = 0;
    for (const msg of reversed) {
      const tokens = estimateTokens(msg.content);
      if (usedTokens + tokens > maxTokens) {
        break;
      }
      result.unshift(msg);
      usedTokens += tokens;
    }
    return result;
  }
  const deepseek = {
    chat,
    sendTravelMessage,
    parseMessageContent,
    formatHistoryToMessages,
    estimateTokens,
    isMessagesTooLong,
    trimHistory
  };
  const deepseek$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
    __proto__: null,
    chat,
    default: deepseek,
    estimateTokens,
    formatHistoryToMessages,
    isMessagesTooLong,
    parseMessageContent,
    sendTravelMessage,
    trimHistory
  }, Symbol.toStringTag, { value: "Module" }));
  function getStorage(key, defaultValue = null) {
    try {
      const value = uni.getStorageSync(key);
      return value !== "" ? value : defaultValue;
    } catch (e) {
      formatAppLog("error", "at utils/storage.js:17", "getStorage error:", e);
      return defaultValue;
    }
  }
  function setStorage(key, value) {
    try {
      uni.setStorageSync(key, value);
      return true;
    } catch (e) {
      formatAppLog("error", "at utils/storage.js:33", "setStorage error:", e);
      return false;
    }
  }
  function removeStorage(key) {
    try {
      uni.removeStorageSync(key);
      return true;
    } catch (e) {
      formatAppLog("error", "at utils/storage.js:48", "removeStorage error:", e);
      return false;
    }
  }
  function clearStorage() {
    try {
      uni.clearStorageSync();
      return true;
    } catch (e) {
      formatAppLog("error", "at utils/storage.js:62", "clearStorage error:", e);
      return false;
    }
  }
  function getStorageInfo() {
    try {
      return uni.getStorageInfoSync();
    } catch (e) {
      formatAppLog("error", "at utils/storage.js:75", "getStorageInfo error:", e);
      return null;
    }
  }
  const STORAGE_KEYS = {
    // 聊天相关
    CHAT_HISTORY: "chat_history",
    // 聊天历史记录
    CHAT_MESSAGES: "chat_messages",
    // 聊天消息列表
    // 用户相关
    USER_PROFILE: "user_profile",
    // 用户资料
    USER_SETTINGS: "user_settings",
    // 用户设置
    SETTINGS: "app_settings",
    // 应用设置
    THEME: "app_theme",
    // 应用主题
    // 行程相关
    ITINERARIES: "itineraries",
    // 行程列表
    // 目的地相关
    DESTINATIONS: "destinations",
    // 目的地列表
    FAVORITES: "favorites",
    // 收藏列表
    // 相册相关
    ALBUMS: "albums",
    // 相册列表
    PHOTOS: "photos"
    // 照片列表
  };
  const storage = {
    get: getStorage,
    set: setStorage,
    remove: removeStorage,
    clear: clearStorage,
    info: getStorageInfo,
    keys: STORAGE_KEYS
  };
  const THEMES = {
    light: {
      id: "light",
      name: "浅色",
      icon: "☀️",
      backgroundColor: "#f7f8f6",
      textColor: "#131811",
      secondaryTextColor: "#708961",
      cardBackgroundColor: "#ffffff",
      borderColor: "rgba(0, 0, 0, 0.05)",
      shadowColor: "rgba(0, 0, 0, 0.05)",
      overlayColor: "rgba(0, 0, 0, 0.4)",
      navigationBarFrontColor: "#000000",
      navigationBarBackgroundColor: "#ffffff"
    },
    dark: {
      id: "dark",
      name: "深色",
      icon: "🌙",
      backgroundColor: "#1a1a1a",
      textColor: "#ffffff",
      secondaryTextColor: "#b0b0b0",
      cardBackgroundColor: "#2a2a2a",
      borderColor: "rgba(255, 255, 255, 0.1)",
      shadowColor: "rgba(0, 0, 0, 0.2)",
      overlayColor: "rgba(0, 0, 0, 0.6)",
      navigationBarFrontColor: "#ffffff",
      navigationBarBackgroundColor: "#1a1a1a"
    }
  };
  function getCurrentTheme() {
    try {
      return storage.get(STORAGE_KEYS.THEME) || "light";
    } catch (e) {
      formatAppLog("error", "at services/theme.js:50", "获取主题失败:", e);
      return "light";
    }
  }
  function setTheme(themeId) {
    try {
      storage.set(STORAGE_KEYS.THEME, themeId);
      applyTheme(themeId);
      return true;
    } catch (e) {
      formatAppLog("error", "at services/theme.js:66", "设置主题失败:", e);
      return false;
    }
  }
  function applyTheme(themeId) {
    const theme = THEMES[themeId] || THEMES.light;
    try {
      uni.setNavigationBarColor({
        frontColor: theme.navigationBarFrontColor,
        backgroundColor: theme.navigationBarBackgroundColor
      });
    } catch (e) {
      formatAppLog("error", "at services/theme.js:85", "设置导航栏颜色失败:", e);
    }
    try {
      uni.setTabBarStyle({
        selectedColor: "#63ec13",
        backgroundColor: theme.navigationBarBackgroundColor
      });
    } catch (e) {
      formatAppLog("error", "at services/theme.js:95", "设置 tabBar 颜色失败:", e);
    }
  }
  function getThemeConfig(themeId) {
    return THEMES[themeId] || THEMES.light;
  }
  function getCurrentThemeConfig() {
    const themeId = getCurrentTheme();
    return getThemeConfig(themeId);
  }
  function toggleTheme(themeId) {
    setTheme(themeId);
    uni.$emit("theme-change", themeId);
    uni.showToast({
      title: "主题已切换",
      icon: "success"
    });
  }
  function onThemeChange(callback) {
    uni.$on("theme-change", callback);
  }
  function offThemeChange(callback) {
    uni.$off("theme-change", callback);
  }
  function getThemeList() {
    return Object.values(THEMES);
  }
  const themeService = {
    THEMES,
    getCurrentTheme,
    setTheme,
    applyTheme,
    getThemeConfig,
    getCurrentThemeConfig,
    toggleTheme,
    getThemeList
  };
  function escapeHtml(text) {
    if (!text)
      return "";
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
  function simpleMarkdown(markdown) {
    if (!markdown)
      return "";
    let html = markdown;
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (match, lang, code) => {
      return `<pre style="background:#f5f5f5;padding:16rpx;border-radius:8rpx;overflow-x:auto;"><code style="font-family:monospace;">${escapeHtml(code.trim())}</code></pre>`;
    });
    html = html.replace(/`([^`]+)`/g, (match, code) => {
      return `<code style="background:#f0f0f0;padding:4rpx 8rpx;border-radius:4rpx;font-family:monospace;color:#e83e8c;">${code}</code>`;
    });
    html = html.replace(/\*\*([^*]+)\*\*/g, (match, text) => {
      return `<strong>${text}</strong>`;
    });
    html = html.replace(/\*([^*]+)\*/g, (match, text) => {
      return `<em>${text}</em>`;
    });
    html = html.replace(/^### (.*$)/gm, (match, text) => {
      return `<h3 style="font-size:32rpx;font-weight:bold;margin:24rpx 0 16rpx;">${text}</h3>`;
    });
    html = html.replace(/^## (.*$)/gm, (match, text) => {
      return `<h2 style="font-size:36rpx;font-weight:bold;margin:24rpx 0 16rpx;">${text}</h2>`;
    });
    html = html.replace(/^# (.*$)/gm, (match, text) => {
      return `<h1 style="font-size:40rpx;font-weight:bold;margin:24rpx 0 16rpx;">${text}</h1>`;
    });
    const lines = html.split("\n");
    let inList = false;
    let result = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const listMatch = line.match(/^[\-\*]\s+(.+)$/);
      if (listMatch) {
        if (!inList) {
          result.push('<ul style="margin:16rpx 0;padding-left:32rpx;">');
          inList = true;
        }
        result.push(`<li style="margin:8rpx 0;">${listMatch[1]}</li>`);
      } else {
        if (inList) {
          result.push("</ul>");
          inList = false;
        }
        result.push(line);
      }
    }
    if (inList) {
      result.push("</ul>");
    }
    html = result.join("\n");
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
      return `<a href="${url}" style="color:#63ec13;">${text}</a>`;
    });
    html = html.replace(/\n\n/g, '</p><p style="margin:16rpx 0;">');
    html = html.replace(/\n/g, "<br />");
    html = '<p style="margin:16rpx 0;">' + html + "</p>";
    html = html.replace(/<p style="margin:16rpx 0;">(<h[1-3]>)/g, "$1");
    html = html.replace(/(<\/h[1-3]>)<\/p>/g, "$1");
    html = html.replace(/<p style="margin:16rpx 0;">(<pre>)/g, "$1");
    html = html.replace(/(<\/pre>)<\/p>/g, "$1");
    html = html.replace(/<p style="margin:16rpx 0;">(<ul>)/g, "$1");
    html = html.replace(/(<\/ul>)<\/p>/g, "$1");
    html = html.replace(/<p style="margin:16rpx 0;"><\/p>/g, "");
    return html;
  }
  const WELCOME_MESSAGE = {
    role: "ai",
    content: "您好！您梦想中的下一个目的地是哪里？我可以帮您规划完美的旅行。",
    timestamp: /* @__PURE__ */ new Date()
  };
  const _sfc_main$a = {
    data() {
      return {
        messages: [],
        inputValue: "",
        isTyping: false,
        scrollIntoView: "",
        errorMessage: "",
        chatHistory: [],
        // API 格式的对话历史
        // Android 适配：系统信息
        statusBarHeight: 44,
        // 默认值，会在 onLoad 中更新
        safeAreaInsets: { top: 0, right: 0, bottom: 0, left: 0 },
        safeAreaInsetBottom: 0,
        // 底部安全区高度（px）
        tabBarHeight: 60
        // TabBar 高度（px）
      };
    },
    onLoad(options) {
      formatAppLog("log", "at pages/chat/chat.vue:122", "聊天页加载，参数:", options);
      this.loadChatHistory();
      onThemeChange(this.handleThemeChange);
      this.initSystemInfo();
      if (options && options.prompt) {
        this.$nextTick(() => {
          setTimeout(() => {
            this.handlePromptFromUrl(decodeURIComponent(options.prompt));
          }, 500);
        });
      }
    },
    onUnload() {
      offThemeChange(this.handleThemeChange);
    },
    methods: {
      /**
       * 初始化系统信息（Android 适配）
       * 获取状态栏高度、安全区域等，用于布局适配
       */
      initSystemInfo() {
        var _a;
        try {
          const systemInfo = uni.getSystemInfoSync();
          this.statusBarHeight = systemInfo.statusBarHeight || 44;
          this.safeAreaInsets = systemInfo.safeArea || { top: 0, right: 0, bottom: 0, left: 0 };
          this.safeAreaInsetBottom = systemInfo.screenHeight - (((_a = systemInfo.safeArea) == null ? void 0 : _a.bottom) || systemInfo.screenHeight);
          formatAppLog("log", "at pages/chat/chat.vue:160", "[Chat] 系统信息:", {
            statusBarHeight: this.statusBarHeight,
            safeAreaInsets: this.safeAreaInsets,
            safeAreaInsetBottom: this.safeAreaInsetBottom
          });
        } catch (e) {
          formatAppLog("error", "at pages/chat/chat.vue:166", "[Chat] 获取系统信息失败:", e);
        }
      },
      /**
       * 加载聊天历史
       */
      loadChatHistory() {
        try {
          const savedMessages = storage.get(STORAGE_KEYS.CHAT_MESSAGES);
          const savedHistory = storage.get(STORAGE_KEYS.CHAT_HISTORY);
          if (savedMessages && savedMessages.length > 0) {
            this.messages = savedMessages;
          } else {
            this.messages = [WELCOME_MESSAGE];
          }
          if (savedHistory) {
            this.chatHistory = savedHistory;
          }
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        } catch (e) {
          formatAppLog("error", "at pages/chat/chat.vue:193", "加载历史失败:", e);
          this.messages = [WELCOME_MESSAGE];
        }
      },
      /**
       * 保存聊天历史
       */
      saveChatHistory() {
        try {
          storage.set(STORAGE_KEYS.CHAT_MESSAGES, this.messages);
          storage.set(STORAGE_KEYS.CHAT_HISTORY, this.chatHistory);
        } catch (e) {
          formatAppLog("error", "at pages/chat/chat.vue:206", "保存历史失败:", e);
        }
      },
      /**
       * 清空聊天历史
       */
      handleClearHistory() {
        uni.showModal({
          title: "确认清空",
          content: "确定要清空所有聊天记录吗？",
          success: (res) => {
            if (res.confirm) {
              this.messages = [WELCOME_MESSAGE];
              this.chatHistory = [];
              this.saveChatHistory();
              uni.showToast({
                title: "已清空",
                icon: "success"
              });
            }
          }
        });
      },
      /**
       * 发送消息
       */
      async handleSendMessage() {
        const content = this.inputValue.trim();
        if (!content || this.isTyping)
          return;
        this.inputValue = "";
        this.errorMessage = "";
        this.addMessage("user", content);
        this.chatHistory.push({
          role: "user",
          content
        });
        this.saveChatHistory();
        this.isTyping = true;
        try {
          const trimmedHistory = trimHistory(this.chatHistory, 6e3);
          const response = await sendTravelMessage(content, trimmedHistory);
          const aiContent = parseMessageContent(response);
          this.addMessage("ai", aiContent);
          this.chatHistory.push({
            role: "assistant",
            content: aiContent
          });
          this.saveChatHistory();
        } catch (error) {
          formatAppLog("error", "at pages/chat/chat.vue:280", "API 调用失败:", error);
          this.errorMessage = this.getErrorMessage(error);
          this.addMessage("ai", "抱歉，我暂时无法回复。请检查网络连接后重试。");
          this.chatHistory.pop();
        } finally {
          this.isTyping = false;
        }
      },
      /**
       * 添加消息到界面
       */
      addMessage(role, content) {
        this.messages.push({
          role,
          content,
          timestamp: /* @__PURE__ */ new Date()
        });
        this.$nextTick(() => {
          this.scrollToBottom();
        });
      },
      /**
       * 滚动到底部
       */
      scrollToBottom() {
        if (this.messages.length > 0) {
          this.scrollIntoView = "msg-" + (this.messages.length - 1);
        }
      },
      /**
       * 获取错误信息
       */
      getErrorMessage(error) {
        if (error.statusCode === 401) {
          return "API 密钥无效，请检查配置";
        } else if (error.statusCode === 429) {
          return "请求过于频繁，请稍后再试";
        } else if (error.statusCode === -1) {
          return "网络连接失败，请检查网络";
        }
        return error.message || "请求失败";
      },
      /**
       * 处理主题变化
       */
      handleThemeChange(themeId) {
        formatAppLog("log", "at pages/chat/chat.vue:332", "主题变化:", themeId);
      },
      /**
       * 处理从 URL 传递过来的 prompt
       */
      handlePromptFromUrl(prompt) {
        formatAppLog("log", "at pages/chat/chat.vue:341", "处理 URL prompt:", prompt);
        if (!prompt || !prompt.trim())
          return;
        this.inputValue = prompt;
        this.handleSendMessage();
      },
      /**
       * 将 Markdown 转换为 HTML
       */
      renderMarkdown(content) {
        return simpleMarkdown(content);
      }
    }
  };
  function _sfc_render$a(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "chat-container" }, [
      vue.createElementVNode(
        "view",
        {
          class: "status-bar-placeholder",
          style: vue.normalizeStyle({ height: $data.statusBarHeight + "px" })
        },
        null,
        4
        /* STYLE */
      ),
      vue.createElementVNode("view", { class: "chat-header" }, [
        vue.createElementVNode("view", { class: "header-avatar" }, [
          vue.createElementVNode("text", { class: "avatar-icon" }, "🤖")
        ]),
        vue.createElementVNode("text", { class: "header-title" }, "漫游向导"),
        vue.createElementVNode("view", { class: "header-actions" }, [
          vue.createElementVNode("button", {
            class: "more-btn",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.handleClearHistory && $options.handleClearHistory(...args))
          }, [
            vue.createElementVNode("text", { class: "more-icon" }, "🗑️")
          ])
        ])
      ]),
      vue.createElementVNode("scroll-view", {
        class: "messages-area",
        "scroll-y": "",
        "scroll-into-view": $data.scrollIntoView,
        "scroll-with-animation": true
      }, [
        (vue.openBlock(true), vue.createElementBlock(
          vue.Fragment,
          null,
          vue.renderList($data.messages, (msg, index) => {
            return vue.openBlock(), vue.createElementBlock("view", {
              key: index,
              id: "msg-" + index,
              class: vue.normalizeClass(["message-item", msg.role === "user" ? "message-user" : "message-ai"])
            }, [
              msg.role === "ai" ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 0,
                class: "avatar ai-avatar"
              }, [
                vue.createElementVNode("image", {
                  class: "avatar-img",
                  src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaTFVAvVtBpKaaOqBQc-6GryNABnseE_0y4ShxE_YSqYhPz7x9sPlVgy5iDqUUNibsFdSmFoPoMruSXFoJzNurQ21EhhWspGUex08lhoWM9FCS9Nuy1a9egaW7ejH5Z9p_nDG_Pu1FtUKgnu7FF5H4U4gVA1OlaY4Yybma_sceytFJYsQz0kn5MN9QYqvIh8QagxOlRxh-puJSzC9Jsu5Zv9No_c3uPzrKzna-kX6wbjY7YlyZnK2LYAF4cAVKgkp6r82r49cL8iM",
                  mode: "aspectFill"
                })
              ])) : vue.createCommentVNode("v-if", true),
              vue.createElementVNode(
                "view",
                {
                  class: vue.normalizeClass(["message-content", msg.role === "user" ? "content-user" : "content-ai"])
                },
                [
                  msg.role === "ai" ? (vue.openBlock(), vue.createElementBlock("text", {
                    key: 0,
                    class: "message-name"
                  }, "漫游向导")) : vue.createCommentVNode("v-if", true),
                  vue.createElementVNode(
                    "view",
                    {
                      class: vue.normalizeClass(["message-bubble", msg.role === "user" ? "bubble-user" : "bubble-ai"])
                    },
                    [
                      msg.role === "ai" ? (vue.openBlock(), vue.createElementBlock("rich-text", {
                        key: 0,
                        class: "message-text",
                        nodes: $options.renderMarkdown(msg.content)
                      }, null, 8, ["nodes"])) : (vue.openBlock(), vue.createElementBlock(
                        "text",
                        {
                          key: 1,
                          class: "message-text"
                        },
                        vue.toDisplayString(msg.content),
                        1
                        /* TEXT */
                      ))
                    ],
                    2
                    /* CLASS */
                  )
                ],
                2
                /* CLASS */
              ),
              msg.role === "user" ? (vue.openBlock(), vue.createElementBlock("view", {
                key: 1,
                class: "avatar user-avatar"
              }, [
                vue.createElementVNode("image", {
                  class: "avatar-img",
                  src: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0aSiQauxMI8oZc-PIhq1fHCKDqXbw17x6zHEJqLLitjl5RgWj3svyV7wlWNgS_M5YCK7H07qF6eICeqh-ISaEypGA3UV9kdaNJt2_8K769hC5DvSAqkbqcKww_DEJDhoSzQers3WHUYPwaGvWGHdV-gF88iZyhDVmuyXR2HeVenFpoq5A8lsIZLeGUaBZBlMHOFXaMQQWCoZi6rGVCytqGV3-1SIuIReECcgvdEu_bZQRBiGrs8fCnGAEGr87Z3RiGZ9cl2GEITU",
                  mode: "aspectFill"
                })
              ])) : vue.createCommentVNode("v-if", true)
            ], 10, ["id"]);
          }),
          128
          /* KEYED_FRAGMENT */
        )),
        $data.isTyping ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "typing-indicator"
        }, [
          vue.createElementVNode("text", { class: "typing-text" }, "漫游向导正在思考...")
        ])) : vue.createCommentVNode("v-if", true),
        $data.errorMessage ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "error-message"
        }, [
          vue.createElementVNode(
            "text",
            { class: "error-text" },
            vue.toDisplayString($data.errorMessage),
            1
            /* TEXT */
          )
        ])) : vue.createCommentVNode("v-if", true)
      ], 8, ["scroll-into-view"]),
      vue.createElementVNode(
        "view",
        {
          class: "input-area",
          style: vue.normalizeStyle({ paddingBottom: $data.safeAreaInsetBottom + "px" })
        },
        [
          vue.createElementVNode("view", { class: "input-box" }, [
            vue.withDirectives(vue.createElementVNode(
              "input",
              {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.inputValue = $event),
                class: "message-input",
                placeholder: "输入您想去的地方...",
                "placeholder-class": "input-placeholder",
                onConfirm: _cache[2] || (_cache[2] = (...args) => $options.handleSendMessage && $options.handleSendMessage(...args))
              },
              null,
              544
              /* NEED_HYDRATION, NEED_PATCH */
            ), [
              [vue.vModelText, $data.inputValue]
            ]),
            vue.createElementVNode("button", {
              class: "send-btn",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.handleSendMessage && $options.handleSendMessage(...args)),
              disabled: $data.isTyping
            }, [
              vue.createElementVNode("text", { class: "send-icon" }, "➤")
            ], 8, ["disabled"])
          ])
        ],
        4
        /* STYLE */
      )
    ]);
  }
  const PagesChatChat = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", _sfc_render$a], ["__scopeId", "data-v-0a633310"], ["__file", "D:/2026_all_Favio/AI_exploring/personal/WanderAI/pages/chat/chat.vue"]]);
  const STORAGE_KEY_TRENDING = "trending_destinations";
  const STORAGE_KEY_LAST_UPDATE = "trending_last_update";
  const UPDATE_INTERVAL_DAYS = 7;
  function generateTrendingPrompt() {
    const now = /* @__PURE__ */ new Date();
    const month = now.getMonth() + 1;
    const season = getSeason(month);
    return `你是一个专业的旅游推荐助手。请根据当前时间（${month}月，${season}）推荐热门旅游目的地。

请按以下JSON格式返回数据（只返回JSON，不要其他文字）：
{
	"domestic": [
		{
			"name": "目的地名称",
			"location": "省份/地区",
			"rating": 4.5-5.0,
			"tags": ["文化", "自然", "美食", "城市", "超值", "宁静海滩"],
			"description": "一句话描述（20字以内）",
			"reason": "为什么这个季节推荐（30字以内）",
			"isTopPick": true/false
		}
	],
	"international": [
		{
			"name": "Destination Name",
			"location": "国家",
			"rating": 4.5-5.0,
			"tags": ["文化", "自然", "美食", "城市", "超值", "宁静海滩"],
			"description": "One sentence description",
			"reason": "Why recommended this season",
			"isTopPick": true/false
		}
	]
}

要求：
1. 国内推荐8-10个，国际推荐8-10个
2. 考虑当前季节的气候和旅游特点
3. 标签从以下选择：文化、自然、美食、城市、超值、宁静海滩
4. isTopPick true的占30%左右
5. description要吸引人，reason要说明为什么这个季节适合
6. 图片URL使用占位符: https://images.unsplash.com/photo-{random}?w=800`;
  }
  function getSeason(month) {
    if (month >= 3 && month <= 5)
      return "春季";
    if (month >= 6 && month <= 8)
      return "夏季";
    if (month >= 9 && month <= 11)
      return "秋季";
    return "冬季";
  }
  function parseAIResponse(response) {
    try {
      return JSON.parse(response);
    } catch (e) {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      throw new Error("无法解析 AI 返回的数据");
    }
  }
  function convertToDestinations(aiData, imageSeed) {
    const destinations = [];
    let id = 1;
    if (aiData.domestic && Array.isArray(aiData.domestic)) {
      aiData.domestic.forEach((item) => {
        destinations.push({
          id: String(id++),
          name: item.name,
          location: `${item.location}, 中国`,
          rating: item.rating || 4.5,
          image: item.image || `https://images.unsplash.com/photo-${imageSeed + id}?w=800`,
          tags: item.tags || ["文化"],
          isFavorite: false,
          isTopPick: item.isTopPick || false,
          description: item.description || ""
        });
      });
    }
    if (aiData.international && Array.isArray(aiData.international)) {
      aiData.international.forEach((item) => {
        destinations.push({
          id: String(id++),
          name: item.name,
          location: item.location,
          rating: item.rating || 4.5,
          image: item.image || `https://images.unsplash.com/photo-${imageSeed + id}?w=800`,
          tags: item.tags || ["文化"],
          isFavorite: false,
          isTopPick: item.isTopPick || false,
          description: item.description || ""
        });
      });
    }
    return destinations;
  }
  async function fetchTrendingFromAI() {
    var _a, _b, _c;
    try {
      formatAppLog("log", "at services/trendingDestinations.js:135", "[热门目的地] 开始从 AI 获取数据...");
      const prompt = generateTrendingPrompt();
      const messages = [{ role: "user", content: prompt }];
      const response = await chat(messages, {
        temperature: 0.7,
        max_tokens: 2e3,
        timeout: 9e4
        // 90秒超时
      });
      const content = ((_c = (_b = (_a = response == null ? void 0 : response.choices) == null ? void 0 : _a[0]) == null ? void 0 : _b.message) == null ? void 0 : _c.content) || (response == null ? void 0 : response.content) || "";
      if (!content) {
        throw new Error("AI 返回为空");
      }
      formatAppLog("log", "at services/trendingDestinations.js:154", "[热门目的地] AI 返回成功，长度:", content.length);
      const aiData = parseAIResponse(content);
      const imageSeed = Date.now();
      const destinations = convertToDestinations(aiData, imageSeed);
      formatAppLog("log", "at services/trendingDestinations.js:163", "[热门目的地] 成功获取", destinations.length, "个目的地");
      return destinations;
    } catch (e) {
      formatAppLog("error", "at services/trendingDestinations.js:167", "[热门目的地] 获取失败:", e);
      if (e.statusCode === -1) {
        formatAppLog("error", "at services/trendingDestinations.js:171", "[热门目的地] 网络连接失败，请检查网络设置");
      } else if (e.statusCode === 401) {
        formatAppLog("error", "at services/trendingDestinations.js:173", "[热门目的地] API 密钥无效");
      } else if (e.statusCode === 429) {
        formatAppLog("error", "at services/trendingDestinations.js:175", "[热门目的地] API 请求频率限制");
      }
      throw e;
    }
  }
  function shouldUpdate() {
    try {
      const lastUpdate = storage.get(STORAGE_KEY_LAST_UPDATE, 0);
      const now = Date.now();
      const daysSinceUpdate = (now - lastUpdate) / (1e3 * 60 * 60 * 24);
      formatAppLog("log", "at services/trendingDestinations.js:191", "[热门目的地] 距离上次更新:", daysSinceUpdate.toFixed(1), "天");
      return daysSinceUpdate >= UPDATE_INTERVAL_DAYS || lastUpdate === 0;
    } catch (e) {
      formatAppLog("error", "at services/trendingDestinations.js:195", "[热门目的地] 检查更新失败:", e);
      return true;
    }
  }
  async function getTrendingDestinations(forceUpdate = false) {
    try {
      if (!forceUpdate && !shouldUpdate()) {
        const cached = storage.get(STORAGE_KEY_TRENDING);
        if (cached && cached.length > 0) {
          formatAppLog("log", "at services/trendingDestinations.js:211", "[热门目的地] 使用缓存数据，共", cached.length, "个");
          return cached;
        }
      }
      formatAppLog("log", "at services/trendingDestinations.js:217", "[热门目的地] 正在更新热门目的地...");
      const destinations = await fetchTrendingFromAI();
      storage.set(STORAGE_KEY_TRENDING, destinations);
      storage.set(STORAGE_KEY_LAST_UPDATE, Date.now());
      formatAppLog("log", "at services/trendingDestinations.js:224", "[热门目的地] 更新完成，下次更新时间:", UPDATE_INTERVAL_DAYS, "天后");
      return destinations;
    } catch (e) {
      formatAppLog("error", "at services/trendingDestinations.js:228", "[热门目的地] 获取失败，使用缓存数据:", e);
      const cached = storage.get(STORAGE_KEY_TRENDING, []);
      if (cached.length > 0) {
        return cached;
      }
      return [];
    }
  }
  async function getDomesticTrending(forceUpdate = false) {
    const all = await getTrendingDestinations(forceUpdate);
    return all.filter((dest) => dest.location.includes("中国"));
  }
  async function getInternationalTrending(forceUpdate = false) {
    const all = await getTrendingDestinations(forceUpdate);
    return all.filter((dest) => !dest.location.includes("中国"));
  }
  async function forceUpdateTrending() {
    return await getTrendingDestinations(true);
  }
  function getUpdateInfo() {
    const lastUpdate = storage.get(STORAGE_KEY_LAST_UPDATE, 0);
    const nextUpdate = lastUpdate + UPDATE_INTERVAL_DAYS * 24 * 60 * 60 * 1e3;
    const now = Date.now();
    return {
      lastUpdate: new Date(lastUpdate),
      nextUpdate: new Date(nextUpdate),
      daysUntilUpdate: Math.max(0, Math.floor((nextUpdate - now) / (24 * 60 * 60 * 1e3))),
      isStale: now >= nextUpdate
    };
  }
  function clearTrendingCache() {
    storage.remove(STORAGE_KEY_TRENDING);
    storage.remove(STORAGE_KEY_LAST_UPDATE);
    formatAppLog("log", "at services/trendingDestinations.js:286", "[热门目的地] 缓存已清除");
  }
  const trendingService = {
    getTrendingDestinations,
    getDomesticTrending,
    getInternationalTrending,
    forceUpdateTrending,
    getUpdateInfo,
    clearTrendingCache
  };
  const MOCK_DESTINATIONS = [
    // ========== 东南亚目的地 ==========
    {
      id: "1",
      name: "佩尼达岛",
      location: "印度尼西亚",
      rating: 4.9,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrC3zXvqCRWlRdlSG4N7lQuhwQYT3phB0fD8osyJGCF8mFv5fmdIqx582ftPERDXxv--PB9iPW5wbfy-0NOBI2SyaDAeluN4Nh7raHeqBYhAzHX8ULAPfrCeht0VgVpZQQQ9Eb0-M1HWoelMTUcoPV-Z3qkWXwXIbgekf83RN3mvh981UIPHiEXTgCG0hOP9X_eK-SRTLmKMmRbMt4zzU7mUtDdwbUJlnILkztpXQXSvamDcMjxOSt8EpqDneJfsff5IzC8tApYyc",
      tags: ["自然", "超值"],
      isFavorite: false,
      isTopPick: false,
      description: "绝美的海滩和壮观的悬崖景观，是潜水和浮潜的天堂。"
    },
    {
      id: "2",
      name: "高龙岛",
      location: "柬埔寨",
      rating: 4.8,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-yjzkbM7jbzGPLyBxUuG7yud9-q15GN0g42TWZMv-WhcOsntW4CmUtS5NknvFvlibiN5CH0fXNw9BWah0rsgZNJr7ro09RJncehlf0Tz3CoaXl4Qo2f43LcffTeFQRHZ7l5XQx7QvIL9_n26aSVq8mhpql8-Yds0L_iBWaV8ld6LUmRQed0WrxDo0BMAEnLkamPlpkYNhwLDBLN0YwW64J1QML3HCwe_rAVTr-QJOArtimkXwI6AqX-nTRjt80fqQQv1QL-ShVxA",
      tags: ["超值", "宁静海滩"],
      isFavorite: false,
      isTopPick: false,
      description: "未被开发的热带天堂，拥有原始的海滩和丰富的海洋生物。"
    },
    {
      id: "3",
      name: "爱妮岛",
      location: "菲律宾",
      rating: 4.9,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7WZSiNrmRPlQBb9olo0te4hEHKgGLherb0TsykVWqGsSMJyo5JzjZm35rAsWd5uBxVxhJT_jRXwrr-2ZGkInKgvwsYWB670d5bKYUL5V5zwbGulZbmpXgT7LhD4mpU4EiOxg2otyVUGP2nrKNx6yXqNETfln0dLKV2t4OZR9AL5WhKebnwyyMohsquHPcEtyDG8yPGCHYVZwEUcFZz3_hwtq46WNgxRU-Od82VB7t0RCoPMYCBPcRttzCxZRI9hfWFpa0rESeH6M",
      tags: ["宁静海滩", "自然"],
      isFavorite: false,
      isTopPick: true,
      description: "拥有壮观的石灰岩岛屿、清澈的泻湖和丰富的海洋生物。"
    },
    {
      id: "4",
      name: "莱利",
      location: "泰国",
      rating: 4.7,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBo8lexkV9vxI6cEfdHOaNEHO8Liy6b_8hy6-RgJvQyCndJQDJCF8CMG_SrcnUQFrb0l1WXSNUZJ1dpX3kef8QxcEGMLqzK6ZeFaBoqfJ5H65h5NA7ko-Qa1SaGYrAexA39jkkTL5HbIGHXdZQfA4esKXR8n04oMPIUn_jVraLc_JDH-JUfOoUyw1mDi4BHHKjeAnnDanR2Xly7pT1cXP924kktHhNpRR_ruhsjl4o5FVWuReTn4h7Yl7UucYXx_8CpAK1S5KL_awc",
      tags: ["宁静海滩", "自然"],
      isFavorite: false,
      isTopPick: false,
      description: "以壮观的石灰岩悬崖、清澈的海水和美丽的沙滩而闻名。"
    },
    {
      id: "5",
      name: "巴厘岛",
      location: "印度尼西亚",
      rating: 4.8,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfRBDKbJG0mM_4keHzAGm27g748VRBz07CgmGEz7sDaHHy_zgzjdpxgZo-L2r9D9QY0DmDdYK5kCAjTmx8yf0Gh6ug1H8jvZwkbigZCK0IBaUuclK34CIZ_4bsA0ZninEMAJ2HwQIyrSP9vq6La99UjzDjUE5rmcBzdRb2VCRZ0rGJZ73bhqBTr2TcY76wjeKJ_-T9gJF4FzL_CH9UXyEaI5yLHnl1kN1YY7IW4-yKG-EpXtw4WXjFxKmF9eCfplzu_s3p7kMKpZc",
      tags: ["文化", "自然"],
      isFavorite: false,
      isTopPick: false,
      description: "拥有美丽的海滩、古老的寺庙和丰富的文化遗产。"
    },
    {
      id: "6",
      name: "普吉岛",
      location: "泰国",
      rating: 4.6,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDlmAISi5g0qEXTGgHKpNLeCHJxXVh0-dOZ8mijTk5mLHDNabYPxmr5VK5c5K4onCYRO7gXth28yYwKzPQ1mSrg13GxtR6UVqR6ipe6EBS127BYOiqcoByALm6qQWPgymAqNMVsTD-vUCOJS9pTrmya-N-UpMI7xUYv3FY0TbyZm118QiSWUIJj1mytu9jSGp7vA_JfQKGwPFS556RdylhNN92_NZYX--84fyJ4jklv6t8iaEiZyJTmbKm_s8Q7peEc2TFquuMOlI1ePpCmhd4Z3dp41YV-B0qa6lU8RGBU28YEKOA8sUz39JFCSjomxLSdifngoK5iW9prn_rFlv8",
      tags: ["超值", "文化"],
      isFavorite: false,
      isTopPick: false,
      description: "以夜生活、海滩和水上活动而闻名。"
    },
    {
      id: "7",
      name: "长滩岛",
      location: "菲律宾",
      rating: 4.7,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDvJdbJmlf7kP7turKsi-y-FJtNCEqC5Qn4-Von0QmSoifiBAGGcmjYghA-vaXl3Qjg5prEPIJ38iYspUwiBoe5j9ReTH_2KEBh3kBwEutpbSW76xlTr67-6gcRMb3MIqrfN14hIBDJQZSos0I4eiye7jU4bzWERA43mWPGR1x1u8uLb4NoYtNvPeXcS2fFMbWI1ePpCmhd4Z3dp41YV-B0qa6lU8RGBU28YEKOA8sUz39JFCSjomxLSdifngoK5iW9prn_rFlv8",
      tags: ["宁静海滩", "超值"],
      isFavorite: false,
      isTopPick: false,
      description: "拥有世界上最长的白沙滩和丰富的海洋生物。"
    },
    {
      id: "8",
      name: "兰塔威",
      location: "印度尼西亚",
      rating: 4.9,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCnp-q8iICOWCFQ0hnJp28UDyu4K9Eks2jgidyvrqVqAAw0oSKyv5qnx1i2v6UFC0kyZR69P7R9DPHyplk90KE6rdt5FR1RHzmpLSfUp9Qf-SvJ30fPtPzUF36azTlHhhc1NPoRG6bcvRXnDm1u6rgW2nxYOcbfofXU2jPX4GuzlhHlDkUvNGsFQ89BbwIUc9v0wNI1_wfQSSbHJ6B1j1klIdYyg_RGtIK19N7r9IFID-GZ1mLkaKBquKG3AJVz-77Q0cF6Bu3TaRSyGP1A97v5kSDgA0LHNC0fD6zKRKeKZ63-lBO4v82r2Bu6EI",
      tags: ["自然", "宁静海滩"],
      isFavorite: false,
      isTopPick: true,
      description: "以壮观的火山景观、清澈的湖水和丰富的海洋生物而闻名。"
    },
    // ========== 中国国内目的地 ==========
    {
      id: "9",
      name: "西安",
      location: "中国",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1584952811565-c90e3d7d6a4a?w=800",
      tags: ["文化", "城市", "美食"],
      isFavorite: false,
      isTopPick: true,
      description: "十三朝古都，兵马俑、大雁塔、古城墙，感受千年历史沉淀。"
    },
    {
      id: "10",
      name: "北京",
      location: "中国",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800",
      tags: ["文化", "城市", "美食"],
      isFavorite: false,
      isTopPick: true,
      description: "故宫、长城、天坛，探索中国首都的历史文化和现代魅力。"
    },
    {
      id: "11",
      name: "成都",
      location: "中国",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1584278860037-57a5198089bd?w=800",
      tags: ["美食", "城市", "超值"],
      isFavorite: false,
      isTopPick: true,
      description: "熊猫基地、火锅、宽窄巷子，体验慢生活的天府之国。"
    },
    {
      id: "12",
      name: "丽江",
      location: "中国",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1508281377477-9768ea9086fc?w=800",
      tags: ["自然", "文化", "宁静海滩"],
      isFavorite: false,
      isTopPick: false,
      description: "玉龙雪山、古城、泸沽湖，感受纳西族的浪漫与神秘。"
    },
    {
      id: "13",
      name: "三亚",
      location: "中国",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800",
      tags: ["宁静海滩", "自然", "超值"],
      isFavorite: false,
      isTopPick: false,
      description: "亚龙湾、天涯海角、热带天堂，中国的马尔代夫。"
    },
    {
      id: "14",
      name: "桂林",
      location: "中国",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1529921879218-f99546d03a16?w=800",
      tags: ["自然", "超值"],
      isFavorite: false,
      isTopPick: true,
      description: "漓江、阳朔、象鼻山，山水甲天下的喀斯特地貌奇观。"
    },
    {
      id: "15",
      name: "上海",
      location: "中国",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1548919973-5cef591cdbc9?w=800",
      tags: ["城市", "美食", "文化"],
      isFavorite: false,
      isTopPick: false,
      description: "外滩、东方明珠、南京路，现代化国际大都市的风采。"
    },
    {
      id: "16",
      name: "杭州",
      location: "中国",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1520625366354-9aabdb8d8140?w=800",
      tags: ["自然", "文化", "城市"],
      isFavorite: false,
      isTopPick: false,
      description: "西湖、灵隐寺、龙井茶，人间天堂的诗意江南。"
    },
    // ========== 日本目的地 ==========
    {
      id: "17",
      name: "东京",
      location: "日本",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
      tags: ["城市", "美食", "文化"],
      isFavorite: false,
      isTopPick: true,
      description: "涩谷、浅草、秋叶原，现代与传统完美融合的国际大都市。"
    },
    {
      id: "18",
      name: "京都",
      location: "日本",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
      tags: ["文化", "自然", "城市"],
      isFavorite: false,
      isTopPick: true,
      description: "清水寺、伏见稻荷、岚山，千年古都的优雅与禅意。"
    },
    {
      id: "19",
      name: "大阪",
      location: "日本",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1578271887552-5ac3a72752bc?w=800",
      tags: ["美食", "城市", "超值"],
      isFavorite: false,
      isTopPick: false,
      description: "道顿堀、大阪城、环球影城，美食之都的欢乐时光。"
    },
    // ========== 韩国目的地 ==========
    {
      id: "20",
      name: "首尔",
      location: "韩国",
      rating: 4.6,
      image: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=800",
      tags: ["城市", "美食", "文化"],
      isFavorite: false,
      isTopPick: false,
      description: "明洞、景福宫、江南，K-pop 文化和传统宫殿的魅力。"
    },
    {
      id: "21",
      name: "济州岛",
      location: "韩国",
      rating: 4.7,
      image: "https://images.unsplash.com/photo-1512551984093-af570e5aa791?w=800",
      tags: ["自然", "超值", "宁静海滩"],
      isFavorite: false,
      isTopPick: false,
      description: "汉拿山、火山岩、海滩，韩国的夏威夷度假胜地。"
    }
  ];
  function getDestinations(useTrending = false) {
    try {
      if (useTrending) {
        const trending = storage.get("trending_destinations");
        if (trending && trending.length > 0) {
          formatAppLog("log", "at services/destination.js:260", "[目的地服务] 使用热门目的地数据，共", trending.length, "个");
          return trending;
        }
      }
      const stored = storage.get(STORAGE_KEYS.DESTINATIONS);
      if (stored && stored.length > 0) {
        return stored;
      }
      return [...MOCK_DESTINATIONS];
    } catch (e) {
      formatAppLog("error", "at services/destination.js:272", "获取目的地数据失败:", e);
      return [...MOCK_DESTINATIONS];
    }
  }
  async function loadTrendingDestinations(forceUpdate = false) {
    var _a;
    try {
      formatAppLog("log", "at services/destination.js:284", "[目的地服务] 正在加载热门目的地...");
      const destinations = await trendingService.getTrendingDestinations(forceUpdate);
      if (destinations && destinations.length > 0) {
        storage.set(STORAGE_KEYS.DESTINATIONS, destinations);
        formatAppLog("log", "at services/destination.js:292", "[目的地服务] 热门目的地已加载，共", destinations.length, "个");
        return destinations;
      }
      formatAppLog("log", "at services/destination.js:297", "[目的地服务] AI 返回空数据，使用默认数据");
      const mockData = [...MOCK_DESTINATIONS];
      storage.set(STORAGE_KEYS.DESTINATIONS, mockData);
      return mockData;
    } catch (e) {
      formatAppLog("error", "at services/destination.js:303", "[目的地服务] 加载热门目的地失败:", e);
      if (e.statusCode === -1 || ((_a = e.message) == null ? void 0 : _a.includes("Socket closed"))) {
        formatAppLog("log", "at services/destination.js:307", "[目的地服务] 网络连接失败，使用默认数据");
      }
      const mockData = [...MOCK_DESTINATIONS];
      storage.set(STORAGE_KEYS.DESTINATIONS, mockData);
      return mockData;
    }
  }
  function saveDestinations(destinations) {
    try {
      storage.set(STORAGE_KEYS.DESTINATIONS, destinations);
      return true;
    } catch (e) {
      formatAppLog("error", "at services/destination.js:327", "保存目的地数据失败:", e);
      return false;
    }
  }
  function searchDestinations(keyword) {
    if (!keyword || !keyword.trim()) {
      return getDestinations();
    }
    const all = getDestinations();
    const lowerKeyword = keyword.toLowerCase().trim();
    return all.filter((dest) => {
      const nameMatch = dest.name.toLowerCase().includes(lowerKeyword);
      const locationMatch = dest.location.toLowerCase().includes(lowerKeyword);
      const tagsMatch = dest.tags.some(
        (tag) => tag.toLowerCase().includes(lowerKeyword)
      );
      return nameMatch || locationMatch || tagsMatch;
    });
  }
  function filterDestinations(activeFilters) {
    if (!activeFilters || activeFilters.length === 0) {
      return getDestinations();
    }
    const all = getDestinations();
    return all.filter((dest) => {
      return activeFilters.some((filter) => dest.tags.includes(filter));
    });
  }
  function searchAndFilter(keyword, activeFilters) {
    let results = getDestinations();
    if (keyword && keyword.trim()) {
      results = searchDestinations(keyword);
    }
    if (activeFilters && activeFilters.length > 0) {
      results = results.filter((dest) => {
        return activeFilters.some((filter) => dest.tags.includes(filter));
      });
    }
    return results;
  }
  function toggleFavorite(destinationId) {
    const all = getDestinations();
    const index = all.findIndex((d) => d.id === destinationId);
    if (index !== -1) {
      all[index].isFavorite = !all[index].isFavorite;
      saveDestinations(all);
      return all[index];
    }
    return null;
  }
  function getFavorites() {
    const all = getDestinations();
    return all.filter((dest) => dest.isFavorite);
  }
  function getDestinationById(destinationId) {
    const all = getDestinations();
    return all.find((d) => d.id === destinationId) || null;
  }
  function getAllTags() {
    const all = getDestinations();
    const tags = /* @__PURE__ */ new Set();
    all.forEach((dest) => {
      dest.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags);
  }
  function getRecommendedDestinations(limit = 10) {
    const all = getDestinations();
    return all.filter((dest) => dest.isTopPick).slice(0, limit);
  }
  function addDestination(destination) {
    const all = getDestinations();
    const newDestination = {
      ...destination,
      id: generateId$2(),
      isFavorite: false,
      isTopPick: false
    };
    all.push(newDestination);
    saveDestinations(all);
    return newDestination;
  }
  function deleteDestination(destinationId) {
    const all = getDestinations();
    const index = all.findIndex((d) => d.id === destinationId);
    if (index !== -1) {
      all.splice(index, 1);
      saveDestinations(all);
      return true;
    }
    return false;
  }
  function generateId$2() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  function resetDestinations() {
    try {
      storage.remove(STORAGE_KEYS.DESTINATIONS);
      return true;
    } catch (e) {
      formatAppLog("error", "at services/destination.js:508", "重置目的地数据失败:", e);
      return false;
    }
  }
  const destinationService = {
    getDestinations,
    loadTrendingDestinations,
    saveDestinations,
    searchDestinations,
    filterDestinations,
    searchAndFilter,
    toggleFavorite,
    getFavorites,
    getDestinationById,
    getAllTags,
    getRecommendedDestinations,
    addDestination,
    deleteDestination,
    resetDestinations
  };
  const STORAGE_KEY_RECENT_SEARCHES = "explore_recent_searches";
  const MAX_RECENT_SEARCHES = 10;
  const _sfc_main$9 = {
    data() {
      return {
        searchKeyword: "",
        isLoading: false,
        isRefreshing: false,
        // 是否正在刷新热门目的地
        allDestinations: [],
        // 所有目的地数据
        filteredDestinations: [],
        // 筛选后的数据
        recentSearches: [],
        // 最近搜索关键词
        filters: [
          { name: "全部", active: true, type: "all" },
          { name: "自然", active: false, type: "tag" },
          { name: "城市", active: false, type: "tag" },
          { name: "美食", active: false, type: "tag" },
          { name: "超值", active: false, type: "tag" },
          { name: "宁静海滩", active: false, type: "tag" },
          { name: "文化", active: false, type: "tag" },
          { name: "只看收藏", active: false, type: "favorite" }
        ],
        // Android 适配：系统信息
        statusBarHeight: 44,
        // 默认值，会在 onLoad 中更新
        safeAreaInsetBottom: 0,
        // 底部安全区高度（px）
        tabBarHeight: 60
        // TabBar 高度（px）
      };
    },
    computed: {
      // 获取激活的筛选标签（排除"全部"和"只看收藏"）
      activeTagFilters() {
        return this.filters.filter((f) => f.active && f.type === "tag").map((f) => f.name);
      },
      // 是否只看收藏
      isFavoritesOnly() {
        return this.filters.some((f) => f.type === "favorite" && f.active);
      }
    },
    onLoad() {
      this.initSystemInfo();
      formatAppLog("log", "at pages/explore/explore.vue:213", "探索页面加载");
      this.loadRecentSearches();
      this.loadDestinations();
      this.tryLoadTrending();
    },
    onShow() {
      this.refreshData();
    },
    methods: {
      /**
       * Android 适配：初始化系统信息
       * 获取状态栏高度、安全区域等，用于布局适配
       */
      initSystemInfo() {
        var _a;
        try {
          const systemInfo = uni.getSystemInfoSync();
          this.statusBarHeight = systemInfo.statusBarHeight || 44;
          this.safeAreaInsetBottom = systemInfo.screenHeight - (((_a = systemInfo.safeArea) == null ? void 0 : _a.bottom) || systemInfo.screenHeight);
          formatAppLog("log", "at pages/explore/explore.vue:237", "[Explore] 系统信息:", {
            statusBarHeight: this.statusBarHeight,
            safeAreaInsetBottom: this.safeAreaInsetBottom
          });
        } catch (e) {
          formatAppLog("error", "at pages/explore/explore.vue:242", "[Explore] 获取系统信息失败:", e);
        }
      },
      /**
       * 加载目的地数据
       */
      loadDestinations() {
        this.isLoading = true;
        formatAppLog("log", "at pages/explore/explore.vue:251", "开始加载目的地数据...");
        try {
          this.allDestinations = destinationService.getDestinations(true);
          formatAppLog("log", "at pages/explore/explore.vue:256", "加载到目的地数量:", this.allDestinations.length);
          this.applyFilters();
        } catch (e) {
          formatAppLog("error", "at pages/explore/explore.vue:262", "加载目的地失败:", e);
          uni.showToast({
            title: "加载失败，请重试",
            icon: "none",
            duration: 2e3
          });
        } finally {
          this.isLoading = false;
        }
      },
      /**
       * 尝试加载热门目的地（异步，不阻塞页面）
       */
      async tryLoadTrending() {
        try {
          formatAppLog("log", "at pages/explore/explore.vue:278", "[热门目的地] 尝试加载...");
          const destinations = await destinationService.loadTrendingDestinations(false);
          if (destinations && destinations.length > 0) {
            this.allDestinations = destinations;
            this.applyFilters();
            formatAppLog("log", "at pages/explore/explore.vue:284", "[热门目的地] 数据已更新，共", destinations.length, "个");
            const isAIMock = destinations.some((d) => d.id === "1" || d.id === "9");
            if (!isAIMock) {
              uni.showToast({
                title: `已更新热门目的地 (${destinations.length}个)`,
                icon: "success",
                duration: 1500
              });
            }
          }
        } catch (e) {
          formatAppLog("log", "at pages/explore/explore.vue:299", "[热门目的地] 使用默认数据");
        }
      },
      /**
       * 刷新热门目的地（用户手动触发）
       */
      async refreshTrendingDestinations() {
        var _a;
        if (this.isRefreshing) {
          return;
        }
        this.isRefreshing = true;
        try {
          uni.showLoading({
            title: "正在获取热门目的地...",
            mask: true
          });
          const destinations = await destinationService.loadTrendingDestinations(true);
          if (destinations && destinations.length > 0) {
            this.allDestinations = destinations;
            this.applyFilters();
            uni.hideLoading();
            uni.showToast({
              title: `更新成功！${destinations.length}个目的地`,
              icon: "success",
              duration: 2e3
            });
          } else {
            uni.hideLoading();
            uni.showToast({
              title: "获取失败，使用默认数据",
              icon: "none"
            });
          }
        } catch (e) {
          formatAppLog("error", "at pages/explore/explore.vue:340", "[热门目的地] 刷新失败:", e);
          uni.hideLoading();
          if (e.statusCode === -1 || ((_a = e.message) == null ? void 0 : _a.includes("Socket closed"))) {
            uni.showToast({
              title: "网络连接失败，已使用默认数据",
              icon: "none",
              duration: 2e3
            });
          } else {
            uni.showToast({
              title: "获取失败，请稍后重试",
              icon: "none",
              duration: 2e3
            });
          }
          try {
            const mockData = destinationService.getDestinations(false);
            this.allDestinations = mockData;
            this.applyFilters();
          } catch (updateError) {
            formatAppLog("error", "at pages/explore/explore.vue:364", "[热门目的地] 更新UI失败:", updateError);
          }
        } finally {
          this.isRefreshing = false;
        }
      },
      /**
       * 刷新数据
       */
      refreshData() {
        try {
          this.allDestinations = destinationService.getDestinations();
          this.applyFilters();
        } catch (e) {
          formatAppLog("error", "at pages/explore/explore.vue:379", "刷新数据失败:", e);
        }
      },
      /**
       * 应用搜索和筛选
       */
      applyFilters() {
        const keyword = this.searchKeyword.trim();
        const activeTags = this.activeTagFilters;
        const favoritesOnly = this.isFavoritesOnly;
        formatAppLog("log", "at pages/explore/explore.vue:391", "=== 开始应用筛选 ===");
        formatAppLog("log", "at pages/explore/explore.vue:392", "搜索词:", keyword);
        formatAppLog("log", "at pages/explore/explore.vue:393", "筛选标签:", activeTags);
        formatAppLog("log", "at pages/explore/explore.vue:394", "只看收藏:", favoritesOnly);
        formatAppLog("log", "at pages/explore/explore.vue:395", "原始数据数量:", this.allDestinations.length);
        let results = [...this.allDestinations];
        formatAppLog("log", "at pages/explore/explore.vue:399", "步骤1: 基础数据数量:", results.length);
        const isAllActive = this.filters.some((f) => f.type === "all" && f.active);
        const hasTagFilter = activeTags.length > 0;
        if (!isAllActive && hasTagFilter) {
          const beforeTagFilter = results.length;
          results = results.filter((dest) => {
            return activeTags.some((tag) => dest.tags.includes(tag));
          });
          formatAppLog("log", "at pages/explore/explore.vue:411", "步骤3: 标签筛选后数量:", results.length, "(过滤掉", beforeTagFilter - results.length, "个)");
        } else {
          formatAppLog("log", "at pages/explore/explore.vue:413", "步骤3: 跳过标签筛选 (isAllActive:", isAllActive, ", hasTagFilter:", hasTagFilter, ")");
        }
        if (favoritesOnly) {
          const beforeFavoriteFilter = results.length;
          results = results.filter((dest) => dest.isFavorite);
          formatAppLog("log", "at pages/explore/explore.vue:420", "步骤4: 收藏筛选后数量:", results.length, "(过滤掉", beforeFavoriteFilter - results.length, "个)");
        } else {
          formatAppLog("log", "at pages/explore/explore.vue:422", "步骤4: 跳过收藏筛选");
        }
        if (keyword) {
          const beforeSearch = results.length;
          const lowerKeyword = keyword.toLowerCase();
          formatAppLog("log", "at pages/explore/explore.vue:429", '步骤5: 开始搜索关键词 "', lowerKeyword, '"');
          results = results.filter((dest) => {
            const nameMatch = dest.name.toLowerCase().includes(lowerKeyword);
            const locationMatch = dest.location.toLowerCase().includes(lowerKeyword);
            const tagsMatch = dest.tags.some(
              (tag) => tag.toLowerCase().includes(lowerKeyword)
            );
            if (nameMatch || locationMatch || tagsMatch) {
              formatAppLog("log", "at pages/explore/explore.vue:440", "  匹配:", dest.name, "- name:", nameMatch, "location:", locationMatch, "tags:", tagsMatch);
            }
            return nameMatch || locationMatch || tagsMatch;
          });
          formatAppLog("log", "at pages/explore/explore.vue:445", "步骤5: 搜索后数量:", results.length, "(过滤掉", beforeSearch - results.length, "个)");
        } else {
          formatAppLog("log", "at pages/explore/explore.vue:447", "步骤5: 跳过关键词搜索 (无搜索词)");
        }
        this.filteredDestinations = [];
        this.$nextTick(() => {
          this.filteredDestinations = results;
          formatAppLog("log", "at pages/explore/explore.vue:456", "=== 筛选完成，最终结果数量:", this.filteredDestinations.length, "===");
          if (this.filteredDestinations.length > 0) {
            formatAppLog("log", "at pages/explore/explore.vue:460", "结果列表:", this.filteredDestinations.map((d) => d.name).join(", "));
          } else {
            formatAppLog("log", "at pages/explore/explore.vue:462", "结果列表: 空 (应显示空状态)");
          }
        });
      },
      /**
       * 搜索输入事件（实时搜索）
       * 注意：由于 v-model 已双向绑定，使用 setTimeout 确保 DOM 更新后再执行筛选
       */
      onSearchInput(e) {
        const inputValue = e.detail.value;
        formatAppLog("log", "at pages/explore/explore.vue:474", "搜索输入事件触发:", inputValue);
        setTimeout(() => {
          this.applyFilters();
        }, 10);
      },
      /**
       * 搜索确认事件
       */
      handleSearch() {
        formatAppLog("log", "at pages/explore/explore.vue:486", "确认搜索:", this.searchKeyword);
        const keyword = this.searchKeyword.trim();
        if (keyword) {
          this.saveRecentSearch(keyword);
        }
        this.applyFilters();
        uni.hideKeyboard();
      },
      /**
       * 清空搜索
       */
      clearSearch() {
        formatAppLog("log", "at pages/explore/explore.vue:499", "清空搜索");
        this.searchKeyword = "";
        this.applyFilters();
      },
      /**
       * 切换筛选标签
       */
      toggleFilter(index) {
        const clickedFilter = this.filters[index];
        const previousState = clickedFilter.active;
        if (clickedFilter.type === "all") {
          if (!previousState) {
            this.filters.forEach((f) => f.active = false);
            clickedFilter.active = true;
          }
        } else {
          const allFilter = this.filters.find((f) => f.type === "all");
          if (allFilter) {
            allFilter.active = false;
          }
          clickedFilter.active = !previousState;
          const hasActiveFilter = this.filters.some((f) => f.active);
          if (!hasActiveFilter && allFilter) {
            allFilter.active = true;
          }
        }
        formatAppLog("log", "at pages/explore/explore.vue:538", "切换筛选:", clickedFilter.name, "->", clickedFilter.active);
        this.applyFilters();
      },
      /**
       * 重置所有筛选
       */
      resetFilters() {
        formatAppLog("log", "at pages/explore/explore.vue:546", "重置筛选");
        this.searchKeyword = "";
        this.filters.forEach((f) => {
          if (f.type === "all") {
            f.active = true;
          } else {
            f.active = false;
          }
        });
        this.applyFilters();
      },
      /**
       * 询问 AI 关于搜索的目的地
       */
      askAIAboutDestination() {
        const keyword = this.searchKeyword.trim();
        const prompt = keyword ? `我想了解关于${keyword}的旅行信息，请帮我推荐相关的目的地和行程安排` : "请为我推荐一些值得去的旅行目的地";
        uni.navigateTo({
          url: `/pages/chat/chat?prompt=${encodeURIComponent(prompt)}`
        });
      },
      /**
       * 切换收藏状态
       */
      toggleFavorite(dest) {
        formatAppLog("log", "at pages/explore/explore.vue:577", "切换收藏:", dest.name, "当前状态:", dest.isFavorite);
        const updated = destinationService.toggleFavorite(dest.id);
        if (updated) {
          const index = this.allDestinations.findIndex((d) => d.id === dest.id);
          if (index !== -1) {
            this.allDestinations[index].isFavorite = updated.isFavorite;
          }
          const filteredIndex = this.filteredDestinations.findIndex((d) => d.id === dest.id);
          if (filteredIndex !== -1) {
            this.filteredDestinations[filteredIndex].isFavorite = updated.isFavorite;
          }
          if (this.isFavoritesOnly) {
            this.applyFilters();
          }
          uni.showToast({
            title: updated.isFavorite ? "已添加到收藏" : "已取消收藏",
            icon: "none",
            duration: 1500
          });
        } else {
          uni.showToast({
            title: "操作失败",
            icon: "none"
          });
        }
      },
      /**
       * 点击目的地卡片
       */
      handleCardClick(dest) {
        formatAppLog("log", "at pages/explore/explore.vue:616", "点击目的地:", dest.name);
        uni.navigateTo({
          url: `/pages/destination/destination?id=${dest.id}`
        });
      },
      /**
       * 加载更多（分页）
       */
      loadMore() {
        formatAppLog("log", "at pages/explore/explore.vue:627", "加载更多");
      },
      /**
       * 生成旅行行程
       */
      handleGenerateItinerary() {
        const count = this.filteredDestinations.length;
        if (count === 0) {
          uni.showToast({
            title: "请先选择目的地",
            icon: "none"
          });
          return;
        }
        const conditions = [];
        if (this.searchKeyword) {
          conditions.push(`搜索"${this.searchKeyword}"`);
        }
        if (this.activeTagFilters.length > 0) {
          conditions.push(`筛选${this.activeTagFilters.join("、")}`);
        }
        if (this.isFavoritesOnly) {
          conditions.push("收藏的目的地");
        }
        const conditionText = conditions.length > 0 ? conditions.join("，") : "全部目的地";
        const destinationNames = this.filteredDestinations.map((d) => d.name).join("、");
        uni.showModal({
          title: "生成行程",
          content: `基于当前 ${count} 个目的地（${conditionText}）生成行程计划？`,
          confirmText: "生成",
          cancelText: "取消",
          success: (res) => {
            if (res.confirm) {
              const prompt = `请帮我规划一个旅行行程，目的地包括：${destinationNames}。${this.activeTagFilters.length > 0 ? `我偏好${this.activeTagFilters.join("、")}类型的目的地。` : ""}`;
              uni.navigateTo({
                url: `/pages/chat/chat?prompt=${encodeURIComponent(prompt)}&intent=generate_itinerary`
              });
            }
          }
        });
      },
      // ==================== 最近搜索相关方法 ====================
      /**
       * 加载最近搜索记录
       */
      loadRecentSearches() {
        try {
          const stored = uni.getStorageSync(STORAGE_KEY_RECENT_SEARCHES);
          if (stored && Array.isArray(stored)) {
            this.recentSearches = stored;
          }
        } catch (e) {
          formatAppLog("error", "at pages/explore/explore.vue:690", "加载最近搜索失败:", e);
        }
      },
      /**
       * 保存最近搜索记录
       */
      saveRecentSearch(keyword) {
        try {
          const index = this.recentSearches.indexOf(keyword);
          if (index !== -1) {
            this.recentSearches.splice(index, 1);
          }
          this.recentSearches.unshift(keyword);
          if (this.recentSearches.length > MAX_RECENT_SEARCHES) {
            this.recentSearches = this.recentSearches.slice(0, MAX_RECENT_SEARCHES);
          }
          uni.setStorageSync(STORAGE_KEY_RECENT_SEARCHES, this.recentSearches);
        } catch (e) {
          formatAppLog("error", "at pages/explore/explore.vue:716", "保存最近搜索失败:", e);
        }
      },
      /**
       * 应用最近搜索
       */
      applyRecentSearch(keyword) {
        this.searchKeyword = keyword;
        this.applyFilters();
      },
      /**
       * 清空最近搜索记录
       */
      clearRecentSearches() {
        uni.showModal({
          title: "清空搜索历史",
          content: "确定要清空所有搜索历史吗？",
          confirmText: "清空",
          cancelText: "取消",
          success: (res) => {
            if (res.confirm) {
              this.recentSearches = [];
              try {
                uni.removeStorageSync(STORAGE_KEY_RECENT_SEARCHES);
                uni.showToast({
                  title: "已清空",
                  icon: "success",
                  duration: 1500
                });
              } catch (e) {
                formatAppLog("error", "at pages/explore/explore.vue:748", "清空最近搜索失败:", e);
              }
            }
          }
        });
      }
    }
  };
  function _sfc_render$9(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "explore-container" }, [
      vue.createElementVNode(
        "view",
        {
          class: "status-bar-placeholder",
          style: vue.normalizeStyle({ height: $data.statusBarHeight + "px" })
        },
        null,
        4
        /* STYLE */
      ),
      vue.createElementVNode("view", { class: "search-header" }, [
        vue.createElementVNode("view", { class: "header-row" }, [
          vue.createElementVNode("text", { class: "header-title" }, "为您推荐"),
          vue.createElementVNode("button", {
            class: "refresh-btn",
            onClick: _cache[0] || (_cache[0] = (...args) => $options.refreshTrendingDestinations && $options.refreshTrendingDestinations(...args)),
            disabled: $data.isRefreshing
          }, [
            vue.createElementVNode(
              "text",
              {
                class: vue.normalizeClass(["refresh-icon", { rotating: $data.isRefreshing }])
              },
              "🔄",
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "text",
              { class: "refresh-text" },
              vue.toDisplayString($data.isRefreshing ? "更新中..." : "更新热门"),
              1
              /* TEXT */
            )
          ], 8, ["disabled"])
        ]),
        vue.createElementVNode("view", { class: "search-box" }, [
          vue.createElementVNode("text", { class: "search-icon" }, "🔍"),
          vue.withDirectives(vue.createElementVNode(
            "input",
            {
              "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.searchKeyword = $event),
              class: "search-input",
              placeholder: "搜寻您的下个目的地...",
              "placeholder-class": "search-placeholder",
              onInput: _cache[2] || (_cache[2] = (...args) => $options.onSearchInput && $options.onSearchInput(...args)),
              onConfirm: _cache[3] || (_cache[3] = (...args) => $options.handleSearch && $options.handleSearch(...args)),
              "confirm-type": "search"
            },
            null,
            544
            /* NEED_HYDRATION, NEED_PATCH */
          ), [
            [vue.vModelText, $data.searchKeyword]
          ]),
          $data.searchKeyword ? (vue.openBlock(), vue.createElementBlock("button", {
            key: 0,
            class: "search-clear-btn",
            onClick: _cache[4] || (_cache[4] = (...args) => $options.clearSearch && $options.clearSearch(...args))
          }, [
            vue.createElementVNode("text", { class: "clear-icon" }, "✕")
          ])) : vue.createCommentVNode("v-if", true)
        ]),
        $data.recentSearches.length > 0 && !$data.searchKeyword ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "recent-searches"
        }, [
          vue.createElementVNode("text", { class: "recent-title" }, "最近搜索"),
          vue.createElementVNode("view", { class: "recent-list" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.recentSearches, (keyword, index) => {
                return vue.openBlock(), vue.createElementBlock("text", {
                  key: index,
                  class: "recent-item",
                  onClick: ($event) => $options.applyRecentSearch(keyword)
                }, vue.toDisplayString(keyword), 9, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            vue.createElementVNode("text", {
              class: "recent-item clear-recent",
              onClick: _cache[5] || (_cache[5] = (...args) => $options.clearRecentSearches && $options.clearRecentSearches(...args))
            }, " 清空 ")
          ])
        ])) : vue.createCommentVNode("v-if", true)
      ]),
      vue.createElementVNode("scroll-view", {
        class: "filter-scroll",
        "scroll-x": "",
        "show-scrollbar": "false"
      }, [
        vue.createElementVNode("view", { class: "filter-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.filters, (filter, index) => {
              return vue.openBlock(), vue.createElementBlock("button", {
                key: index,
                class: vue.normalizeClass(["filter-btn", filter.active ? "filter-btn-active" : ""]),
                onClick: ($event) => $options.toggleFilter(index)
              }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["filter-text", filter.active ? "filter-text-active" : ""])
                  },
                  vue.toDisplayString(filter.name),
                  3
                  /* TEXT, CLASS */
                ),
                filter.active && filter.name !== "全部" ? (vue.openBlock(), vue.createElementBlock("text", {
                  key: 0,
                  class: "filter-close"
                }, "✕")) : vue.createCommentVNode("v-if", true)
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      !$data.isLoading && $data.filteredDestinations.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "result-count"
      }, [
        vue.createElementVNode(
          "text",
          { class: "count-text" },
          "找到 " + vue.toDisplayString($data.filteredDestinations.length) + " 个目的地",
          1
          /* TEXT */
        )
      ])) : vue.createCommentVNode("v-if", true),
      vue.createElementVNode(
        "scroll-view",
        {
          class: "content-scroll",
          "scroll-y": "",
          onScrolltolower: _cache[8] || (_cache[8] = (...args) => $options.loadMore && $options.loadMore(...args))
        },
        [
          $data.isLoading && $data.allDestinations.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "loading-container"
          }, [
            vue.createElementVNode("text", { class: "loading-text" }, "加载中...")
          ])) : $data.filteredDestinations.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "empty-state"
          }, [
            vue.createElementVNode("text", { class: "empty-icon" }, "🔍"),
            vue.createElementVNode("text", { class: "empty-title" }, "未找到相关目的地"),
            vue.createElementVNode("text", { class: "empty-subtitle" }, "试试其他关键词，或让 AI 为您推荐"),
            vue.createElementVNode("view", { class: "empty-actions" }, [
              vue.createElementVNode("button", {
                class: "empty-action-btn secondary",
                onClick: _cache[6] || (_cache[6] = (...args) => $options.resetFilters && $options.resetFilters(...args))
              }, [
                vue.createElementVNode("text", { class: "empty-action-text" }, "重置筛选")
              ]),
              vue.createElementVNode("button", {
                class: "empty-action-btn primary",
                onClick: _cache[7] || (_cache[7] = (...args) => $options.askAIAboutDestination && $options.askAIAboutDestination(...args))
              }, [
                vue.createElementVNode("text", { class: "empty-action-icon" }, "🤖"),
                vue.createElementVNode("text", { class: "empty-action-text" }, "询问 AI")
              ])
            ])
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "masonry-grid"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.filteredDestinations, (dest) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: dest.id,
                  class: "destination-card",
                  onClick: ($event) => $options.handleCardClick(dest)
                }, [
                  vue.createElementVNode("view", { class: "card-image-wrapper" }, [
                    vue.createElementVNode("image", {
                      class: "card-image",
                      src: dest.image,
                      mode: "aspectFill",
                      "lazy-load": true
                    }, null, 8, ["src"]),
                    vue.createElementVNode("view", {
                      class: vue.normalizeClass(["card-favorite", dest.isFavorite ? "favorite-active" : ""]),
                      onClick: vue.withModifiers(($event) => $options.toggleFavorite(dest), ["stop"])
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "favorite-icon" },
                        vue.toDisplayString(dest.isFavorite ? "❤️" : "🤍"),
                        1
                        /* TEXT */
                      )
                    ], 10, ["onClick"]),
                    dest.isTopPick ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "card-badge"
                    }, [
                      vue.createElementVNode("text", { class: "badge-text" }, "⭐ 首选")
                    ])) : vue.createCommentVNode("v-if", true),
                    vue.createElementVNode("view", { class: "card-tags" }, [
                      (vue.openBlock(true), vue.createElementBlock(
                        vue.Fragment,
                        null,
                        vue.renderList(dest.tags.slice(0, 2), (tag, tagIndex) => {
                          return vue.openBlock(), vue.createElementBlock(
                            "text",
                            {
                              key: tagIndex,
                              class: "tag-item"
                            },
                            vue.toDisplayString(tag),
                            1
                            /* TEXT */
                          );
                        }),
                        128
                        /* KEYED_FRAGMENT */
                      ))
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "card-info" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "card-title" },
                      vue.toDisplayString(dest.name),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("view", { class: "card-location" }, [
                      vue.createElementVNode("text", { class: "location-icon" }, "📍"),
                      vue.createElementVNode(
                        "text",
                        { class: "location-text" },
                        vue.toDisplayString(dest.location),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "card-footer" }, [
                      vue.createElementVNode("view", { class: "card-rating" }, [
                        vue.createElementVNode("text", { class: "rating-icon" }, "★"),
                        vue.createElementVNode(
                          "text",
                          { class: "rating-text" },
                          vue.toDisplayString(dest.rating),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode(
                        "text",
                        { class: "card-desc" },
                        vue.toDisplayString(dest.description),
                        1
                        /* TEXT */
                      )
                    ])
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ])),
          $data.isLoading && $data.allDestinations.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 3,
            class: "load-more"
          }, [
            vue.createElementVNode("text", { class: "load-more-text" }, "加载更多...")
          ])) : vue.createCommentVNode("v-if", true)
        ],
        32
        /* NEED_HYDRATION */
      ),
      vue.createElementVNode("view", { class: "fab-container" }, [
        vue.createElementVNode("button", {
          class: "fab-btn",
          onClick: _cache[9] || (_cache[9] = (...args) => $options.handleGenerateItinerary && $options.handleGenerateItinerary(...args))
        }, [
          vue.createElementVNode("text", { class: "fab-icon" }, "✨"),
          vue.createElementVNode("text", { class: "fab-text" }, "生成旅行行程")
        ])
      ])
    ]);
  }
  const PagesExploreExplore = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", _sfc_render$9], ["__scopeId", "data-v-a3df0f97"], ["__file", "D:/2026_all_Favio/AI_exploring/personal/WanderAI/pages/explore/explore.vue"]]);
  const MOCK_MEMORIES = [
    {
      id: "1",
      title: "周末在京都",
      date: "2023年10月",
      location: "京都，日本",
      photoCount: 3,
      coverImage: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop",
      description: "在古老的街道漫步，品尝传统美食，参观金阁寺和清水寺。",
      photos: [
        {
          id: "p1",
          url: "https://images.unsplash.com/photo-1524413840807-0c3cb6fa808d?w=800&auto=format&fit=crop",
          memoryId: "1",
          createdAt: "2023-10-15T10:00:00.000Z"
        },
        {
          id: "p2",
          url: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&auto=format&fit=crop",
          memoryId: "1",
          createdAt: "2023-10-15T11:00:00.000Z"
        },
        {
          id: "p3",
          url: "https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&auto=format&fit=crop",
          memoryId: "1",
          createdAt: "2023-10-15T12:00:00.000Z"
        }
      ],
      createdAt: "2023-10-15T00:00:00.000Z",
      hasNote: false,
      travelNote: ""
    },
    {
      id: "2",
      title: "巴黎的夏天",
      date: "2023年7月",
      location: "巴黎，法国",
      photoCount: 3,
      coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&auto=format&fit=crop",
      description: "在埃菲尔铁塔下野餐，参观卢浮宫，漫步塞纳河畔。",
      photos: [
        {
          id: "p4",
          url: "https://images.unsplash.com/photo-1511739001486-6bfe10ce65f4?w=800&auto=format&fit=crop",
          memoryId: "2",
          createdAt: "2023-07-20T14:00:00.000Z"
        },
        {
          id: "p5",
          url: "https://images.unsplash.com/photo-1431274172761-fca41d930114?w=800&auto=format&fit=crop",
          memoryId: "2",
          createdAt: "2023-07-20T15:00:00.000Z"
        },
        {
          id: "p6",
          url: "https://images.unsplash.com/photo-1550340499-a6c60fc8287c?w=800&auto=format&fit=crop",
          memoryId: "2",
          createdAt: "2023-07-20T16:00:00.000Z"
        }
      ],
      createdAt: "2023-07-20T00:00:00.000Z",
      hasNote: true,
      travelNote: "在巴黎的那个夏天，我漫步在香榭丽舍大道上，感受着这座城市的浪漫气息。埃菲尔铁塔下，我遇到了来自世界各地的旅人，分享了彼此的故事。"
    },
    {
      id: "3",
      title: "西湖春游",
      date: "2024年3月",
      location: "杭州，中国",
      photoCount: 2,
      coverImage: "https://images.unsplash.com/photo-1564399579883-451a5d44ec08?w=800&auto=format&fit=crop",
      description: "春暖花开时节，游览杭州西湖，欣赏苏堤春晓的美景。",
      photos: [
        {
          id: "p7",
          url: "https://images.unsplash.com/photo-1548266652-99cf277df8c2?w=800&auto=format&fit=crop",
          memoryId: "3",
          createdAt: "2024-03-15T09:00:00.000Z"
        },
        {
          id: "p8",
          url: "https://images.unsplash.com/photo-1528702748617-c64d49f918af?w=800&auto=format&fit=crop",
          memoryId: "3",
          createdAt: "2024-03-15T10:00:00.000Z"
        }
      ],
      createdAt: "2024-03-15T00:00:00.000Z",
      hasNote: false,
      travelNote: ""
    }
  ];
  const MOCK_PHOTOS = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAWpn0wEFPKPeeT0FvlicFPe6cd5VfWMYg2cYeBlHTFLAykbrVXEXlc12ueU-sBMfW-djPYMj_P2nMKAaDWLYKtKKn61H0C2yqUGiVGCb1mhw9_8e2tGVrFRIPepiY3bsK_aJUObOfFMEqHF0WlUutpbSW76xlTr67-6gcRMb3MIqrfN14hIBDJQZSos0I4eiye7jU4bzWERA43mWPGR1x1u8uLb4NoYtNvPeXcS2fFMbWI1ePpCmhd4Z3dp41YV-B0qa6lU8RGBU28YEKOA8sUz39JFCSjomxLSdifngoK5iW9prn_rFlv8",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDvJdbJmlf7kP7turKsi-y-FJtNCEqC5Qn4-Von0QmSoifiBAGGcmjYghA-vaXl3Qjg5prEPIJ38iYspUwiBoe5j9ReTH_2KEBh3kBwEutpbSW76xlTr67-6gcRMb3MIqrfN14hIBDJQZSos0I4eiye7jU4bzWERA43mWPGR1x1u8uLb4NoYtNvPeXcS2fFMbWI1ePpCmhd4Z3dp41YV-B0qa6lU8RGBU28YEKOA8sUz39JFCSjomxLSdifngoK5iW9prn_rFlv8",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBoLQPID18D6ajvBXuX-XxIQCl-akEaRlxtfe5WY6oNowdK7_kZolpbc7VllSfpWUaX_fuDzktIEx7kgJTsnU1Zsc1ik86Cl0cXqiBYAWMQ-RJki_TFizUu_3APPuWdKDoNf6gu7tTpoxS98DkExBO0JglTQW08JZhwbTlvBCuUDTAFqFZI90NNqtBatcB1bOOGGkGJqklFsfw_2qB1IL_FabhFX5GmwkAPp7PHnSVgQOap2381IJAap7eqtHoW_x2o6Zaz-o",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC6qJc-yrkkzR_9vrL8-BVtP3LQLdFjwk2KWwa66bdzDN6U4y_RNFaIOdR5cnlT1baonbFID0ihnnPaGltaThDXcIPMv04NIhjPMr4rGL-idVjGAyiqdwuzU4UF-pX-TC0_KpDEp_aFxxEMrIILKSudGf7F0Hs-IZOdb0OE355Br_0W49hU-tTCX0ZsHk_byhESViQ2puhhWE0ENMIQrxwN6h5QXr7Pyf-WdjbJglalsmtepocSYUq58cBhb3oJq7xAyb00",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDc41qf4dUSbvgr-m3UCYG_wjkJe9mCtCQc82_f2aDU8LsW68_Wp8yU37T-HUHcON_ICQ3KHkuYwTBePsxUxg0JepKC8ArDQebQ-xIeb8YlXMH3vZ7x90NQ612a55CFYZTbMClooJUO173_ngoEqGD4wlKHiWe4ijQBk2fbbLIO8oJtyuKc95j8-KZ97lfQBs4ZyRZwFOJGOp-sP7yJZW__wWXeqBCRBzm813qyPWYNMNLHv5X63a2NQPMf0l18nEBZ",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCnp-q8iICOWCFQ0hnJp28UDyu4K9Eks2jgidyvrqVqAAw0oSKyv5qnx1i2v6UFC0kyZR69P7R9DPHyplk90KE6rdt5FR1RHzmpLSfUp9Qf-SvJ30fPtPzUF36azTlHhhc1NPoRG6bcvRXnDm1u6rgW2nxYOcbfofXU2jPX4GuzlhHlDkUvNGsFQ89BbwIUc9v0wNI1_wfQSSbHJ6B1j1klIdYyg_RGtIK19N7r9IFID-GZ1mLkaKBquKG3AJVz-77Q0cF6Bu3TaRSyGP1A97v5kSDgA0LHNC0fD6zKRKeKZ63-lBO4v82r2Bu6EI",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDvJdbJmlf7kP7turKsi-y-FJtNCEqC5Qn4-Von0QmSoifiBAGGcmjYghA-vaXl3Qjg5prEPIJ38iYspUwiBoe5j9ReTH_2KEBh3kBwEutpbSW76xlTr67-6gcRMb3MIqrfN14hIBDJQZSos0I4eiye7jU4bzWERA43mWPGR1x1u8uLb4NoYtNvPeXcS2fFMbWI1ePpCmhd4Z3dp41YV-B0qa6lU8RGBU28YEKOA8sUz39JFCSjomxLSdifngoK5iW9prn_rFlv8"
  ];
  function getMemories() {
    try {
      const stored = storage.get(STORAGE_KEYS.ALBUMS);
      if (stored && stored.length > 0) {
        return stored;
      }
      return [...MOCK_MEMORIES];
    } catch (e) {
      formatAppLog("error", "at services/album.js:125", "获取回忆数据失败:", e);
      return [...MOCK_MEMORIES];
    }
  }
  function saveMemories(memories) {
    try {
      storage.set(STORAGE_KEYS.ALBUMS, memories);
      return true;
    } catch (e) {
      formatAppLog("error", "at services/album.js:140", "保存回忆数据失败:", e);
      return false;
    }
  }
  function getMemoryById(memoryId) {
    const all = getMemories();
    return all.find((m) => m.id === memoryId) || null;
  }
  function addMemory(memory) {
    const all = getMemories();
    const newMemory = {
      ...memory,
      id: generateId$1(),
      photos: []
    };
    all.unshift(newMemory);
    saveMemories(all);
    return newMemory;
  }
  function deleteMemory(memoryId) {
    const all = getMemories();
    const index = all.findIndex((m) => m.id === memoryId);
    if (index !== -1) {
      all.splice(index, 1);
      saveMemories(all);
      return true;
    }
    return false;
  }
  function getPhotos() {
    try {
      const stored = storage.get(STORAGE_KEYS.PHOTOS);
      if (stored && stored.length > 0) {
        return stored;
      }
      return [...MOCK_PHOTOS];
    } catch (e) {
      formatAppLog("error", "at services/album.js:202", "获取照片数据失败:", e);
      return [...MOCK_PHOTOS];
    }
  }
  function savePhotos(photos) {
    try {
      storage.set(STORAGE_KEYS.PHOTOS, photos);
      return true;
    } catch (e) {
      formatAppLog("error", "at services/album.js:217", "保存照片数据失败:", e);
      return false;
    }
  }
  function addPhoto(memoryId, photoUrl) {
    const all = getMemories();
    const memory = all.find((m) => m.id === memoryId);
    if (memory) {
      const photo = {
        id: generateId$1(),
        url: photoUrl,
        memoryId,
        createdAt: (/* @__PURE__ */ new Date()).toISOString()
      };
      if (!memory.photos) {
        memory.photos = [];
      }
      memory.photos.unshift(photo);
      memory.photoCount = memory.photos.length;
      saveMemories(all);
      return photo;
    }
    return null;
  }
  function deletePhoto(memoryId, photoId) {
    const all = getMemories();
    const memory = all.find((m) => m.id === memoryId);
    if (memory && memory.photos) {
      const index = memory.photos.findIndex((p) => p.id === photoId);
      if (index !== -1) {
        memory.photos.splice(index, 1);
        memory.photoCount = memory.photos.length;
        saveMemories(all);
        return true;
      }
    }
    return false;
  }
  function getTravelNote(memoryId) {
    const all = getMemories();
    const memory = all.find((m) => m.id === memoryId);
    return memory ? memory.travelNote : null;
  }
  function saveTravelNote(memoryId, note) {
    const all = getMemories();
    const memory = all.find((m) => m.id === memoryId);
    if (memory) {
      memory.travelNote = note;
      memory.hasNote = true;
      saveMemories(all);
      return true;
    }
    return false;
  }
  function updateMemory(memoryId, updates) {
    const all = getMemories();
    const index = all.findIndex((m) => m.id === memoryId);
    if (index !== -1) {
      all[index] = { ...all[index], ...updates };
      saveMemories(all);
      return all[index];
    }
    return null;
  }
  function getAlbumStats() {
    const memories = getMemories();
    const photos = getPhotos();
    let totalPhotoCount = 0;
    memories.forEach((mem) => {
      var _a;
      totalPhotoCount += ((_a = mem.photos) == null ? void 0 : _a.length) || 0;
    });
    return {
      totalMemories: memories.length,
      totalPhotos: totalPhotoCount || photos.length,
      totalNotes: memories.filter((m) => m.hasNote).length,
      recentMemory: memories[0] || null
    };
  }
  function generateId$1() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  function resetAlbumData() {
    try {
      storage.remove(STORAGE_KEYS.ALBUMS);
      storage.remove(STORAGE_KEYS.PHOTOS);
      return true;
    } catch (e) {
      formatAppLog("error", "at services/album.js:366", "重置相册数据失败:", e);
      return false;
    }
  }
  const albumService = {
    getMemories,
    saveMemories,
    getMemoryById,
    addMemory,
    deleteMemory,
    getPhotos,
    savePhotos,
    addPhoto,
    deletePhoto,
    getTravelNote,
    saveTravelNote,
    updateMemory,
    getAlbumStats,
    resetAlbumData
  };
  const _sfc_main$8 = {
    data() {
      return {
        memories: [],
        photos: [],
        recentPhotos: [],
        isLoading: false,
        isGenerating: false,
        selectedMemory: null,
        showNoteModal: false,
        showCreateModal: false,
        showAddPhotoModal: false,
        noteContent: "",
        currentMemoryId: null,
        stats: {
          totalMemories: 0,
          totalPhotos: 0,
          totalNotes: 0
        },
        newMemory: {
          title: "",
          location: "",
          date: "",
          description: ""
        },
        // Android 适配：系统信息
        statusBarHeight: 44,
        // 默认值，会在 onLoad 中更新
        safeAreaInsetBottom: 0,
        // 底部安全区高度（px）
        tabBarHeight: 60
        // TabBar 高度（px）
      };
    },
    onLoad() {
      this.initSystemInfo();
      this.loadData();
    },
    onShow() {
      this.loadData();
    },
    methods: {
      /**
       * Android 适配：初始化系统信息
       * 获取状态栏高度、安全区域等，用于布局适配
       */
      initSystemInfo() {
        var _a;
        try {
          const systemInfo = uni.getSystemInfoSync();
          this.statusBarHeight = systemInfo.statusBarHeight || 44;
          this.safeAreaInsetBottom = systemInfo.screenHeight - (((_a = systemInfo.safeArea) == null ? void 0 : _a.bottom) || systemInfo.screenHeight);
          formatAppLog("log", "at pages/album/album.vue:326", "[Album] 系统信息:", {
            statusBarHeight: this.statusBarHeight,
            safeAreaInsetBottom: this.safeAreaInsetBottom
          });
        } catch (e) {
          formatAppLog("error", "at pages/album/album.vue:331", "[Album] 获取系统信息失败:", e);
        }
      },
      /**
       * 加载所有数据
       */
      loadData() {
        var _a;
        formatAppLog("log", "at pages/album/album.vue:339", "[相册] 开始加载数据...");
        this.memories = albumService.getMemories();
        this.photos = albumService.getPhotos();
        this.loadRecentPhotos();
        this.updateStats();
        if (this.memories.length > 0 && !this.selectedMemory) {
          this.selectedMemory = this.memories[0];
        }
        formatAppLog("log", "at pages/album/album.vue:352", "[相册] 数据加载完成:", {
          memories: this.memories.length,
          photos: this.photos.length,
          selectedMemory: (_a = this.selectedMemory) == null ? void 0 : _a.title
        });
      },
      /**
       * 加载最近照片
       */
      loadRecentPhotos() {
        const allPhotos = [];
        this.memories.forEach((mem) => {
          if (mem.photos && mem.photos.length > 0) {
            mem.photos.forEach((photo) => {
              allPhotos.push({
                ...photo,
                memoryTitle: mem.title,
                memoryId: mem.id
              });
            });
          }
          if (mem.coverImage) {
            allPhotos.push({
              id: `cover-${mem.id}`,
              url: mem.coverImage,
              memoryTitle: mem.title,
              memoryId: mem.id
            });
          }
        });
        allPhotos.sort((a, b) => {
          const timeA = new Date(a.createdAt || 0).getTime();
          const timeB = new Date(b.createdAt || 0).getTime();
          return timeB - timeA;
        });
        this.recentPhotos = allPhotos.slice(0, 20);
      },
      /**
       * 更新统计信息
       */
      updateStats() {
        this.stats = albumService.getAlbumStats();
      },
      /**
       * 获取显示的照片列表
       */
      getDisplayPhotos() {
        if (!this.selectedMemory)
          return [];
        const photos = this.selectedMemory.photos || [];
        if (this.selectedMemory.coverImage) {
          const hasCover = photos.some((p) => p.url === this.selectedMemory.coverImage);
          if (!hasCover) {
            return [{ id: "cover", url: this.selectedMemory.coverImage }, ...photos];
          }
        }
        return photos;
      },
      /**
       * 返回
       */
      handleBack() {
        uni.switchTab({
          url: "/pages/chat/chat"
        });
      },
      /**
       * 搜索
       */
      handleSearch() {
        uni.showToast({
          title: "搜索功能开发中",
          icon: "none"
        });
      },
      /**
       * 查看所有回忆
       */
      handleViewAllMemories() {
        const items = this.memories.map((m) => m.title);
        uni.showActionSheet({
          itemList: items,
          success: (res) => {
            this.selectedMemory = this.memories[res.tapIndex];
            this.handleViewMemoryDetail();
          }
        });
      },
      /**
       * 点击回忆卡片
       */
      handleMemoryClick(mem) {
        this.selectedMemory = mem;
        this.currentMemoryId = mem.id;
        uni.navigateTo({
          url: `/pages/album/memory-detail?id=${mem.id}`
        });
      },
      /**
       * 查看回忆详情
       */
      handleViewMemoryDetail() {
        if (this.selectedMemory) {
          uni.navigateTo({
            url: `/pages/album/memory-detail?id=${this.selectedMemory.id}`
          });
        }
      },
      /**
       * 点击照片
       */
      handlePhotoClick(index) {
        const photos = this.getDisplayPhotos();
        const urls = photos.map((p) => p.url || p);
        uni.previewImage({
          urls,
          current: index
        });
      },
      /**
       * 创建回忆
       */
      handleCreateMemory() {
        this.newMemory = {
          title: "",
          location: "",
          date: this.getDefaultDate(),
          description: ""
        };
        this.showCreateModal = true;
      },
      /**
       * 获取默认日期
       */
      getDefaultDate() {
        const now = /* @__PURE__ */ new Date();
        return `${now.getFullYear()}年${now.getMonth() + 1}月`;
      },
      /**
       * 关闭创建弹窗
       */
      closeCreateModal() {
        this.showCreateModal = false;
      },
      /**
       * 创建新回忆
       */
      createMemory() {
        if (!this.newMemory.title || !this.newMemory.title.trim()) {
          uni.showToast({
            title: "请输入回忆标题",
            icon: "none"
          });
          return;
        }
        const coverImage = `https://images.unsplash.com/photo-${Date.now()}?w=800&auto=format&fit=crop`;
        const memory = {
          title: this.newMemory.title.trim(),
          location: this.newMemory.location.trim() || "未知地点",
          date: this.newMemory.date.trim() || this.getDefaultDate(),
          description: this.newMemory.description.trim(),
          coverImage,
          photoCount: 0,
          hasNote: false
        };
        const newMemory = albumService.addMemory(memory);
        this.loadData();
        this.closeCreateModal();
        uni.showToast({
          title: "创建成功",
          icon: "success"
        });
        this.selectedMemory = newMemory;
      },
      /**
       * 添加照片
       */
      handleAddPhoto() {
        if (this.memories.length === 0) {
          this.handleCreateMemory();
          uni.showToast({
            title: "请先创建回忆",
            icon: "none"
          });
          return;
        }
        this.showAddPhotoModal = true;
      },
      /**
       * 关闭添加照片弹窗
       */
      closeAddPhotoModal() {
        this.showAddPhotoModal = false;
      },
      /**
       * 选择回忆用于添加照片
       */
      selectMemoryForPhoto(mem) {
        this.selectedMemory = mem;
      },
      /**
       * 从相册选择照片
       */
      chooseFromAlbum() {
        uni.chooseImage({
          count: 9,
          sizeType: ["compressed"],
          sourceType: ["album"],
          success: (res) => {
            this.handleSelectedPhotos(res.tempFilePaths);
          },
          fail: (err) => {
            formatAppLog("error", "at pages/album/album.vue:600", "[相册] 选择照片失败:", err);
            uni.showToast({
              title: "选择照片失败",
              icon: "none"
            });
          }
        });
      },
      /**
       * 拍照
       */
      takePhoto() {
        uni.chooseImage({
          count: 1,
          sizeType: ["compressed"],
          sourceType: ["camera"],
          success: (res) => {
            this.handleSelectedPhotos(res.tempFilePaths);
          },
          fail: (err) => {
            formatAppLog("error", "at pages/album/album.vue:621", "[相册] 拍照失败:", err);
            uni.showToast({
              title: "拍照失败",
              icon: "none"
            });
          }
        });
      },
      /**
       * 处理选中的照片
       */
      handleSelectedPhotos(filePaths) {
        if (!this.selectedMemory) {
          uni.showToast({
            title: "请先选择回忆",
            icon: "none"
          });
          return;
        }
        let successCount = 0;
        filePaths.forEach((filePath) => {
          const photo = albumService.addPhoto(this.selectedMemory.id, filePath);
          if (photo) {
            successCount++;
          }
        });
        this.closeAddPhotoModal();
        this.loadData();
        uni.showToast({
          title: `成功添加 ${successCount} 张照片`,
          icon: "success"
        });
      },
      /**
       * 生成旅行札记
       */
      async handleGenerateNote() {
        if (this.memories.length === 0) {
          uni.showToast({
            title: "请先创建回忆",
            icon: "none"
          });
          return;
        }
        const targetMemory = this.selectedMemory || this.memories[0];
        this.isGenerating = true;
        uni.showLoading({
          title: "生成中...",
          mask: true
        });
        try {
          const prompt = `请根据以下旅行信息生成一篇生动的旅行札记：

地点：${targetMemory.location}
时间：${targetMemory.date}
标题：${targetMemory.title}
描述：${targetMemory.description || "暂无描述"}
照片数量：${targetMemory.photoCount} 张

要求：
1. 用第一人称叙述，充满感情色彩
2. 描述当时的感受和心情
3. 提及有趣的细节和见闻
4. 语言生动有趣，约 300-500 字
5. 可以适当使用表情符号增加亲和力
6. 只返回札记内容，不要其他说明`;
          const response = await sendTravelMessage(prompt, [], {
            temperature: 0.8,
            max_tokens: 1e3
          });
          const note = parseMessageContent(response);
          if (note && targetMemory) {
            albumService.saveTravelNote(targetMemory.id, note);
            this.loadData();
            uni.hideLoading();
            this.selectedMemory = targetMemory;
            this.currentMemoryId = targetMemory.id;
            this.noteContent = note;
            this.showNoteModal = true;
          } else {
            throw new Error("生成内容为空");
          }
        } catch (error) {
          formatAppLog("error", "at pages/album/album.vue:721", "[相册] 生成札记失败:", error);
          uni.hideLoading();
          const fallbackNote = `# ${targetMemory.title}

在${targetMemory.location}的${targetMemory.date}，我度过了一段难忘的时光。

${targetMemory.description || "这段回忆深深地印在了我的脑海里。"}

期待下一次的旅程！✨`;
          albumService.saveTravelNote(targetMemory.id, fallbackNote);
          this.loadData();
          this.selectedMemory = targetMemory;
          this.currentMemoryId = targetMemory.id;
          this.noteContent = fallbackNote;
          this.showNoteModal = true;
          uni.showToast({
            title: "网络失败，已生成模板",
            icon: "none"
          });
        } finally {
          this.isGenerating = false;
        }
      },
      /**
       * 打开札记编辑弹窗
       */
      openNoteModal() {
        var _a;
        this.showNoteModal = true;
        this.noteContent = ((_a = this.selectedMemory) == null ? void 0 : _a.travelNote) || "";
      },
      /**
       * 关闭札记弹窗
       */
      closeNoteModal() {
        this.showNoteModal = false;
        this.noteContent = "";
      },
      /**
       * 保存札记
       */
      saveNote() {
        if (!this.noteContent || !this.noteContent.trim()) {
          uni.showToast({
            title: "请输入札记内容",
            icon: "none"
          });
          return;
        }
        if (this.currentMemoryId) {
          albumService.saveTravelNote(this.currentMemoryId, this.noteContent.trim());
          this.loadData();
          this.closeNoteModal();
          uni.showToast({
            title: "保存成功",
            icon: "success"
          });
        }
      }
    }
  };
  function _sfc_render$8(_ctx, _cache, $props, $setup, $data, $options) {
    var _a;
    return vue.openBlock(), vue.createElementBlock("view", { class: "album-container" }, [
      vue.createElementVNode(
        "view",
        {
          class: "status-bar-placeholder",
          style: vue.normalizeStyle({ height: $data.statusBarHeight + "px" })
        },
        null,
        4
        /* STYLE */
      ),
      vue.createElementVNode("view", { class: "app-bar" }, [
        vue.createElementVNode("button", {
          class: "bar-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.handleBack && $options.handleBack(...args))
        }, [
          vue.createElementVNode("text", { class: "bar-icon" }, "←")
        ]),
        vue.createElementVNode("text", { class: "bar-title" }, "智能相册"),
        vue.createElementVNode("view", { class: "bar-actions" }, [
          vue.createElementVNode("button", {
            class: "bar-btn",
            onClick: _cache[1] || (_cache[1] = (...args) => $options.handleSearch && $options.handleSearch(...args))
          }, [
            vue.createElementVNode("text", { class: "bar-icon" }, "🔍")
          ]),
          vue.createElementVNode("button", {
            class: "bar-btn",
            onClick: _cache[2] || (_cache[2] = (...args) => $options.handleAddPhoto && $options.handleAddPhoto(...args))
          }, [
            vue.createElementVNode("text", { class: "bar-icon" }, "+")
          ])
        ])
      ]),
      vue.createElementVNode("scroll-view", {
        class: "content-scroll",
        "scroll-y": ""
      }, [
        vue.createElementVNode("view", { class: "content-area" }, [
          vue.createElementVNode("view", { class: "stats-card" }, [
            vue.createElementVNode("view", { class: "stat-item" }, [
              vue.createElementVNode(
                "text",
                { class: "stat-value" },
                vue.toDisplayString($data.stats.totalMemories),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "stat-label" }, "回忆")
            ]),
            vue.createElementVNode("view", { class: "stat-item" }, [
              vue.createElementVNode(
                "text",
                { class: "stat-value" },
                vue.toDisplayString($data.stats.totalPhotos),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "stat-label" }, "照片")
            ]),
            vue.createElementVNode("view", { class: "stat-item" }, [
              vue.createElementVNode(
                "text",
                { class: "stat-value" },
                vue.toDisplayString($data.stats.totalNotes),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "stat-label" }, "札记")
            ])
          ]),
          vue.createElementVNode("view", { class: "section-header" }, [
            vue.createElementVNode("text", { class: "section-title" }, "精彩回忆"),
            vue.createElementVNode("button", {
              class: "view-all-btn",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.handleViewAllMemories && $options.handleViewAllMemories(...args))
            }, [
              vue.createElementVNode("text", { class: "view-all-text" }, "查看全部")
            ])
          ]),
          vue.createElementVNode("scroll-view", {
            class: "memories-scroll",
            "scroll-x": ""
          }, [
            vue.createElementVNode("view", { class: "memories-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.memories, (mem) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: mem.id,
                    class: "memory-card",
                    onClick: ($event) => $options.handleMemoryClick(mem)
                  }, [
                    vue.createElementVNode("image", {
                      class: "memory-image",
                      src: mem.coverImage,
                      mode: "aspectFill"
                    }, null, 8, ["src"]),
                    vue.createElementVNode("view", { class: "memory-overlay" }, [
                      vue.createElementVNode("view", { class: "memory-info" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "memory-title" },
                          vue.toDisplayString(mem.title),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode("view", { class: "memory-meta" }, [
                          vue.createElementVNode("text", { class: "meta-icon" }, "📅"),
                          vue.createElementVNode(
                            "text",
                            { class: "meta-text" },
                            vue.toDisplayString(mem.date),
                            1
                            /* TEXT */
                          )
                        ])
                      ]),
                      vue.createElementVNode("view", { class: "memory-badge" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "badge-text" },
                          vue.toDisplayString(mem.photoCount) + " 张照片",
                          1
                          /* TEXT */
                        )
                      ]),
                      mem.hasNote ? (vue.openBlock(), vue.createElementBlock("view", {
                        key: 0,
                        class: "note-indicator"
                      }, [
                        vue.createElementVNode("text", { class: "note-icon" }, "✏️")
                      ])) : vue.createCommentVNode("v-if", true)
                    ])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              )),
              vue.createElementVNode("view", {
                class: "memory-card memory-card-add",
                onClick: _cache[4] || (_cache[4] = (...args) => $options.handleCreateMemory && $options.handleCreateMemory(...args))
              }, [
                vue.createElementVNode("view", { class: "add-content" }, [
                  vue.createElementVNode("text", { class: "add-icon" }, "+"),
                  vue.createElementVNode("text", { class: "add-text" }, "创建回忆")
                ])
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "grid-section" }, [
            vue.createElementVNode("view", { class: "grid-header" }, [
              vue.createElementVNode("view", { class: "grid-title-area" }, [
                vue.createElementVNode(
                  "text",
                  { class: "grid-title" },
                  vue.toDisplayString($data.selectedMemory ? $data.selectedMemory.title : "最近照片"),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "grid-subtitle" },
                  vue.toDisplayString($data.selectedMemory ? $data.selectedMemory.date : ""),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("button", {
                class: "grid-more-btn",
                onClick: _cache[5] || (_cache[5] = (...args) => $options.handleViewMemoryDetail && $options.handleViewMemoryDetail(...args))
              }, [
                vue.createElementVNode("text", { class: "more-icon" }, "⋯")
              ])
            ]),
            $data.selectedMemory ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "photo-grid"
            }, [
              vue.createElementVNode("view", {
                class: "photo-item photo-item-large",
                onClick: _cache[6] || (_cache[6] = ($event) => $options.handlePhotoClick(0))
              }, [
                vue.createElementVNode("image", {
                  class: "photo-image",
                  src: $data.selectedMemory.coverImage,
                  mode: "aspectFill"
                }, null, 8, ["src"])
              ]),
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($options.getDisplayPhotos().slice(0, 5), (photo, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: photo.id || index,
                    class: "photo-item",
                    onClick: ($event) => $options.handlePhotoClick(index + 1)
                  }, [
                    vue.createElementVNode("image", {
                      class: "photo-image",
                      src: photo.url || photo,
                      mode: "aspectFill"
                    }, null, 8, ["src"])
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "photo-grid"
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.recentPhotos.slice(0, 6), (photo, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: photo.id || index,
                    class: vue.normalizeClass(["photo-item", { "photo-item-large": index === 0 }]),
                    onClick: ($event) => $options.handlePhotoClick(index)
                  }, [
                    vue.createElementVNode("image", {
                      class: "photo-image",
                      src: photo.url || photo,
                      mode: "aspectFill"
                    }, null, 8, ["src"])
                  ], 10, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])),
            !$data.selectedMemory && $data.recentPhotos.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 2,
              class: "empty-photos"
            }, [
              vue.createElementVNode("text", { class: "empty-text" }, "暂无照片"),
              vue.createElementVNode("button", {
                class: "empty-btn",
                onClick: _cache[7] || (_cache[7] = (...args) => $options.handleAddPhoto && $options.handleAddPhoto(...args))
              }, [
                vue.createElementVNode("text", { class: "empty-btn-text" }, "添加照片")
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ])
        ])
      ]),
      vue.createElementVNode("view", { class: "fab-container" }, [
        vue.createElementVNode("button", {
          class: "fab-btn",
          onClick: _cache[8] || (_cache[8] = (...args) => $options.handleGenerateNote && $options.handleGenerateNote(...args)),
          disabled: $data.isGenerating || $data.memories.length === 0
        }, [
          vue.createElementVNode(
            "text",
            { class: "fab-icon" },
            vue.toDisplayString($data.isGenerating ? "⏳" : "✨"),
            1
            /* TEXT */
          ),
          vue.createElementVNode(
            "text",
            { class: "fab-text" },
            vue.toDisplayString($data.isGenerating ? "生成中..." : "一键生成旅行札记"),
            1
            /* TEXT */
          )
        ], 8, ["disabled"])
      ]),
      $data.showNoteModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "modal-overlay",
        onClick: _cache[13] || (_cache[13] = (...args) => $options.closeNoteModal && $options.closeNoteModal(...args))
      }, [
        vue.createElementVNode("view", {
          class: "modal-content",
          onClick: _cache[12] || (_cache[12] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode(
              "text",
              { class: "modal-title" },
              vue.toDisplayString(((_a = $data.selectedMemory) == null ? void 0 : _a.title) || "编辑札记"),
              1
              /* TEXT */
            ),
            vue.createElementVNode("button", {
              class: "modal-close",
              onClick: _cache[9] || (_cache[9] = (...args) => $options.closeNoteModal && $options.closeNoteModal(...args))
            }, [
              vue.createElementVNode("text", { class: "close-icon" }, "✕")
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-form" }, [
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.createElementVNode("text", { class: "form-label" }, "旅行札记"),
              vue.withDirectives(vue.createElementVNode(
                "textarea",
                {
                  "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => $data.noteContent = $event),
                  class: "form-textarea",
                  placeholder: "记录您的旅行感受...",
                  "placeholder-class": "form-placeholder",
                  maxlength: 1e3,
                  "auto-height": true
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.noteContent]
              ]),
              vue.createElementVNode(
                "text",
                { class: "char-count" },
                vue.toDisplayString($data.noteContent.length) + "/1000",
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("button", {
              class: "form-submit",
              onClick: _cache[11] || (_cache[11] = (...args) => $options.saveNote && $options.saveNote(...args))
            }, [
              vue.createElementVNode("text", { class: "submit-text" }, "保存")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      $data.showCreateModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "modal-overlay",
        onClick: _cache[21] || (_cache[21] = (...args) => $options.closeCreateModal && $options.closeCreateModal(...args))
      }, [
        vue.createElementVNode("view", {
          class: "modal-content",
          onClick: _cache[20] || (_cache[20] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "创建新回忆"),
            vue.createElementVNode("button", {
              class: "modal-close",
              onClick: _cache[14] || (_cache[14] = (...args) => $options.closeCreateModal && $options.closeCreateModal(...args))
            }, [
              vue.createElementVNode("text", { class: "close-icon" }, "✕")
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-form" }, [
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.createElementVNode("text", { class: "form-label" }, "回忆标题"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => $data.newMemory.title = $event),
                  class: "form-input",
                  placeholder: "例如：周末在京都",
                  "placeholder-class": "form-placeholder"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.newMemory.title]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.createElementVNode("text", { class: "form-label" }, "地点"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => $data.newMemory.location = $event),
                  class: "form-input",
                  placeholder: "例如：京都，日本",
                  "placeholder-class": "form-placeholder"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.newMemory.location]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.createElementVNode("text", { class: "form-label" }, "时间"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => $data.newMemory.date = $event),
                  class: "form-input",
                  placeholder: "例如：2023年10月",
                  "placeholder-class": "form-placeholder"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.newMemory.date]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.createElementVNode("text", { class: "form-label" }, "描述"),
              vue.withDirectives(vue.createElementVNode(
                "textarea",
                {
                  "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => $data.newMemory.description = $event),
                  class: "form-textarea",
                  placeholder: "描述这段回忆...",
                  "placeholder-class": "form-placeholder",
                  maxlength: 200,
                  "auto-height": true
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.newMemory.description]
              ])
            ]),
            vue.createElementVNode("button", {
              class: "form-submit",
              onClick: _cache[19] || (_cache[19] = (...args) => $options.createMemory && $options.createMemory(...args))
            }, [
              vue.createElementVNode("text", { class: "submit-text" }, "创建")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      $data.showAddPhotoModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "modal-overlay",
        onClick: _cache[26] || (_cache[26] = (...args) => $options.closeAddPhotoModal && $options.closeAddPhotoModal(...args))
      }, [
        vue.createElementVNode("view", {
          class: "modal-content modal-content-bottom",
          onClick: _cache[25] || (_cache[25] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "添加照片"),
            vue.createElementVNode("button", {
              class: "modal-close",
              onClick: _cache[22] || (_cache[22] = (...args) => $options.closeAddPhotoModal && $options.closeAddPhotoModal(...args))
            }, [
              vue.createElementVNode("text", { class: "close-icon" }, "✕")
            ])
          ]),
          vue.createElementVNode("view", { class: "photo-options" }, [
            vue.createElementVNode("button", {
              class: "photo-option-btn",
              onClick: _cache[23] || (_cache[23] = (...args) => $options.chooseFromAlbum && $options.chooseFromAlbum(...args))
            }, [
              vue.createElementVNode("text", { class: "photo-option-icon" }, "📷"),
              vue.createElementVNode("text", { class: "photo-option-text" }, "从相册选择")
            ]),
            vue.createElementVNode("button", {
              class: "photo-option-btn",
              onClick: _cache[24] || (_cache[24] = (...args) => $options.takePhoto && $options.takePhoto(...args))
            }, [
              vue.createElementVNode("text", { class: "photo-option-icon" }, "📸"),
              vue.createElementVNode("text", { class: "photo-option-text" }, "拍照")
            ])
          ]),
          $data.memories.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "memory-selector"
          }, [
            vue.createElementVNode("text", { class: "selector-label" }, "选择回忆"),
            vue.createElementVNode("scroll-view", {
              class: "memory-selector-scroll",
              "scroll-x": ""
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.memories, (mem) => {
                  var _a2;
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: mem.id,
                    class: vue.normalizeClass(["memory-selector-item", { active: ((_a2 = $data.selectedMemory) == null ? void 0 : _a2.id) === mem.id }]),
                    onClick: ($event) => $options.selectMemoryForPhoto(mem)
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "selector-item-text" },
                      vue.toDisplayString(mem.title),
                      1
                      /* TEXT */
                    )
                  ], 10, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAlbumAlbum = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", _sfc_render$8], ["__scopeId", "data-v-7c8b231e"], ["__file", "D:/2026_all_Favio/AI_exploring/personal/WanderAI/pages/album/album.vue"]]);
  const DEFAULT_USER = {
    // 基本信息
    name: "漫游者",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBfRBDKbJG0mM_4keHzAGm27g748VRBz07CgmGEz7sDaHHy_zgzjdpxgZo-L2r9D9QY0DmDdYK5kCAjTmx8yf0Gh6ug1H8jvZwkbigZCK0IBaUuclK34CIZ_4bsA0ZninEMAJ2HwQIyrSP9vq6La99UjzDjUE5rmcBzdRb2VCRZ0rGJZ73bhqBTr2TcY76wjeKJ_-T9gJF4FzL_CH9UXyEaI5yLHnl1kN1YY7IW4-yKG-EpXtw4WXjFxKmF9eCfplzu_s3p7kMKpZc",
    level: 1,
    joinYear: (/* @__PURE__ */ new Date()).getFullYear(),
    // 统计数据
    countries: 0,
    days: 0,
    continents: 0,
    // 设置
    preferences: {
      theme: "light",
      language: "zh-CN",
      notifications: true
    }
  };
  function getUserProfile() {
    try {
      const user = storage.get(STORAGE_KEYS.USER_PROFILE);
      if (user && user.name) {
        return user;
      }
      return { ...DEFAULT_USER };
    } catch (e) {
      formatAppLog("error", "at services/user.js:41", "获取用户信息失败:", e);
      return { ...DEFAULT_USER };
    }
  }
  function saveUserProfile(userData) {
    try {
      storage.set(STORAGE_KEYS.USER_PROFILE, userData);
      return true;
    } catch (e) {
      formatAppLog("error", "at services/user.js:56", "保存用户信息失败:", e);
      return false;
    }
  }
  function updateUserProfile(updates) {
    const user = getUserProfile();
    const updated = { ...user, ...updates };
    saveUserProfile(updated);
    return updated;
  }
  function updateBasicInfo(name, avatar) {
    return updateUserProfile({ name, avatar });
  }
  function updateLevel(level) {
    return updateUserProfile({ level });
  }
  function addTravelStats(countries = 0, days = 0, continents = 0) {
    const user = getUserProfile();
    return updateUserProfile({
      countries: user.countries + countries,
      days: user.days + days,
      continents: user.continents + continents
    });
  }
  function getLevelInfo(level) {
    const levels = [
      { level: 1, title: "新手旅行者", minExp: 0 },
      { level: 2, title: "城市探险家", minExp: 100 },
      { level: 3, title: "探险家", minExp: 500 },
      { level: 4, title: "旅行达人", minExp: 1500 },
      { level: 5, title: "环球旅行家", minExp: 3e3 }
    ];
    const current = levels.find((l) => l.level === level) || levels[0];
    const next = levels.find((l) => l.level === level + 1);
    return {
      ...current,
      nextLevel: next ? next.title : null,
      progress: next ? Math.min(100, (level * 500 - current.minExp) / (next.minExp - current.minExp) * 100) : 100
    };
  }
  function getLevelTitle(level) {
    const info = getLevelInfo(level);
    return info.title;
  }
  function updatePreferences(preferences) {
    const user = getUserProfile();
    return updateUserProfile({
      preferences: { ...user.preferences, ...preferences }
    });
  }
  function getPreferences() {
    const user = getUserProfile();
    return user.preferences || DEFAULT_USER.preferences;
  }
  function clearUserData() {
    try {
      storage.remove(STORAGE_KEYS.USER_PROFILE);
      return true;
    } catch (e) {
      formatAppLog("error", "at services/user.js:172", "清空用户数据失败:", e);
      return false;
    }
  }
  function uploadAvatar(filePath) {
    return new Promise((resolve, reject) => {
      resolve(filePath);
    });
  }
  function chooseAvatar() {
    return new Promise((resolve, reject) => {
      uni.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album"],
        success: (res) => {
          resolve(res.tempFilePaths[0]);
        },
        fail: reject
      });
    });
  }
  function takeAvatar() {
    return new Promise((resolve, reject) => {
      uni.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["camera"],
        success: (res) => {
          resolve(res.tempFilePaths[0]);
        },
        fail: reject
      });
    });
  }
  async function chooseAndUpdateAvatar() {
    try {
      const filePath = await chooseAvatar();
      const avatarUrl = filePath;
      updateUserProfile({ avatar: avatarUrl });
      return avatarUrl;
    } catch (e) {
      formatAppLog("error", "at services/user.js:252", "选择头像失败:", e);
      throw e;
    }
  }
  async function takeAndUpdateAvatar() {
    try {
      const filePath = await takeAvatar();
      const avatarUrl = filePath;
      updateUserProfile({ avatar: avatarUrl });
      return avatarUrl;
    } catch (e) {
      formatAppLog("error", "at services/user.js:268", "拍照头像失败:", e);
      throw e;
    }
  }
  const userService = {
    getUserProfile,
    saveUserProfile,
    updateUserProfile,
    updateBasicInfo,
    updateLevel,
    addTravelStats,
    getLevelInfo,
    getLevelTitle,
    updatePreferences,
    getPreferences,
    clearUserData,
    uploadAvatar,
    chooseAvatar,
    takeAvatar,
    chooseAndUpdateAvatar,
    takeAndUpdateAvatar
  };
  const _sfc_main$7 = {
    data() {
      return {
        // 用户数据
        user: {
          name: "漫游者",
          avatar: "",
          level: 1,
          joinYear: (/* @__PURE__ */ new Date()).getFullYear(),
          countries: 0,
          days: 0,
          continents: 0,
          preferences: {
            theme: "light",
            notifications: true
          }
        },
        // 编辑弹窗
        showEditModal: false,
        editForm: {
          name: "",
          joinYear: null
        },
        yearOptions: [],
        currentYear: (/* @__PURE__ */ new Date()).getFullYear(),
        // 设置弹窗
        showSettingsModal: false,
        themeOptions: ["浅色", "深色", "跟随系统"],
        // 菜单项
        menuItems: [
          { id: "favorites", icon: "🔖", title: "我的收藏", sub: "24 个保存的地点" },
          { id: "orders", icon: "📋", title: "订单管理", sub: "3 个即将进行的行程" },
          { id: "settings", icon: "🎛️", title: "AI 偏好设置", sub: "自定义您的推荐流" }
        ],
        // Android 适配：系统信息
        statusBarHeight: 44,
        // 默认值，会在 onLoad 中更新
        safeAreaInsetBottom: 0,
        // 底部安全区高度（px）
        tabBarHeight: 60
        // TabBar 高度（px）
      };
    },
    computed: {
      levelTitle() {
        return getLevelTitle(this.user.level);
      }
    },
    onLoad() {
      this.initSystemInfo();
      this.initYearOptions();
      this.loadUserProfile();
    },
    methods: {
      /**
       * Android 适配：初始化系统信息
       * 获取状态栏高度、安全区域等，用于布局适配
       */
      initSystemInfo() {
        var _a;
        try {
          const systemInfo = uni.getSystemInfoSync();
          this.statusBarHeight = systemInfo.statusBarHeight || 44;
          this.safeAreaInsetBottom = systemInfo.screenHeight - (((_a = systemInfo.safeArea) == null ? void 0 : _a.bottom) || systemInfo.screenHeight);
          formatAppLog("log", "at pages/profile/profile.vue:263", "[Profile] 系统信息:", {
            statusBarHeight: this.statusBarHeight,
            safeAreaInsetBottom: this.safeAreaInsetBottom
          });
        } catch (e) {
          formatAppLog("error", "at pages/profile/profile.vue:268", "[Profile] 获取系统信息失败:", e);
        }
      },
      /**
       * 初始化年份选项
       */
      initYearOptions() {
        const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
        this.yearOptions = [];
        for (let i = 0; i < 10; i++) {
          this.yearOptions.push(currentYear - i);
        }
      },
      /**
       * 加载用户数据
       */
      loadUserProfile() {
        this.user = userService.getUserProfile();
      },
      /**
       * 打开编辑弹窗
       */
      openEditModal() {
        this.editForm = {
          name: this.user.name,
          joinYear: this.user.joinYear
        };
        this.showEditModal = true;
      },
      /**
       * 关闭编辑弹窗
       */
      closeEditModal() {
        this.showEditModal = false;
      },
      /**
       * 年份选择变化
       */
      onYearChange(e) {
        this.editForm.joinYear = this.yearOptions[e.detail.value];
      },
      /**
       * 保存用户资料
       */
      saveUserProfile() {
        if (!this.editForm.name || !this.editForm.name.trim()) {
          uni.showToast({
            title: "请输入昵称",
            icon: "none"
          });
          return;
        }
        this.user = userService.updateUserProfile({
          name: this.editForm.name.trim(),
          joinYear: this.editForm.joinYear
        });
        this.closeEditModal();
        uni.showToast({
          title: "保存成功",
          icon: "success"
        });
      },
      /**
       * 编辑头像
       */
      async handleEditAvatar() {
        try {
          uni.showActionSheet({
            itemList: ["从相册选择", "拍照"],
            success: async (res) => {
              try {
                if (res.tapIndex === 0) {
                  uni.showLoading({
                    title: "加载中..."
                  });
                  const avatarUrl = await userService.chooseAndUpdateAvatar();
                  this.user.avatar = avatarUrl;
                  uni.hideLoading();
                  uni.showToast({
                    title: "头像已更新",
                    icon: "success"
                  });
                } else if (res.tapIndex === 1) {
                  uni.showLoading({
                    title: "拍照中..."
                  });
                  const avatarUrl = await userService.takeAndUpdateAvatar();
                  this.user.avatar = avatarUrl;
                  uni.hideLoading();
                  uni.showToast({
                    title: "头像已更新",
                    icon: "success"
                  });
                }
              } catch (e) {
                uni.hideLoading();
                formatAppLog("error", "at pages/profile/profile.vue:376", "更新头像失败:", e);
                uni.showToast({
                  title: "更新失败，请重试",
                  icon: "none"
                });
              }
            }
          });
        } catch (e) {
          formatAppLog("error", "at pages/profile/profile.vue:385", "选择头像失败:", e);
        }
      },
      /**
       * 打开设置弹窗
       */
      openSettingsModal() {
        this.showSettingsModal = true;
        this.loadUserProfile();
      },
      /**
       * 关闭设置弹窗
       */
      closeSettingsModal() {
        this.showSettingsModal = false;
      },
      /**
       * 通知开关变化
       */
      onNotificationChange(e) {
        this.user = userService.updatePreferences({
          notifications: e.detail.value
        });
        uni.showToast({
          title: e.detail.value ? "已开启通知" : "已关闭通知",
          icon: "none"
        });
      },
      /**
       * 主题选择变化
       */
      onThemeChange(e) {
        const themes = ["light", "dark", "auto"];
        const theme = themes[e.detail.value];
        this.user = userService.updatePreferences({ theme });
        uni.showToast({
          title: "主题已切换",
          icon: "none"
        });
      },
      /**
       * 获取主题标签
       */
      getThemeLabel(theme) {
        const labels = {
          light: "浅色",
          dark: "深色",
          auto: "跟随系统"
        };
        return labels[theme] || "浅色";
      },
      /**
       * 获取旅行进度百分比
       */
      getTravelProgress() {
        return Math.round(this.user.continents / 7 * 100);
      },
      /**
       * 清空所有数据
       */
      handleClearData() {
        uni.showModal({
          title: "确认清空",
          content: "确定要清空所有数据吗？此操作不可恢复。",
          confirmColor: "#ff4d4f",
          success: (res) => {
            if (res.confirm) {
              userService.clearUserData();
              this.loadUserProfile();
              this.closeSettingsModal();
              uni.showToast({
                title: "已清空",
                icon: "success"
              });
            }
          }
        });
      },
      /**
       * 菜单点击
       */
      handleMenuClick(item) {
        formatAppLog("log", "at pages/profile/profile.vue:476", "点击菜单项:", item.title);
        switch (item.id) {
          case "favorites":
            uni.navigateTo({
              url: "/pages/favorites/favorites"
            });
            break;
          case "orders":
            uni.navigateTo({
              url: "/pages/orders/orders"
            });
            break;
          case "settings":
            uni.navigateTo({
              url: "/pages/settings/settings"
            });
            break;
          default:
            uni.showToast({
              title: item.title + " 即将上线",
              icon: "none"
            });
        }
      },
      /**
       * 返回
       */
      handleBack() {
        uni.switchTab({
          url: "/pages/chat/chat"
        });
      }
    }
  };
  function _sfc_render$7(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "profile-container" }, [
      vue.createElementVNode(
        "view",
        {
          class: "status-bar-placeholder",
          style: vue.normalizeStyle({ height: $data.statusBarHeight + "px" })
        },
        null,
        4
        /* STYLE */
      ),
      vue.createElementVNode("view", { class: "header" }, [
        vue.createElementVNode("button", {
          class: "header-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.handleBack && $options.handleBack(...args))
        }, [
          vue.createElementVNode("text", { class: "btn-icon" }, "←")
        ]),
        vue.createElementVNode("text", { class: "header-title" }, "个人中心"),
        vue.createElementVNode("button", {
          class: "header-btn",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.openSettingsModal && $options.openSettingsModal(...args))
        }, [
          vue.createElementVNode("text", { class: "btn-icon" }, "⚙️")
        ])
      ]),
      vue.createElementVNode("scroll-view", {
        class: "content-scroll",
        "scroll-y": ""
      }, [
        vue.createElementVNode("view", { class: "content-area" }, [
          vue.createElementVNode("view", { class: "user-section" }, [
            vue.createElementVNode("view", { class: "avatar-wrapper" }, [
              vue.createElementVNode("view", {
                class: "avatar-container",
                onClick: _cache[2] || (_cache[2] = (...args) => $options.handleEditAvatar && $options.handleEditAvatar(...args))
              }, [
                vue.createElementVNode("image", {
                  class: "avatar-image",
                  src: $data.user.avatar,
                  mode: "aspectFill"
                }, null, 8, ["src"]),
                vue.createElementVNode("button", { class: "avatar-edit-btn" }, [
                  vue.createElementVNode("text", { class: "edit-icon" }, "✏️")
                ])
              ])
            ]),
            vue.createElementVNode("view", {
              class: "user-info-wrapper",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.openEditModal && $options.openEditModal(...args))
            }, [
              vue.createElementVNode(
                "text",
                { class: "user-name" },
                vue.toDisplayString($data.user.name),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "user-level" },
                vue.toDisplayString($options.levelTitle) + " " + vue.toDisplayString($data.user.level) + "级 • " + vue.toDisplayString($data.user.joinYear) + "年加入",
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "stats-grid" }, [
            vue.createElementVNode("view", { class: "stat-card" }, [
              vue.createElementVNode("view", { class: "stat-icon stat-icon-nature" }, [
                vue.createElementVNode("text", { class: "icon" }, "🌍")
              ]),
              vue.createElementVNode("view", { class: "stat-info" }, [
                vue.createElementVNode("text", { class: "stat-label" }, "去过的国家"),
                vue.createElementVNode(
                  "text",
                  { class: "stat-value" },
                  vue.toDisplayString($data.user.countries),
                  1
                  /* TEXT */
                )
              ])
            ]),
            vue.createElementVNode("view", { class: "stat-card" }, [
              vue.createElementVNode("view", { class: "stat-icon stat-icon-calendar" }, [
                vue.createElementVNode("text", { class: "icon" }, "📅")
              ]),
              vue.createElementVNode("view", { class: "stat-info" }, [
                vue.createElementVNode("text", { class: "stat-label" }, "累计旅行天数"),
                vue.createElementVNode(
                  "text",
                  { class: "stat-value" },
                  vue.toDisplayString($data.user.days),
                  1
                  /* TEXT */
                )
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "menu-section" }, [
            vue.createElementVNode("text", { class: "menu-title" }, "我的账户"),
            vue.createElementVNode("view", { class: "menu-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.menuItems, (item, index) => {
                  return vue.openBlock(), vue.createElementBlock("button", {
                    key: index,
                    class: "menu-item",
                    onClick: ($event) => $options.handleMenuClick(item)
                  }, [
                    vue.createElementVNode("view", { class: "menu-icon-bg" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "menu-icon" },
                        vue.toDisplayString(item.icon),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("view", { class: "menu-content" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "menu-item-title" },
                        vue.toDisplayString(item.title),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "menu-item-sub" },
                        vue.toDisplayString(item.sub),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode("text", { class: "menu-arrow" }, "›")
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createElementVNode("view", { class: "map-section" }, [
            vue.createElementVNode("view", { class: "map-header" }, [
              vue.createElementVNode("text", { class: "map-title" }, "旅行足迹"),
              vue.createElementVNode("button", { class: "map-view-btn" }, [
                vue.createElementVNode("text", { class: "map-view-text" }, "查看完整地图")
              ])
            ]),
            vue.createElementVNode("view", { class: "map-card" }, [
              vue.createElementVNode("image", {
                class: "map-background",
                src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCTP5IacWOAKclbfp8soJAZnjdAsOT8gXzEKl7I9eUkOvBtmTnZwCIl-nZhGZDc4R3IdlpsPb4rObWRFir7WkajYSSB4-SH3t_-XSH_QLzGQeumKYhwbh0dgtpZDVZFSinJlDWwug6tqnwasDZrUW8-JgmpKcbsUTVSJ8fm4J548eZOANi-B0VYsehLzMACffzBMBfAlcewNR-k7FbqsxQ-HSWmriU1kfi167B3kSDgA0LHNC0fD6zKRKeKZ63-lBO4vS82r2Bu6EI",
                mode: "aspectFill"
              }),
              vue.createElementVNode("view", { class: "map-overlay" }, [
                vue.createElementVNode("view", { class: "map-stats" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "map-stat-value" },
                    vue.toDisplayString($data.user.continents) + " 个大洲",
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "map-stat-desc" },
                    "您已走过世界的 " + vue.toDisplayString($options.getTravelProgress()) + "%！",
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode("button", { class: "map-share-btn" }, [
                  vue.createElementVNode("text", { class: "share-icon" }, "📍")
                ])
              ])
            ])
          ])
        ])
      ]),
      $data.showEditModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "modal-overlay",
        onClick: _cache[9] || (_cache[9] = (...args) => $options.closeEditModal && $options.closeEditModal(...args))
      }, [
        vue.createElementVNode("view", {
          class: "modal-content",
          onClick: _cache[8] || (_cache[8] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "编辑资料"),
            vue.createElementVNode("button", {
              class: "modal-close",
              onClick: _cache[4] || (_cache[4] = (...args) => $options.closeEditModal && $options.closeEditModal(...args))
            }, [
              vue.createElementVNode("text", { class: "close-icon" }, "✕")
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-form" }, [
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.createElementVNode("text", { class: "form-label" }, "昵称"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => $data.editForm.name = $event),
                  class: "form-input",
                  placeholder: "请输入昵称",
                  "placeholder-class": "form-placeholder",
                  maxlength: "20"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.editForm.name]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.createElementVNode("text", { class: "form-label" }, "加入年份"),
              vue.createElementVNode("picker", {
                mode: "selector",
                range: $data.yearOptions,
                onChange: _cache[6] || (_cache[6] = (...args) => $options.onYearChange && $options.onYearChange(...args))
              }, [
                vue.createElementVNode("view", { class: "form-input form-picker" }, [
                  vue.createTextVNode(
                    vue.toDisplayString($data.editForm.joinYear || "请选择") + " ",
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", { class: "picker-arrow" }, "▼")
                ])
              ], 40, ["range"])
            ]),
            vue.createElementVNode("button", {
              class: "form-submit",
              onClick: _cache[7] || (_cache[7] = (...args) => $options.saveUserProfile && $options.saveUserProfile(...args))
            }, [
              vue.createElementVNode("text", { class: "submit-text" }, "保存")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      $data.showSettingsModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "modal-overlay",
        onClick: _cache[15] || (_cache[15] = (...args) => $options.closeSettingsModal && $options.closeSettingsModal(...args))
      }, [
        vue.createElementVNode("view", {
          class: "modal-content",
          onClick: _cache[14] || (_cache[14] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "设置"),
            vue.createElementVNode("button", {
              class: "modal-close",
              onClick: _cache[10] || (_cache[10] = (...args) => $options.closeSettingsModal && $options.closeSettingsModal(...args))
            }, [
              vue.createElementVNode("text", { class: "close-icon" }, "✕")
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-form" }, [
            vue.createElementVNode("view", { class: "settings-list" }, [
              vue.createElementVNode("view", { class: "settings-item" }, [
                vue.createElementVNode("text", { class: "settings-label" }, "消息通知"),
                vue.createElementVNode("switch", {
                  checked: $data.user.preferences.notifications,
                  onChange: _cache[11] || (_cache[11] = (...args) => $options.onNotificationChange && $options.onNotificationChange(...args)),
                  color: "#63ec13"
                }, null, 40, ["checked"])
              ]),
              vue.createElementVNode("view", { class: "settings-item" }, [
                vue.createElementVNode("text", { class: "settings-label" }, "主题"),
                vue.createElementVNode("picker", {
                  mode: "selector",
                  range: $data.themeOptions,
                  onChange: _cache[12] || (_cache[12] = (...args) => $options.onThemeChange && $options.onThemeChange(...args))
                }, [
                  vue.createElementVNode(
                    "view",
                    { class: "theme-value" },
                    vue.toDisplayString($options.getThemeLabel($data.user.preferences.theme)),
                    1
                    /* TEXT */
                  )
                ], 40, ["range"])
              ])
            ]),
            vue.createElementVNode("button", {
              class: "form-submit-secondary",
              onClick: _cache[13] || (_cache[13] = (...args) => $options.handleClearData && $options.handleClearData(...args))
            }, [
              vue.createElementVNode("text", { class: "submit-text-secondary" }, "清空所有数据")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesProfileProfile = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", _sfc_render$7], ["__scopeId", "data-v-dd383ca2"], ["__file", "D:/2026_all_Favio/AI_exploring/personal/WanderAI/pages/profile/profile.vue"]]);
  const scriptRel = "modulepreload";
  const assetsURL = function(dep) {
    return "/" + dep;
  };
  const seen = {};
  const __vitePreload = function preload(baseModule, deps, importerUrl) {
    let promise = Promise.resolve();
    if (false) {
      const links = document.getElementsByTagName("link");
      const cspNonceMeta = document.querySelector("meta[property=csp-nonce]");
      const cspNonce = (cspNonceMeta == null ? void 0 : cspNonceMeta.nonce) || (cspNonceMeta == null ? void 0 : cspNonceMeta.getAttribute("nonce"));
      promise = Promise.all(deps.map((dep) => {
        dep = assetsURL(dep);
        if (dep in seen)
          return;
        seen[dep] = true;
        const isCss = dep.endsWith(".css");
        const cssSelector = isCss ? '[rel="stylesheet"]' : "";
        const isBaseRelative = !!importerUrl;
        if (isBaseRelative) {
          for (let i = links.length - 1; i >= 0; i--) {
            const link2 = links[i];
            if (link2.href === dep && (!isCss || link2.rel === "stylesheet")) {
              return;
            }
          }
        } else if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
          return;
        }
        const link = document.createElement("link");
        link.rel = isCss ? "stylesheet" : scriptRel;
        if (!isCss) {
          link.as = "script";
          link.crossOrigin = "";
        }
        link.href = dep;
        if (cspNonce) {
          link.setAttribute("nonce", cspNonce);
        }
        document.head.appendChild(link);
        if (isCss) {
          return new Promise((res, rej) => {
            link.addEventListener("load", res);
            link.addEventListener("error", () => rej(new Error(`Unable to preload CSS for ${dep}`)));
          });
        }
      }));
    }
    return promise.then(() => baseModule()).catch((err) => {
      const e = new Event("vite:preloadError", { cancelable: true });
      e.payload = err;
      window.dispatchEvent(e);
      if (!e.defaultPrevented) {
        throw err;
      }
    });
  };
  const DEFAULT_ITINERARY = {
    title: "京都之旅计划",
    startDate: "10月12日",
    endDate: "10月20日",
    items: [
      {
        id: "1",
        day: 2,
        time: "09:00",
        period: "morning",
        title: "Kichi Kichi 早餐",
        description: "著名的蛋包饭预约",
        category: "餐饮",
        duration: "1.5小时"
      },
      {
        id: "2",
        day: 2,
        time: "10:30",
        period: "morning",
        title: "伏见稻荷大社",
        description: "徒步登山路线",
        category: "文化",
        duration: "2小时",
        image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCUkqFmW1LWHSiPhXwHqQMkWVF2SYczgdmx-0gQwksJYhhbcLNK3y7v3BFuFtMFTbMwZBsqRCQoFF8IGfvkP2xN0EUQ20naCjd-qUdUecinv5Mo4P-dZYd5tB_TZZP6lWjUij0lHkOQhTDOLtkr6cnzXw7pIvvtGwNRVW5_1CGWcjn6EfFPi_WMe56hVzLYE0b-9FSDn4rw3SOVf3GR66heDkqhfs5PN5rrpGJv0dSEcLsaK1RVuMd6jGQkNLOg8zT1ciRFRPpz4IA"
      },
      {
        id: "3",
        day: 2,
        time: "13:00",
        period: "afternoon",
        title: "车站附近的午餐",
        description: "根据您的拉面喜好推荐",
        category: "餐饮",
        duration: "1小时",
        isAiSuggestion: true
      },
      {
        id: "4",
        day: 2,
        time: "15:00",
        period: "afternoon",
        title: "祇园区域漫步",
        description: "探索艺伎与茶室文化",
        category: "文化",
        duration: "2小时"
      }
    ]
  };
  function getItinerary() {
    try {
      const data = storage.get(STORAGE_KEYS.ITINERARIES);
      if (data && data.items && data.items.length > 0) {
        return data;
      }
      return DEFAULT_ITINERARY;
    } catch (e) {
      formatAppLog("error", "at services/itinerary.js:71", "获取行程数据失败:", e);
      return DEFAULT_ITINERARY;
    }
  }
  function saveItinerary(data) {
    try {
      formatAppLog("log", "at services/itinerary.js:83", "itineraryService.saveItinerary - 保存数据:", JSON.stringify(data));
      storage.set(STORAGE_KEYS.ITINERARIES, data);
      formatAppLog("log", "at services/itinerary.js:85", "保存成功");
      return true;
    } catch (e) {
      formatAppLog("error", "at services/itinerary.js:88", "保存行程数据失败:", e);
      return false;
    }
  }
  function getItemsByDay(day) {
    const itinerary = getItinerary();
    return itinerary.items.filter((item) => item.day === day).sort((a, b) => a.time.localeCompare(b.time));
  }
  function addItem(item) {
    formatAppLog("log", "at services/itinerary.js:111", "itineraryService.addItem - 输入数据:", JSON.stringify(item));
    const itinerary = getItinerary();
    const newItem = {
      ...item,
      id: generateId(),
      isAiSuggestion: false
    };
    formatAppLog("log", "at services/itinerary.js:118", "创建的新行程项:", JSON.stringify(newItem));
    itinerary.items.push(newItem);
    formatAppLog("log", "at services/itinerary.js:120", "添加前的行程数量:", itinerary.items.length);
    const result = saveItinerary(itinerary);
    formatAppLog("log", "at services/itinerary.js:122", "添加后的行程数量:", itinerary.items.length);
    return result;
  }
  function updateItem(id, updates) {
    const itinerary = getItinerary();
    const index = itinerary.items.findIndex((item) => item.id === id);
    if (index !== -1) {
      itinerary.items[index] = { ...itinerary.items[index], ...updates };
      saveItinerary(itinerary);
    }
    return itinerary;
  }
  function deleteItem(id) {
    const itinerary = getItinerary();
    itinerary.items = itinerary.items.filter((item) => item.id !== id);
    saveItinerary(itinerary);
    return itinerary;
  }
  function acceptAiSuggestion(id) {
    return updateItem(id, { isAiSuggestion: false });
  }
  function addAiSuggestion(item) {
    const itinerary = getItinerary();
    const newItem = {
      ...item,
      id: generateId(),
      isAiSuggestion: true
    };
    itinerary.items.push(newItem);
    saveItinerary(itinerary);
    return itinerary;
  }
  function clearItinerary() {
    try {
      storage.remove(STORAGE_KEYS.ITINERARIES);
      return true;
    } catch (e) {
      formatAppLog("error", "at services/itinerary.js:189", "清空行程数据失败:", e);
      return false;
    }
  }
  function updateItineraryInfo(info) {
    const itinerary = getItinerary();
    Object.assign(itinerary, info);
    saveItinerary(itinerary);
    return itinerary;
  }
  function getItineraryStats() {
    const itinerary = getItinerary();
    const items = itinerary.items;
    const byDay = {};
    items.forEach((item) => {
      if (!byDay[item.day]) {
        byDay[item.day] = [];
      }
      byDay[item.day].push(item);
    });
    const byCategory = {};
    items.forEach((item) => {
      if (!byCategory[item.category]) {
        byCategory[item.category] = 0;
      }
      byCategory[item.category]++;
    });
    const totalHours = items.reduce((sum, item) => {
      var _a;
      const match = (_a = item.duration) == null ? void 0 : _a.match(/(\d+(\.\d+)?)/);
      const hours = match ? parseFloat(match[1]) : 0;
      return sum + hours;
    }, 0);
    return {
      totalItems: items.length,
      daysWithPlans: Object.keys(byDay).length,
      totalHours: Math.round(totalHours),
      byCategory,
      aiSuggestions: items.filter((item) => item.isAiSuggestion).length
    };
  }
  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }
  function parseItineraryFromChat(content, day = 1) {
    const lines = content.split("\n").filter((line) => line.trim());
    for (const line of lines) {
      const timeMatch = line.match(/(\d{1,2}):(\d{2})/);
      if (timeMatch) {
        const time = line.substring(timeMatch.index, timeMatch.index + 5);
        const rest = line.substring(timeMatch.index + 5).trim();
        let title = rest.replace(/^[:：]\s*/, "").split(/[，,。]/)[0].trim();
        if (title) {
          return {
            day,
            time,
            period: parseInt(time.split(":")[0]) < 12 ? "morning" : "afternoon",
            title,
            description: content.substring(0, 100),
            category: "景点",
            duration: "2小时",
            isAiSuggestion: true
          };
        }
      }
    }
    return null;
  }
  const itineraryService = {
    getItinerary,
    saveItinerary,
    getItemsByDay,
    addItem,
    updateItem,
    deleteItem,
    acceptAiSuggestion,
    addAiSuggestion,
    clearItinerary,
    updateItineraryInfo,
    getItineraryStats,
    parseItineraryFromChat
  };
  const STORAGE_KEYS_ITINERARY = {
    ITINERARIES: "itineraries",
    // 行程数据
    SELECTED_DAY: "itinerary_selected_day",
    // 选中的天数
    SELECTED_DATE: "itinerary_selected_date"
    // 选中的日期 (YYYY-MM-DD)
  };
  const _sfc_main$6 = {
    data() {
      return {
        // 视图模式
        viewMode: "timeline",
        // 'timeline' | 'calendar'
        // 行程信息
        itineraryInfo: {
          title: "京都之旅计划",
          startDate: "10月12日",
          endDate: "10月20日"
        },
        // 天数列表
        selectedDay: 1,
        days: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        // 行程项列表
        items: [],
        // 弹窗状态
        showModal: false,
        showAiModal: false,
        editingItem: null,
        // 平台标识（用于 Android 兼容处理）
        isAndroid: false,
        // 输入框焦点控制（用于 Android 强制聚焦）
        inputFocus: "",
        // 当前真正聚焦的输入框（用于防止焦点循环）
        focusedField: "",
        // 表单数据
        form: {
          day: 1,
          timeStart: "09:00",
          timeEnd: "",
          category: "景点",
          duration: "1小时",
          location: "",
          title: "",
          description: "",
          source: "user",
          status: "confirmed"
        },
        // AI 生成表单
        aiGenerateRange: "today",
        aiForm: {
          city: "京都",
          preferences: ""
        },
        // 分类选项
        categories: ["景点", "餐饮", "文化", "交通", "购物"],
        // 日历相关
        weekdays: ["日", "一", "二", "三", "四", "五", "六"],
        currentYear: (/* @__PURE__ */ new Date()).getFullYear(),
        currentMonth: (/* @__PURE__ */ new Date()).getMonth() + 1,
        selectedCalendarDate: null,
        // 行程按日期索引（用于日历视图）
        itemsByDate: {},
        // '2024-10-15': [items]
        // Android 适配：系统信息
        statusBarHeight: 44,
        // 默认值，会在 onLoad 中更新
        safeAreaInsetBottom: 0,
        // 底部安全区高度（px）
        tabBarHeight: 60
        // TabBar 高度（px）
      };
    },
    computed: {
      /**
       * 过滤当前选中天的行程
       */
      filteredItems() {
        return this.items.filter((item) => item.day === this.selectedDay).sort((a, b) => (a.timeStart || a.time).localeCompare(b.timeStart || b.time));
      },
      /**
       * 当月第一天是星期几
       */
      firstDayOfWeek() {
        return new Date(this.currentYear, this.currentMonth - 1, 1).getDay();
      },
      /**
       * 当月天数
       */
      daysInMonth() {
        return new Date(this.currentYear, this.currentMonth, 0).getDate();
      }
    },
    onLoad() {
      this.initSystemInfo();
      const systemInfo = uni.getSystemInfoSync();
      this.isAndroid = systemInfo.platform === "android";
      this.loadItinerary();
      this.loadSelectedDay();
      this.initCalendar();
    },
    onShow() {
      this.loadItinerary();
    },
    onUnload() {
      this.saveSelectedDay();
    },
    methods: {
      // ==================== Android 适配 ====================
      /**
       * Android 适配：初始化系统信息
       * 获取状态栏高度、安全区域等，用于布局适配
       */
      initSystemInfo() {
        var _a;
        try {
          const systemInfo = uni.getSystemInfoSync();
          this.statusBarHeight = systemInfo.statusBarHeight || 44;
          this.safeAreaInsetBottom = systemInfo.screenHeight - (((_a = systemInfo.safeArea) == null ? void 0 : _a.bottom) || systemInfo.screenHeight);
          formatAppLog("log", "at pages/itinerary/itinerary.vue:576", "[Itinerary] 系统信息:", {
            statusBarHeight: this.statusBarHeight,
            safeAreaInsetBottom: this.safeAreaInsetBottom
          });
        } catch (e) {
          formatAppLog("error", "at pages/itinerary/itinerary.vue:581", "[Itinerary] 获取系统信息失败:", e);
        }
      },
      // ==================== 数据加载与保存 ====================
      /**
       * 加载行程数据
       */
      loadItinerary() {
        formatAppLog("log", "at pages/itinerary/itinerary.vue:591", "[行程] 加载数据...");
        try {
          const itinerary = itineraryService.getItinerary();
          formatAppLog("log", "at pages/itinerary/itinerary.vue:594", "[行程] 获取到的数据:", itinerary);
          this.items = itinerary.items || [];
          this.itineraryInfo = {
            title: itinerary.title || "行程计划",
            startDate: itinerary.startDate || "",
            endDate: itinerary.endDate || ""
          };
          this.buildDateIndex();
          formatAppLog("log", "at pages/itinerary/itinerary.vue:606", "[行程] 当前行程数量:", this.items.length);
        } catch (e) {
          formatAppLog("error", "at pages/itinerary/itinerary.vue:608", "[行程] 加载失败:", e);
        }
      },
      /**
       * 保存选中的天数
       */
      saveSelectedDay() {
        try {
          storage.set(STORAGE_KEYS_ITINERARY.SELECTED_DAY, this.selectedDay);
        } catch (e) {
          formatAppLog("error", "at pages/itinerary/itinerary.vue:619", "[行程] 保存选中天数失败:", e);
        }
      },
      /**
       * 加载选中的天数
       */
      loadSelectedDay() {
        try {
          const savedDay = storage.get(STORAGE_KEYS_ITINERARY.SELECTED_DAY);
          if (savedDay && this.days.includes(savedDay)) {
            this.selectedDay = savedDay;
          }
        } catch (e) {
          formatAppLog("error", "at pages/itinerary/itinerary.vue:633", "[行程] 加载选中天数失败:", e);
        }
      },
      /**
       * 构建日期索引（用于日历视图快速查询）
       */
      buildDateIndex() {
        this.itemsByDate = {};
        this.items.forEach((item) => {
          const dateKey = `10-${String(11 + item.day).padStart(2, "0")}`;
          if (!this.itemsByDate[dateKey]) {
            this.itemsByDate[dateKey] = [];
          }
          this.itemsByDate[dateKey].push(item);
        });
      },
      // ==================== 视图切换 ====================
      /**
       * 切换视图模式
       */
      switchViewMode(mode) {
        this.viewMode = mode;
        if (mode === "calendar") {
          this.initCalendar();
        }
      },
      /**
       * 初始化日历
       */
      initCalendar() {
        const now = /* @__PURE__ */ new Date();
        this.currentYear = now.getFullYear();
        this.currentMonth = now.getMonth() + 1;
        this.selectedCalendarDate = now.getDate();
      },
      /**
       * 上一月
       */
      prevMonth() {
        if (this.currentMonth === 1) {
          this.currentMonth = 12;
          this.currentYear--;
        } else {
          this.currentMonth--;
        }
      },
      /**
       * 下一月
       */
      nextMonth() {
        if (this.currentMonth === 12) {
          this.currentMonth = 1;
          this.currentYear++;
        } else {
          this.currentMonth++;
        }
      },
      /**
       * 检查某天是否有行程
       */
      hasItemsOnDay(day) {
        `10-${String(11 + day).padStart(2, "0")}`;
        return day >= 12 && day <= 20;
      },
      /**
       * 判断是否是今天
       */
      isToday(day) {
        const now = /* @__PURE__ */ new Date();
        return day === now.getDate() && this.currentMonth === now.getMonth() + 1 && this.currentYear === now.getFullYear();
      },
      /**
       * 判断是否是当前选中的日期（时间轴模式下选中的天对应的日期）
       */
      isCurrentDay(day) {
        const actualDay = 11 + this.selectedDay;
        return day === actualDay && this.selectedCalendarDate === day;
      },
      /**
       * 选择日历中的某一天
       */
      selectCalendarDay(day) {
        this.selectedCalendarDate = day;
        const dayNum = day - 11;
        if (dayNum >= 1 && dayNum <= this.days.length) {
          this.selectedDay = dayNum;
        }
      },
      /**
       * 获取日历日期的行程项
       */
      getItemsForCalendarDay(day) {
        const dayNum = day - 11;
        return this.items.filter((item) => item.day === dayNum).sort((a, b) => (a.timeStart || a.time).localeCompare(b.timeStart || b.time));
      },
      // ==================== 时间轴视图 ====================
      /**
       * 选择天数
       */
      selectDay(day) {
        this.selectedDay = day;
        this.saveSelectedDay();
      },
      /**
       * 获取某天对应的日期
       */
      getDayDate(day) {
        return 11 + day;
      },
      /**
       * 返回
       */
      handleBack() {
        uni.navigateBack();
      },
      /**
       * 显示更多菜单
       */
      showMoreMenu() {
        const items = ["分享行程", "清空行程", "取消"];
        uni.showActionSheet({
          itemList: items,
          success: (res) => {
            if (res.tapIndex === 0) {
              this.shareItinerary();
            } else if (res.tapIndex === 1) {
              this.clearAllItinerary();
            }
          }
        });
      },
      // ==================== 添加/编辑/删除 ====================
      /**
       * 打开添加行程弹窗
       */
      openAddModal() {
        this.editingItem = null;
        const now = /* @__PURE__ */ new Date();
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");
        this.form = {
          day: this.selectedDay,
          timeStart: `${hours}:${minutes}`,
          timeEnd: "",
          category: "景点",
          duration: "1小时",
          location: "",
          title: "",
          description: "",
          source: "user",
          status: "confirmed"
        };
        this.inputFocus = "";
        this.focusedField = "";
        this.showModal = true;
      },
      /**
       * 编辑行程项
       */
      editItem(item) {
        this.editingItem = item;
        this.form = {
          day: item.day,
          timeStart: item.timeStart || item.time,
          timeEnd: item.timeEnd || "",
          category: item.category,
          duration: item.duration,
          location: item.location || "",
          title: item.title,
          description: item.description,
          source: item.source || "user",
          status: item.status || "confirmed"
        };
        this.inputFocus = "";
        this.focusedField = "";
        this.showModal = true;
      },
      /**
       * 确认删除行程项
       */
      confirmDeleteItem(item) {
        uni.showModal({
          title: "确认删除",
          content: `确定要删除「${item.title}」吗？`,
          confirmColor: "#ff4d4f",
          success: (res) => {
            if (res.confirm) {
              this.deleteItem(item.id);
            }
          }
        });
      },
      /**
       * 删除行程项
       */
      deleteItem(id) {
        itineraryService.deleteItem(id);
        this.loadItinerary();
        uni.showToast({
          title: "已删除",
          icon: "success"
        });
      },
      /**
       * 关闭弹窗
       */
      closeModal() {
        this.showModal = false;
        this.editingItem = null;
        this.inputFocus = "";
        this.focusedField = "";
      },
      /**
       * 开始时间变化
       */
      onStartTimeChange(e) {
        this.form.timeStart = e.detail.value;
        const hour = parseInt(this.form.timeStart.split(":")[0]);
        this.form.period = hour < 12 ? "morning" : "afternoon";
      },
      /**
       * 输入框获得焦点（Android 兼容）
       */
      onInputFocus(e) {
        var _a, _b;
        const fieldName = ((_b = (_a = e.target) == null ? void 0 : _a.dataset) == null ? void 0 : _b.field) || this.inputFocus;
        if (fieldName) {
          this.focusedField = fieldName;
          formatAppLog("log", "at pages/itinerary/itinerary.vue:905", "[输入框] 获得焦点:", fieldName);
        }
      },
      /**
       * 输入框失去焦点（Android 兼容）
       */
      onInputBlur(e) {
        var _a, _b;
        const fieldName = ((_b = (_a = e.target) == null ? void 0 : _a.dataset) == null ? void 0 : _b.field) || this.focusedField;
        formatAppLog("log", "at pages/itinerary/itinerary.vue:916", "[输入框] 失去焦点:", fieldName);
        this.focusedField = "";
      },
      /**
       * 手动触发输入框聚焦（Android 兼容）
       * 当点击输入框外层容器时，通过编程方式触发输入框聚焦
       */
      focusInput(fieldName) {
        formatAppLog("log", "at pages/itinerary/itinerary.vue:926", "[手动聚焦] 字段:", fieldName, "当前聚焦:", this.focusedField);
        if (this.focusedField === fieldName) {
          formatAppLog("log", "at pages/itinerary/itinerary.vue:930", "[手动聚焦] 字段已聚焦，跳过");
          return;
        }
        this.inputFocus = "";
        this.$nextTick(() => {
          this.inputFocus = fieldName;
        });
      },
      /**
       * 结束时间变化
       */
      onEndTimeChange(e) {
        this.form.timeEnd = e.detail.value;
      },
      /**
       * 选择分类
       */
      selectCategory(category) {
        this.form.category = category;
      },
      /**
       * 保存行程项
       */
      saveItem() {
        var _a;
        if (!this.form.title || !this.form.title.trim()) {
          uni.showToast({
            title: "请输入行程名称",
            icon: "none"
          });
          return;
        }
        if (!this.form.timeStart) {
          uni.showToast({
            title: "请选择开始时间",
            icon: "none"
          });
          return;
        }
        const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
        if (!timeRegex.test(this.form.timeStart)) {
          uni.showToast({
            title: "时间格式错误",
            icon: "none"
          });
          return;
        }
        const hour = parseInt(this.form.timeStart.split(":")[0]);
        this.form.period = hour < 12 ? "morning" : "afternoon";
        const saveData = {
          ...this.form,
          time: this.form.timeStart,
          // 兼容旧字段
          period: this.form.period
        };
        if ((_a = this.editingItem) == null ? void 0 : _a.id) {
          itineraryService.updateItem(this.editingItem.id, saveData);
        } else {
          itineraryService.addItem(saveData);
        }
        this.loadItinerary();
        this.closeModal();
        uni.showToast({
          title: "保存成功",
          icon: "success"
        });
      },
      /**
       * 接受 AI 建议
       */
      acceptSuggestion(id) {
        itineraryService.acceptAiSuggestion(id);
        this.loadItinerary();
        uni.showToast({
          title: "已接受建议",
          icon: "success"
        });
      },
      /**
       * 获取分类图标
       */
      getCategoryIcon(category) {
        const icons = {
          "餐饮": "🍽️",
          "交通": "🚗",
          "文化": "🏛️",
          "景点": "📍",
          "购物": "🛍️"
        };
        return icons[category] || "📍";
      },
      // ==================== AI 生成行程 ====================
      /**
       * 打开 AI 生成弹窗
       */
      openAiGenerateModal() {
        this.aiForm = {
          city: this.itineraryInfo.title.replace("之旅计划", "") || "京都",
          preferences: ""
        };
        this.aiGenerateRange = "today";
        this.showAiModal = true;
      },
      /**
       * 关闭 AI 弹窗
       */
      closeAiModal() {
        this.showAiModal = false;
      },
      /**
       * 选择 AI 生成范围
       */
      selectAiRange(range) {
        this.aiGenerateRange = range;
      },
      /**
       * 使用 AI 生成行程
       */
      async generateWithAI() {
        var _a, _b, _c;
        const city = this.aiForm.city.trim();
        if (!city) {
          uni.showToast({
            title: "请输入目的地",
            icon: "none"
          });
          return;
        }
        this.closeAiModal();
        const days = this.aiGenerateRange === "3days" ? 3 : 1;
        const startDay = this.selectedDay;
        const existingItems = this.items.filter(
          (item) => item.day >= startDay && item.day < startDay + days
        );
        const promptText = `请为我规划${days}天${city}的旅行行程。
${this.aiForm.preferences ? "偏好：" + this.aiForm.preferences : ""}
${existingItems.length > 0 ? "已有安排：\n" + existingItems.map((i) => `- 第${i.day}天 ${i.time}: ${i.title}`).join("\n") : ""}

请按以下JSON格式返回（只返回JSON，不要其他文字）：
[
  {
    "day": ${startDay},
    "timeStart": "09:00",
    "title": "景点名称",
    "description": "描述",
    "category": "景点",
    "duration": "2小时",
    "location": "详细地址"
  }
]`;
        uni.showLoading({
          title: "AI 正在生成行程..."
        });
        try {
          const { chat: chat2 } = await __vitePreload(() => Promise.resolve().then(() => deepseek$1), false ? "__VITE_PRELOAD__" : void 0);
          const messages = [
            { role: "user", content: promptText }
          ];
          const response = await chat2(messages, {
            temperature: 0.7,
            max_tokens: 2e3,
            timeout: 6e4
          });
          const content = ((_c = (_b = (_a = response == null ? void 0 : response.choices) == null ? void 0 : _a[0]) == null ? void 0 : _b.message) == null ? void 0 : _c.content) || (response == null ? void 0 : response.content) || "";
          if (!content) {
            throw new Error("AI 返回为空");
          }
          let aiItems;
          try {
            aiItems = JSON.parse(content);
          } catch (e) {
            const jsonMatch = content.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
            if (jsonMatch) {
              aiItems = JSON.parse(jsonMatch[0]);
            } else {
              throw new Error("无法解析 AI 返回的数据");
            }
          }
          if (!Array.isArray(aiItems)) {
            if (aiItems.domestic || aiItems.international) {
              aiItems = [...aiItems.domestic || [], ...aiItems.international || []];
            } else {
              aiItems = [aiItems];
            }
          }
          let addedCount = 0;
          aiItems.forEach((item) => {
            if (item.title && item.timeStart) {
              itineraryService.addAiSuggestion({
                day: item.day || startDay,
                timeStart: item.timeStart,
                title: item.title,
                description: item.description || "AI 生成的行程建议",
                category: item.category || "景点",
                duration: item.duration || "2小时",
                location: item.location || city,
                isAiSuggestion: true
              });
              addedCount++;
            }
          });
          this.loadItinerary();
          uni.hideLoading();
          if (addedCount > 0) {
            uni.showToast({
              title: `已生成 ${addedCount} 条建议`,
              icon: "success",
              duration: 2e3
            });
          } else {
            uni.showToast({
              title: "生成失败，请重试",
              icon: "none"
            });
          }
        } catch (e) {
          formatAppLog("error", "at pages/itinerary/itinerary.vue:1194", "[AI 生成] 失败:", e);
          uni.hideLoading();
          uni.showModal({
            title: "AI 生成失败",
            content: "无法连接到 AI 服务，是否使用示例数据？",
            confirmText: "使用示例",
            cancelText: "取消",
            success: (res) => {
              if (res.confirm) {
                this.generateMockItinerary(days, city);
              }
            }
          });
        }
      },
      /**
       * 生成模拟行程（AI 调用失败时的兜底方案）
       * TODO: 未来可移除，当 AI 联动完全实现后
       */
      generateMockItinerary(days, city) {
        uni.showLoading({
          title: "生成中..."
        });
        setTimeout(() => {
          const mockItems = this.getMockAiItems(days, city);
          mockItems.forEach((item) => {
            itineraryService.addAiSuggestion(item);
          });
          this.loadItinerary();
          uni.hideLoading();
          uni.showToast({
            title: `已生成 ${mockItems.length} 条建议`,
            icon: "success"
          });
        }, 1500);
      },
      /**
       * 获取模拟 AI 建议数据
       */
      getMockAiItems(days, city) {
        const suggestions = [];
        const startDay = this.selectedDay;
        for (let d = 0; d < days; d++) {
          const day = startDay + d;
          const count = 2 + Math.floor(Math.random() * 2);
          for (let i = 0; i < count; i++) {
            const hour = 9 + i * 4;
            suggestions.push({
              day,
              timeStart: `${String(hour).padStart(2, "0")}:00`,
              title: `${city}推荐景点 ${i + 1}`,
              description: "AI 根据您的偏好生成的建议",
              category: ["景点", "餐饮", "文化"][Math.floor(Math.random() * 3)],
              duration: "2小时",
              location: `${city}市中心`,
              isAiSuggestion: true
            });
          }
        }
        return suggestions;
      },
      // ==================== 分享功能 ====================
      /**
       * 分享行程
       */
      shareItinerary() {
        const dayItems = this.filteredItems.sort(
          (a, b) => (a.timeStart || a.time).localeCompare(b.timeStart || b.time)
        );
        if (dayItems.length === 0) {
          uni.showToast({
            title: "当前日期没有行程",
            icon: "none"
          });
          return;
        }
        let shareText = `${this.itineraryInfo.title}
`;
        shareText += `${this.itineraryInfo.startDate} - ${this.itineraryInfo.endDate}
`;
        shareText += `第 ${this.selectedDay} 天行程：

`;
        dayItems.forEach((item) => {
          const time = item.timeStart || item.time;
          shareText += `${time} ${item.title}`;
          if (item.location) {
            shareText += ` @${item.location}`;
          }
          if (item.description) {
            shareText += `
    ${item.description}`;
          }
          shareText += "\n";
        });
        shareText += `
——来自 WanderAI 漫游奇点`;
        uni.setClipboardData({
          data: shareText,
          success: () => {
            uni.showToast({
              title: "行程已复制",
              icon: "success"
            });
          }
        });
      },
      /**
       * 清空所有行程
       */
      clearAllItinerary() {
        uni.showModal({
          title: "确认清空",
          content: "确定要清空所有行程吗？此操作不可恢复。",
          confirmColor: "#ff4d4f",
          success: (res) => {
            if (res.confirm) {
              itineraryService.clearItinerary();
              this.loadItinerary();
              uni.showToast({
                title: "已清空",
                icon: "success"
              });
            }
          }
        });
      }
    }
  };
  function _sfc_render$6(_ctx, _cache, $props, $setup, $data, $options) {
    var _a;
    return vue.openBlock(), vue.createElementBlock("view", { class: "itinerary-container" }, [
      vue.createElementVNode(
        "view",
        {
          class: "status-bar-placeholder",
          style: vue.normalizeStyle({ height: $data.statusBarHeight + "px" })
        },
        null,
        4
        /* STYLE */
      ),
      vue.createElementVNode(
        "view",
        {
          class: vue.normalizeClass(["header", { "header-android": $data.isAndroid }])
        },
        [
          vue.createElementVNode("view", { class: "header-top" }, [
            vue.createElementVNode("button", {
              class: "header-btn",
              onClick: _cache[0] || (_cache[0] = (...args) => $options.handleBack && $options.handleBack(...args))
            }, [
              vue.createElementVNode("text", { class: "btn-icon" }, "←")
            ]),
            vue.createElementVNode("view", { class: "header-center" }, [
              vue.createElementVNode(
                "text",
                { class: "header-title" },
                vue.toDisplayString($data.itineraryInfo.title || "行程计划"),
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "header-subtitle" },
                vue.toDisplayString($data.itineraryInfo.startDate) + " - " + vue.toDisplayString($data.itineraryInfo.endDate),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("button", {
              class: "header-btn",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.showMoreMenu && $options.showMoreMenu(...args))
            }, [
              vue.createElementVNode("text", { class: "btn-icon" }, "⋯")
            ])
          ]),
          vue.createElementVNode("view", { class: "view-toggle" }, [
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["toggle-option", $data.viewMode === "timeline" ? "toggle-active" : ""]),
                onClick: _cache[2] || (_cache[2] = ($event) => $options.switchViewMode("timeline"))
              },
              [
                vue.createElementVNode("text", { class: "toggle-icon" }, "📋"),
                vue.createElementVNode("text", { class: "toggle-text" }, "时间轴")
              ],
              2
              /* CLASS */
            ),
            vue.createElementVNode(
              "view",
              {
                class: vue.normalizeClass(["toggle-option", $data.viewMode === "calendar" ? "toggle-active" : ""]),
                onClick: _cache[3] || (_cache[3] = ($event) => $options.switchViewMode("calendar"))
              },
              [
                vue.createElementVNode("text", { class: "toggle-icon" }, "📅"),
                vue.createElementVNode("text", { class: "toggle-text" }, "日历")
              ],
              2
              /* CLASS */
            )
          ]),
          $data.viewMode === "timeline" ? (vue.openBlock(), vue.createElementBlock("scroll-view", {
            key: 0,
            class: "day-selector",
            "scroll-x": ""
          }, [
            vue.createElementVNode("view", { class: "day-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.days, (day) => {
                  return vue.openBlock(), vue.createElementBlock("button", {
                    key: day,
                    class: vue.normalizeClass(["day-btn", $data.selectedDay === day ? "day-btn-active" : ""]),
                    onClick: ($event) => $options.selectDay(day)
                  }, [
                    vue.createElementVNode(
                      "text",
                      {
                        class: vue.normalizeClass(["day-label", $data.selectedDay === day ? "day-label-active" : ""])
                      },
                      "第 " + vue.toDisplayString(day) + " 天",
                      3
                      /* TEXT, CLASS */
                    ),
                    vue.createElementVNode(
                      "text",
                      {
                        class: vue.normalizeClass(["day-number", $data.selectedDay === day ? "day-number-active" : ""])
                      },
                      vue.toDisplayString($options.getDayDate(day)),
                      3
                      /* TEXT, CLASS */
                    )
                  ], 10, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ],
        2
        /* CLASS */
      ),
      $data.viewMode === "timeline" ? (vue.openBlock(), vue.createElementBlock("scroll-view", {
        key: 0,
        class: "timeline-scroll",
        "scroll-y": ""
      }, [
        vue.createElementVNode("view", { class: "timeline-container" }, [
          $options.filteredItems.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "timeline-line"
          })) : vue.createCommentVNode("v-if", true),
          $options.filteredItems.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "empty-state"
          }, [
            vue.createElementVNode("text", { class: "empty-icon" }, "📅"),
            vue.createElementVNode("text", { class: "empty-title" }, "今天还没有计划哦"),
            vue.createElementVNode("text", { class: "empty-subtitle" }, "点击下方的 + 号开始添加")
          ])) : vue.createCommentVNode("v-if", true),
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($options.filteredItems, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("view", {
                key: item.id,
                class: "timeline-item"
              }, [
                vue.createElementVNode("view", { class: "time-label" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "time-text" },
                    vue.toDisplayString(item.time),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode(
                    "text",
                    { class: "period-text" },
                    vue.toDisplayString(item.period === "morning" ? "上午" : "下午"),
                    1
                    /* TEXT */
                  )
                ]),
                vue.createElementVNode(
                  "view",
                  {
                    class: vue.normalizeClass(["item-card", item.isAiSuggestion ? "card-ai" : "card-normal"])
                  },
                  [
                    item.isAiSuggestion ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 0,
                      class: "ai-badge"
                    }, [
                      vue.createElementVNode("text", { class: "ai-badge-text" }, "AI 建议")
                    ])) : vue.createCommentVNode("v-if", true),
                    vue.createElementVNode("view", { class: "card-content" }, [
                      vue.createElementVNode("view", { class: "card-icon" }, [
                        item.image ? (vue.openBlock(), vue.createElementBlock("image", {
                          key: 0,
                          class: "icon-image",
                          src: item.image,
                          mode: "aspectFill"
                        }, null, 8, ["src"])) : (vue.openBlock(), vue.createElementBlock(
                          "text",
                          {
                            key: 1,
                            class: "icon-placeholder"
                          },
                          vue.toDisplayString($options.getCategoryIcon(item.category)),
                          1
                          /* TEXT */
                        ))
                      ]),
                      vue.createElementVNode("view", { class: "card-info" }, [
                        vue.createElementVNode("view", { class: "card-header" }, [
                          vue.createElementVNode(
                            "text",
                            { class: "card-title" },
                            vue.toDisplayString(item.title),
                            1
                            /* TEXT */
                          ),
                          !item.isAiSuggestion ? (vue.openBlock(), vue.createElementBlock("view", {
                            key: 0,
                            class: "card-actions"
                          }, [
                            vue.createElementVNode("button", {
                              class: "action-btn",
                              onClick: vue.withModifiers(($event) => $options.editItem(item), ["stop"])
                            }, [
                              vue.createElementVNode("text", { class: "action-icon" }, "✏️")
                            ], 8, ["onClick"]),
                            vue.createElementVNode("button", {
                              class: "action-btn",
                              onClick: vue.withModifiers(($event) => $options.confirmDeleteItem(item), ["stop"])
                            }, [
                              vue.createElementVNode("text", { class: "action-icon" }, "🗑️")
                            ], 8, ["onClick"])
                          ])) : vue.createCommentVNode("v-if", true)
                        ]),
                        vue.createElementVNode(
                          "text",
                          { class: "card-desc" },
                          vue.toDisplayString(item.description),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode("view", { class: "card-meta" }, [
                          vue.createElementVNode("view", { class: "meta-tag" }, [
                            vue.createElementVNode(
                              "text",
                              { class: "tag-text" },
                              vue.toDisplayString(item.category),
                              1
                              /* TEXT */
                            )
                          ]),
                          vue.createElementVNode(
                            "text",
                            { class: "meta-duration" },
                            vue.toDisplayString(item.duration),
                            1
                            /* TEXT */
                          )
                        ])
                      ])
                    ]),
                    item.isAiSuggestion ? (vue.openBlock(), vue.createElementBlock("view", {
                      key: 1,
                      class: "ai-actions"
                    }, [
                      vue.createElementVNode("button", {
                        class: "ai-accept-btn",
                        onClick: vue.withModifiers(($event) => $options.acceptSuggestion(item.id), ["stop"])
                      }, [
                        vue.createElementVNode("text", { class: "ai-btn-text" }, "接受建议")
                      ], 8, ["onClick"]),
                      vue.createElementVNode("button", {
                        class: "ai-reject-btn",
                        onClick: vue.withModifiers(($event) => $options.confirmDeleteItem(item), ["stop"])
                      }, [
                        vue.createElementVNode("text", { class: "ai-reject-icon" }, "✕")
                      ], 8, ["onClick"])
                    ])) : vue.createCommentVNode("v-if", true)
                  ],
                  2
                  /* CLASS */
                )
              ]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ])) : (vue.openBlock(), vue.createElementBlock("scroll-view", {
        key: 1,
        class: "calendar-scroll",
        "scroll-y": ""
      }, [
        vue.createElementVNode("view", { class: "calendar-container" }, [
          vue.createElementVNode("view", { class: "calendar-header" }, [
            vue.createElementVNode("button", {
              class: "month-nav-btn",
              onClick: _cache[4] || (_cache[4] = (...args) => $options.prevMonth && $options.prevMonth(...args))
            }, [
              vue.createElementVNode("text", { class: "nav-icon" }, "‹")
            ]),
            vue.createElementVNode(
              "text",
              { class: "month-title" },
              vue.toDisplayString($data.currentYear) + "年 " + vue.toDisplayString($data.currentMonth) + "月",
              1
              /* TEXT */
            ),
            vue.createElementVNode("button", {
              class: "month-nav-btn",
              onClick: _cache[5] || (_cache[5] = (...args) => $options.nextMonth && $options.nextMonth(...args))
            }, [
              vue.createElementVNode("text", { class: "nav-icon" }, "›")
            ])
          ]),
          vue.createElementVNode("view", { class: "weekdays" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.weekdays, (day) => {
                return vue.openBlock(), vue.createElementBlock(
                  "text",
                  {
                    key: day,
                    class: "weekday"
                  },
                  vue.toDisplayString(day),
                  1
                  /* TEXT */
                );
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          vue.createElementVNode("view", { class: "calendar-grid" }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($options.firstDayOfWeek, (n) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: "empty-" + n,
                  class: "calendar-day calendar-day-empty"
                });
              }),
              128
              /* KEYED_FRAGMENT */
            )),
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($options.daysInMonth, (day) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: day,
                  class: vue.normalizeClass(["calendar-day", {
                    "day-has-items": $options.hasItemsOnDay(day),
                    "day-is-today": $options.isToday(day),
                    "day-is-selected": $options.isCurrentDay(day)
                  }]),
                  onClick: ($event) => $options.selectCalendarDay(day)
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "day-number-text" },
                    vue.toDisplayString(day),
                    1
                    /* TEXT */
                  ),
                  $options.hasItemsOnDay(day) ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "day-dot"
                  })) : vue.createCommentVNode("v-if", true)
                ], 10, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]),
          $data.selectedCalendarDate ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "day-summary"
          }, [
            vue.createElementVNode("view", { class: "summary-header" }, [
              vue.createElementVNode(
                "text",
                { class: "summary-title" },
                vue.toDisplayString($data.currentMonth) + "月" + vue.toDisplayString($data.selectedCalendarDate) + "日",
                1
                /* TEXT */
              ),
              vue.createElementVNode(
                "text",
                { class: "summary-count" },
                vue.toDisplayString($options.getItemsForCalendarDay($data.selectedCalendarDate).length) + " 项行程",
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("scroll-view", {
              class: "summary-list",
              "scroll-y": ""
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($options.getItemsForCalendarDay($data.selectedCalendarDate), (item) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: item.id,
                    class: "summary-item"
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "summary-time" },
                      vue.toDisplayString(item.time),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "summary-title-text" },
                      vue.toDisplayString(item.title),
                      1
                      /* TEXT */
                    )
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ])) : vue.createCommentVNode("v-if", true)
        ])
      ])),
      vue.createElementVNode("button", {
        class: "fab-add",
        onClick: _cache[6] || (_cache[6] = (...args) => $options.openAddModal && $options.openAddModal(...args))
      }, [
        vue.createElementVNode("text", { class: "fab-add-icon" }, "+")
      ]),
      vue.createElementVNode("button", {
        class: "fab-ai",
        onClick: _cache[7] || (_cache[7] = (...args) => $options.openAiGenerateModal && $options.openAiGenerateModal(...args))
      }, [
        vue.createElementVNode("text", { class: "fab-ai-icon" }, "✨"),
        vue.createElementVNode("text", { class: "fab-ai-text" }, "AI 生成")
      ]),
      $data.showModal ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 2,
          class: "modal-overlay",
          onClick: _cache[32] || (_cache[32] = (...args) => $options.closeModal && $options.closeModal(...args)),
          onTouchmove: _cache[33] || (_cache[33] = vue.withModifiers(() => {
          }, ["stop", "prevent"]))
        },
        [
          vue.createElementVNode("view", {
            class: "modal-content",
            onClick: _cache[31] || (_cache[31] = vue.withModifiers(() => {
            }, ["stop"]))
          }, [
            vue.createElementVNode("view", { class: "modal-header" }, [
              vue.createElementVNode(
                "text",
                { class: "modal-title" },
                vue.toDisplayString(((_a = $data.editingItem) == null ? void 0 : _a.id) ? "编辑行程" : "添加新行程"),
                1
                /* TEXT */
              ),
              vue.createElementVNode("button", {
                class: "modal-close",
                onClick: _cache[8] || (_cache[8] = (...args) => $options.closeModal && $options.closeModal(...args))
              }, [
                vue.createElementVNode("text", { class: "close-icon" }, "✕")
              ])
            ]),
            vue.createElementVNode(
              "scroll-view",
              {
                class: "modal-form",
                "scroll-y": "",
                "scroll-with-animation": false,
                "enable-flex": "",
                onTouchmove: _cache[29] || (_cache[29] = vue.withModifiers(() => {
                }, ["stop"]))
              },
              [
                vue.createElementVNode("view", {
                  class: "form-group",
                  onClick: _cache[12] || (_cache[12] = ($event) => $options.focusInput("title"))
                }, [
                  vue.createElementVNode("text", { class: "form-label" }, "行程名称 *"),
                  vue.withDirectives(vue.createElementVNode("input", {
                    "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => $data.form.title = $event),
                    type: "text",
                    class: "form-input",
                    placeholder: "例: 岚山小火车",
                    "placeholder-class": "form-placeholder",
                    "cursor-spacing": 20,
                    "adjust-position": "",
                    "confirm-type": "next",
                    "data-field": "title",
                    onFocus: _cache[10] || (_cache[10] = (...args) => $options.onInputFocus && $options.onInputFocus(...args)),
                    onBlur: _cache[11] || (_cache[11] = (...args) => $options.onInputBlur && $options.onInputBlur(...args)),
                    focus: $data.inputFocus === "title"
                  }, null, 40, ["focus"]), [
                    [vue.vModelText, $data.form.title]
                  ])
                ]),
                vue.createElementVNode("view", { class: "form-row" }, [
                  vue.createElementVNode("view", {
                    class: "form-group flex-1",
                    onClick: _cache[14] || (_cache[14] = ($event) => $options.focusInput("timeStart"))
                  }, [
                    vue.createElementVNode("text", { class: "form-label" }, "开始时间 *"),
                    vue.createElementVNode("picker", {
                      mode: "time",
                      value: $data.form.timeStart,
                      onChange: _cache[13] || (_cache[13] = (...args) => $options.onStartTimeChange && $options.onStartTimeChange(...args))
                    }, [
                      vue.createElementVNode("view", { class: "picker-trigger" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "picker-text" },
                          vue.toDisplayString($data.form.timeStart || "09:00"),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode("text", { class: "picker-arrow" }, "▼")
                      ])
                    ], 40, ["value"])
                  ]),
                  vue.createElementVNode("view", {
                    class: "form-group flex-1",
                    onClick: _cache[16] || (_cache[16] = ($event) => $options.focusInput("timeEnd"))
                  }, [
                    vue.createElementVNode("text", { class: "form-label" }, "结束时间"),
                    vue.createElementVNode("picker", {
                      mode: "time",
                      value: $data.form.timeEnd,
                      onChange: _cache[15] || (_cache[15] = (...args) => $options.onEndTimeChange && $options.onEndTimeChange(...args))
                    }, [
                      vue.createElementVNode("view", { class: "picker-trigger" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "picker-text" },
                          vue.toDisplayString($data.form.timeEnd || "未设置"),
                          1
                          /* TEXT */
                        ),
                        vue.createElementVNode("text", { class: "picker-arrow" }, "▼")
                      ])
                    ], 40, ["value"])
                  ])
                ]),
                vue.createElementVNode("view", {
                  class: "form-group",
                  onClick: _cache[20] || (_cache[20] = ($event) => $options.focusInput("duration"))
                }, [
                  vue.createElementVNode("text", { class: "form-label" }, "大概时长"),
                  vue.withDirectives(vue.createElementVNode("input", {
                    "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => $data.form.duration = $event),
                    type: "text",
                    class: "form-input",
                    placeholder: "2小时",
                    "placeholder-class": "form-placeholder",
                    "cursor-spacing": 20,
                    "adjust-position": "",
                    "data-field": "duration",
                    onFocus: _cache[18] || (_cache[18] = (...args) => $options.onInputFocus && $options.onInputFocus(...args)),
                    onBlur: _cache[19] || (_cache[19] = (...args) => $options.onInputBlur && $options.onInputBlur(...args)),
                    focus: $data.inputFocus === "duration"
                  }, null, 40, ["focus"]), [
                    [vue.vModelText, $data.form.duration]
                  ])
                ]),
                vue.createElementVNode("view", {
                  class: "form-group",
                  onClick: _cache[24] || (_cache[24] = ($event) => $options.focusInput("location"))
                }, [
                  vue.createElementVNode("text", { class: "form-label" }, "地点（可选）"),
                  vue.withDirectives(vue.createElementVNode("input", {
                    "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => $data.form.location = $event),
                    type: "text",
                    class: "form-input",
                    placeholder: "详细地址或地标",
                    "placeholder-class": "form-placeholder",
                    "cursor-spacing": 20,
                    "adjust-position": "",
                    "data-field": "location",
                    onFocus: _cache[22] || (_cache[22] = (...args) => $options.onInputFocus && $options.onInputFocus(...args)),
                    onBlur: _cache[23] || (_cache[23] = (...args) => $options.onInputBlur && $options.onInputBlur(...args)),
                    focus: $data.inputFocus === "location"
                  }, null, 40, ["focus"]), [
                    [vue.vModelText, $data.form.location]
                  ])
                ]),
                vue.createElementVNode("view", {
                  class: "form-group",
                  onClick: _cache[28] || (_cache[28] = ($event) => $options.focusInput("description"))
                }, [
                  vue.createElementVNode("text", { class: "form-label" }, "描述/备注"),
                  vue.withDirectives(vue.createElementVNode("textarea", {
                    "onUpdate:modelValue": _cache[25] || (_cache[25] = ($event) => $data.form.description = $event),
                    class: "form-textarea",
                    placeholder: "具体的内容或注意事项...",
                    "placeholder-class": "form-placeholder",
                    "cursor-spacing": 20,
                    "adjust-position": "",
                    maxlength: 500,
                    "auto-height": false,
                    "data-field": "description",
                    onFocus: _cache[26] || (_cache[26] = (...args) => $options.onInputFocus && $options.onInputFocus(...args)),
                    onBlur: _cache[27] || (_cache[27] = (...args) => $options.onInputBlur && $options.onInputBlur(...args)),
                    focus: $data.inputFocus === "description"
                  }, null, 40, ["focus"]), [
                    [vue.vModelText, $data.form.description]
                  ])
                ]),
                vue.createElementVNode("view", { class: "form-group" }, [
                  vue.createElementVNode("text", { class: "form-label" }, "分类"),
                  vue.createElementVNode("view", { class: "category-list" }, [
                    (vue.openBlock(true), vue.createElementBlock(
                      vue.Fragment,
                      null,
                      vue.renderList($data.categories, (cat) => {
                        return vue.openBlock(), vue.createElementBlock("button", {
                          key: cat,
                          class: vue.normalizeClass(["category-btn", $data.form.category === cat ? "category-btn-active" : ""]),
                          onClick: ($event) => $options.selectCategory(cat)
                        }, [
                          vue.createElementVNode(
                            "text",
                            {
                              class: vue.normalizeClass(["category-text", $data.form.category === cat ? "category-text-active" : ""])
                            },
                            vue.toDisplayString(cat),
                            3
                            /* TEXT, CLASS */
                          )
                        ], 10, ["onClick"]);
                      }),
                      128
                      /* KEYED_FRAGMENT */
                    ))
                  ])
                ])
              ],
              32
              /* NEED_HYDRATION */
            ),
            vue.createElementVNode("button", {
              class: "form-submit",
              onClick: _cache[30] || (_cache[30] = (...args) => $options.saveItem && $options.saveItem(...args))
            }, [
              vue.createElementVNode("text", { class: "submit-text" }, "保存行程")
            ])
          ])
        ],
        32
        /* NEED_HYDRATION */
      )) : vue.createCommentVNode("v-if", true),
      $data.showAiModal ? (vue.openBlock(), vue.createElementBlock(
        "view",
        {
          key: 3,
          class: "modal-overlay",
          onClick: _cache[41] || (_cache[41] = (...args) => $options.closeAiModal && $options.closeAiModal(...args)),
          onTouchmove: _cache[42] || (_cache[42] = vue.withModifiers(() => {
          }, ["stop", "prevent"]))
        },
        [
          vue.createElementVNode("view", {
            class: "modal-content",
            onClick: _cache[40] || (_cache[40] = vue.withModifiers(() => {
            }, ["stop"]))
          }, [
            vue.createElementVNode("view", { class: "modal-header" }, [
              vue.createElementVNode("text", { class: "modal-title" }, "AI 生成行程"),
              vue.createElementVNode("button", {
                class: "modal-close",
                onClick: _cache[34] || (_cache[34] = (...args) => $options.closeAiModal && $options.closeAiModal(...args))
              }, [
                vue.createElementVNode("text", { class: "close-icon" }, "✕")
              ])
            ]),
            vue.createElementVNode("view", { class: "ai-form" }, [
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "生成范围"),
                vue.createElementVNode("view", { class: "ai-options" }, [
                  vue.createElementVNode(
                    "button",
                    {
                      class: vue.normalizeClass(["ai-option-btn", $data.aiGenerateRange === "today" ? "ai-option-active" : ""]),
                      onClick: _cache[35] || (_cache[35] = ($event) => $options.selectAiRange("today"))
                    },
                    [
                      vue.createElementVNode("text", { class: "ai-option-text" }, "仅今天")
                    ],
                    2
                    /* CLASS */
                  ),
                  vue.createElementVNode(
                    "button",
                    {
                      class: vue.normalizeClass(["ai-option-btn", $data.aiGenerateRange === "3days" ? "ai-option-active" : ""]),
                      onClick: _cache[36] || (_cache[36] = ($event) => $options.selectAiRange("3days"))
                    },
                    [
                      vue.createElementVNode("text", { class: "ai-option-text" }, "未来3天")
                    ],
                    2
                    /* CLASS */
                  )
                ])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "目的地城市"),
                vue.withDirectives(vue.createElementVNode(
                  "input",
                  {
                    "onUpdate:modelValue": _cache[37] || (_cache[37] = ($event) => $data.aiForm.city = $event),
                    type: "text",
                    class: "form-input",
                    placeholder: "例: 京都",
                    "placeholder-class": "form-placeholder"
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.aiForm.city]
                ])
              ]),
              vue.createElementVNode("view", { class: "form-group" }, [
                vue.createElementVNode("text", { class: "form-label" }, "偏好描述（可选）"),
                vue.withDirectives(vue.createElementVNode(
                  "textarea",
                  {
                    "onUpdate:modelValue": _cache[38] || (_cache[38] = ($event) => $data.aiForm.preferences = $event),
                    class: "form-textarea",
                    placeholder: "例: 喜欢历史文化，想体验当地美食...",
                    "placeholder-class": "form-placeholder",
                    maxlength: 200
                  },
                  null,
                  512
                  /* NEED_PATCH */
                ), [
                  [vue.vModelText, $data.aiForm.preferences]
                ])
              ]),
              vue.createElementVNode("view", { class: "ai-tips" }, [
                vue.createElementVNode("text", { class: "tips-icon" }, "💡"),
                vue.createElementVNode("text", { class: "tips-text" }, "AI 将根据您的偏好生成合适的行程建议")
              ])
            ]),
            vue.createElementVNode("button", {
              class: "form-submit",
              onClick: _cache[39] || (_cache[39] = (...args) => $options.generateWithAI && $options.generateWithAI(...args))
            }, [
              vue.createElementVNode("text", { class: "submit-text" }, "开始生成")
            ])
          ])
        ],
        32
        /* NEED_HYDRATION */
      )) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesItineraryItinerary = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", _sfc_render$6], ["__scopeId", "data-v-9bfb8cb3"], ["__file", "D:/2026_all_Favio/AI_exploring/personal/WanderAI/pages/itinerary/itinerary.vue"]]);
  const _sfc_main$5 = {
    data() {
      return {
        favorites: [],
        isLoading: false,
        // Android 适配：系统信息
        statusBarHeight: 44,
        // 默认值，会在 onLoad 中更新
        safeAreaInsetBottom: 0
        // 底部安全区高度（px）
      };
    },
    onLoad() {
      this.initSystemInfo();
      this.loadFavorites();
    },
    methods: {
      /**
       * Android 适配：初始化系统信息
       * 获取状态栏高度、安全区域等，用于布局适配
       */
      initSystemInfo() {
        var _a;
        try {
          const systemInfo = uni.getSystemInfoSync();
          this.statusBarHeight = systemInfo.statusBarHeight || 44;
          this.safeAreaInsetBottom = systemInfo.screenHeight - (((_a = systemInfo.safeArea) == null ? void 0 : _a.bottom) || systemInfo.screenHeight);
          formatAppLog("log", "at pages/favorites/favorites.vue:99", "[Favorites] 系统信息:", {
            statusBarHeight: this.statusBarHeight,
            safeAreaInsetBottom: this.safeAreaInsetBottom
          });
        } catch (e) {
          formatAppLog("error", "at pages/favorites/favorites.vue:104", "[Favorites] 获取系统信息失败:", e);
        }
      },
      /**
       * 加载收藏列表
       */
      loadFavorites() {
        this.isLoading = true;
        try {
          this.favorites = destinationService.getFavorites();
        } catch (e) {
          formatAppLog("error", "at pages/favorites/favorites.vue:116", "加载收藏失败:", e);
          uni.showToast({
            title: "加载失败",
            icon: "none"
          });
        } finally {
          this.isLoading = false;
        }
      },
      /**
       * 返回
       */
      handleBack() {
        uni.navigateBack();
      },
      /**
       * 点击卡片 - 跳转到详情页
       */
      handleCardClick(item) {
        formatAppLog("log", "at pages/favorites/favorites.vue:137", "点击收藏:", item.name);
        uni.navigateTo({
          url: `/pages/destination/destination?id=${item.id}`
        });
      },
      /**
       * 切换收藏状态
       */
      toggleFavorite(item) {
        destinationService.toggleFavorite(item.id);
        this.loadFavorites();
      },
      /**
       * 去探索页
       */
      goToExplore() {
        uni.switchTab({
          url: "/pages/explore/explore"
        });
      }
    }
  };
  function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "favorites-container" }, [
      vue.createElementVNode(
        "view",
        {
          class: "status-bar-placeholder",
          style: vue.normalizeStyle({ height: $data.statusBarHeight + "px" })
        },
        null,
        4
        /* STYLE */
      ),
      vue.createElementVNode("view", { class: "app-bar" }, [
        vue.createElementVNode("button", {
          class: "bar-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.handleBack && $options.handleBack(...args))
        }, [
          vue.createElementVNode("text", { class: "bar-icon" }, "←")
        ]),
        vue.createElementVNode("text", { class: "bar-title" }, "我的收藏"),
        vue.createElementVNode("button", { class: "bar-btn" }, [
          vue.createElementVNode("text", { class: "bar-icon" }, "⋯")
        ])
      ]),
      vue.createElementVNode("scroll-view", {
        class: "content-scroll",
        "scroll-y": ""
      }, [
        vue.createElementVNode("view", { class: "content-area" }, [
          $data.isLoading ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "loading-container"
          }, [
            vue.createElementVNode("text", { class: "loading-text" }, "加载中...")
          ])) : $data.favorites.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "empty-state"
          }, [
            vue.createElementVNode("text", { class: "empty-icon" }, "❤️"),
            vue.createElementVNode("text", { class: "empty-title" }, "还没有收藏"),
            vue.createElementVNode("text", { class: "empty-subtitle" }, "去探索页发现更多精彩目的地"),
            vue.createElementVNode("button", {
              class: "empty-btn",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.goToExplore && $options.goToExplore(...args))
            }, [
              vue.createElementVNode("text", { class: "empty-btn-text" }, "去探索")
            ])
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "favorites-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($data.favorites, (item) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: item.id,
                  class: "favorite-card",
                  onClick: ($event) => $options.handleCardClick(item)
                }, [
                  vue.createElementVNode("image", {
                    class: "card-image",
                    src: item.image,
                    mode: "aspectFill"
                  }, null, 8, ["src"]),
                  vue.createElementVNode("view", { class: "card-overlay" }, [
                    vue.createElementVNode("view", { class: "card-info" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "card-title" },
                        vue.toDisplayString(item.name),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { class: "card-location" }, [
                        vue.createElementVNode("text", { class: "location-icon" }, "📍"),
                        vue.createElementVNode(
                          "text",
                          { class: "location-text" },
                          vue.toDisplayString(item.location),
                          1
                          /* TEXT */
                        )
                      ]),
                      vue.createElementVNode("view", { class: "card-rating" }, [
                        vue.createElementVNode("text", { class: "rating-icon" }, "★"),
                        vue.createElementVNode(
                          "text",
                          { class: "rating-text" },
                          vue.toDisplayString(item.rating),
                          1
                          /* TEXT */
                        )
                      ])
                    ]),
                    vue.createElementVNode("button", {
                      class: "card-favorite-btn",
                      onClick: vue.withModifiers(($event) => $options.toggleFavorite(item), ["stop"])
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "favorite-icon" },
                        vue.toDisplayString(item.isFavorite ? "❤️" : "♡"),
                        1
                        /* TEXT */
                      )
                    ], 8, ["onClick"])
                  ]),
                  item.isTopPick ? (vue.openBlock(), vue.createElementBlock("view", {
                    key: 0,
                    class: "card-badge"
                  }, [
                    vue.createElementVNode("text", { class: "badge-text" }, "首选")
                  ])) : vue.createCommentVNode("v-if", true)
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]))
        ])
      ])
    ]);
  }
  const PagesFavoritesFavorites = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5], ["__scopeId", "data-v-da3e0273"], ["__file", "D:/2026_all_Favio/AI_exploring/personal/WanderAI/pages/favorites/favorites.vue"]]);
  const _sfc_main$4 = {
    data() {
      return {
        activeTab: "all",
        isLoading: false,
        // Android 适配：系统信息
        statusBarHeight: 44,
        // 默认值，会在 onLoad 中更新
        safeAreaInsetBottom: 0,
        // 底部安全区高度（px）
        tabs: [
          { id: "all", name: "全部", count: 0 },
          { id: "pending", name: "待付款", count: 0 },
          { id: "paid", name: "待出行", count: 0 },
          { id: "completed", name: "已完成", count: 0 }
        ],
        orders: [
          {
            id: "1",
            orderId: "ORD20240120001",
            title: "京都一日游",
            location: "京都，日本",
            date: "2024-02-15",
            price: "299",
            status: "pending",
            statusText: "待付款",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCDlmAISi5g0qEXTGgHKpNLeCHJxXVh0-dOZ8mijTk5mLHDNabYPxmr5VK5c5K4onCYRO7gXth28yYwKzPQ1mSrg13GxtR6UVqR6ipe6EBS127BYOiqcoByALm6qQWPgymAqNMVsTD-vUCOJS9pTrmya-N-UpMI7xUYv3FY0TbyZm118QiSWUIJj1mytu9jSGp7vA_JfQKGwPFS556RdylhNN92_NZYX--84fyJ4jklv6t8iaEiZyJTmbKm_s8Q7peEc2TFquuMOlI1ePpCmhd4Z3dp41YV-B0qa6lU8RGBU28YEKOA8sUz39JFCSjomxLSdifngoK5iW9prn_rFlv8",
            createTime: "2024-01-20 14:30"
          },
          {
            id: "2",
            orderId: "ORD20240119002",
            title: "巴黎浪漫之旅",
            location: "巴黎，法国",
            date: "2024-03-01",
            price: "599",
            status: "paid",
            statusText: "待出行",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDH7TK7nJ6DMr-i6dtmlyaESDklR5cKDXNuhuFnTg138c0NsLnOmA3PzGnNr0qaC9jeCpTuQPDI-AhdUkKvE2YRTM7gpZen1CL9DMBqzMynsmhNVf5EKGf5VTixbeSKeKsn5hVJchwXbGDGYYM0rH-JoB6_JwTsN0mkZunsEwLd_pTK_6Tn5MIyNPi9nGJ1rGjybSZFiSATcQlOSEI1PNuba3gTFanpfX80gjrF8dA-YO1KOCVQUk6mmebFwRb-tUP3hr6T2W6Vl",
            createTime: "2024-01-19 10:15"
          },
          {
            id: "3",
            orderId: "ORD20240118003",
            title: "东京自由行",
            location: "东京，日本",
            date: "2024-01-10",
            price: "399",
            status: "completed",
            statusText: "已完成",
            image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAWpn0wEFPKPeeT0FvlicFPe6cd5VfWMYg2cYeBlHTFLAykbrVXEXlc12ueU-sBMfW-djPYMj_P2nMKAaDWLYKtKKn61H0C2yqUGiVGCb1mhw9_8e2tGVrFRIPepiY3bsK_aJUObOfFMEqHF0WlUutpbSW76xlTr67-6gcRMb3MIqrfN14hIBDJQZSos0I4eiye7jU4bzWERA43mWPGR1x1u8uLb4NoYtNvPeXcS2fFMbWI1ePpCmhd4Z3dp41YV-B0qa6lU8RGBU28YEKOA8sUz39JFCSjomxLSdifngoK5iW9prn_rFlv8",
            createTime: "2024-01-18 16:45"
          }
        ]
      };
    },
    computed: {
      filteredOrders() {
        if (this.activeTab === "all") {
          return this.orders;
        }
        return this.orders.filter((order) => order.status === this.activeTab);
      }
    },
    onLoad() {
      this.initSystemInfo();
      this.loadOrders();
    },
    methods: {
      /**
       * Android 适配：初始化系统信息
       * 获取状态栏高度、安全区域等，用于布局适配
       */
      initSystemInfo() {
        var _a;
        try {
          const systemInfo = uni.getSystemInfoSync();
          this.statusBarHeight = systemInfo.statusBarHeight || 44;
          this.safeAreaInsetBottom = systemInfo.screenHeight - (((_a = systemInfo.safeArea) == null ? void 0 : _a.bottom) || systemInfo.screenHeight);
          formatAppLog("log", "at pages/orders/orders.vue:185", "[Orders] 系统信息:", {
            statusBarHeight: this.statusBarHeight,
            safeAreaInsetBottom: this.safeAreaInsetBottom
          });
        } catch (e) {
          formatAppLog("error", "at pages/orders/orders.vue:190", "[Orders] 获取系统信息失败:", e);
        }
      },
      /**
       * 加载订单
       */
      loadOrders() {
        this.isLoading = true;
        this.updateTabCounts();
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      },
      /**
       * 更新标签计数
       */
      updateTabCounts() {
        this.tabs.forEach((tab) => {
          if (tab.id === "all") {
            tab.count = this.orders.length;
          } else {
            tab.count = this.orders.filter((order) => order.status === tab.id).length;
          }
        });
      },
      /**
       * 切换标签
       */
      switchTab(tabId) {
        this.activeTab = tabId;
      },
      /**
       * 返回
       */
      handleBack() {
        uni.navigateBack();
      },
      /**
       * 点击订单
       */
      handleOrderClick(order) {
        formatAppLog("log", "at pages/orders/orders.vue:236", "点击订单:", order.orderId);
        uni.showToast({
          title: `查看订单详情`,
          icon: "none"
        });
      },
      /**
       * 订单操作
       */
      handleAction(order) {
        if (order.status === "pending") {
          uni.showModal({
            title: "确认付款",
            content: "确认支付 ¥" + order.price + " 吗？",
            success: (res) => {
              if (res.confirm) {
                this.payOrder(order.id);
              }
            }
          });
        } else if (order.status === "paid") {
          uni.showToast({
            title: "即将出发，请做好准备",
            icon: "none"
          });
        } else if (order.status === "completed") {
          uni.showToast({
            title: "订单已完成",
            icon: "none"
          });
        }
      },
      /**
       * 支付订单
       */
      payOrder(orderId) {
        uni.showLoading({
          title: "支付中..."
        });
        setTimeout(() => {
          uni.hideLoading();
          const order = this.orders.find((o) => o.id === orderId);
          if (order) {
            order.status = "paid";
            order.statusText = "待出行";
            this.updateTabCounts();
            uni.showToast({
              title: "支付成功",
              icon: "success"
            });
          }
        }, 1500);
      },
      /**
       * 获取操作按钮文字
       */
      getActionText(status) {
        const map = {
          pending: "去支付",
          paid: "查看详情",
          completed: "再次预订"
        };
        return map[status] || "查看详情";
      },
      /**
       * 去探索页
       */
      goToExplore() {
        uni.switchTab({
          url: "/pages/explore/explore"
        });
      }
    }
  };
  function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "orders-container" }, [
      vue.createElementVNode(
        "view",
        {
          class: "status-bar-placeholder",
          style: vue.normalizeStyle({ height: $data.statusBarHeight + "px" })
        },
        null,
        4
        /* STYLE */
      ),
      vue.createElementVNode("view", { class: "app-bar" }, [
        vue.createElementVNode("button", {
          class: "bar-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.handleBack && $options.handleBack(...args))
        }, [
          vue.createElementVNode("text", { class: "bar-icon" }, "←")
        ]),
        vue.createElementVNode("text", { class: "bar-title" }, "我的订单"),
        vue.createElementVNode("button", { class: "bar-btn" }, [
          vue.createElementVNode("text", { class: "bar-icon" }, "⋯")
        ])
      ]),
      vue.createElementVNode("view", { class: "tabs-container" }, [
        vue.createElementVNode("view", { class: "tabs-list" }, [
          (vue.openBlock(true), vue.createElementBlock(
            vue.Fragment,
            null,
            vue.renderList($data.tabs, (tab) => {
              return vue.openBlock(), vue.createElementBlock("button", {
                key: tab.id,
                class: vue.normalizeClass(["tab-btn", $data.activeTab === tab.id ? "tab-btn-active" : ""]),
                onClick: ($event) => $options.switchTab(tab.id)
              }, [
                vue.createElementVNode(
                  "text",
                  {
                    class: vue.normalizeClass(["tab-text", $data.activeTab === tab.id ? "tab-text-active" : ""])
                  },
                  vue.toDisplayString(tab.name),
                  3
                  /* TEXT, CLASS */
                ),
                tab.count > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
                  key: 0,
                  class: "tab-badge"
                }, [
                  vue.createElementVNode(
                    "text",
                    { class: "badge-text" },
                    vue.toDisplayString(tab.count),
                    1
                    /* TEXT */
                  )
                ])) : vue.createCommentVNode("v-if", true)
              ], 10, ["onClick"]);
            }),
            128
            /* KEYED_FRAGMENT */
          ))
        ])
      ]),
      vue.createElementVNode("scroll-view", {
        class: "content-scroll",
        "scroll-y": ""
      }, [
        vue.createElementVNode("view", { class: "content-area" }, [
          $data.isLoading ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "loading-container"
          }, [
            vue.createElementVNode("text", { class: "loading-text" }, "加载中...")
          ])) : $options.filteredOrders.length === 0 ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "empty-state"
          }, [
            vue.createElementVNode("text", { class: "empty-icon" }, "📋"),
            vue.createElementVNode("text", { class: "empty-title" }, "暂无订单"),
            vue.createElementVNode("text", { class: "empty-subtitle" }, "去探索页发现更多精彩目的地"),
            vue.createElementVNode("button", {
              class: "empty-btn",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.goToExplore && $options.goToExplore(...args))
            }, [
              vue.createElementVNode("text", { class: "empty-btn-text" }, "去探索")
            ])
          ])) : (vue.openBlock(), vue.createElementBlock("view", {
            key: 2,
            class: "orders-list"
          }, [
            (vue.openBlock(true), vue.createElementBlock(
              vue.Fragment,
              null,
              vue.renderList($options.filteredOrders, (order) => {
                return vue.openBlock(), vue.createElementBlock("view", {
                  key: order.id,
                  class: "order-card",
                  onClick: ($event) => $options.handleOrderClick(order)
                }, [
                  vue.createElementVNode("view", { class: "order-header" }, [
                    vue.createElementVNode("view", { class: "order-id" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "id-text" },
                        "订单号: " + vue.toDisplayString(order.orderId),
                        1
                        /* TEXT */
                      )
                    ]),
                    vue.createElementVNode(
                      "view",
                      {
                        class: vue.normalizeClass(["order-status", "status-" + order.status])
                      },
                      [
                        vue.createElementVNode(
                          "text",
                          { class: "status-text" },
                          vue.toDisplayString(order.statusText),
                          1
                          /* TEXT */
                        )
                      ],
                      2
                      /* CLASS */
                    )
                  ]),
                  vue.createElementVNode("view", { class: "order-content" }, [
                    vue.createElementVNode("image", {
                      class: "order-image",
                      src: order.image,
                      mode: "aspectFill"
                    }, null, 8, ["src"]),
                    vue.createElementVNode("view", { class: "order-info" }, [
                      vue.createElementVNode(
                        "text",
                        { class: "order-title" },
                        vue.toDisplayString(order.title),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode("view", { class: "order-meta" }, [
                        vue.createElementVNode("view", { class: "meta-item" }, [
                          vue.createElementVNode("text", { class: "meta-icon" }, "📍"),
                          vue.createElementVNode(
                            "text",
                            { class: "meta-text" },
                            vue.toDisplayString(order.location),
                            1
                            /* TEXT */
                          )
                        ]),
                        vue.createElementVNode("view", { class: "meta-item" }, [
                          vue.createElementVNode("text", { class: "meta-icon" }, "📅"),
                          vue.createElementVNode(
                            "text",
                            { class: "meta-text" },
                            vue.toDisplayString(order.date),
                            1
                            /* TEXT */
                          )
                        ])
                      ]),
                      vue.createElementVNode("view", { class: "order-price" }, [
                        vue.createElementVNode(
                          "text",
                          { class: "price-text" },
                          "¥" + vue.toDisplayString(order.price),
                          1
                          /* TEXT */
                        )
                      ])
                    ])
                  ]),
                  vue.createElementVNode("view", { class: "order-footer" }, [
                    vue.createElementVNode(
                      "text",
                      { class: "order-time" },
                      "下单时间: " + vue.toDisplayString(order.createTime),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode("button", {
                      class: "order-action-btn",
                      onClick: vue.withModifiers(($event) => $options.handleAction(order), ["stop"])
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "action-text" },
                        vue.toDisplayString($options.getActionText(order.status)),
                        1
                        /* TEXT */
                      )
                    ], 8, ["onClick"])
                  ])
                ], 8, ["onClick"]);
              }),
              128
              /* KEYED_FRAGMENT */
            ))
          ]))
        ])
      ])
    ]);
  }
  const PagesOrdersOrders = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4], ["__scopeId", "data-v-1acc51a1"], ["__file", "D:/2026_all_Favio/AI_exploring/personal/WanderAI/pages/orders/orders.vue"]]);
  const _sfc_main$3 = {
    data() {
      return {
        currentTheme: "light",
        themes: Object.values(THEMES),
        aiStyle: 0,
        aiStyleOptions: [
          { id: "friendly", name: "友好亲切" },
          { id: "professional", name: "专业严谨" },
          { id: "humorous", name: "幽默风趣" }
        ],
        noteStyle: 0,
        noteStyleOptions: [
          { id: "emotional", name: "情感丰富" },
          { id: "concise", name: "简洁明了" },
          { id: "detailed", name: "详细描述" }
        ],
        pushNotification: true,
        emailNotification: false,
        privacyMode: false,
        cacheSize: "0 MB",
        // Android 适配：系统信息
        statusBarHeight: 44,
        // 默认值，会在 onLoad 中更新
        safeAreaInsetBottom: 0
        // 底部安全区高度（px）
      };
    },
    onLoad() {
      this.initSystemInfo();
      this.loadSettings();
      this.calculateCacheSize();
    },
    methods: {
      /**
       * Android 适配：初始化系统信息
       * 获取状态栏高度、安全区域等，用于布局适配
       */
      initSystemInfo() {
        var _a;
        try {
          const systemInfo = uni.getSystemInfoSync();
          this.statusBarHeight = systemInfo.statusBarHeight || 44;
          this.safeAreaInsetBottom = systemInfo.screenHeight - (((_a = systemInfo.safeArea) == null ? void 0 : _a.bottom) || systemInfo.screenHeight);
          formatAppLog("log", "at pages/settings/settings.vue:225", "[Settings] 系统信息:", {
            statusBarHeight: this.statusBarHeight,
            safeAreaInsetBottom: this.safeAreaInsetBottom
          });
        } catch (e) {
          formatAppLog("error", "at pages/settings/settings.vue:230", "[Settings] 获取系统信息失败:", e);
        }
      },
      /**
       * 加载设置
       */
      loadSettings() {
        try {
          const settings = storage.get(STORAGE_KEYS.SETTINGS) || {};
          this.currentTheme = themeService.getCurrentTheme();
          this.aiStyle = this.aiStyleOptions.findIndex((opt) => opt.id === settings.aiStyle) || 0;
          this.noteStyle = this.noteStyleOptions.findIndex((opt) => opt.id === settings.noteStyle) || 0;
          this.pushNotification = settings.pushNotification !== false;
          this.emailNotification = settings.emailNotification || false;
          this.privacyMode = settings.privacyMode || false;
        } catch (e) {
          formatAppLog("error", "at pages/settings/settings.vue:247", "加载设置失败:", e);
        }
      },
      /**
       * 保存设置
       */
      saveSettings() {
        try {
          const settings = {
            aiStyle: this.aiStyleOptions[this.aiStyle].id,
            noteStyle: this.noteStyleOptions[this.noteStyle].id,
            pushNotification: this.pushNotification,
            emailNotification: this.emailNotification,
            privacyMode: this.privacyMode
          };
          storage.set(STORAGE_KEYS.SETTINGS, settings);
        } catch (e) {
          formatAppLog("error", "at pages/settings/settings.vue:265", "保存设置失败:", e);
        }
      },
      /**
       * 切换主题
       */
      switchTheme(themeId) {
        this.currentTheme = themeId;
        themeService.toggleTheme(themeId);
        this.saveSettings();
      },
      /**
       * AI 风格改变
       */
      handleAiStyleChange(e) {
        this.aiStyle = e.detail.value;
        this.saveSettings();
      },
      /**
       * 札记风格改变
       */
      handleNoteStyleChange(e) {
        this.noteStyle = e.detail.value;
        this.saveSettings();
      },
      /**
       * 推送通知改变
       */
      handlePushNotificationChange(e) {
        this.pushNotification = e.detail.value;
        this.saveSettings();
      },
      /**
       * 邮件通知改变
       */
      handleEmailNotificationChange(e) {
        this.emailNotification = e.detail.value;
        this.saveSettings();
      },
      /**
       * 隐私模式改变
       */
      handlePrivacyModeChange(e) {
        this.privacyMode = e.detail.value;
        this.saveSettings();
      },
      /**
       * 清除缓存/重置数据
       */
      handleClearCache() {
        uni.showModal({
          title: "确认清除",
          content: "确定要清除所有缓存和数据吗？\n\n这将清除：\n- 聊天记录\n- 收藏列表\n- 相册照片\n- 行程计划\n- 热门目的地\n（用户设置和个人资料将保留）",
          confirmText: "清除",
          confirmColor: "#ff4d4f",
          success: (res) => {
            if (res.confirm) {
              uni.showLoading({
                title: "清除中..."
              });
              try {
                const keysToKeep = [
                  STORAGE_KEYS.USER_PROFILE,
                  STORAGE_KEYS.SETTINGS,
                  STORAGE_KEYS.THEME
                ];
                const allKeys = [STORAGE_KEYS.CHAT_HISTORY, STORAGE_KEYS.CHAT_MESSAGES, STORAGE_KEYS.FAVORITES, STORAGE_KEYS.DESTINATIONS, STORAGE_KEYS.ALBUMS, STORAGE_KEYS.PHOTOS, STORAGE_KEYS.ITINERARIES];
                allKeys.forEach((key) => {
                  try {
                    storage.remove(key);
                  } catch (e) {
                    formatAppLog("error", "at pages/settings/settings.vue:349", "清除", key, "失败:", e);
                  }
                });
                try {
                  const { clearTrendingCache: clearTrendingCache2 } = require("@/services/trendingDestinations.js");
                  clearTrendingCache2();
                } catch (e) {
                  formatAppLog("error", "at pages/settings/settings.vue:358", "清除热门目的地缓存失败:", e);
                }
                try {
                  const { resetAlbumData: resetAlbumData2 } = require("@/services/album.js");
                  resetAlbumData2();
                } catch (e) {
                  formatAppLog("error", "at pages/settings/settings.vue:366", "重置相册数据失败:", e);
                }
                setTimeout(() => {
                  uni.hideLoading();
                  this.calculateCacheSize();
                  uni.showToast({
                    title: "数据已清除",
                    icon: "success"
                  });
                }, 500);
              } catch (e) {
                formatAppLog("error", "at pages/settings/settings.vue:378", "清除数据失败:", e);
                uni.hideLoading();
                uni.showToast({
                  title: "清除失败",
                  icon: "none"
                });
              }
            }
          }
        });
      },
      /**
       * 关于我们
       */
      handleAbout() {
        const version = "v1.0.2";
        uni.showModal({
          title: "关于我们",
          content: `WanderAI ${version}

智能旅行伴侣，让您的旅行更加精彩。

© 2024 WanderAI`,
          showCancel: false
        });
      },
      /**
       * 计算缓存大小
       */
      calculateCacheSize() {
        try {
          const info = uni.getStorageInfoSync();
          const size = (info.currentSize / 1024 / 1024).toFixed(2);
          this.cacheSize = size + " MB";
        } catch (e) {
          formatAppLog("error", "at pages/settings/settings.vue:412", "计算缓存失败:", e);
        }
      },
      /**
       * 返回
       */
      handleBack() {
        uni.navigateBack();
      }
    }
  };
  function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "settings-container" }, [
      vue.createElementVNode(
        "view",
        {
          class: "status-bar-placeholder",
          style: vue.normalizeStyle({ height: $data.statusBarHeight + "px" })
        },
        null,
        4
        /* STYLE */
      ),
      vue.createElementVNode("view", { class: "app-bar" }, [
        vue.createElementVNode("button", {
          class: "bar-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.handleBack && $options.handleBack(...args))
        }, [
          vue.createElementVNode("text", { class: "bar-icon" }, "←")
        ]),
        vue.createElementVNode("text", { class: "bar-title" }, "设置"),
        vue.createElementVNode("button", { class: "bar-btn" }, [
          vue.createElementVNode("text", { class: "bar-icon" }, "⋯")
        ])
      ]),
      vue.createElementVNode("scroll-view", {
        class: "content-scroll",
        "scroll-y": ""
      }, [
        vue.createElementVNode("view", { class: "content-area" }, [
          vue.createElementVNode("view", { class: "section" }, [
            vue.createElementVNode("text", { class: "section-title" }, "外观设置"),
            vue.createElementVNode("view", { class: "setting-item" }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-icon" }, "🎨"),
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode("text", { class: "item-title" }, "主题模式"),
                  vue.createElementVNode("text", { class: "item-desc" }, "选择您喜欢的主题")
                ])
              ]),
              vue.createElementVNode("view", { class: "item-right" }, [
                (vue.openBlock(true), vue.createElementBlock(
                  vue.Fragment,
                  null,
                  vue.renderList($data.themes, (theme) => {
                    return vue.openBlock(), vue.createElementBlock("button", {
                      key: theme.id,
                      class: vue.normalizeClass(["theme-btn", $data.currentTheme === theme.id ? "theme-btn-active" : ""]),
                      onClick: ($event) => $options.switchTheme(theme.id)
                    }, [
                      vue.createElementVNode(
                        "text",
                        { class: "theme-icon" },
                        vue.toDisplayString(theme.icon),
                        1
                        /* TEXT */
                      ),
                      vue.createElementVNode(
                        "text",
                        { class: "theme-name" },
                        vue.toDisplayString(theme.name),
                        1
                        /* TEXT */
                      )
                    ], 10, ["onClick"]);
                  }),
                  128
                  /* KEYED_FRAGMENT */
                ))
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "section" }, [
            vue.createElementVNode("text", { class: "section-title" }, "AI 设置"),
            vue.createElementVNode("view", { class: "setting-item" }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-icon" }, "🤖"),
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode("text", { class: "item-title" }, "AI 回复风格"),
                  vue.createElementVNode("text", { class: "item-desc" }, "调整 AI 的回复语气")
                ])
              ]),
              vue.createElementVNode("picker", {
                value: $data.aiStyle,
                range: $data.aiStyleOptions,
                "range-key": "name",
                onChange: _cache[1] || (_cache[1] = (...args) => $options.handleAiStyleChange && $options.handleAiStyleChange(...args))
              }, [
                vue.createElementVNode("view", { class: "picker-trigger" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "picker-text" },
                    vue.toDisplayString($data.aiStyleOptions[$data.aiStyle].name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", { class: "picker-arrow" }, "▼")
                ])
              ], 40, ["value", "range"])
            ]),
            vue.createElementVNode("view", { class: "setting-item" }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-icon" }, "📝"),
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode("text", { class: "item-title" }, "札记生成风格"),
                  vue.createElementVNode("text", { class: "item-desc" }, "选择旅行札记的写作风格")
                ])
              ]),
              vue.createElementVNode("picker", {
                value: $data.noteStyle,
                range: $data.noteStyleOptions,
                "range-key": "name",
                onChange: _cache[2] || (_cache[2] = (...args) => $options.handleNoteStyleChange && $options.handleNoteStyleChange(...args))
              }, [
                vue.createElementVNode("view", { class: "picker-trigger" }, [
                  vue.createElementVNode(
                    "text",
                    { class: "picker-text" },
                    vue.toDisplayString($data.noteStyleOptions[$data.noteStyle].name),
                    1
                    /* TEXT */
                  ),
                  vue.createElementVNode("text", { class: "picker-arrow" }, "▼")
                ])
              ], 40, ["value", "range"])
            ])
          ]),
          vue.createElementVNode("view", { class: "section" }, [
            vue.createElementVNode("text", { class: "section-title" }, "通知设置"),
            vue.createElementVNode("view", { class: "setting-item" }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-icon" }, "🔔"),
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode("text", { class: "item-title" }, "推送通知"),
                  vue.createElementVNode("text", { class: "item-desc" }, "接收行程提醒和推荐")
                ])
              ]),
              vue.createElementVNode("switch", {
                checked: $data.pushNotification,
                onChange: _cache[3] || (_cache[3] = (...args) => $options.handlePushNotificationChange && $options.handlePushNotificationChange(...args)),
                color: "#63ec13"
              }, null, 40, ["checked"])
            ]),
            vue.createElementVNode("view", { class: "setting-item" }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-icon" }, "📧"),
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode("text", { class: "item-title" }, "邮件通知"),
                  vue.createElementVNode("text", { class: "item-desc" }, "接收重要更新通知")
                ])
              ]),
              vue.createElementVNode("switch", {
                checked: $data.emailNotification,
                onChange: _cache[4] || (_cache[4] = (...args) => $options.handleEmailNotificationChange && $options.handleEmailNotificationChange(...args)),
                color: "#63ec13"
              }, null, 40, ["checked"])
            ])
          ]),
          vue.createElementVNode("view", { class: "section" }, [
            vue.createElementVNode("text", { class: "section-title" }, "隐私设置"),
            vue.createElementVNode("view", { class: "setting-item" }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-icon" }, "🔒"),
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode("text", { class: "item-title" }, "隐私模式"),
                  vue.createElementVNode("text", { class: "item-desc" }, "隐藏敏感信息")
                ])
              ]),
              vue.createElementVNode("switch", {
                checked: $data.privacyMode,
                onChange: _cache[5] || (_cache[5] = (...args) => $options.handlePrivacyModeChange && $options.handlePrivacyModeChange(...args)),
                color: "#63ec13"
              }, null, 40, ["checked"])
            ])
          ]),
          vue.createElementVNode("view", { class: "section" }, [
            vue.createElementVNode("text", { class: "section-title" }, "其他"),
            vue.createElementVNode("view", {
              class: "setting-item",
              onClick: _cache[6] || (_cache[6] = (...args) => $options.handleClearCache && $options.handleClearCache(...args))
            }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-icon" }, "🗑️"),
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode("text", { class: "item-title" }, "清除缓存"),
                  vue.createElementVNode("text", { class: "item-desc" }, "释放存储空间")
                ])
              ]),
              vue.createElementVNode(
                "text",
                { class: "cache-size" },
                vue.toDisplayString($data.cacheSize),
                1
                /* TEXT */
              )
            ]),
            vue.createElementVNode("view", {
              class: "setting-item",
              onClick: _cache[7] || (_cache[7] = (...args) => $options.handleAbout && $options.handleAbout(...args))
            }, [
              vue.createElementVNode("view", { class: "item-left" }, [
                vue.createElementVNode("text", { class: "item-icon" }, "ℹ️"),
                vue.createElementVNode("view", { class: "item-info" }, [
                  vue.createElementVNode("text", { class: "item-title" }, "关于我们"),
                  vue.createElementVNode("text", { class: "item-desc" }, "版本信息")
                ])
              ]),
              vue.createElementVNode("text", { class: "arrow" }, "›")
            ])
          ])
        ])
      ])
    ]);
  }
  const PagesSettingsSettings = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3], ["__scopeId", "data-v-7fad0a1c"], ["__file", "D:/2026_all_Favio/AI_exploring/personal/WanderAI/pages/settings/settings.vue"]]);
  const _sfc_main$2 = {
    data() {
      return {
        isLoading: true,
        destinationId: "",
        destination: null,
        // Android 适配：系统信息
        statusBarHeight: 44,
        // 默认值，会在 onLoad 中更新
        safeAreaInsetBottom: 0,
        // 底部安全区高度（px）
        recommendReasons: [],
        bestTimeToVisit: "",
        estimatedCost: {
          budget: "",
          days: ""
        }
      };
    },
    onLoad(options) {
      this.initSystemInfo();
      formatAppLog("log", "at pages/destination/destination.vue:159", "目的地详情页加载，参数:", options);
      this.destinationId = options.id || "";
      this.loadDestination();
    },
    methods: {
      /**
       * Android 适配：初始化系统信息
       * 获取状态栏高度、安全区域等，用于布局适配
       */
      initSystemInfo() {
        var _a;
        try {
          const systemInfo = uni.getSystemInfoSync();
          this.statusBarHeight = systemInfo.statusBarHeight || 44;
          this.safeAreaInsetBottom = systemInfo.screenHeight - (((_a = systemInfo.safeArea) == null ? void 0 : _a.bottom) || systemInfo.screenHeight);
          formatAppLog("log", "at pages/destination/destination.vue:174", "[Destination] 系统信息:", {
            statusBarHeight: this.statusBarHeight,
            safeAreaInsetBottom: this.safeAreaInsetBottom
          });
        } catch (e) {
          formatAppLog("error", "at pages/destination/destination.vue:179", "[Destination] 获取系统信息失败:", e);
        }
      },
      /**
       * 加载目的地详情
       */
      loadDestination() {
        this.isLoading = true;
        try {
          this.destination = destinationService.getDestinationById(this.destinationId);
          if (this.destination) {
            this.generateRecommendReasons();
            this.generateTravelInfo();
          } else {
            formatAppLog("error", "at pages/destination/destination.vue:198", "未找到目的地:", this.destinationId);
          }
        } catch (e) {
          formatAppLog("error", "at pages/destination/destination.vue:201", "加载详情失败:", e);
          uni.showToast({
            title: "加载失败",
            icon: "none"
          });
        } finally {
          this.isLoading = false;
        }
      },
      /**
       * 生成推荐理由
       */
      generateRecommendReasons() {
        const reasons = [];
        if (this.destination.tags.includes("自然")) {
          reasons.push({ icon: "🌿", text: "壮丽的自然风光，令人心旷神怡" });
        }
        if (this.destination.tags.includes("宁静海滩")) {
          reasons.push({ icon: "🏖️", text: "宁静优美的海滩，远离喧嚣" });
        }
        if (this.destination.tags.includes("超值")) {
          reasons.push({ icon: "💎", text: "性价比超高，物超所值" });
        }
        if (this.destination.tags.includes("文化")) {
          reasons.push({ icon: "🎭", text: "丰富的文化体验，深度旅行" });
        }
        if (this.destination.rating >= 4.8) {
          reasons.push({ icon: "⭐", text: "游客好评如潮，值得信赖" });
        }
        if (this.destination.isTopPick) {
          reasons.push({ icon: "🏆", text: "平台精选推荐，品质保证" });
        }
        if (reasons.length === 0) {
          reasons.push({ icon: "❤️", text: "独特的旅行体验，不容错过" });
        }
        this.recommendReasons = reasons;
      },
      /**
       * 生成旅行信息
       */
      generateTravelInfo() {
        const timeOptions = [
          "11月 - 4月（旱季，天气晴朗）",
          "5月 - 10月（雨季，绿意盎然）",
          "全年适宜（热带气候）",
          "3月 - 5月，9月 - 11月（春秋最佳）"
        ];
        this.bestTimeToVisit = timeOptions[Math.floor(Math.random() * timeOptions.length)];
        const isBudget = this.destination.tags.includes("超值");
        const budgetOptions = isBudget ? ["¥3,000 - ¥5,000", "¥2,000 - ¥4,000", "¥4,000 - ¥6,000"] : ["¥5,000 - ¥8,000", "¥6,000 - ¥10,000", "¥8,000 - ¥12,000"];
        this.estimatedCost.budget = budgetOptions[Math.floor(Math.random() * budgetOptions.length)];
        const daysOptions = ["3-5 天", "5-7 天", "7-10 天"];
        this.estimatedCost.days = daysOptions[Math.floor(Math.random() * daysOptions.length)];
      },
      /**
       * 切换收藏状态
       */
      toggleFavorite() {
        const updated = destinationService.toggleFavorite(this.destination.id);
        if (updated) {
          this.destination.isFavorite = updated.isFavorite;
          uni.showToast({
            title: updated.isFavorite ? "已添加到收藏" : "已取消收藏",
            icon: "none",
            duration: 1500
          });
        }
      },
      /**
       * 分享
       */
      handleShare() {
        uni.showShareMenu({
          withShareTicket: true
        });
      },
      /**
       * 加入行程
       */
      handleAddToItinerary() {
        uni.showToast({
          title: "已加入待选行程",
          icon: "success"
        });
      },
      /**
       * 开始规划
       */
      handlePlanTrip() {
        uni.navigateTo({
          url: `/pages/chat/chat?prompt=帮我规划一个去${this.destination.name}的旅行行程，${this.destination.description}`
        });
      },
      /**
       * 返回
       */
      goBack() {
        uni.navigateBack();
      }
    }
  };
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "destination-container" }, [
      vue.createElementVNode(
        "view",
        {
          class: "status-bar-placeholder",
          style: vue.normalizeStyle({ height: $data.statusBarHeight + "px" })
        },
        null,
        4
        /* STYLE */
      ),
      $data.isLoading ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "loading-container"
      }, [
        vue.createElementVNode("text", { class: "loading-text" }, "加载中...")
      ])) : !$data.destination ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "not-found"
      }, [
        vue.createElementVNode("text", { class: "not-found-icon" }, "😕"),
        vue.createElementVNode("text", { class: "not-found-text" }, "未找到该目的地"),
        vue.createElementVNode("button", {
          class: "back-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.goBack && $options.goBack(...args))
        }, [
          vue.createElementVNode("text", { class: "back-text" }, "返回")
        ])
      ])) : (vue.openBlock(), vue.createElementBlock("scroll-view", {
        key: 2,
        class: "detail-scroll",
        "scroll-y": ""
      }, [
        vue.createElementVNode("view", { class: "header-image-wrapper" }, [
          vue.createElementVNode("image", {
            class: "header-image",
            src: $data.destination.image,
            mode: "aspectFill"
          }, null, 8, ["src"]),
          vue.createElementVNode("view", { class: "image-gradient" }),
          vue.createElementVNode("view", { class: "header-actions" }, [
            vue.createElementVNode("button", {
              class: "action-btn back-action",
              onClick: _cache[1] || (_cache[1] = (...args) => $options.goBack && $options.goBack(...args))
            }, [
              vue.createElementVNode("text", { class: "action-icon" }, "←")
            ]),
            vue.createElementVNode(
              "button",
              {
                class: vue.normalizeClass(["action-btn favorite-action", { "is-favorite": $data.destination.isFavorite }]),
                onClick: _cache[2] || (_cache[2] = (...args) => $options.toggleFavorite && $options.toggleFavorite(...args))
              },
              [
                vue.createElementVNode(
                  "text",
                  { class: "action-icon" },
                  vue.toDisplayString($data.destination.isFavorite ? "❤️" : "🤍"),
                  1
                  /* TEXT */
                )
              ],
              2
              /* CLASS */
            ),
            vue.createElementVNode("button", {
              class: "action-btn share-action",
              onClick: _cache[3] || (_cache[3] = (...args) => $options.handleShare && $options.handleShare(...args))
            }, [
              vue.createElementVNode("text", { class: "action-icon" }, "↗")
            ])
          ]),
          $data.destination.isTopPick ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "top-pick-badge"
          }, [
            vue.createElementVNode("text", { class: "top-pick-text" }, "⭐ 首选推荐")
          ])) : vue.createCommentVNode("v-if", true)
        ]),
        vue.createElementVNode("view", { class: "content-area" }, [
          vue.createElementVNode("view", { class: "title-section" }, [
            vue.createElementVNode(
              "text",
              { class: "destination-title" },
              vue.toDisplayString($data.destination.name),
              1
              /* TEXT */
            ),
            vue.createElementVNode("view", { class: "location-row" }, [
              vue.createElementVNode("text", { class: "location-icon" }, "📍"),
              vue.createElementVNode(
                "text",
                { class: "location-text" },
                vue.toDisplayString($data.destination.location),
                1
                /* TEXT */
              )
            ])
          ]),
          vue.createElementVNode("view", { class: "meta-section" }, [
            vue.createElementVNode("view", { class: "rating-box" }, [
              vue.createElementVNode("text", { class: "rating-star" }, "★"),
              vue.createElementVNode(
                "text",
                { class: "rating-score" },
                vue.toDisplayString($data.destination.rating),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "rating-label" }, "评分")
            ]),
            vue.createElementVNode("view", { class: "tags-box" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.destination.tags, (tag, index) => {
                  return vue.openBlock(), vue.createElementBlock(
                    "text",
                    {
                      key: index,
                      class: "tag-item"
                    },
                    vue.toDisplayString(tag),
                    1
                    /* TEXT */
                  );
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createElementVNode("view", { class: "description-section" }, [
            vue.createElementVNode("text", { class: "section-title" }, "📝 简介"),
            vue.createElementVNode(
              "text",
              { class: "description-text" },
              vue.toDisplayString($data.destination.description),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "reasons-section" }, [
            vue.createElementVNode("text", { class: "section-title" }, "✨ 推荐理由"),
            vue.createElementVNode("view", { class: "reasons-list" }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.recommendReasons, (reason, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: index,
                    class: "reason-item"
                  }, [
                    vue.createElementVNode(
                      "text",
                      { class: "reason-icon" },
                      vue.toDisplayString(reason.icon),
                      1
                      /* TEXT */
                    ),
                    vue.createElementVNode(
                      "text",
                      { class: "reason-text" },
                      vue.toDisplayString(reason.text),
                      1
                      /* TEXT */
                    )
                  ]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])
          ]),
          vue.createElementVNode("view", { class: "time-section" }, [
            vue.createElementVNode("text", { class: "section-title" }, "📅 最佳旅行时间"),
            vue.createElementVNode(
              "text",
              { class: "time-text" },
              vue.toDisplayString($data.bestTimeToVisit),
              1
              /* TEXT */
            )
          ]),
          vue.createElementVNode("view", { class: "cost-section" }, [
            vue.createElementVNode("text", { class: "section-title" }, "💰 预计费用"),
            vue.createElementVNode("view", { class: "cost-list" }, [
              vue.createElementVNode("view", { class: "cost-item" }, [
                vue.createElementVNode("text", { class: "cost-label" }, "人均预算"),
                vue.createElementVNode(
                  "text",
                  { class: "cost-value" },
                  vue.toDisplayString($data.estimatedCost.budget),
                  1
                  /* TEXT */
                )
              ]),
              vue.createElementVNode("view", { class: "cost-item" }, [
                vue.createElementVNode("text", { class: "cost-label" }, "建议天数"),
                vue.createElementVNode(
                  "text",
                  { class: "cost-value" },
                  vue.toDisplayString($data.estimatedCost.days),
                  1
                  /* TEXT */
                )
              ])
            ])
          ])
        ])
      ])),
      vue.createElementVNode("view", { class: "bottom-actions" }, [
        vue.createElementVNode("button", {
          class: "action-card-btn",
          onClick: _cache[4] || (_cache[4] = (...args) => $options.handleAddToItinerary && $options.handleAddToItinerary(...args))
        }, [
          vue.createElementVNode("text", { class: "action-card-icon" }, "📋"),
          vue.createElementVNode("text", { class: "action-card-text" }, "加入行程")
        ]),
        vue.createElementVNode("button", {
          class: "primary-action-btn",
          onClick: _cache[5] || (_cache[5] = (...args) => $options.handlePlanTrip && $options.handlePlanTrip(...args))
        }, [
          vue.createElementVNode("text", { class: "primary-action-icon" }, "✨"),
          vue.createElementVNode("text", { class: "primary-action-text" }, "开始规划")
        ])
      ])
    ]);
  }
  const PagesDestinationDestination = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-cca836c7"], ["__file", "D:/2026_all_Favio/AI_exploring/personal/WanderAI/pages/destination/destination.vue"]]);
  const _sfc_main$1 = {
    data() {
      return {
        memoryId: "",
        memory: null,
        photos: [],
        isLoading: true,
        isGenerating: false,
        showOptionsModal: false,
        showEditModal: false,
        showNoteEditor: false,
        editingNote: "",
        // Android 适配：系统信息
        statusBarHeight: 44,
        // 默认值，会在 onLoad 中更新
        safeAreaInsetBottom: 0,
        // 底部安全区高度（px）
        editingMemory: {
          title: "",
          location: "",
          date: "",
          description: ""
        }
      };
    },
    onLoad(options) {
      this.initSystemInfo();
      this.memoryId = options.id || "";
      this.loadMemory();
    },
    methods: {
      /**
       * Android 适配：初始化系统信息
       * 获取状态栏高度、安全区域等，用于布局适配
       */
      initSystemInfo() {
        var _a;
        try {
          const systemInfo = uni.getSystemInfoSync();
          this.statusBarHeight = systemInfo.statusBarHeight || 44;
          this.safeAreaInsetBottom = systemInfo.screenHeight - (((_a = systemInfo.safeArea) == null ? void 0 : _a.bottom) || systemInfo.screenHeight);
          formatAppLog("log", "at pages/album/memory-detail.vue:259", "[MemoryDetail] 系统信息:", {
            statusBarHeight: this.statusBarHeight,
            safeAreaInsetBottom: this.safeAreaInsetBottom
          });
        } catch (e) {
          formatAppLog("error", "at pages/album/memory-detail.vue:264", "[MemoryDetail] 获取系统信息失败:", e);
        }
      },
      /**
       * 加载回忆详情
       */
      loadMemory() {
        formatAppLog("log", "at pages/album/memory-detail.vue:272", "[回忆详情] 加载回忆:", this.memoryId);
        this.isLoading = true;
        const memory = albumService.getMemoryById(this.memoryId);
        if (memory) {
          this.memory = memory;
          this.photos = this.collectPhotos();
          formatAppLog("log", "at pages/album/memory-detail.vue:281", "[回忆详情] 加载成功:", {
            title: memory.title,
            photos: this.photos.length
          });
        } else {
          formatAppLog("error", "at pages/album/memory-detail.vue:286", "[回忆详情] 回忆不存在");
        }
        this.isLoading = false;
      },
      /**
       * 收集所有照片
       */
      collectPhotos() {
        const photos = [];
        if (this.memory.coverImage) {
          photos.push({
            id: "cover",
            url: this.memory.coverImage,
            isCover: true
          });
        }
        if (this.memory.photos && this.memory.photos.length > 0) {
          photos.push(...this.memory.photos);
        }
        return photos;
      },
      /**
       * 格式化日期
       */
      formatDate(dateString) {
        if (!dateString)
          return "";
        const date = new Date(dateString);
        return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
      },
      /**
       * 返回
       */
      handleBack() {
        uni.navigateBack();
      },
      /**
       * 更多选项
       */
      handleMoreOptions() {
        this.showOptionsModal = true;
      },
      /**
       * 关闭选项弹窗
       */
      closeOptionsModal() {
        this.showOptionsModal = false;
      },
      /**
       * 编辑回忆
       */
      handleEdit() {
        this.closeOptionsModal();
        this.editingMemory = {
          title: this.memory.title,
          location: this.memory.location,
          date: this.memory.date,
          description: this.memory.description || ""
        };
        this.showEditModal = true;
      },
      /**
       * 关闭编辑弹窗
       */
      closeEditModal() {
        this.showEditModal = false;
      },
      /**
       * 保存编辑
       */
      saveEditMemory() {
        if (!this.editingMemory.title || !this.editingMemory.title.trim()) {
          uni.showToast({
            title: "请输入回忆标题",
            icon: "none"
          });
          return;
        }
        const updated = albumService.updateMemory(this.memoryId, {
          title: this.editingMemory.title.trim(),
          location: this.editingMemory.location.trim() || this.memory.location,
          date: this.editingMemory.date.trim() || this.memory.date,
          description: this.editingMemory.description.trim()
        });
        if (updated) {
          this.memory = updated;
          this.closeEditModal();
          uni.showToast({
            title: "保存成功",
            icon: "success"
          });
        }
      },
      /**
       * 删除回忆
       */
      handleDelete() {
        this.closeOptionsModal();
        uni.showModal({
          title: "确认删除",
          content: "删除后将无法恢复，确定要删除这个回忆吗？",
          confirmText: "删除",
          confirmColor: "#ff4444",
          success: (res) => {
            if (res.confirm) {
              const success = albumService.deleteMemory(this.memoryId);
              if (success) {
                uni.showToast({
                  title: "删除成功",
                  icon: "success"
                });
                setTimeout(() => {
                  uni.navigateBack();
                }, 500);
              }
            }
          }
        });
      },
      /**
       * 分享
       */
      handleShare() {
        uni.showToast({
          title: "分享功能开发中",
          icon: "none"
        });
      },
      /**
       * 切换札记编辑器
       */
      toggleNoteEditor() {
        this.showNoteEditor = true;
        this.editingNote = this.memory.travelNote || "";
      },
      /**
       * 取消编辑札记
       */
      cancelEditNote() {
        this.showNoteEditor = false;
        this.editingNote = "";
      },
      /**
       * 保存札记
       */
      saveNote() {
        if (!this.editingNote || !this.editingNote.trim()) {
          uni.showToast({
            title: "请输入札记内容",
            icon: "none"
          });
          return;
        }
        albumService.saveTravelNote(this.memoryId, this.editingNote.trim());
        this.memory = albumService.getMemoryById(this.memoryId);
        this.showNoteEditor = false;
        uni.showToast({
          title: "保存成功",
          icon: "success"
        });
      },
      /**
       * 生成旅行札记
       */
      async handleGenerateNote() {
        this.isGenerating = true;
        uni.showLoading({
          title: "生成中...",
          mask: true
        });
        try {
          const prompt = `请根据以下旅行信息生成一篇生动的旅行札记：

地点：${this.memory.location}
时间：${this.memory.date}
标题：${this.memory.title}
描述：${this.memory.description || "暂无描述"}
照片数量：${this.memory.photoCount} 张

要求：
1. 用第一人称叙述，充满感情色彩
2. 描述当时的感受和心情
3. 提及有趣的细节和见闻
4. 语言生动有趣，约 300-500 字
5. 可以适当使用表情符号增加亲和力
6. 只返回札记内容，不要其他说明`;
          const response = await sendTravelMessage(prompt, [], {
            temperature: 0.8,
            max_tokens: 1e3
          });
          const note = parseMessageContent(response);
          if (note) {
            albumService.saveTravelNote(this.memoryId, note);
            this.memory = albumService.getMemoryById(this.memoryId);
            uni.hideLoading();
            uni.showToast({
              title: "生成成功",
              icon: "success"
            });
          } else {
            throw new Error("生成内容为空");
          }
        } catch (error) {
          formatAppLog("error", "at pages/album/memory-detail.vue:519", "[回忆详情] 生成札记失败:", error);
          uni.hideLoading();
          const fallbackNote = `# ${this.memory.title}

在${this.memory.location}的${this.memory.date}，我度过了一段难忘的时光。

${this.memory.description || "这段回忆深深地印在了我的脑海里。"}

期待下一次的旅程！✨`;
          albumService.saveTravelNote(this.memoryId, fallbackNote);
          this.memory = albumService.getMemoryById(this.memoryId);
          uni.showToast({
            title: "网络失败，已生成模板",
            icon: "none"
          });
        } finally {
          this.isGenerating = false;
        }
      },
      /**
       * 预览照片
       */
      previewPhoto(index) {
        const urls = this.photos.map((p) => p.url);
        uni.previewImage({
          urls,
          current: index
        });
      },
      /**
       * 删除照片
       */
      deletePhoto(photoId) {
        if (photoId === "cover") {
          uni.showToast({
            title: "封面图无法删除",
            icon: "none"
          });
          return;
        }
        uni.showModal({
          title: "确认删除",
          content: "确定要删除这张照片吗？",
          confirmColor: "#ff4444",
          success: (res) => {
            if (res.confirm) {
              const success = albumService.deletePhoto(this.memoryId, photoId);
              if (success) {
                this.memory = albumService.getMemoryById(this.memoryId);
                this.photos = this.collectPhotos();
                uni.showToast({
                  title: "删除成功",
                  icon: "success"
                });
              }
            }
          }
        });
      },
      /**
       * 添加照片
       */
      handleAddPhotos() {
        uni.chooseImage({
          count: 9,
          sizeType: ["compressed"],
          sourceType: ["album", "camera"],
          success: (res) => {
            let successCount = 0;
            res.tempFilePaths.forEach((filePath) => {
              const photo = albumService.addPhoto(this.memoryId, filePath);
              if (photo)
                successCount++;
            });
            if (successCount > 0) {
              this.memory = albumService.getMemoryById(this.memoryId);
              this.photos = this.collectPhotos();
              uni.showToast({
                title: `成功添加 ${successCount} 张照片`,
                icon: "success"
              });
            }
          }
        });
      }
    }
  };
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", { class: "memory-detail-container" }, [
      vue.createElementVNode(
        "view",
        {
          class: "status-bar-placeholder",
          style: vue.normalizeStyle({ height: $data.statusBarHeight + "px" })
        },
        null,
        4
        /* STYLE */
      ),
      vue.createElementVNode("view", { class: "app-bar" }, [
        vue.createElementVNode("button", {
          class: "bar-btn",
          onClick: _cache[0] || (_cache[0] = (...args) => $options.handleBack && $options.handleBack(...args))
        }, [
          vue.createElementVNode("text", { class: "bar-icon" }, "←")
        ]),
        vue.createElementVNode("text", { class: "bar-title" }, "回忆详情"),
        vue.createElementVNode("button", {
          class: "bar-btn",
          onClick: _cache[1] || (_cache[1] = (...args) => $options.handleMoreOptions && $options.handleMoreOptions(...args))
        }, [
          vue.createElementVNode("text", { class: "bar-icon" }, "⋯")
        ])
      ]),
      vue.createElementVNode("scroll-view", {
        class: "content-scroll",
        "scroll-y": ""
      }, [
        $data.memory ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 0,
          class: "content-area"
        }, [
          vue.createElementVNode("view", { class: "cover-section" }, [
            vue.createElementVNode("image", {
              class: "cover-image",
              src: $data.memory.coverImage,
              mode: "aspectFill"
            }, null, 8, ["src"]),
            vue.createElementVNode("view", { class: "cover-overlay" }, [
              vue.createElementVNode(
                "text",
                { class: "cover-title" },
                vue.toDisplayString($data.memory.title),
                1
                /* TEXT */
              ),
              vue.createElementVNode("view", { class: "cover-meta" }, [
                vue.createElementVNode(
                  "text",
                  { class: "meta-item" },
                  "📍 " + vue.toDisplayString($data.memory.location),
                  1
                  /* TEXT */
                ),
                vue.createElementVNode(
                  "text",
                  { class: "meta-item" },
                  "📅 " + vue.toDisplayString($data.memory.date),
                  1
                  /* TEXT */
                )
              ])
            ])
          ]),
          vue.createElementVNode("view", { class: "stats-row" }, [
            vue.createElementVNode("view", { class: "stat-row-item" }, [
              vue.createElementVNode(
                "text",
                { class: "stat-row-value" },
                vue.toDisplayString($data.memory.photoCount),
                1
                /* TEXT */
              ),
              vue.createElementVNode("text", { class: "stat-row-label" }, "张照片")
            ]),
            $data.memory.hasNote ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "stat-row-item"
            }, [
              vue.createElementVNode("text", { class: "stat-row-icon" }, "✏️"),
              vue.createElementVNode("text", { class: "stat-row-label" }, "有札记")
            ])) : vue.createCommentVNode("v-if", true),
            vue.createElementVNode("view", { class: "stat-row-item" }, [
              vue.createElementVNode(
                "text",
                { class: "stat-row-label" },
                vue.toDisplayString($options.formatDate($data.memory.createdAt)),
                1
                /* TEXT */
              )
            ])
          ]),
          $data.memory.description ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 0,
            class: "description-section"
          }, [
            vue.createElementVNode(
              "text",
              { class: "description-text" },
              vue.toDisplayString($data.memory.description),
              1
              /* TEXT */
            )
          ])) : vue.createCommentVNode("v-if", true),
          $data.memory.hasNote || $data.showNoteEditor ? (vue.openBlock(), vue.createElementBlock("view", {
            key: 1,
            class: "note-section"
          }, [
            vue.createElementVNode("view", { class: "note-header" }, [
              vue.createElementVNode("text", { class: "note-title" }, "旅行札记"),
              $data.memory.hasNote && !$data.showNoteEditor ? (vue.openBlock(), vue.createElementBlock("button", {
                key: 0,
                class: "note-edit-btn",
                onClick: _cache[2] || (_cache[2] = (...args) => $options.toggleNoteEditor && $options.toggleNoteEditor(...args))
              }, [
                vue.createElementVNode("text", { class: "edit-btn-text" }, "编辑")
              ])) : vue.createCommentVNode("v-if", true)
            ]),
            $data.memory.hasNote && !$data.showNoteEditor ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "note-content"
            }, [
              vue.createElementVNode(
                "text",
                { class: "note-text" },
                vue.toDisplayString($data.memory.travelNote),
                1
                /* TEXT */
              )
            ])) : vue.createCommentVNode("v-if", true),
            $data.showNoteEditor ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "note-editor"
            }, [
              vue.withDirectives(vue.createElementVNode(
                "textarea",
                {
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => $data.editingNote = $event),
                  class: "note-textarea",
                  placeholder: "记录您的旅行感受...",
                  "placeholder-class": "note-placeholder",
                  maxlength: 1e3,
                  "auto-height": true
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.editingNote]
              ]),
              vue.createElementVNode("view", { class: "note-actions" }, [
                vue.createElementVNode("button", {
                  class: "note-btn note-btn-cancel",
                  onClick: _cache[4] || (_cache[4] = (...args) => $options.cancelEditNote && $options.cancelEditNote(...args))
                }, [
                  vue.createElementVNode("text", { class: "btn-text" }, "取消")
                ]),
                vue.createElementVNode("button", {
                  class: "note-btn note-btn-save",
                  onClick: _cache[5] || (_cache[5] = (...args) => $options.saveNote && $options.saveNote(...args))
                }, [
                  vue.createElementVNode("text", { class: "btn-text" }, "保存")
                ])
              ])
            ])) : vue.createCommentVNode("v-if", true)
          ])) : vue.createCommentVNode("v-if", true),
          vue.createElementVNode("view", { class: "photos-section" }, [
            vue.createElementVNode("view", { class: "photos-header" }, [
              vue.createElementVNode(
                "text",
                { class: "photos-title" },
                "全部照片 (" + vue.toDisplayString($data.memory.photoCount) + ")",
                1
                /* TEXT */
              )
            ]),
            $data.photos.length > 0 ? (vue.openBlock(), vue.createElementBlock("view", {
              key: 0,
              class: "photos-grid"
            }, [
              (vue.openBlock(true), vue.createElementBlock(
                vue.Fragment,
                null,
                vue.renderList($data.photos, (photo, index) => {
                  return vue.openBlock(), vue.createElementBlock("view", {
                    key: photo.id,
                    class: "photo-grid-item",
                    onClick: ($event) => $options.previewPhoto(index)
                  }, [
                    vue.createElementVNode("image", {
                      class: "photo-grid-image",
                      src: photo.url,
                      mode: "aspectFill"
                    }, null, 8, ["src"]),
                    !photo.isCover ? (vue.openBlock(), vue.createElementBlock("button", {
                      key: 0,
                      class: "photo-delete-btn",
                      onClick: vue.withModifiers(($event) => $options.deletePhoto(photo.id), ["stop"])
                    }, [
                      vue.createElementVNode("text", { class: "delete-icon" }, "×")
                    ], 8, ["onClick"])) : vue.createCommentVNode("v-if", true)
                  ], 8, ["onClick"]);
                }),
                128
                /* KEYED_FRAGMENT */
              ))
            ])) : (vue.openBlock(), vue.createElementBlock("view", {
              key: 1,
              class: "empty-photos"
            }, [
              vue.createElementVNode("text", { class: "empty-photos-text" }, "暂无照片")
            ])),
            vue.createElementVNode("button", {
              class: "add-photos-btn",
              onClick: _cache[6] || (_cache[6] = (...args) => $options.handleAddPhotos && $options.handleAddPhotos(...args))
            }, [
              vue.createElementVNode("text", { class: "add-photos-icon" }, "+"),
              vue.createElementVNode("text", { class: "add-photos-text" }, "添加照片")
            ])
          ])
        ])) : $data.isLoading ? (vue.openBlock(), vue.createElementBlock("view", {
          key: 1,
          class: "loading-area"
        }, [
          vue.createElementVNode("text", { class: "loading-text" }, "加载中...")
        ])) : (vue.openBlock(), vue.createElementBlock("view", {
          key: 2,
          class: "error-area"
        }, [
          vue.createElementVNode("text", { class: "error-text" }, "回忆不存在"),
          vue.createElementVNode("button", {
            class: "error-btn",
            onClick: _cache[7] || (_cache[7] = (...args) => $options.handleBack && $options.handleBack(...args))
          }, [
            vue.createElementVNode("text", { class: "error-btn-text" }, "返回")
          ])
        ]))
      ]),
      $data.memory ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 0,
        class: "bottom-actions"
      }, [
        vue.createElementVNode("button", {
          class: "action-btn action-btn-secondary",
          onClick: _cache[8] || (_cache[8] = (...args) => $options.handleShare && $options.handleShare(...args))
        }, [
          vue.createElementVNode("text", { class: "action-btn-text" }, "分享")
        ]),
        vue.createElementVNode("button", {
          class: "action-btn action-btn-primary",
          onClick: _cache[9] || (_cache[9] = (...args) => $options.handleGenerateNote && $options.handleGenerateNote(...args)),
          disabled: $data.isGenerating
        }, [
          vue.createElementVNode(
            "text",
            { class: "action-btn-text" },
            vue.toDisplayString($data.isGenerating ? "生成中..." : "AI生成札记"),
            1
            /* TEXT */
          )
        ], 8, ["disabled"])
      ])) : vue.createCommentVNode("v-if", true),
      $data.showOptionsModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 1,
        class: "modal-overlay",
        onClick: _cache[14] || (_cache[14] = (...args) => $options.closeOptionsModal && $options.closeOptionsModal(...args))
      }, [
        vue.createElementVNode("view", {
          class: "options-modal",
          onClick: _cache[13] || (_cache[13] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("button", {
            class: "option-item",
            onClick: _cache[10] || (_cache[10] = (...args) => $options.handleEdit && $options.handleEdit(...args))
          }, [
            vue.createElementVNode("text", { class: "option-text" }, "编辑回忆")
          ]),
          vue.createElementVNode("button", {
            class: "option-item",
            onClick: _cache[11] || (_cache[11] = (...args) => $options.handleDelete && $options.handleDelete(...args))
          }, [
            vue.createElementVNode("text", { class: "option-text option-text-danger" }, "删除回忆")
          ]),
          vue.createElementVNode("button", {
            class: "option-item option-item-cancel",
            onClick: _cache[12] || (_cache[12] = (...args) => $options.closeOptionsModal && $options.closeOptionsModal(...args))
          }, [
            vue.createElementVNode("text", { class: "option-text" }, "取消")
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true),
      $data.showEditModal ? (vue.openBlock(), vue.createElementBlock("view", {
        key: 2,
        class: "modal-overlay",
        onClick: _cache[22] || (_cache[22] = (...args) => $options.closeEditModal && $options.closeEditModal(...args))
      }, [
        vue.createElementVNode("view", {
          class: "modal-content",
          onClick: _cache[21] || (_cache[21] = vue.withModifiers(() => {
          }, ["stop"]))
        }, [
          vue.createElementVNode("view", { class: "modal-header" }, [
            vue.createElementVNode("text", { class: "modal-title" }, "编辑回忆"),
            vue.createElementVNode("button", {
              class: "modal-close",
              onClick: _cache[15] || (_cache[15] = (...args) => $options.closeEditModal && $options.closeEditModal(...args))
            }, [
              vue.createElementVNode("text", { class: "close-icon" }, "✕")
            ])
          ]),
          vue.createElementVNode("view", { class: "modal-form" }, [
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.createElementVNode("text", { class: "form-label" }, "回忆标题"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => $data.editingMemory.title = $event),
                  class: "form-input",
                  placeholder: "例如：周末在京都",
                  "placeholder-class": "form-placeholder"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.editingMemory.title]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.createElementVNode("text", { class: "form-label" }, "地点"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => $data.editingMemory.location = $event),
                  class: "form-input",
                  placeholder: "例如：京都，日本",
                  "placeholder-class": "form-placeholder"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.editingMemory.location]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.createElementVNode("text", { class: "form-label" }, "时间"),
              vue.withDirectives(vue.createElementVNode(
                "input",
                {
                  "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => $data.editingMemory.date = $event),
                  class: "form-input",
                  placeholder: "例如：2023年10月",
                  "placeholder-class": "form-placeholder"
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.editingMemory.date]
              ])
            ]),
            vue.createElementVNode("view", { class: "form-group" }, [
              vue.createElementVNode("text", { class: "form-label" }, "描述"),
              vue.withDirectives(vue.createElementVNode(
                "textarea",
                {
                  "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => $data.editingMemory.description = $event),
                  class: "form-textarea",
                  placeholder: "描述这段回忆...",
                  "placeholder-class": "form-placeholder",
                  maxlength: 200,
                  "auto-height": true
                },
                null,
                512
                /* NEED_PATCH */
              ), [
                [vue.vModelText, $data.editingMemory.description]
              ])
            ]),
            vue.createElementVNode("button", {
              class: "form-submit",
              onClick: _cache[20] || (_cache[20] = (...args) => $options.saveEditMemory && $options.saveEditMemory(...args))
            }, [
              vue.createElementVNode("text", { class: "submit-text" }, "保存")
            ])
          ])
        ])
      ])) : vue.createCommentVNode("v-if", true)
    ]);
  }
  const PagesAlbumMemoryDetail = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-778cbcf1"], ["__file", "D:/2026_all_Favio/AI_exploring/personal/WanderAI/pages/album/memory-detail.vue"]]);
  __definePage("pages/splash/splash", PagesSplashSplash);
  __definePage("pages/chat/chat", PagesChatChat);
  __definePage("pages/explore/explore", PagesExploreExplore);
  __definePage("pages/album/album", PagesAlbumAlbum);
  __definePage("pages/profile/profile", PagesProfileProfile);
  __definePage("pages/itinerary/itinerary", PagesItineraryItinerary);
  __definePage("pages/favorites/favorites", PagesFavoritesFavorites);
  __definePage("pages/orders/orders", PagesOrdersOrders);
  __definePage("pages/settings/settings", PagesSettingsSettings);
  __definePage("pages/destination/destination", PagesDestinationDestination);
  __definePage("pages/album/memory-detail", PagesAlbumMemoryDetail);
  const _sfc_main = {
    data() {
      return {
        currentTheme: "light",
        // 系统信息，用于安全区适配
        systemInfo: {
          statusBarHeight: 0,
          windowHeight: 0,
          windowWidth: 0,
          pixelRatio: 1,
          platform: "",
          safeArea: { top: 0, right: 0, bottom: 0, left: 0 }
        }
      };
    },
    onLaunch: function() {
      formatAppLog("log", "at App.vue:20", "WanderAI App Launch");
      const themeId = getCurrentTheme();
      this.currentTheme = themeId;
      applyTheme(themeId);
      this.getSystemInfo();
    },
    onShow: function() {
      formatAppLog("log", "at App.vue:30", "App Show");
    },
    onHide: function() {
      formatAppLog("log", "at App.vue:33", "App Hide");
    },
    methods: {
      /**
       * 获取系统信息，用于安全区适配
       * Android App 适配：获取状态栏高度、安全区域等
       */
      getSystemInfo() {
        try {
          const systemInfo = uni.getSystemInfoSync();
          this.systemInfo = {
            statusBarHeight: systemInfo.statusBarHeight || 0,
            windowHeight: systemInfo.windowHeight || 0,
            windowWidth: systemInfo.windowWidth || 0,
            pixelRatio: systemInfo.pixelRatio || 1,
            platform: systemInfo.platform || "",
            safeArea: systemInfo.safeArea || { top: 0, right: 0, bottom: 0, left: 0 }
          };
          uni.$emit("systemInfoReady", this.systemInfo);
          formatAppLog("log", "at App.vue:53", "[App] 系统信息:", this.systemInfo);
        } catch (e) {
          formatAppLog("error", "at App.vue:55", "[App] 获取系统信息失败:", e);
        }
      }
    }
  };
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    return vue.openBlock(), vue.createElementBlock("view", {
      class: "app-wrapper",
      "data-theme": $data.currentTheme
    }, [
      vue.renderSlot(_ctx.$slots, "default")
    ], 8, ["data-theme"]);
  }
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__file", "D:/2026_all_Favio/AI_exploring/personal/WanderAI/App.vue"]]);
  function createApp() {
    const app = vue.createVueApp(App);
    return {
      app
    };
  }
  const { app: __app__, Vuex: __Vuex__, Pinia: __Pinia__ } = createApp();
  uni.Vuex = __Vuex__;
  uni.Pinia = __Pinia__;
  __app__.provide("__globalStyles", __uniConfig.styles);
  __app__._component.mpType = "app";
  __app__._component.render = () => {
  };
  __app__.mount("#app");
})(Vue);
