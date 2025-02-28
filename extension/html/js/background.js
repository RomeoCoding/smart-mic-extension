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
            if (tabs.length === 0) return;
            const tabId = tabs[0].id;

            if (message.action === "unmute") {
                console.log("Unmuting mic...");
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    if (tabs.length === 0 || !tabs[0].url.startsWith("http")) {
                        console.error("Cannot run script on this page.");
                        return;  // Don't execute on chrome:// pages
                    }
                
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },  // Get current tab ID dynamically
                        func: muteMic
                    });
                });
                
            } else if (message.action === "mute") {
                console.log("Muting mic...");
                chrome.scripting.executeScript({
                    target: { tabId },
                    func: muteMic
                });
            }
        });
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
