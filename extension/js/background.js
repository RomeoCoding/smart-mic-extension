let ws;
let isMonitoring = false;

function connectToServer() {
    // Open a WebSocket connection to the server
    ws = new WebSocket("ws://localhost:8765");

    ws.onopen = () => {
        console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
        // Parse the incoming WebSocket message
        const message = JSON.parse(event.data);
        if (message.action === "unmute") {
            console.log("Unmuting mic...");
            // Execute script to unmute the microphone in the active tab
            chrome.scripting.executeScript({
                target: { tabId: chrome.tabs.TAB_ID },  // Replace with the correct tabId
                func: unmuteMic
            });
        } else if (message.action === "mute") {
            console.log("Muting mic...");
            // Execute script to mute the microphone in the active tab
            chrome.scripting.executeScript({
                target: { tabId: chrome.tabs.TAB_ID },  // Replace with the correct tabId
                func: muteMic
            });
        }
    };

    ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {
        console.log("Disconnected from WebSocket server");
    };
}

function unmuteMic() {
    const unmuteButton = document.querySelector('button[aria-label="Unmute microphone"]');
    if (unmuteButton) unmuteButton.click();  // Trigger the unmute action
}

function muteMic() {
    const muteButton = document.querySelector('button[aria-label="Mute microphone"]');
    if (muteButton) muteButton.click();  // Trigger the mute action
}

function startMonitoring() {
    // Only attempt to connect to the WebSocket if it's not already active
    if (!isMonitoring) {
        connectToServer();
        isMonitoring = true;
    }
}

function stopMonitoring() {
    // Close the WebSocket connection when stopping the monitoring
    if (isMonitoring && ws) {
        ws.close();
        isMonitoring = false;
    }
}

// Listen for start/stop actions from other parts of the extension (e.g., popup.js)
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "start") {
        startMonitoring();
    } else if (message.action === "stop") {
        stopMonitoring();
    }
});
