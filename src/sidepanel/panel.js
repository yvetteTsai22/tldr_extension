// DOM Elements
const summaryElement = document.getElementById('summary');
const chatMessages = document.getElementById('chat-messages');
const questionInput = document.getElementById('question-input');
const askButton = document.getElementById('ask-button');

// Initialize the side panel
function initialize() {
    // Request content from the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_CONTENT' }, (response) => {
            if (response && response.content) {
                // Send content for analysis
                chrome.runtime.sendMessage({
                    type: 'ANALYZE_CONTENT',
                    content: response.content
                });
            }
        });
    });
}

// Handle incoming messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'CONTENT_ANALYZED') {
        summaryElement.textContent = message.summary;
    }
});

// Handle ask button click
askButton.addEventListener('click', async () => {
    const question = questionInput.value.trim();
    if (!question) return;

    // Add user question to chat
    addMessageToChat('user', question);
    questionInput.value = '';

    try {
        // Get current tab content
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        const response = await chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_CONTENT' });
        
        if (response && response.content) {
            // Send question to background script
            chrome.runtime.sendMessage({
                type: 'ASK_QUESTION',
                question: question,
                content: response.content
            }, (answer) => {
                if (answer) {
                    addMessageToChat('assistant', answer);
                }
            });
        }
    } catch (error) {
        console.error('Error asking question:', error);
        addMessageToChat('error', 'Sorry, I encountered an error while processing your question.');
    }
});

// Add message to chat
function addMessageToChat(role, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initialize when the panel loads
document.addEventListener('DOMContentLoaded', initialize); 