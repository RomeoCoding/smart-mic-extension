let ws;
let isMonitoring = false;

function connectToServer() {
    ws = new WebSocket("ws://localhost:8765");

    ws.onopen = () => {
        console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.action === "unmute") {
            console.log("Unmuting mic...");
            // You need to handle the unmute action in the page context,
            // e.g., by interacting with the page's DOM or a content script.
            chrome.scripting.executeScript({
                target: { tabId: chrome.tabs.TAB_ID }, // Replace with the correct tabId
                func: unmuteMic
            });
        } else if (message.action === "mute") {
            console.log("Muting mic...");
            // Similarly, mute action needs to interact with the page context.
            chrome.scripting.executeScript({
                target: { tabId: chrome.tabs.TAB_ID }, // Replace with the correct tabId
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
    if (unmuteButton) unmuteButton.click();
}

function muteMic() {
    const muteButton = document.querySelector('button[aria-label="Mute microphone"]');
    if (muteButton) muteButton.click();
}

function startMonitoring() {
    if (!isMonitoring) {
        connectToServer();
        isMonitoring = true;
    }
}

function stopMonitoring() {
    if (isMonitoring && ws) {
        ws.close();
        isMonitoring = false;
    }
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "start") {
        startMonitoring();
    } else if (message.action === "stop") {
        stopMonitoring();
    }
});
