# Smart Mic Extension  

The Smart Mic Extension is a browser extension that uses AI-powered voice recognition to mute background voices and unmute only when the user speaks. It enhances audio clarity during virtual meetings on platforms like Google Meet, Zoom, and Microsoft Teams.  

## Features  
- Automatically mutes the microphone when background voices are detected.  
- Unmutes only when the user's voice is recognized.  
- Compatible with Google Meet, Zoom, and Microsoft Teams.  
- Simple browser extension interface.  

## Technology Stack  
- **Chrome Extension API** – Manages browser functionality and user interaction.  
- **AI-Based Voice Recognition (Python)** – Identifies and differentiates voices.  
- **WebSockets** – Enables real-time communication between the extension and the AI server.  

## Installation  

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/YOUR_USERNAME/smart-mic-extension.git
   cd smart-mic-extension
   ```  

2. **Install Python Dependencies**  
   ```bash
   cd server
   pip install -r requirements.txt
   ```  

3. **Record a Voice Sample** (to help the AI recognize your voice)  
   ```python
   import sounddevice as sd
   import numpy as np
   import torchaudio

   duration = 5  
   samplerate = 16000
   print("Recording... Speak now!")
   audio = sd.rec(int(duration * samplerate), samplerate=samplerate, channels=1, dtype='float32')
   sd.wait()
   torchaudio.save("my_voice.wav", torch.tensor(audio), samplerate)
   print("Voice sample saved as my_voice.wav")
   ```  

4. **Start the AI Server**  
   ```bash
   cd server
   python server.py
   ```  

5. **Load the Chrome Extension**  
   - Open `chrome://extensions/` in Google Chrome.  
   - Enable **Developer Mode** and select **Load Unpacked**.  
   - Choose the `extension/` folder and activate the extension.  

6. **Test the Extension**  
   - The microphone unmutes when you speak.  
   - Background voices trigger automatic muting.  
   - Typing or ambient noise does not affect activation.  

## Future Enhancements  
- Adjustable sensitivity settings.  
- Support for multiple recognized voices.  
- A standalone desktop application.  

For more details or contributions, refer to the repository.
