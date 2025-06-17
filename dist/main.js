/******/ (() => { // webpackBootstrap
/*!*****************************!*\
  !*** ./src/content/main.js ***!
  \*****************************/
// Debug logging
function debugLog(message) {
  var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var timestamp = new Date().toISOString();
  var logMessage = data ? "".concat(timestamp, " - ").concat(message, ": ").concat(JSON.stringify(data)) : "".concat(timestamp, " - ").concat(message);
  console.log(logMessage);
}
debugLog('Content script loaded');

// Extract article content
function extractContent() {
  debugLog('Extracting content');
  // Try to find the main article element
  var article = document.querySelector('article') || document.querySelector('[role="article"]') || document.querySelector('.article') || document.querySelector('.post') || document.querySelector('.content');
  if (!article) {
    debugLog('No article found, using body text');
    return document.body.innerText;
  }
  debugLog('Article found, processing content');
  // Clone the article to avoid modifying the original
  var articleClone = article.cloneNode(true);

  // Remove unwanted elements
  articleClone.querySelectorAll('script, style, nav, footer, header, aside, .comments, .sidebar').forEach(function (el) {
    return el.remove();
  });
  return articleClone.innerText.trim();
}

// Initialize content script
function initialize() {
  debugLog('Initializing content script');
  var content = extractContent();

  // Send content for analysis
  chrome.runtime.sendMessage({
    type: 'ANALYZE_CONTENT',
    content: content
  });

  // Add highlight styles
  var style = document.createElement('style');
  style.textContent = "\n        .tldr-highlight {\n            background-color: #fff3cd;\n            cursor: pointer;\n            border-bottom: 1px dotted #ffc107;\n        }\n        .tldr-highlight:hover {\n            background-color: #ffe69c;\n        }\n    ";
  document.head.appendChild(style);

  // Highlight key phrases
  function highlightKeyPhrases() {
    debugLog('Highlighting key phrases');
    var keyPhrases = new Set(['important', 'key', 'significant', 'major', 'critical', 'essential', 'crucial', 'vital', 'fundamental', 'primary']);

    // Function to process text nodes
    function processTextNode(node) {
      var text = node.textContent;
      var words = text.split(/\s+/);
      var hasHighlight = false;
      words.forEach(function (word) {
        if (keyPhrases.has(word.toLowerCase())) {
          hasHighlight = true;
        }
      });
      if (hasHighlight) {
        var span = document.createElement('span');
        span.innerHTML = text.replace(new RegExp("\\b(".concat(Array.from(keyPhrases).join('|'), ")\\b"), 'gi'), '<span class="tldr-highlight" title="Click for definition">$1</span>');
        node.parentNode.replaceChild(span, node);
      }
    }

    // Walk through all text nodes in the document
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
    var node;
    while (node = walker.nextNode()) {
      processTextNode(node);
    }
  }
  highlightKeyPhrases();
}

// Listen for messages from the side panel
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  debugLog('Received message', message);
  if (message.type === 'GET_CONTENT') {
    var content = extractContent();
    debugLog('Sending content response');
    sendResponse({
      content: content
    });
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
/******/ })()
;
//# sourceMappingURL=main.js.map