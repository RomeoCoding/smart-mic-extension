import sounddevice as sd
import numpy as np
import websockets
import asyncio
import json
from silero_vad import load_silero_vad, read_audio, get_speech_timestamps
import torch

# Initialize the VAD model
model = load_silero_vad()

# Typing sound detection threshold
TYPING_THRESHOLD = 0.1  # Adjust this value based on testing

# WebSocket connection URI
uri = "ws://localhost:8765"

async def send_audio_to_extension(websocket, path):  # Updated to include parameters
    duration = 1  # seconds to record per cycle
    samplerate = 16000
    print("Monitoring sound...")
    
    while True:
        # Record audio for a short period (1 second)
        audio = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=1, dtype='float32')
        sd.wait()

        # Calculate the loudness of the audio
        loudness = np.max(np.abs(audio))  # Get the peak amplitude (absolute value)

        # Check if the loudness exceeds the typing threshold
        if loudness > TYPING_THRESHOLD:
            print("Typing detected, muting mic...")
            await websocket.send(json.dumps({"action": "mute"}))

        # Check for voice activity (your speech)
        speech_timestamps = get_speech_timestamps(
            audio.flatten(),  # Flatten the audio array
            model,
            return_seconds=True
        )

        if speech_timestamps:  # If speech is detected (timestamps will be non-empty)
            print("Speech detected, unmuting mic...")
            await websocket.send(json.dumps({"action": "unmute"}))

        # Sleep before next audio cycle
        await asyncio.sleep(duration)

async def start_server():
    server = await websockets.serve(send_audio_to_extension, "localhost", 8765)
    await server.wait_closed()

# Run the WebSocket server
asyncio.run(start_server())
