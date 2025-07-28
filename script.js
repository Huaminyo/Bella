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
                    chatInterface.addMessage('assistant', 'Sorry, I’m a little confused. Please try again later...');
                }
            };
        }

        micButton.disabled = false;
        transcriptDiv.textContent = 'Bella is ready. Tap the microphone to start.';

    } catch (error) {
        console.error('Failed to initialize Bella AI:', error);
        transcriptDiv.textContent = 'AI model failed to load, but chat is still available.';

        if (chatInterface) {
            chatInterface.onMessageSend = async (message) => {
                chatInterface.showTypingIndicator();
                setTimeout(() => {
                    chatInterface.hideTypingIndicator();
                    const fallback = [
                        'My AI brain is still loading...',
                        'Sorry, I can’t think clearly right now!',
                        'Booting up... please wait.',
                        'System updating. Please try again later.'
                    ];
                    const reply = fallback[Math.floor(Math.random() * fallback.length)];
                    chatInterface.addMessage('assistant', reply);
                }, 1000);
            };
        }

        micButton.disabled = true;
    }

    // Hide loading screen
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            const panel = document.querySelector('.chat-control-panel');
            if (panel) panel.classList.add('visible');
        }, 500);
    }, 1500);

    let activeVideo = video1;
    let inactiveVideo = video2;

    const videoList = [
        'videos/pose1.mp4',
        'videos/cheer1.mp4',
        'videos/dance1.mp4',
        'videos/pose2.mp4',
        'videos/angry1.mp4'
    ];

    function switchVideo() {
        const currentSrc = activeVideo.querySelector('source').getAttribute('src');
        let nextSrc = currentSrc;
        while (nextSrc === currentSrc) {
            const idx = Math.floor(Math.random() * videoList.length);
            nextSrc = videoList[idx];
        }

        inactiveVideo.querySelector('source').setAttribute('src', nextSrc);
        inactiveVideo.load();

        inactiveVideo.addEventListener('canplaythrough', function onReady() {
            inactiveVideo.removeEventListener('canplaythrough', onReady);
            inactiveVideo.play().catch(err => console.error("Video play failed:", err));
            activeVideo.classList.remove('active');
            inactiveVideo.classList.add('active');
            [activeVideo, inactiveVideo] = [inactiveVideo, activeVideo];
            activeVideo.addEventListener('ended', switchVideo, { once: true });
        }, { once: true });
    }

    activeVideo.addEventListener('ended', switchVideo, { once: true });

    // Chat button logic
    const chatToggleBtn = document.getElementById('chat-toggle-btn');
    const chatTestBtn = document.getElementById('chat-test-btn');

    if (chatToggleBtn) {
        chatToggleBtn.addEventListener('click', () => {
            if (chatInterface) {
                chatInterface.toggle();
                const visible = chatInterface.getVisibility();
                chatToggleBtn.innerHTML = visible
                    ? '<i class="fas fa-times"></i><span>Close</span>'
                    : '<i class="fas fa-comments"></i><span>Chat</span>';
            }
        });
    }

    if (chatTestBtn) {
        chatTestBtn.addEventListener('click', () => {
            if (chatInterface) {
                const testMessages = [
                    'Hi! I’m Bella, nice to meet you!',
                    'The chat interface is working!',
                    'Test message sent successfully.'
                ];
                const msg = testMessages[Math.floor(Math.random() * testMessages.length)];
                chatInterface.addMessage('assistant', msg);
                if (!chatInterface.getVisibility()) {
                    chatInterface.show();
                    chatToggleBtn.innerHTML = '<i class="fas fa-times"></i><span>Close</span>';
                }
            }
        });
    }

    // Voice recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let recognition;

    if (SpeechRecognition) {
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.lang = 'en-US';
        recognition.interimResults = true;

        recognition.onresult = async (event) => {
            const transcriptContainer = document.getElementById('transcript');
            let finalText = '';
            let interimText = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalText += event.results[i][0].transcript;
                } else {
                    interimText += event.results[i][0].transcript;
                }
            }

            transcriptContainer.textContent = `You: ${finalText || interimText}`;

            if (finalText && bellaAI) {
                const userText = finalText.trim();
                transcriptContainer.textContent = `You: ${userText}`;

                if (chatInterface && chatInterface.getVisibility()) {
                    chatInterface.addMessage('user', userText);
                }

                try {
                    const thinking = document.createElement('p');
                    thinking.textContent = 'Bella is thinking...';
                    thinking.style.color = '#888';
                    thinking.style.fontStyle = 'italic';
                    transcriptContainer.appendChild(thinking);

                    const response = await bellaAI.think(userText);
                    transcriptContainer.removeChild(thinking);

                    const reply = document.createElement('p');
                    reply.textContent = `Bella: ${response}`;
                    reply.style.color = '#ff6b9d';
                    reply.style.fontWeight = 'bold';
                    reply.style.marginTop = '10px';
                    transcriptContainer.appendChild(reply);

                    if (chatInterface && chatInterface.getVisibility()) {
                        chatInterface.addMessage('assistant', response);
                    }

                } catch (error) {
                    console.error('Bella AI processing error:', error);
                    const errMsg = document.createElement('p');
                    errMsg.textContent = 'Bella is having trouble thinking...';
                    errMsg.style.color = '#ff9999';
                    transcriptContainer.appendChild(errMsg);

                    if (chatInterface && chatInterface.getVisibility()) {
                        chatInterface.addMessage('assistant', errMsg.textContent);
                    }
                }
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
        };

    } else {
        console.warn('Speech recognition not supported by this browser.');
    }

    // Mic button
    let isListening = false;

    micButton.addEventListener('click', () => {
        if (!SpeechRecognition) return;

        isListening = !isListening;
        micButton.classList.toggle('is-listening', isListening);
        const transcriptContainer = document.querySelector('.transcript-container');
        const transcriptText = document.getElementById('transcript');

        if (isListening) {
            transcriptText.textContent = 'Listening...';
            transcriptContainer.classList.add('visible');
            recognition.start();
        } else {
            recognition.stop();
            transcriptContainer.classList.remove('visible');
            transcriptText.textContent = '';
        }
    });
});
