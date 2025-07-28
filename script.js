// script.js - Bella AI App (English Version)
import { BellaAI } from './core.js';
import { ChatInterface } from './chatInterface.js';

document.addEventListener('DOMContentLoaded', async function () {
    const transcriptDiv = document.getElementById('transcript');
    const loadingScreen = document.getElementById('loading-screen');
    const video1 = document.getElementById('video1');
    const video2 = document.getElementById('video2');
    const micButton = document.getElementById('mic-button');

    let bellaAI;
    let chatInterface;

    try {
        chatInterface = new ChatInterface();
        console.log('Chat interface initialized.');
        setTimeout(() => {
            chatInterface.show();
            console.log('Chat interface auto-shown.');
        }, 2000);
    } catch (error) {
        console.error('Failed to initialize chat interface:', error);
    }

    micButton.disabled = true;
    transcriptDiv.textContent = 'Waking up Bella...';

    try {
        bellaAI = await BellaAI.getInstance();
        console.log('Bella AI initialized.');

        if (chatInterface) {
            chatInterface.onMessageSend = async (message) => {
                try {
                    chatInterface.showTypingIndicator();
                    const response = await bellaAI.think(message);
                    chatInterface.hideTypingIndicator();
                    chatInterface.addMessage('assistant', response);
                } catch (error) {
                    console.error('AI error:', error);
                    chatInterface.hideTypingIndicator();
                    chatInterface.addMessage('assistant', 'Sorry, I'm a bit confused. Please try again later.');
                }
            };
        }

        micButton.disabled = false;
        transcriptDiv.textContent = 'Bella is ready. Tap the mic to start talking.';

    } catch (error) {
        console.error('Failed to initialize Bella AI:', error);
        transcriptDiv.textContent = 'AI model failed to load. Basic chat still available.';

        if (chatInterface) {
            chatInterface.onMessageSend = async (message) => {
                chatInterface.showTypingIndicator();
                setTimeout(() => {
                    chatInterface.hideTypingIndicator();
                    const fallbackResponses = [
                        'Bella is still warming up. Try again shortly...',
                        'Sorry, my brain is loading. Hang tight!',
                        'Still booting up. I'll be ready soon!',
                        'System update in progress. Please try again later.'
                    ];
                    const response = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
                    chatInterface.addMessage('assistant', response);
                }, 1000);
            };
        }

        micButton.disabled = true;
    }

    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            const chatPanel = document.querySelector('.chat-control-panel');
            if (chatPanel) chatPanel.classList.add('visible');
        }, 500);
    }, 1500);

    let activeVideo = video1;
    let inactiveVideo = video2;

    const videoList = [
        'video/3d-modeling.mp4',
        'video/smile-shake.mp4',
        'video/pose-smile.mp4',
        'video/encourage.mp4',
        'video/dance.mp4',
        'video/angry-talking.mp4'
    ];

    function switchVideo() {
        const currentSrc = activeVideo.querySelector('source').getAttribute('src');
        let nextSrc = currentSrc;
        while (nextSrc === currentSrc) {
            const i = Math.floor(Math.random() * videoList.length);
            nextSrc = videoList[i];
        }
        inactiveVideo.querySelector('source').setAttribute('src', nextSrc);
        inactiveVideo.load();

        inactiveVideo.addEventListener('canplaythrough', function handler() {
            inactiveVideo.removeEventListener('canplaythrough', handler);
            inactiveVideo.play().catch(e => console.error('Video play error:', e));
            activeVideo.classList.remove('active');
            inactiveVideo.classList.add('active');
            [activeVideo, inactiveVideo] = [inactiveVideo, activeVideo];
            activeVideo.addEventListener('ended', switchVideo, { once: true });
        }, { once: true });
    }

    activeVideo.addEventListener('ended', switchVideo, { once: true });

    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatTestBtn = document.getElementById('chat-test-btn');

    if (chatToggleBtn) {
        chatToggleBtn.addEventListener('click', () => {
            if (chatInterface) {
                chatInterface.toggle();
                const isVisible = chatInterface.getVisibility();
                chatToggleBtn.innerHTML = isVisible ?
                    '<i class="fas fa-times"></i><span>Close</span>' :
                    '<i class="fas fa-comments"></i><span>Chat</span>';
            }
        });
    }

    if (chatTestBtn) {
        chatTestBtn.addEventListener('click', () => {
            if (chatInterface) {
                const testMsgs = [
                    'Hello! I'm Bella. Nice to meet you!',
                    'Chat interface ready and running.',
                    'This is a test message for UI check.'
                ];
                const msg = testMsgs[Math.floor(Math.random() * testMsgs.length)];
                chatInterface.addMessage('assistant', msg);
                if (!chatInterface.getVisibility()) {
                    chatInterface.show();
                    chatToggleBtn.innerHTML = '<i class="fas fa-times"></i><span>Close</span>';
                }
            }
        });
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'en-US';
        recognition.interimResults = true;

        recognition.onresult = async (event) => {
            const container = document.getElementById('transcript');
            let finalText = '', interimText = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) finalText += event.results[i][0].transcript;
                else interimText += event.results[i][0].transcript;
            }

            container.textContent = `You: ${finalText || interimText}`;

            if (finalText && bellaAI) {
                const userText = finalText.trim();
                container.textContent = `You: ${userText}`;
                if (chatInterface?.getVisibility()) chatInterface.addMessage('user', userText);

                try {
                    const thinking = document.createElement('p');
                    thinking.textContent = 'Bella is thinking...';
                    thinking.style.color = '#888';
                    thinking.style.fontStyle = 'italic';
                    container.appendChild(thinking);

                    const response = await bellaAI.think(userText);
                    container.removeChild(thinking);
                    const reply = document.createElement('p');
                    reply.textContent = `Bella: ${response}`;
                    reply.style.color = '#ff6b9d';
                    reply.style.fontWeight = 'bold';
                    reply.style.marginTop = '10px';
                    container.appendChild(reply);

                    if (chatInterface?.getVisibility()) chatInterface.addMessage('assistant', response);

                } catch (error) {
                    console.error('AI processing error:', error);
                    const err = document.createElement('p');
                    err.textContent = 'Bella is having trouble responding...';
                    err.style.color = '#ff9999';
                    container.appendChild(err);
                    if (chatInterface?.getVisibility()) chatInterface.addMessage('assistant', err.textContent);
                }
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };

    } else {
        console.log('Speech recognition not supported.');
    }

    let isListening = false;
    micButton.addEventListener('click', function () {
        if (!SpeechRecognition) return;

        isListening = !isListening;
        micButton.classList.toggle('is-listening', isListening);
        const container = document.querySelector('.transcript-container');
        const text = document.getElementById('transcript');

        if (isListening) {
            text.textContent = 'Listening...';
            container.classList.add('visible');
            recognition.start();
        } else {
            recognition.stop();
            container.classList.remove('visible');
            text.textContent = '';
        }
    });

});
