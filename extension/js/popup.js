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
        // Provide a better error message based on the error name
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          alert('Microphone access denied. Please check your browser settings.');
        } else {
          alert('An unexpected error occurred while accessing the microphone. Please try again.');
        }
      });
  } else {
    toggleBtn.textContent = 'Activate';
    // Send a message to stop the microphone monitoring
    chrome.runtime.sendMessage({ action: "stop" });
  }
});
