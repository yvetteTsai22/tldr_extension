// Import marked for markdown rendering
import { marked } from 'marked';

// Debug logging
function debugLog(message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = data ? `${timestamp} - ${message}: ${JSON.stringify(data)}` : `${timestamp} - ${message}`;
    console.log(logMessage);
}

// DOM Elements
const summaryHeader = document.getElementById('summaryHeader');
const summaryContent = document.getElementById('summaryContent');
const summaryText = document.querySelector('.summary-content');
const summaryLoading = document.getElementById('summaryLoading');
const chatHeader = document.getElementById('chatHeader');
const chatContent = document.getElementById('chatContent');
const chatMessages = document.getElementById('chatMessages');
const questionInput = document.getElementById('questionInput');
const askButton = document.getElementById('askButton');
const chatLoading = document.getElementById('chatLoading');

// Configure marked options
marked.setOptions({
    breaks: true, // Convert line breaks to <br>
    gfm: true, // GitHub Flavored Markdown
    headerIds: true, // Add IDs to headers
    mangle: false, // Don't escape HTML
    sanitize: false // Allow HTML
});

// Section toggles
function toggleSection(header, content) {
    const isActive = content.classList.contains('active');
    content.classList.toggle('active');
    header.querySelector('.toggle-icon').textContent = isActive ? '▼' : '▲';
}

summaryHeader.addEventListener('click', () => {
    toggleSection(summaryHeader, summaryContent);
    if (summaryContent.classList.contains('active') && summaryText.textContent === 'Click to generate summary...') {
        generateSummary();
    }
});

chatHeader.addEventListener('click', () => {
    toggleSection(chatHeader, chatContent);
});

// Generate summary
async function generateSummary() {
    debugLog('Generating summary');
    summaryLoading.classList.add('active');
    summaryText.textContent = '';

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) {
            throw new Error('No active tab found');
        }

        // Inject content script
        await injectContentScript(tab.id);
        
        // Wait a bit for the script to initialize
        await new Promise(resolve => setTimeout(resolve, 100));

        // Get content from the page
        const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_CONTENT' });
        if (!response || !response.content) {
            throw new Error('Could not extract content from the page');
        }

        // Send content for analysis
        chrome.runtime.sendMessage({ type: 'ANALYZE_CONTENT', content: response.content });
    } catch (error) {
        console.error('Error generating summary:', error);
        debugLog('Error generating summary', error);
        summaryText.textContent = `Error: ${error.message}`;
    } finally {
        summaryLoading.classList.remove('active');
    }
}

// Inject content script
async function injectContentScript(tabId) {
    debugLog('Injecting content script', { tabId });
    try {
        await chrome.scripting.executeScript({
            target: { tabId },
            files: ['main.js']
        });
        debugLog('Content script injected successfully');
    } catch (error) {
        console.error('Error injecting content script:', error);
        debugLog('Error injecting content script', error);
        throw error;
    }
}

// Handle summary response
chrome.runtime.onMessage.addListener((message) => {
    debugLog('Received message', message);
    if (message.type === 'CONTENT_ANALYZED') {
        // Convert markdown to HTML
        summaryText.innerHTML = marked.parse(message.summary);
    }
});

// Handle chat
askButton.addEventListener('click', async () => {
    const question = questionInput.value.trim();
    if (!question) return;

    // Disable input while processing
    questionInput.disabled = true;
    askButton.disabled = true;
    chatLoading.classList.add('active');

    // Add user message
    addMessage(question, 'user');

    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tab) {
            throw new Error('No active tab found');
        }

        // Inject content script
        await injectContentScript(tab.id);
        
        // Wait a bit for the script to initialize
        await new Promise(resolve => setTimeout(resolve, 100));

        // Get content from the page
        const response = await chrome.tabs.sendMessage(tab.id, { type: 'GET_CONTENT' });
        if (!response || !response.content) {
            throw new Error('Could not extract content from the page');
        }

        // Send question to background script
        const answer = await new Promise((resolve, reject) => {
            chrome.runtime.sendMessage(
                { type: 'ASK_QUESTION', question, content: response.content },
                (response) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else if (response.error) {
                        reject(new Error(response.error));
                    } else {
                        resolve(response.answer);
                    }
                }
            );
        });

        // Add assistant message
        addMessage(answer, 'assistant');
    } catch (error) {
        console.error('Error processing question:', error);
        debugLog('Error processing question', error);
        addMessage(`Error: ${error.message}`, 'error');
    } finally {
        // Re-enable input
        questionInput.disabled = false;
        askButton.disabled = false;
        chatLoading.classList.remove('active');
        questionInput.value = '';
        questionInput.focus();
    }
});

// Add message to chat
function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    // Convert markdown to HTML for assistant messages
    messageDiv.innerHTML = type === 'assistant' ? marked.parse(text) : text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle Enter key in question input
questionInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        askButton.click();
    }
}); 