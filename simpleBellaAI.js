// simpleBellaAI.js - Simplified English-only Bella AI for chat interface testing

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
        this.currentMode = 'casual'; // Modes: casual, assistant, creative
        this.isInitialized = false;
    }

    async init() {
        try {
            console.log('Initializing simplified Bella AI...');
            await new Promise(resolve => setTimeout(resolve, 1000));
            this.isInitialized = true;
            console.log('Simplified Bella AI initialized');
        } catch (error) {
            console.error('Initialization failed:', error);
            throw error;
        }
    }

    async think(prompt) {
        try {
            console.log('Bella is thinking about:', prompt);
            await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
            return this.generateResponse(prompt);
        } catch (error) {
            console.error('Error while thinking:', error);
            return this.getErrorResponse();
        }
    }

    generateResponse(prompt) {
        const responses = {
            casual: [
                `Haha, what you said about "${prompt}" is really interesting! Let's talk more about it.`,
                `"${prompt}" sounds fun! Do you want to tell me more?`,
                `Hmm, "${prompt}" made me think of many things! Let's keep chatting.`,
                `Wow, I like the topic "${prompt}"! You always have such cool ideas.`,
                `Hearing you say "${prompt}" just made my day better. Tell me more!`
            ],
            assistant: [
                `Regarding "${prompt}", here's some useful information.`,
                `For the topic "${prompt}", I suggest considering the following.`,
                `"${prompt}" is a great question, let me break it down for you.`,
                `Based on "${prompt}", here's some advice.`,
                `Here’s what I found about "${prompt}".`
            ],
            creative: [
                `Wow! "${prompt}" sparked my imagination. Let’s create something together!`,
                `"${prompt}" is such an imaginative idea! I’m picturing it right now!`,
                `Just hearing "${prompt}" opens a new world! Let’s explore it!`,
                `"${prompt}" gave me an amazing idea... want to hear it?`,
                `Wooo! "${prompt}" makes my brain fly! Let's get creative!`
            ]
        };

        const modeResponses = responses[this.currentMode] || responses.casual;
        return modeResponses[Math.floor(Math.random() * modeResponses.length)];
    }

    getErrorResponse() {
        const errorResponses = [
            "Sorry, I'm a bit confused right now... let me gather my thoughts.",
            "Hmm... I need a moment to think about that.",
            "My mind is all over the place—give me a second.",
            "Let me rephrase that, just a sec.",
            "Oops! I got distracted. Can you say that again?"
        ];

        return errorResponses[Math.floor(Math.random() * errorResponses.length)];
    }

    setChatMode(mode) {
        if (['casual', 'assistant', 'creative'].includes(mode)) {
            this.currentMode = mode;
            console.log(`Chat mode changed to: ${mode}`);
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
        console.log('Conversation history cleared');
    }
}

window.SimpleBellaAI = SimpleBellaAI;
window.BellaAI = SimpleBellaAI;

console.log('SimpleBellaAI English-only version loaded');
