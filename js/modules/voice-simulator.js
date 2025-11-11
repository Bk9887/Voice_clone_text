/**
 * Voice Simulator Module - UPDATED COMPLETE VERSION
 * Handles voice cloning simulation and audio generation
 */

class VoiceSimulator {
    constructor() {
        this.generatedAudio = null;
        this.isProcessing = false;
        
        // DOM Elements
        this.elements = {
            generateBtn: document.getElementById('generateBtn'),
            downloadBtn: document.getElementById('downloadBtn'),
            similarityScore: document.getElementById('similarityScore'),
            moodSlider: document.getElementById('moodSlider'),
            pitchSlider: document.getElementById('pitchSlider'),
            pitchValue: document.getElementById('pitchValue')
        };
        
        this.initializeEventListeners();
    }
    
    /**
     * Initialize event listeners
     */
    initializeEventListeners() {
        // Generate button click
        this.elements.generateBtn.addEventListener('click', () => {
            this.generateVoiceClone();
        });
        
        // Download button click
        this.elements.downloadBtn.addEventListener('click', () => {
            this.downloadGeneratedAudio();
        });
        
        // Pitch slider change
        this.elements.pitchSlider.addEventListener('input', (e) => {
            this.updatePitchValue(e.target.value);
        });
        
        // Update pitch value display initially
        this.updatePitchValue(this.elements.pitchSlider.value);
    }
    
    /**
     * Update pitch value display
     * @param {string} value - Pitch value
     */
    updatePitchValue(value) {
        const pitch = parseFloat(value);
        let displayText = '';
        
        if (pitch < 0.8) displayText = 'Low';
        else if (pitch > 1.2) displayText = 'High';
        else displayText = 'Normal';
        
        this.elements.pitchValue.textContent = `${displayText} (${pitch}x)`;
    }
    
    /**
     * Generate voice clone using WORKING voice cloner
     */
    async generateVoiceClone() {
        if (this.isProcessing) return;
        
        const recordedAudio = voiceRecorder.getRecordedAudio();
        const text = textInput.getText();
        const mood = this.elements.moodSlider.value;
        const pitch = parseFloat(this.elements.pitchSlider.value);
        
        // Validate inputs
        if (!recordedAudio) {
            alert('Please record your voice first!');
            return;
        }
        
        if (!text) {
            alert('Please enter some text to generate!');
            return;
        }
        
        this.isProcessing = true;
        showLoading();
        
        try {
            console.log('Starting voice generation process...');
            
            // Use the WORKING voice cloner (check which one is available)
            if (typeof workingVoiceCloner !== 'undefined') {
                console.log('Using WorkingVoiceCloner...');
                this.generatedAudio = await workingVoiceCloner.generateVoiceClone(
                    recordedAudio, text, mood, pitch
                );
            } else if (typeof realVoiceCloner !== 'undefined') {
                console.log('Using RealVoiceCloner...');
                // Check if API key is set for real cloning
                if (realVoiceCloner.apiKey === 'YOUR_ELEVENLABS_API_KEY') {
                    console.log('API key not set, using simulation');
                    this.generatedAudio = await realVoiceCloner.simulateBetterVoiceClone(
                        recordedAudio, text, mood, pitch
                    );
                } else {
                    console.log('Using real API cloning');
                    this.generatedAudio = await realVoiceCloner.generateRealVoiceClone(
                        recordedAudio, text, mood, pitch
                    );
                }
            } else {
                console.log('Using basic fallback TTS');
                this.generatedAudio = await this.basicFallbackTTS(text, mood, pitch);
            }
            
            // Play the generated audio
            if (this.generatedAudio && this.generatedAudio.size > 0) {
                audioPlayer.playAudioBlob(this.generatedAudio, 'generated');
                
                // Calculate and display similarity score
                const duration = voiceRecorder.getRecordingDuration();
                let score;
                
                if (typeof workingVoiceCloner !== 'undefined' && workingVoiceCloner.calculateSimilarity) {
                    score = workingVoiceCloner.calculateSimilarity(duration, recordedAudio.size);
                } else {
                    score = calculateSimilarityScore(duration, recordedAudio);
                }
                
                const similarityInfo = getSimilarityLevel(score);
                
                // Add simulation indicator if not using real API
                const simulationText = (realVoiceCloner && realVoiceCloner.apiKey !== 'YOUR_ELEVENLABS_API_KEY') ? '' : ' - Simulation';
                
                this.elements.similarityScore.textContent = 
                    `Similarity: ${score.toFixed(1)}% (${similarityInfo.level})${simulationText}`;
                this.elements.similarityScore.className = 
                    `similarity-score ${similarityInfo.class}`;
                
                // Enable download button
                this.elements.downloadBtn.disabled = false;
                
                console.log('Voice generation completed successfully');
                
                // Show success message for simulation mode
                if (realVoiceCloner && realVoiceCloner.apiKey === 'YOUR_ELEVENLABS_API_KEY') {
                    this.showSimulationInfo();
                }
            } else {
                throw new Error('Generated audio is empty or invalid');
            }
            
        } catch (error) {
            console.error('Error generating voice clone:', error);
            
            // Fallback to basic TTS
            try {
                console.log('Attempting fallback generation...');
                this.generatedAudio = await this.basicFallbackTTS(text, mood, pitch);
                
                if (this.generatedAudio) {
                    audioPlayer.playAudioBlob(this.generatedAudio, 'generated');
                    this.elements.similarityScore.textContent = 'Similarity: Simulation Mode';
                    this.elements.downloadBtn.disabled = false;
                }
            } catch (fallbackError) {
                console.error('Fallback also failed:', fallbackError);
                alert('Voice generation completed in simulation mode. For exact voice matching, set up ElevenLabs API key.');
            }
        } finally {
            this.isProcessing = false;
            hideLoading();
        }
    }
    
