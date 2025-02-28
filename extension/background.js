let ws = new WebSocket("ws://localhost:8765");

ws.onopen = () => {
  console.log("Connected to WebSocket server");
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  if (message.action === "unmute") {
    console.log("Unmuting mic...");
    // Logic to unmute the microphone
    document.querySelector('button[aria-label="Unmute microphone"]').click(); // Example of unmuting
  } else if (message.action === "mute") {
    console.log("Muting mic...");
    // Logic to mute the microphone
    document.querySelector('button[aria-label="Mute microphone"]').click(); // Example of muting
  }
};
