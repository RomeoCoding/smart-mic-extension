let ws;
let isMonitoring = false;

function connectToServer() {
    ws = new WebSocket("ws://localhost:8765");

    ws.onopen = () => {
        console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);

        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs.length === 0 || !tabs[0].url.includes("meet.google.com")) {
                console.error("Not a Google Meet tab. Skipping script execution.");
                return;  // Prevent execution on non-Google Meet pages
            }

            const tabId = tabs[0].id;
            const actionFunc = message.action === "unmute" ? unmuteMic : muteMic;

            chrome.scripting.executeScript({
                target: { tabId },
                func: actionFunc
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

function muteMic() {
    checkMuteState("muted");  // Ensure this function is defined before calling it
}

function unmuteMic() {
    checkMuteState("unmuted");  // Ensure this function is defined before calling it
}

// Define checkMuteState function
function checkMuteState(state) {
    const muteButton = document.querySelector('button[aria-label*="Mute"], button[aria-label*="Unmute"]');
    
    if (!muteButton) {
        console.log("Mute button not found.");
        return;
    }

    const buttonLabel = muteButton.getAttribute("aria-label").toLowerCase();

    if ((state === "muted" && buttonLabel.includes("mute")) || 
        (state === "unmuted" && buttonLabel.includes("unmute"))) {
        playNotificationSound(state);
    }
}

// Define the function to play sound
function playNotificationSound(state) {
    console.log("Playing sound for state:", state);  // Add this for debugging
    const soundFile = chrome.runtime.getURL('33782__jobro__3-beep-b.wav');  // Use runtime URL for audio
    const audio = new Audio(soundFile);
    
    audio.play();
    audio.onplay = () => {
        console.log(`${state.charAt(0).toUpperCase() + state.slice(1)} notification played.`);
    };
    audio.onerror = (err) => {
        console.error("Error playing sound:", err);
    };
}

function startMonitoring() {
    if (!isMonitoring) {
        console.log('Starting microphone monitoring...');
        connectToServer();
        isMonitoring = true;
    }
}

function stopMonitoring() {
    if (isMonitoring && ws) {
        console.log('Stopping microphone monitoring...');
        ws.close();
        isMonitoring = false;
    }
}

chrome.runtime.onMessage.addListener((message) => {
    console.log('Received message:', message);
    if (message.action === "start") {
        startMonitoring();
    } else if (message.action === "stop") {
        stopMonitoring();
    }
});
