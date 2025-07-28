// chatInterface.js - Bella's Chat Interface Component
// This module creates and manages the elegant chat interface reflecting Bella's warm personality

class ChatInterface {
    constructor() {
        this.isVisible = false;
        this.messages = [];
        this.maxMessages = 50; // Maximum 50 messages
        this.chatContainer = null;
        this.messageContainer = null;
        this.inputContainer = null;
        this.messageInput = null;
        this.sendButton = null;
        this.toggleButton = null;
        this.settingsPanel = null;
        this.isSettingsVisible = false;

        this.init();
    }

    // Initialize the chat interface
    init() {
        this.createChatContainer();
        this.createToggleButton();
        this.createSettingsPanel();
        this.bindEvents();
        this.addWelcomeMessage();
    }

    createChatContainer() {
        this.chatContainer = document.createElement('div');
        this.chatContainer.className = 'bella-chat-container';
        this.chatContainer.innerHTML = `
            <div class="bella-chat-header">
                <div class="bella-chat-title">
                    <div class="bella-avatar">💝</div>
                    <div class="bella-title-text">
                        <h3>Bella</h3>
                        <span class="bella-status">Online</span>
                    </div>
                </div>
                <div class="bella-chat-controls">
                    <button class="bella-settings-btn" title="Settings">
                        <i class="fas fa-cog"></i>
                    </button>
                    <button class="bella-minimize-btn" title="Minimize">
                        <i class="fas fa-minus"></i>
                    </button>
                </div>
            </div>
            <div class="bella-chat-messages"></div>
            <div class="bella-chat-input-container">
                <div class="bella-input-wrapper">
                    <input type="text" class="bella-message-input" placeholder="Say something to Bella..." maxlength="500">
                    <button class="bella-send-btn" title="Send">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                <div class="bella-input-hint">
                    Press Enter to send, Shift + Enter for newline
                </div>
            </div>
        `;

        this.messageContainer = this.chatContainer.querySelector('.bella-chat-messages');
        this.inputContainer = this.chatContainer.querySelector('.bella-chat-input-container');
        this.messageInput = this.chatContainer.querySelector('.bella-message-input');
        this.sendButton = this.chatContainer.querySelector('.bella-send-btn');

        document.body.appendChild(this.chatContainer);
    }

    createToggleButton() {
        this.toggleButton = document.createElement('button');
        this.toggleButton.className = 'bella-chat-toggle';
        this.toggleButton.innerHTML = `
            <div class="bella-toggle-icon">
                <i class="fas fa-comments"></i>
            </div>
            <div class="bella-toggle-text">Chat with Bella</div>
        `;
        this.toggleButton.title = 'Open Chat Window';

        document.body.appendChild(this.toggleButton);
    }

    createSettingsPanel() {
        this.settingsPanel = document.createElement('div');
        this.settingsPanel.className = 'bella-settings-panel';
        this.settingsPanel.innerHTML = `
            <div class="bella-settings-header">
                <h4>Chat Settings</h4>
                <button class="bella-settings-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="bella-settings-content">
                <div class="bella-setting-group">
                    <label>AI Provider</label>
                    <select class="bella-provider-select">
                        <option value="local">Local Model</option>
                        <option value="openai">OpenAI GPT</option>
                        <option value="qwen">Qwen</option>
                        <option value="ernie">ERNIE</option>
                        <option value="glm">GLM</option>
                    </select>
                </div>
                <div class="bella-setting-group bella-api-key-group" style="display: none;">
                    <label>API Key</label>
                    <input type="password" class="bella-api-key-input" placeholder="Enter your API key">
                    <button class="bella-api-key-save">Save</button>
                </div>
                <div class="bella-setting-group">
                    <label>Chat Mode</label>
                    <select class="bella-mode-select">
                        <option value="casual">Casual Chat</option>
                        <option value="assistant">Assistant</option>
                        <option value="creative">Creative</option>
                    </select>
                </div>
                <div class="bella-setting-group">
                    <button class="bella-clear-history">Clear Chat History</button>
                </div>
            </div>
        `;

        document.body.appendChild(this.settingsPanel);
    }

    // Remaining methods (bindEvents, sendMessage, addMessage, etc.) remain unchanged.
    // Replace any Chinese text or comments in the rest of the file similarly.
}

export { ChatInterface };
