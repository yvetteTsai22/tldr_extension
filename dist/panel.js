/******/ (() => { // webpackBootstrap
/*!********************************!*\
  !*** ./src/sidepanel/panel.js ***!
  \********************************/
// DOM Elements
const summaryElement = document.getElementById('summary');
const chatMessages = document.getElementById('chat-messages');
const questionInput = document.getElementById('question-input');
const askButton = document.getElementById('ask-button');

// Section headers and content
const summaryHeader = document.getElementById('summary-header');
const summaryContent = document.getElementById('summary-content');
const chatHeader = document.getElementById('chat-header');
const chatContent = document.getElementById('chat-content');

// Debug logging
function debugLog(message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = data ? `${timestamp} - ${message}: ${JSON.stringify(data)}` : `${timestamp} - ${message}`;
    console.log(logMessage);
}

// Initialize the side panel
function initialize() {
    debugLog('Initializing side panel');
    
    // Set up section toggles
    setupSectionToggle(summaryHeader, summaryContent);
    setupSectionToggle(chatHeader, chatContent);

    // Set up summary generation
    summaryHeader.addEventListener('click', generateSummary);
    
    debugLog('Side panel initialized');
}

// Set up section toggle functionality
function setupSectionToggle(header, content) {
    header.addEventListener('click', () => {
        const isActive = content.classList.contains('active');
        debugLog(`Toggling section: ${header.querySelector('h2').textContent}`, { isActive: !isActive });
        content.classList.toggle('active');
        header.querySelector('.toggle-icon').classList.toggle('active');
    });
}

// Inject content script into the current tab
async function injectContentScript(tabId) {
    debugLog('Injecting content script', { tabId });
    try {
        await chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['main.js']
        });
        debugLog('Content script injected successfully');
        return true;
    } catch (error) {
        console.error('Error injecting content script:', error);
        debugLog('Content script injection error', error);
        return false;
    }
}

// Generate summary when section is clicked
async function generateSummary() {
    if (summaryElement.textContent === 'Click to generate summary...') {
        debugLog('Generating summary');
        summaryElement.textContent = 'Generating summary...';
        
        try {
            // Get current tab
            const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            debugLog('Current tab', tabs[0]);
            
            if (!tabs[0]) {
                throw new Error('No active tab found');
            }

            // Inject content script if not already injected
            const injected = await injectContentScript(tabs[0].id);
            if (!injected) {
                throw new Error('Failed to inject content script');
            }

            // Wait a moment for the script to initialize
            await new Promise(resolve => setTimeout(resolve, 100));

            // Get content from the page
            const response = await chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_CONTENT' });
            debugLog('Content response', response);
            
            if (!response || !response.content) {
                throw new Error('Could not get page content');
            }

            // Send content for analysis
            debugLog('Sending content for analysis');
            chrome.runtime.sendMessage({
                type: 'ANALYZE_CONTENT',
                content: response.content
            });
        } catch (error) {
            console.error('Error generating summary:', error);
            debugLog('Summary generation error', error);
            summaryElement.textContent = 'Error: Could not generate summary. Please try again.';
        }
    }
}

// Handle incoming messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    debugLog('Received message', message);
    
    if (message.type === 'CONTENT_ANALYZED') {
        debugLog('Updating summary with analyzed content');
        summaryElement.textContent = message.summary;
    }
});

// Handle ask button click
askButton.addEventListener('click', async () => {
    const question = questionInput.value.trim();
    if (!question) return;

    debugLog('Processing question', question);

    // Add user question to chat
    addMessageToChat('user', question);
    questionInput.value = '';
    questionInput.disabled = true;
    askButton.disabled = true;

    try {
        // Get current tab
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        debugLog('Current tab for question', tabs[0]);
        
        if (!tabs[0]) {
            throw new Error('No active tab found');
        }

        // Inject content script if not already injected
        const injected = await injectContentScript(tabs[0].id);
        if (!injected) {
            throw new Error('Failed to inject content script');
        }

        // Wait a moment for the script to initialize
        await new Promise(resolve => setTimeout(resolve, 100));

        const response = await chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_CONTENT' });
        debugLog('Content response for question', response);
        
        if (!response || !response.content) {
            throw new Error('Could not get page content');
        }

        // Send question to background script
        debugLog('Sending question to background script');
        chrome.runtime.sendMessage({
            type: 'ASK_QUESTION',
            question: question,
            content: response.content
        }, (answer) => {
            debugLog('Received answer', answer);
            
            if (answer.error) {
                addMessageToChat('error', answer.error);
            } else if (answer.answer) {
                addMessageToChat('assistant', answer.answer);
            }
            questionInput.disabled = false;
            askButton.disabled = false;
            questionInput.focus();
        });
    } catch (error) {
        console.error('Error asking question:', error);
        debugLog('Question error', error);
        addMessageToChat('error', 'Sorry, I encountered an error while processing your question.');
        questionInput.disabled = false;
        askButton.disabled = false;
    }
});

// Add message to chat
function addMessageToChat(role, content) {
    debugLog('Adding message to chat', { role, content });
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${role}`;
    messageDiv.textContent = content;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initialize when the panel loads
document.addEventListener('DOMContentLoaded', initialize); 
/******/ })()
;
//# sourceMappingURL=panel.js.map