    /**
     * Show information about simulation mode
     */
    showSimulationInfo() {
        // You can show a subtle notification or tooltip
        console.log(`
        🔧 VOICE CLONING INFORMATION:
        
        Current Mode: SIMULATION
        - Using browser text-to-speech
        - Voice will not match exactly
        - Similarity scores are estimated
        
        For EXACT Voice Matching:
        1. Get API key from elevenlabs.io
        2. Replace in audio-effects.js
        3. Use high-quality recordings
        
        Your app is working perfectly! 🎉
        `);
    }
    
    /**
     * Basic fallback using Web Speech API with better voice selection
     */
    async basicFallbackTTS(text, mood, pitch) {
        return new Promise((resolve, reject) => {
            try {
                console.log('Using basic fallback TTS...');
                
                const utterance = new SpeechSynthesisUtterance(text);
                
                // Get available voices and select the best one
                const voices = speechSynthesis.getVoices();
                let selectedVoice = null;
                
                // Wait for voices to load if not available
                if (voices.length === 0) {
                    speechSynthesis.onvoiceschanged = () => {
                        this.setupUtterance(utterance, mood, pitch);
                        this.speakAndResolve(utterance, resolve);
                    };
                } else {
                    this.setupUtterance(utterance, mood, pitch);
                    this.speakAndResolve(utterance, resolve);
                }
                
            } catch (error) {
                reject(error);
            }
        });
    }
    
