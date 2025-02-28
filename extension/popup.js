const toggleBtn = document.getElementById('toggleBtn');

toggleBtn.addEventListener('click', () => {
  if (toggleBtn.textContent === 'Activate') {
    toggleBtn.textContent = 'Deactivate';

    // Request microphone permission dynamically using chrome.permissions.request()
    chrome.permissions.request({
      permissions: ['microphone']
    }, (granted) => {
      if (granted) {
        // Once permission is granted, request the microphone access
        navigator.mediaDevices.getUserMedia({ audio: true })
          .then((stream) => {
            console.log('Microphone access granted');
            // Send a message to start the microphone monitoring in background.js
            chrome.runtime.sendMessage({ action: "start" });
          })
          .catch((err) => {
            console.error('Microphone access denied:', err);
            alert('Microphone access denied. Please check your permissions.');
          });
      } else {
        console.error('Microphone permission not granted');
        alert('Microphone permission denied. Please grant the permission.');
      }
    });
  } else {
    toggleBtn.textContent = 'Activate';
    // Send a message to stop the microphone monitoring
    chrome.runtime.sendMessage({ action: "stop" });
  }
});
