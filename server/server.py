import sounddevice as sd
import numpy as np
import websockets
import asyncio
import json
import torch

# Load the Silero VAD model from PyTorch Hub
model, utils = torch.hub.load('snakers4/silero-vad', 'silero_vad', source='github')

# Typing sound detection threshold
TYPING_THRESHOLD = 0.1  # Adjust this value based on testing

# WebSocket connection URI
uri = "ws://localhost:8765"

# Helper function for detecting speech activity
def detect_speech(audio):
    audio_tensor = torch.FloatTensor(audio)
    return model(audio_tensor.unsqueeze(0))  # Add batch dimension

async def send_audio_to_extension():
    async with websockets.connect(uri) as websocket:
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
            if detect_speech(audio):
                print("Speech detected, unmuting mic...")
                await websocket.send(json.dumps({"action": "unmute"}))

            # Sleep before next audio cycle
            await asyncio.sleep(duration)

async def start_server():
    server = await websockets.serve(send_audio_to_extension, "localhost", 8765)
    await server.wait_closed()

asyncio.run(start_server())
