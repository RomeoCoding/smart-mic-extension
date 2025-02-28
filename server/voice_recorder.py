import sounddevice as sd
import numpy as np
import torchaudio

duration = 5
samplerate = 16000
print("Recording... Speak now!")
audio = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=2, dtype='float32')
sd.wait()
torchaudio.save("my_voice.wav", torch.tensor(audio), samplerate)
print("Voice sample saved as my_voice.wav")
