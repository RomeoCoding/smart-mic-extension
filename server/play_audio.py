import sounddevice as sd
import numpy as np
import torch
import torchaudio

# Load the audio file
filename = "my_voice.wav"
waveform, sample_rate = torchaudio.load(filename)

# Convert to numpy for playback (if necessary)
# Ensure that the waveform is mono or stereo and handle it
if waveform.ndimension() > 1:  # If stereo, convert to mono by averaging channels
    waveform = waveform.mean(dim=0)  # Convert to mono by averaging channels

audio = waveform.numpy()

# Play the audio
print("Playing back the recorded audio...")
sd.play(audio, samplerate=sample_rate)
sd.wait()  # Wait until playback is done
