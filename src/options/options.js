// Load saved API key
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.local.get(['openaiApiKey'], (result) => {
        if (result.openaiApiKey) {
            document.getElementById('apiKey').value = result.openaiApiKey;
        }
    });
});

// Save API key
document.getElementById('save').addEventListener('click', () => {
    const apiKey = document.getElementById('apiKey').value.trim();
    const status = document.getElementById('status');
    
    if (!apiKey) {
        showStatus('Please enter an API key', 'error');
        return;
    }

    chrome.storage.local.set({ openaiApiKey: apiKey }, () => {
        showStatus('API key saved successfully!', 'success');
    });
});

// Show status message
function showStatus(message, type) {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${type}`;
    status.style.display = 'block';
    
    setTimeout(() => {
        status.style.display = 'none';
    }, 3000);
} 