import torch
import torchaudio
import numpy as np
import sounddevice as sd
import asyncio
import websockets
from silero_vad import get_speech_timestamps, load_model
from speechbrain.pretrained import SpeakerRecognition

# Load the VAD (Voice Activity Detection) model
model, utils = load_model(device=torch.device('cpu'))
(get_speech_timestamps, _, read_audio, *_ ) = utils

# Load the speaker verification model
spk_model = SpeakerRecognition.from_hparams(source="speechbrain/spkrec-ecapa-voxceleb", savedir="tmp")

# Load a sample of YOUR voice for recognition
YOUR_VOICE_SAMPLE = "my_voice.wav"

def is_my_voice(audio_path):
    score, _ = spk_model.verify_files(YOUR_VOICE_SAMPLE, audio_path)
    return score.item() > 0.8  # Adjust threshold as needed

async def detect_voice(websocket, path):
    def callback(indata, frames, time, status):
        audio_np = np.array(indata[:, 0], dtype=np.float32)
        speech_timestamps = get_speech_timestamps(audio_np, model, sampling_rate=16000)

        if speech_timestamps:
            # Save audio to a temp file and compare
            torchaudio.save("temp.wav", torch.tensor(audio_np), 16000)
            if is_my_voice("temp.wav"):
                asyncio.run(websocket.send("unmute"))  # Your voice detected → Unmute
            else:
                asyncio.run(websocket.send("mute"))  # Someone else is speaking → Mute
        else:
            asyncio.run(websocket.send("mute"))  # No speech detected → Mute

    with sd.InputStream(callback=callback, channels=1, samplerate=16000):
        asyncio.get_event_loop().run_forever()

async def main():
    async with websockets.serve(detect_voice, "localhost", 8765):
        await asyncio.Future()

asyncio.run(main())
