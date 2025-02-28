import sounddevice as sd
import numpy as np
import torchaudio
import torch
import soundfile as sf

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
channels = 1  # mono audio
filename = "my_voice.wav"

# List available devices
print("Available devices:")
print(sd.query_devices())

# Set the correct input device index (based on your device list)
input_device_index = 1  # Replace with your chosen device index

# Record audio
try:
    print("Recording... Speak now!")
    audio = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=channels, dtype='float32', device=input_device_index)
    sd.wait()  # Wait until recording is done

    # Ensure the audio is a numpy array, and convert to torch tensor
    audio_tensor = torch.tensor(audio)
    if audio_tensor.ndimension() != 2 or audio_tensor.shape[1] != channels:
        raise ValueError(f"Audio shape is invalid. Expected {channels} channels, got {audio_tensor.shape[1]}.")

    # Save audio to file using soundfile
    sf.write(filename, audio_tensor.numpy(), samplerate)  # Use soundfile to save
    print(f"Voice sample saved as {filename}")

except Exception as e:
    print(f"An error occurred during recording or saving: {e}")