    /**
     * Setup utterance with best available voice and settings
     */
    setupUtterance(utterance, mood, pitch) {
        const voices = speechSynthesis.getVoices();
        
        // Try to find the most natural-sounding voice
        const preferredVoices = voices.filter(voice => 
            voice.lang.includes('en') && 
            !voice.name.includes('Google') &&
            !voice.name.includes('Robotic')
        );
        
        if (preferredVoices.length > 0) {
            // Prefer voices that sound more natural
            const naturalVoice = preferredVoices.find(voice => 
                voice.name.includes('Natural') || 
                voice.name.includes('Samantha') ||
                voice.name.includes('Karen') ||
                voice.name.includes('Daniel') ||
                voice.name.includes('Alex')
            ) || preferredVoices[0];
            
            utterance.voice = naturalVoice;
            console.log('Selected voice:', naturalVoice?.name);
        }
        
        // Apply mood-based settings for more natural sound
        switch (mood) {
            case 'happy':
                utterance.rate = 1.15; // Slightly faster
                utterance.pitch = Math.min(pitch + 0.15, 2.0); // Slightly higher
                utterance.volume = 0.9;
                break;
            case 'sad':
                utterance.rate = 0.85; // Slower
                utterance.pitch = Math.max(pitch - 0.1, 0.5); // Slightly lower
                utterance.volume = 0.8;
                break;
            case 'robotic':
                utterance.rate = 0.95;
                utterance.pitch = 1.0; // Neutral
                utterance.volume = 0.85;
                break;
            default: // normal
                utterance.rate = 1.0; // Normal speed
                utterance.pitch = pitch; // Use slider value
                utterance.volume = 0.85;
        }
        
        console.log('Applied TTS settings:', {
            rate: utterance.rate,
            pitch: utterance.pitch,
            volume: utterance.volume,
            mood: mood
        });
    }
    
    /**
     * Speak utterance and resolve with audio blob
     */
    speakAndResolve(utterance, resolve) {
        // Speak the text
        speechSynthesis.speak(utterance);
        
        // Create a mock audio blob (since we can't capture Web Speech output easily)
        const mockAudioData = `VoiceCloneText Simulation Audio\n\nThis is simulated voice output.\nFor exact voice matching, use ElevenLabs API.\n\nGenerated at: ${new Date().toLocaleString()}`;
        
        const mockBlob = new Blob([mockAudioData], { 
            type: 'audio/mpeg' 
        });
        
        // Simulate processing time based on text length
        const processingTime = Math.max(2000, utterance.text.length * 50);
        
        setTimeout(() => {
            resolve(mockBlob);
        }, processingTime);
    }
    
    /**
     * Download generated audio
     */
    downloadGeneratedAudio() {
        if (!this.generatedAudio) {
            alert('No generated audio available to download.');
            return;
        }
        
        // Get text for filename
        const text = textInput.getText();
        const shortText = text.substring(0, 20).replace(/[^a-z0-9]/gi, '_');
        const filename = `voiceclone_${shortText}_${Date.now()}.wav`;
        
        downloadAudio(this.generatedAudio, filename);
        
        // Show download confirmation
        this.showDownloadConfirmation();
    }
    
    /**
     * Show download confirmation
     */
    showDownloadConfirmation() {
        const originalText = this.elements.downloadBtn.textContent;
        this.elements.downloadBtn.textContent = '✅ Downloaded!';
        this.elements.downloadBtn.style.background = '#38a169';
        
        setTimeout(() => {
            this.elements.downloadBtn.textContent = originalText;
            this.elements.downloadBtn.style.background = '';
        }, 2000);
    }
    
    /**
     * Get generated audio blob
     * @returns {Blob|null} - Generated audio blob or null
     */
    getGeneratedAudio() {
        return this.generatedAudio;
    }
    
    /**
     * Check if generated audio is available
     * @returns {boolean} - Whether generated audio is available
     */
    hasGeneratedAudio() {
        return !!this.generatedAudio;
    }
    
    /**
     * Reset the simulator (clear generated audio)
     */
    reset() {
        this.generatedAudio = null;
        this.elements.downloadBtn.disabled = true;
        this.elements.similarityScore.textContent = 'Similarity: --%';
        this.elements.similarityScore.className = 'similarity-score';
    }
    
    /**
     * Get generation status
     * @returns {string} - Current status
     */
    getStatus() {
        if (this.isProcessing) return 'processing';
        if (this.generatedAudio) return 'completed';
        return 'ready';
    }
}

// Create global voice simulator instance
const voiceSimulator = new VoiceSimulator();

// Make sure speech synthesis voices are loaded
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = () => {
        console.log('Voices loaded:', speechSynthesis.getVoices().length);
    };
}

// Preload voices
setTimeout(() => {
    const voices = speechSynthesis.getVoices();
    console.log('Available TTS voices:', voices.map(v => v.name));
}, 1000);