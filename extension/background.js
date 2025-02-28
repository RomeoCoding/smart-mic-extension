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

function startMonitoring() {
    if (!isMonitoring) {
        // Request microphone permission
        chrome.permissions.request({
            permissions: ['microphone'],
            origins: ['http://localhost/', 'ws://localhost/']
        }, (granted) => {
            if (granted) {
                console.log("Microphone access granted!");
                connectToServer();
                isMonitoring = true;
            } else {
                console.log("Microphone access denied.");
            }
        });
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
