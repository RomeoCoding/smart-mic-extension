const toggleBtn = document.getElementById('toggleBtn');

toggleBtn.addEventListener('click', () => {
  if (toggleBtn.textContent === 'Activate') {
    toggleBtn.textContent = 'Deactivate';
    // Send a message to start the microphone monitoring
    chrome.runtime.sendMessage({ action: "start" });
  } else {
    toggleBtn.textContent = 'Activate';
    // Send a message to stop the microphone monitoring
    chrome.runtime.sendMessage({ action: "stop" });
  }
});
