import sounddevice as sd
import numpy as np
import websockets
import asyncio
import json
import torch
from silero_vad import VAD

# Initialize the VAD model
vad = VAD()

# Typing sound detection threshold
TYPING_THRESHOLD = 0.1  # Adjust this value based on testing

# WebSocket connection URI
uri = "ws://localhost:8765"

async def send_audio_to_extension(websocket, path):
    duration = 1  # seconds to record per cycle
    samplerate = 16000
    print("Monitoring sound...")

    try:
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
            audio_tensor = torch.tensor(audio)
            speech_detected = vad(audio_tensor)

            if speech_detected:
                print("Speech detected, unmuting mic...")
                await websocket.send(json.dumps({"action": "unmute"}))

            # Sleep before next audio cycle
            await asyncio.sleep(duration)

    except websockets.exceptions.ConnectionClosed as e:
        print(f"Connection closed: {e}")
    except Exception as e:
        print(f"Error occurred: {e}")
    finally:
        await websocket.close()

async def start_server():
    # Starting WebSocket server and listening on localhost:8765
    server = await websockets.serve(send_audio_to_extension, "localhost", 8765)
    print("Server started, listening on ws://localhost:8765/")
    await server.wait_closed()

# Run the WebSocket server
asyncio.run(start_server())
