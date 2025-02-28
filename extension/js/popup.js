const toggleBtn = document.getElementById('toggleBtn');

toggleBtn.addEventListener('click', () => {
  console.log('Button clicked!');  // Debugging the button click

  if (toggleBtn.textContent === 'Activate') {
    toggleBtn.textContent = 'Deactivate';
    console.log('Attempting to get microphone access...');  // Debugging the microphone request

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        console.log('Microphone access granted');
        // Start the microphone monitoring after granting permission
        chrome.runtime.sendMessage({ action: "start" });
      })
      .catch((err) => {
        console.error('Microphone access denied:', err);
        if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
          alert('Microphone access denied. Please check your browser settings.');
        } else {
          alert('An unexpected error occurred while accessing the microphone. Please try again.');
        }
      });
  } else {
    toggleBtn.textContent = 'Activate';
    console.log('Stopping monitoring...');
    // Send a message to stop the microphone monitoring
    chrome.runtime.sendMessage({ action: "stop" });
  }
});
