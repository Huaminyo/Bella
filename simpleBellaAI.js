// simpleBellaAI.js - 简化版贝拉AI，专门用于测试聊天界面
// 移除了复杂的模块依赖，专注于聊天功能

class SimpleBellaAI {
    static instance = null;

    static async getInstance() {
        if (this.instance === null) {
            this.instance = new SimpleBellaAI();
            await this.instance.init();
        }
        return this.instance;
    }

    constructor() {
        this.currentMode = 'casual'; // 聊天模式：casual, assistant, creative
        this.isInitialized = false;
    }

    async init() {
        try {
            console.log('初始化简化版贝拉AI...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.isInitialized = true;
            console.log('简化版贝拉AI初始化完成');
        } catch (error) {
            console.error('简化版贝拉AI初始化失败:', error);
            throw error;
        }
    }

    async think(prompt) {
        try {
            console.log('贝拉正在思考:', prompt);
            await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
            
            const response = this.generateResponse(prompt);
            this.speak(response); // 让贝拉说话
            return response;

        } catch (error) {
            console.error('思考过程中出现错误:', error);
            return this.getErrorResponse();
        }
    }

    generateResponse(prompt) {
        const responses = {
            casual: [
                `哈哈，你说的"${prompt}"真有趣！我觉得这个话题很棒呢～`,
                `关于"${prompt}"，我想说这真的很有意思！你还想聊什么吗？`,
                `嗯嗯，"${prompt}"让我想到了很多呢！我们继续聊下去吧～`,
                `哇，"${prompt}"这个话题我喜欢！你的想法总是那么特别～`,
                `听你说"${prompt}"，我感觉心情都变好了！继续和我分享吧～`
            ],
            assistant: [
                `关于"${prompt}"，我来为您提供一些有用的信息和建议。`,
                `针对"${prompt}"这个问题，我建议您可以从以下几个方面考虑。`,
                `"${prompt}"是一个很好的问题，让我来帮您分析一下。`,
                `基于"${prompt}"，我可以为您提供以下专业建议。`,
                `关于"${prompt}"，我整理了一些相关信息供您参考。`
            ],
            creative: [
                `哇！"${prompt}"让我的创意火花瞬间点燃！让我们一起想象一下...`,
                `"${prompt}"真是个充满想象力的话题！我脑海中浮现出无数奇妙的画面～`,
                `听到"${prompt}"，我仿佛看到了一个全新的世界！让我们一起探索吧～`,
                `"${prompt}"激发了我的灵感！我想到了一个超级有趣的创意...`,
                `哇塞！"${prompt}"让我的想象力飞起来了！我们来创造点什么特别的吧～`
            ]
        };

        const modeResponses = responses[this.currentMode] || responses.casual;
        const randomResponse = modeResponses[Math.floor(Math.random() * modeResponses.length)];
        
        return randomResponse;
    }

    getErrorResponse() {
        const errorResponses = [
            "抱歉，我现在有点困惑，让我重新整理一下思路...",
            "嗯...我需要再想想，请稍等一下。",
            "我的思绪有点乱，给我一点时间整理一下。",
            "让我重新组织一下语言，稍等片刻。",
            "哎呀，我刚才走神了，你能再说一遍吗？"
        ];
        
        return errorResponses[Math.floor(Math.random() * errorResponses.length)];
    }

    // 🗣️ 让贝拉说话（语音合成）
    speak(text) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN'; // Ganti ke 'en-US' atau 'id-ID' sesuai preferensi
            utterance.pitch = 1;
            utterance.rate = 1;
            utterance.volume = 1;
            speechSynthesis.speak(utterance);
        } else {
            console.warn('此浏览器不支持语音合成');
        }
    }

    setChatMode(mode) {
        if (['casual', 'assistant', 'creative'].includes(mode)) {
            this.currentMode = mode;
            console.log(`聊天模式已切换为: ${mode}`);
            return true;
        }
        return false;
    }

    getCurrentConfig() {
        return {
            useCloudAPI: false,
            provider: { name: 'simple', model: 'SimpleBellaAI' },
            mode: this.currentMode,
            isConfigured: true,
            isInitialized: this.isInitialized
        };
    }

    clearHistory() {
        console.log('对话历史已清除');
    }
}

// 导出全局对象
window.SimpleBellaAI = SimpleBellaAI;
window.BellaAI = SimpleBellaAI;

console.log('SimpleBellaAI 已加载完成');
