import sounddevice as sd
import numpy as np
import torchaudio
import torch

# Function to check if the device is available
def check_device(device_index):
    try:
        sd.query_devices(device_index)
        print(f"Device {device_index} is available.")
    except Exception as e:
        print(f"Error querying device {device_index}: {e}")
        return False
    return True

# Setup parameters
duration = 5  # seconds
samplerate = 16000  # Hz
channels = 19  # stereo audio
filename = "my_voice.wav"

# List available devices
print("Available devices:")
print(sd.query_devices())

# Record audio
try:
    print("Recording... Speak now!")
    audio = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=channels, dtype='float32')
    sd.wait()  # Wait until recording is done

    # Ensure the audio is a numpy array, and convert to torch tensor
    audio_tensor = torch.tensor(audio)
    if audio_tensor.ndimension() != 2 or audio_tensor.shape[1] != channels:
        raise ValueError(f"Audio shape is invalid. Expected {channels} channels, got {audio_tensor.shape[1]}.")

    # Save audio to file
    torchaudio.save(filename, audio_tensor, samplerate)
    print(f"Voice sample saved as {filename}")

except Exception as e:
    print(f"An error occurred during recording or saving: {e}")
