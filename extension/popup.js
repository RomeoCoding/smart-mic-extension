const toggleBtn = document.getElementById('toggleBtn');

toggleBtn.addEventListener('click', () => {
  if (toggleBtn.textContent === 'Activate') {
    toggleBtn.textContent = 'Deactivate';
    
    // Request microphone access here
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        console.log('Microphone access granted');
        // Send a message to start the microphone monitoring in background.js
        chrome.runtime.sendMessage({ action: "start" });
      })
      .catch((err) => {
        console.error('Microphone access denied:', err);
      });
  } else {
    toggleBtn.textContent = 'Activate';
    // Send a message to stop the microphone monitoring
    chrome.runtime.sendMessage({ action: "stop" });
  }
});
