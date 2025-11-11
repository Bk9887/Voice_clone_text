# 🎙️ VoiceCloneText

## 📝 Project Description
**VoiceCloneText** is an innovative web application that allows you to generate any text in your own voice! Simply record a short 7-second voice sample, type any text you want, and instantly get an audio output that sounds like you speaking. This personal voice cloning technology brings a human touch to text-to-speech conversion.

## 🚀 Key Features
- **Instant Voice Cloning** - Record once, generate unlimited speech
- **Simple Interface** - 3-step process: Record → Type → Generate
- **Voice Customization** - Adjust mood (Happy, Sad, Robotic, Normal) and pitch
- **Real-time Comparison** - Listen to both original and generated audio side-by-side
- **Download Capability** - Save your generated voice clips
- **Responsive Design** - Works perfectly on desktop and mobile devices

## 💻 Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Web APIs:** MediaRecorder API, Web Speech API, Web Audio API
- **Voice Cloning:** ElevenLabs API Integration
- **Storage:** Browser Local Storage & IndexedDB
- **Version Control:** Git & GitHub

## 🛠️ Setup & Installation Instructions

### Prerequisites
- Modern web browser (Chrome, Edge, or Firefox recommended)
- Microphone access
- Internet connection (for real voice cloning)

### Local Development Setup

#### Method 1: Simple File Opening
```bash
# 1. Download or clone the project
git clone https://github.com/your-username/voiceclonetext.git

# 2. Navigate to project folder
cd voiceclonetext

# 3. Open index.html in your browser
# Simply double-click index.html or drag it to browser

Project Structure:

voiceclonetext/
├── index.html                 # Main application file
├── css/                       # Stylesheets
│   ├── style.css              # Main styles
│   └── components/            # Component-specific styles
├── js/                        # JavaScript modules
│   ├── app.js                 # Main application controller
│   ├── modules/               # Feature modules
│   └── utils/                 # Utility functions
├── assets/                    # Additional resources
└── README.md                  # This file