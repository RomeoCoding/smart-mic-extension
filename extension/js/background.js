let ws;
let isMonitoring = false;
let currentTabId = null;

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
            // Ensure tabId is set
            if (currentTabId !== null) {
                chrome.scripting.executeScript({
                    target: { tabId: currentTabId },  // Use the active tabId
                    func: unmuteMic
                });
            }
        } else if (message.action === "mute") {
            console.log("Muting mic...");
            // Ensure tabId is set
            if (currentTabId !== null) {
                chrome.scripting.executeScript({
                    target: { tabId: currentTabId },  // Use the active tabId
                    func: muteMic
                });
            }
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
    if (!isMonitoring) {
        // Get the active tab ID before connecting to the server
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            currentTabId = tabs[0].id;  // Get the current active tab ID
            connectToServer();
            isMonitoring = true;
        });
    }
}

function stopMonitoring() {
    if (isMonitoring && ws) {
        ws.close();
        isMonitoring = false;
        currentTabId = null;  // Clear tabId
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
