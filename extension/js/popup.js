// popup.js

const toggleBtn = document.getElementById('toggleBtn');

toggleBtn.addEventListener('click', () => {
  if (toggleBtn.textContent === 'Activate') {
    toggleBtn.textContent = 'Deactivate';

    // Request microphone access
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        console.log('Microphone access granted');
        // Send message to background script to start monitoring
        chrome.runtime.sendMessage({ action: "start" });
      })
      .catch((err) => {
        console.error('Microphone access denied:', err);
        alert('Microphone access denied. Please check your browser settings.');
      });
  } else {
    toggleBtn.textContent = 'Activate';
    // Send message to stop microphone monitoring
    chrome.runtime.sendMessage({ action: "stop" });
  }
});
