// Store the OpenAI API key
let apiKey = '';

// Debug logging
function debugLog(message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = data ? `${timestamp} - ${message}: ${JSON.stringify(data)}` : `${timestamp} - ${message}`;
    console.log(logMessage);
}

// Initialize the extension
chrome.runtime.onInstalled.addListener(() => {
    debugLog('Extension installed/updated');
    // Request API key from user
    chrome.storage.local.get(['openaiApiKey'], (result) => {
        if (!result.openaiApiKey) {
            debugLog('No API key found, opening options page');
            chrome.runtime.openOptionsPage();
        } else {
            debugLog('API key found in storage');
            apiKey = result.openaiApiKey;
        }
    });
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    debugLog('Extension icon clicked', { tabId: tab.id });
    chrome.sidePanel.open({ tabId: tab.id });
});

// Handle messages from content script and side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    debugLog('Received message', message);
    
    if (message.type === 'ANALYZE_CONTENT') {
        debugLog('Analyzing content');
        analyzeContent(message.content)
            .then(summary => {
                debugLog('Content analyzed successfully');
                chrome.runtime.sendMessage({
                    type: 'CONTENT_ANALYZED',
                    summary: summary
                });
            })
            .catch(error => {
                console.error('Error analyzing content:', error);
                debugLog('Error analyzing content', error);
                chrome.runtime.sendMessage({
                    type: 'CONTENT_ANALYZED',
                    summary: 'Error: Could not analyze content. Please check your API key.'
                });
            });
    } else if (message.type === 'ASK_QUESTION') {
        debugLog('Processing question', { question: message.question });
        answerQuestion(message.question, message.content)
            .then(answer => {
                debugLog('Question answered successfully');
                sendResponse({ answer: answer });
            })
            .catch(error => {
                console.error('Error answering question:', error);
                debugLog('Error answering question', error);
                sendResponse({ error: 'Could not answer question. Please check your API key.' });
            });
        return true; // Required for async sendResponse
    }
});

// Analyze content using OpenAI API
async function analyzeContent(content) {
    if (!apiKey) {
        throw new Error('OpenAI API key not set');
    }

    debugLog('Sending request to OpenAI API');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that summarizes articles in markdown format. Focus on key points and main ideas. Use bullet points and headers to organize the information.'
                },
                {
                    role: 'user',
                    content: `Please summarize this article in markdown format, focusing on key points and main ideas:\n\n${content}`
                }
            ],
            max_tokens: 500
        })
    });

    if (!response.ok) {
        debugLog('OpenAI API error', { status: response.status });
        throw new Error('Failed to analyze content');
    }

    const data = await response.json();
    debugLog('OpenAI API response', data);
    return data.choices[0].message.content;
}

// Answer question using OpenAI API
async function answerQuestion(question, content) {
    if (!apiKey) {
        throw new Error('OpenAI API key not set');
    }

    debugLog('Sending question to OpenAI API');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful assistant that answers questions about articles in a clear and concise way.'
                },
                {
                    role: 'user',
                    content: `Here is the article content:\n\n${content}\n\nQuestion: ${question}`
                }
            ],
            max_tokens: 500
        })
    });

    if (!response.ok) {
        debugLog('OpenAI API error', { status: response.status });
        throw new Error('Failed to answer question');
    }

    const data = await response.json();
    debugLog('OpenAI API response', data);
    return data.choices[0].message.content;
}

// Handle API key updates
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.openaiApiKey) {
        debugLog('API key updated');
        apiKey = changes.openaiApiKey.newValue;
    }
}); 