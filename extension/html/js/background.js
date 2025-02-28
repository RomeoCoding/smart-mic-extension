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

            // Execute the corresponding function in the context of the tab
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
    console.log("Looking for mute button...");
    // Look for the mute button (microphone icon)
    const muteButton = document.querySelector('button[aria-label="Turn on microphone"]');
    if (muteButton) {
        console.log("Mute button found, clicking...");
        muteButton.click();
        console.log("Mic Muted");
    } else {
        console.error("Mute button not found");
    }
}

function unmuteMic() {
    console.log("Looking for unmute button...");
    // Look for the unmute button (microphone icon)
    const unmuteButton = document.querySelector('button[aria-label="Turn off microphone"]');
    if (unmuteButton) {
        console.log("Unmute button found, clicking...");
        unmuteButton.click();
        console.log("Mic Unmuted");
    } else {
        console.error("Unmute button not found");
    }
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
