let ws;
let isMonitoring = false;

// Function to check if the mic is muted or unmuted and play sound
function checkMuteState(state) {
    // Try finding the mute/unmute button based on specific aria-labels for microphone
    const muteButton = document.querySelector('button[aria-label="Mute microphone"], button[aria-label="Unmute microphone"], button[aria-pressed]');

    if (!muteButton) {
        console.log("Mute button not found.");
        return;
    }

    // Use aria-pressed to determine the mute state if available
    const buttonState = muteButton.getAttribute("aria-pressed");
    const buttonLabel = muteButton.getAttribute("aria-label").toLowerCase();

    console.log("Button label:", buttonLabel);  // Debugging: Log the button label
    console.log("Button aria-pressed state:", buttonState);  // Debugging: Log aria-pressed state

    // Determine whether to play sound based on the current state and passed state
    if ((state === "muted" && (buttonState === "false" || buttonLabel.includes("mute"))) || 
        (state === "unmuted" && (buttonState === "true" || buttonLabel.includes("unmute")))) {
        playNotificationSound(state);
    }
}

// Function to play the sound notification
function playNotificationSound(state) {
    console.log("Playing sound for state:", state);  // Add this for debugging
    const soundFile = chrome.runtime.getURL('33782__jobro__3-beep-b.wav');  // Correct path for audio
    const audio = new Audio(soundFile);
    
    audio.play();
    audio.onplay = () => {
        console.log(`${state.charAt(0).toUpperCase() + state.slice(1)} notification played.`);
    };
    audio.onerror = (err) => {
        console.error("Error playing sound:", err);
    };
}

// Function to connect to the WebSocket server
function connectToServer() {
    ws = new WebSocket("ws://localhost:8765");

    ws.onopen = () => {
        console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('Received message from WebSocket:', message);  // Debugging

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0 || !tabs[0].url.includes("meet.google.com")) {
                console.error("Not a Google Meet tab. Skipping script execution.");
                return;  // Prevent execution on non-Google Meet pages
            }

            const tabId = tabs[0].id;
            // Send the action directly (no need to execute the function through scripting)
            chrome.scripting.executeScript({
                target: { tabId },
                func: checkMuteState,
                args: [message.action]  // Pass the action (either "muted" or "unmuted")
            });
        });
    };

    ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {
        console.log("Disconnected from WebSocket server");
    };
}

// Function to start monitoring
function startMonitoring() {
    if (!isMonitoring) {
        console.log('Starting microphone monitoring...');
        connectToServer();
        isMonitoring = true;
    }
}

// Function to stop monitoring
function stopMonitoring() {
    if (isMonitoring && ws) {
        console.log('Stopping microphone monitoring...');
        ws.close();
        isMonitoring = false;
    }
}

// Listening for start/stop commands from the runtime
chrome.runtime.onMessage.addListener((message) => {
    console.log('Received message:', message);  // Debugging
    if (message.action === "start") {
        startMonitoring();
    } else if (message.action === "stop") {
        stopMonitoring();
    }
});
