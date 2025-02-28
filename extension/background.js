let ws;
let isMonitoring = false;  // Track the connection state

// Function to connect to WebSocket server
function connectToServer() {
    ws = new WebSocket("ws://localhost:8765");

    ws.onopen = () => {
        console.log("Connected to WebSocket server");
    };

    ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.action === "unmute") {
            console.log("Unmuting mic...");
            document.querySelector('button[aria-label="Unmute microphone"]').click();  // Example of unmuting
        } else if (message.action === "mute") {
            console.log("Muting mic...");
            document.querySelector('button[aria-label="Mute microphone"]').click();  // Example of muting
        }
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
        connectToServer();
        isMonitoring = true;
    }
}

// Function to stop monitoring
function stopMonitoring() {
    if (isMonitoring && ws) {
        ws.close();
        isMonitoring = false;
    }
}

// Listen for start/stop actions from popup.js
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "start") {
        startMonitoring();
    } else if (message.action === "stop") {
        stopMonitoring();
    }
});
