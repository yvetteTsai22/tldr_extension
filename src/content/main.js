// Extract main article content
function extractArticleContent() {
    // Try to find the main article content
    const article = document.querySelector('article') || 
                   document.querySelector('[role="article"]') ||
                   document.querySelector('.article') ||
                   document.querySelector('.post') ||
                   document.querySelector('.content');
    
    if (!article) return document.body.innerText;
    
    // Remove unwanted elements
    const clone = article.cloneNode(true);
    const unwanted = clone.querySelectorAll('script, style, nav, footer, header, aside, .comments, .sidebar');
    unwanted.forEach(el => el.remove());
    
    return clone.innerText.trim();
}

// Highlight key phrases
function highlightKeyPhrases(text) {
    const words = text.split(/\s+/);
    const keyPhrases = new Set([
        'important', 'key', 'significant', 'major', 'critical',
        'essential', 'crucial', 'vital', 'fundamental', 'primary'
    ]);
    
    words.forEach(word => {
        if (keyPhrases.has(word.toLowerCase())) {
            const span = document.createElement('span');
            span.className = 'tldr-highlight';
            span.textContent = word;
            span.title = 'Click for definition';
            word.parentNode.replaceChild(span, word);
        }
    });
}

// Initialize the extension
function initialize() {
    // Extract and send content to background script
    const content = extractArticleContent();
    chrome.runtime.sendMessage({
        type: 'ANALYZE_CONTENT',
        content: content
    });
    
    // Add highlight styles
    const style = document.createElement('style');
    style.textContent = `
        .tldr-highlight {
            background-color: #fff3cd;
            cursor: pointer;
            border-bottom: 1px dotted #ffc107;
        }
        .tldr-highlight:hover {
            background-color: #ffe69c;
        }
    `;
    document.head.appendChild(style);
    
    // Highlight key phrases
    highlightKeyPhrases(document.body);
}

// Listen for messages from the side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'GET_CONTENT') {
        sendResponse({ content: extractArticleContent() });
    }
});

// Initialize when the page is loaded
if (document.readyState === 'complete') {
    initialize();
} else {
    window.addEventListener('load', initialize);
} 