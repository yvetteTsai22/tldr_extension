/******/ (() => { // webpackBootstrap
/*!********************************!*\
  !*** ./src/options/options.js ***!
  \********************************/
// Load saved API key
document.addEventListener('DOMContentLoaded', function () {
  chrome.storage.local.get(['openaiApiKey'], function (result) {
    if (result.openaiApiKey) {
      document.getElementById('apiKey').value = result.openaiApiKey;
    }
  });
});

// Save API key
document.getElementById('save').addEventListener('click', function () {
  var apiKey = document.getElementById('apiKey').value.trim();
  var status = document.getElementById('status');
  if (!apiKey) {
    showStatus('Please enter an API key', 'error');
    return;
  }
  chrome.storage.local.set({
    openaiApiKey: apiKey
  }, function () {
    showStatus('API key saved successfully!', 'success');
  });
});

// Show status message
function showStatus(message, type) {
  var status = document.getElementById('status');
  status.textContent = message;
  status.className = "status ".concat(type);
  status.style.display = 'block';
  setTimeout(function () {
    status.style.display = 'none';
  }, 3000);
}
/******/ })()
;
//# sourceMappingURL=options.js.map