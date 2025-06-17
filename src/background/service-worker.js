// Store the OpenAI API key
let apiKey = '';

// Initialize the extension
chrome.runtime.onInstalled.addListener(() => {
    // Request API key from user
    chrome.storage.local.get(['openaiApiKey'], (result) => {
        if (!result.openaiApiKey) {
            chrome.runtime.openOptionsPage();
        } else {
            apiKey = result.openaiApiKey;
        }
    });
});

// Handle messages from content script and side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'ANALYZE_CONTENT') {
        analyzeContent(message.content)
            .then(summary => {
                chrome.runtime.sendMessage({
                    type: 'CONTENT_ANALYZED',
                    summary: summary
                });
            })
            .catch(error => {
                console.error('Error analyzing content:', error);
            });
    }
});

// Analyze content using OpenAI API
async function analyzeContent(content) {
    if (!apiKey) {
        throw new Error('OpenAI API key not set');
    }

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
                    content: 'You are a helpful assistant that summarizes articles and answers questions about them.'
                },
                {
                    role: 'user',
                    content: `Please summarize this article in bullet points:\n\n${content}`
                }
            ],
            max_tokens: 500
        })
    });

    if (!response.ok) {
        throw new Error('Failed to analyze content');
    }

    const data = await response.json();
    return data.choices[0].message.content;
}

// Handle API key updates
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'local' && changes.openaiApiKey) {
        apiKey = changes.openaiApiKey.newValue;
    }
});

chrome.action.onClicked.addListener((tab) => {
  chrome.sidePanel.open({ tabId: tab.id });
}); 