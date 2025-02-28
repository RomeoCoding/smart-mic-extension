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
    checkMuteState("muted");
}

function unmuteMic() {
    checkMuteState("unmuted");
}

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

function playNotificationSound(state) {
    const soundFile = state === "muted" ? "sounds/33782__jobro__3-beep-b.wav" : "sounds/33782__jobro__3-beep-b.wav"; // Replace with appropriate file if needed
    const audio = new Audio(chrome.runtime.getURL(soundFile));
    audio.play();
    console.log(`${state.charAt(0).toUpperCase() + state.slice(1)} notification played.`);
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
