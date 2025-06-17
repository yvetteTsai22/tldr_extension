// Debug logging
function debugLog(message, data = null) {
    const timestamp = new Date().toISOString();
    const logMessage = data ? `${timestamp} - ${message}: ${JSON.stringify(data)}` : `${timestamp} - ${message}`;
    console.log(logMessage);
}

debugLog('Content script loaded');

// Extract article content
function extractContent() {
    debugLog('Extracting content');
    // Try to find the main article element
    const article = document.querySelector('article') || 
                   document.querySelector('[role="article"]') || 
                   document.querySelector('.article') || 
                   document.querySelector('.post') || 
                   document.querySelector('.content');
    
    if (!article) {
        debugLog('No article found, using body text');
        return document.body.innerText;
    }
    
    debugLog('Article found, processing content');
    // Clone the article to avoid modifying the original
    const articleClone = article.cloneNode(true);
    
    // Remove unwanted elements
    articleClone.querySelectorAll('script, style, nav, footer, header, aside, .comments, .sidebar').forEach(el => el.remove());
    
    return articleClone.innerText.trim();
}

// Initialize content script
function initialize() {
    debugLog('Initializing content script');
    const content = extractContent();
    
    // Send content for analysis
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
    function highlightKeyPhrases() {
        debugLog('Highlighting key phrases');
        const keyPhrases = new Set([
            'important', 'key', 'significant', 'major', 'critical',
            'essential', 'crucial', 'vital', 'fundamental', 'primary'
        ]);

        // Function to process text nodes
        function processTextNode(node) {
            const text = node.textContent;
            const words = text.split(/\s+/);
            let hasHighlight = false;

            words.forEach(word => {
                if (keyPhrases.has(word.toLowerCase())) {
                    hasHighlight = true;
                }
            });

            if (hasHighlight) {
                const span = document.createElement('span');
                span.innerHTML = text.replace(
                    new RegExp(`\\b(${Array.from(keyPhrases).join('|')})\\b`, 'gi'),
                    '<span class="tldr-highlight" title="Click for definition">$1</span>'
                );
                node.parentNode.replaceChild(span, node);
            }
        }

        // Walk through all text nodes in the document
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );

        let node;
        while (node = walker.nextNode()) {
            processTextNode(node);
        }
    }

    highlightKeyPhrases();
}

// Listen for messages from the side panel
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    debugLog('Received message', message);
    if (message.type === 'GET_CONTENT') {
        const content = extractContent();
        debugLog('Sending content response');
        sendResponse({ content: content });
    }
});

// Initialize when the page is loaded
if (document.readyState === 'complete') {
    debugLog('Document already loaded, initializing');
    initialize();
} else {
    debugLog('Waiting for document load');
    window.addEventListener('load', initialize);
} 