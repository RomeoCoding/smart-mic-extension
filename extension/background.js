let socket = new WebSocket("ws://localhost:8765");

socket.onmessage = (event) => {
    let action = event.data; // "mute" or "unmute"
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.scripting.executeScript({
            target: {tabId: tabs[0].id},
            function: toggleMute,
            args: [action === "mute"]
        });
    });
};

function toggleMute(shouldMute) {
    navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        let track = stream.getAudioTracks()[0];
        track.enabled = !shouldMute;
    });
}
