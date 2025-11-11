/**
 * Main Application File
 * Initializes and coordinates all modules
 */

class VoiceCloneTextApp {
    constructor() {
        this.modules = {
            recorder: voiceRecorder,
            textInput: textInput,
            voiceSimulator: voiceSimulator,
            audioPlayer: audioPlayer
        };
        
        this.initializeApp();
    }
    
    /**
     * Initialize the application
     */
    initializeApp() {
        console.log('🎙️ VoiceCloneText App Initializing...');
        
        // Check browser compatibility
        if (!this.checkCompatibility()) {
            this.showCompatibilityError();
            return;
        }
        
        // Initialize modules
        this.initializeModules();
        
        // Set up global event listeners
        this.setupGlobalEventListeners();
        
        // Show welcome message
        this.showWelcomeMessage();
        
        console.log('✅ VoiceCloneText App Ready!');
    }
    
    /**
     * Check browser compatibility
     * @returns {boolean} - Whether browser is compatible
     */
    checkCompatibility() {
        const requiredAPIs = [
            'MediaRecorder',
            'navigator.mediaDevices.getUserMedia',
            'AudioContext',
            'speechSynthesis'
        ];
        
        for (const api of requiredAPIs) {
            if (!this.checkAPI(api)) {
                console.error(`Missing required API: ${api}`);
                return false;
            }
        }
        
        return true;
    }
    
    /**
     * Check if specific API is available
     * @param {string} api - API name to check
     * @returns {boolean} - Whether API is available
     */
    checkAPI(api) {
        try {
            const parts = api.split('.');
            let obj = window;
            
            for (const part of parts) {
                if (!obj[part]) return false;
                obj = obj[part];
            }
            
            return true;
        } catch (error) {
            return false;
        }
    }
    
    /**
     * Show compatibility error message
     */
    showCompatibilityError() {
        const errorHtml = `
            <div class="compatibility-error" style="
                background: #fed7d7;
                border: 2px solid #e53e3e;
                border-radius: 10px;
                padding: 20px;
                margin: 20px 0;
                text-align: center;
                color: #742a2a;
            ">
                <h3>🚫 Browser Compatibility Issue</h3>
                <p>Your browser doesn't support all required features for VoiceCloneText.</p>
                <p>Please try using a modern browser like Chrome, Firefox, or Edge.</p>
                <p><small>Required: MediaRecorder API, Microphone Access, Web Audio API</small></p>
            </div>
        `;
        
        document.querySelector('.app-container').innerHTML = errorHtml;
    }
    
    /**
     * Initialize all modules
     */
    initializeModules() {
        // Modules are already initialized when their files are loaded
        // This is where we would coordinate module initialization if needed
        console.log('📦 All modules initialized');
    }
    
    /**
     * Set up global event listeners
     */
    setupGlobalEventListeners() {
        // Listen for recording completion
        document.addEventListener('recordingComplete', (event) => {
            console.log('Recording completed event received:', event.detail);
        });
        
        // Handle page visibility changes (pause audio when tab is hidden)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                audioPlayer.stopAllAudio();
            }
        });
        
        // Handle beforeunload to clean up resources
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }
    
    /**
     * Show welcome message and instructions
     */
    showWelcomeMessage() {
        console.log(`
            🎉 Welcome to VoiceCloneText!
            
            How to use:
            1. Click "Start Recording" and read the sample text
            2. Type any text you want to hear in your voice
            3. Adjust voice settings if desired
            4. Click "Generate Voice Clone"
            5. Listen to and download your generated audio!
            
            Note: This is a prototype using simulated voice cloning.
            Real voice cloning would require advanced AI models.
        `);
    }
    
    /**
     * Clean up resources
     */
    cleanup() {
        audioPlayer.stopAllAudio();
        
        // Revoke any object URLs
        // Additional cleanup can be added here
    }
    
    /**
     * Get app version and info
     * @returns {Object} - App information
     */
    getAppInfo() {
        return {
            name: 'VoiceCloneText',
            version: '1.0.0',
            type: 'Prototype',
            description: 'Generate text in your own voice - Simulation Demo'
        };
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.voiceCloneApp = new VoiceCloneTextApp();
});

// Export for testing or external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = VoiceCloneTextApp;
}