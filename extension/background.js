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
            document.querySelector('button[aria-label="Unmute microphone"]').click();
        } else if (message.action === "mute") {
            console.log("Muting mic...");
            document.querySelector('button[aria-label="Mute microphone"]').click();
        }
    };

    ws.onerror = (error) => {
        console.error("WebSocket Error:", error);
    };

    ws.onclose = () => {
        console.log("Disconnected from WebSocket server");
    };
}

// Request microphone access
function requestMicrophoneAccess() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            console.log('Microphone access granted');
            startMonitoring();
        })
        .catch((err) => {
            console.error('Microphone access denied', err);
        });
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
        requestMicrophoneAccess();  // Request microphone access before starting monitoring
    } else if (message.action === "stop") {
        stopMonitoring();
    }
});
