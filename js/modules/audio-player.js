/**
 * Audio Player Module
 * Handles audio playback functionality
 */

class AudioPlayer {
    constructor() {
        this.audioElements = {
            original: document.getElementById('originalAudio'),
            generated: document.getElementById('generatedAudio')
        };
        this.currentPlaying = null;
    }
    
    /**
     * Play audio from a blob
     * @param {Blob} audioBlob - The audio blob to play
     * @param {string} type - Type of audio ('original' or 'generated')
     */
    playAudioBlob(audioBlob, type = 'generated') {
        if (!this.audioElements[type]) {
            console.error(`Audio element not found for type: ${type}`);
            return;
        }
        
        // Create object URL from blob
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Set the audio source and play
        this.audioElements[type].src = audioUrl;
        this.audioElements[type].load();
        
        // Play the audio
        this.audioElements[type].play().catch(error => {
            console.error('Error playing audio:', error);
        });
        
        // Store reference to currently playing audio
        this.currentPlaying = this.audioElements[type];
    }
    
    /**
     * Play audio from URL
     * @param {string} audioUrl - The audio URL to play
     * @param {string} type - Type of audio ('original' or 'generated')
     */
    playAudioUrl(audioUrl, type = 'generated') {
        if (!this.audioElements[type]) {
            console.error(`Audio element not found for type: ${type}`);
            return;
        }
        
        this.audioElements[type].src = audioUrl;
        this.audioElements[type].load();
        this.audioElements[type].play().catch(error => {
            console.error('Error playing audio:', error);
        });
        
        this.currentPlaying = this.audioElements[type];
    }
    
    /**
     * Stop currently playing audio
     */
    stopAllAudio() {
        Object.values(this.audioElements).forEach(audio => {
            audio.pause();
            audio.currentTime = 0;
        });
        this.currentPlaying = null;
    }
    
    /**
     * Set volume for all audio elements
     * @param {number} volume - Volume level (0 to 1)
     */
    setVolume(volume) {
        Object.values(this.audioElements).forEach(audio => {
            audio.volume = Math.max(0, Math.min(1, volume));
        });
    }
    
    /**
     * Get duration of audio blob
     * @param {Blob} audioBlob - The audio blob
     * @returns {Promise<number>} - Duration in seconds
     */
    getAudioDuration(audioBlob) {
        return new Promise((resolve) => {
            const audio = new Audio();
            audio.src = URL.createObjectURL(audioBlob);
            
            audio.addEventListener('loadedmetadata', () => {
                resolve(audio.duration);
                URL.revokeObjectURL(audio.src);
            });
            
            audio.addEventListener('error', () => {
                resolve(0);
                URL.revokeObjectURL(audio.src);
            });
        });
    }
}

// Create global audio player instance
const audioPlayer = new AudioPlayer();