import sounddevice as sd
import numpy as np
import torch
import torchaudio

# Load the audio file
filename = "my_voice.wav"
waveform, sample_rate = torchaudio.load(filename)

# Convert to numpy for playback (if necessary)
audio = waveform.numpy()

# Play the audio
print("Playing back the recorded audio...")
sd.play(audio, samplerate=sample_rate)
sd.wait()  # Wait until playback is done
