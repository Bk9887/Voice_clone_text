/**
 * Voice Recorder Module - FIXED VERSION
 * Handles audio recording functionality
 */

class VoiceRecorder {
    constructor() {
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.isRecording = false;
        this.recordingStartTime = 0;
        this.recordingTimer = null;
        this.recordingDuration = 0;
        this.audioStream = null; // Added to track stream
        
        // Maximum recording duration (7 seconds)
        this.maxDuration = 7000;
        
        // DOM Elements
        this.elements = {
            startBtn: document.getElementById('startRecordBtn'),
            stopBtn: document.getElementById('stopRecordBtn'),
            playBtn: document.getElementById('playRecordedBtn'),
            status: document.getElementById('recordingStatus'),
            timer: document.getElementById('timer'),
            waveform: document.getElementById('waveform')
        };
        
        // Initialize event listeners
        this.initializeEventListeners();
    }
    
    /**
     * Initialize event listeners for recorder controls
     */
    initializeEventListeners() {
        this.elements.startBtn.addEventListener('click', () => this.startRecording());
        this.elements.stopBtn.addEventListener('click', () => this.stopRecording());
        this.elements.playBtn.addEventListener('click', () => this.playRecording());
    }
    
    /**
     * Start audio recording - FIXED VERSION
     */
    async startRecording() {
        try {
            console.log('Starting recording...');
            
            // Request microphone access with better error handling
            this.audioStream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                    channelCount: 1
                } 
            }).catch(error => {
                console.error('Microphone access denied:', error);
                throw new Error('Microphone access is required for recording. Please allow microphone permissions.');
            });
            
            // Check available MIME types and choose compatible one
            const options = { 
                audioBitsPerSecond: 128000 
            };
            
            if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
                options.mimeType = 'audio/webm;codecs=opus';
            } else if (MediaRecorder.isTypeSupported('audio/webm')) {
                options.mimeType = 'audio/webm';
            } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
                options.mimeType = 'audio/mp4';
            }
            // If no specific MIME type is supported, use default
            
            console.log('Using MIME type:', options.mimeType || 'default');
            
            // Initialize MediaRecorder
            this.mediaRecorder = new MediaRecorder(this.audioStream, options);
            
            // Reset audio chunks
            this.audioChunks = [];
            
            // Set up data available event
            this.mediaRecorder.ondataavailable = (event) => {
                console.log('Data available:', event.data.size, 'bytes');
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };
            
            // Set up recording stop event
            this.mediaRecorder.onstop = () => {
                console.log('Recording stopped, processing audio...');
                this.handleRecordingStop();
            };
            
            // Set up recording error event
            this.mediaRecorder.onerror = (event) => {
                console.error('MediaRecorder error:', event);
                alert('Recording error occurred. Please try again.');
                this.stopRecording();
            };
            
            // Start recording with timeslice (important for some browsers)
            this.mediaRecorder.start(100); // Collect data every 100ms
            this.isRecording = true;
            this.recordingStartTime = Date.now();
            
            // Update UI
            this.updateUIForRecording(true);
            
            // Start timer
            this.startTimer();
            
            console.log('Recording started successfully');
            
            // Auto-stop after max duration
            setTimeout(() => {
                if (this.isRecording) {
                    console.log('Auto-stopping recording after 7 seconds');
                    this.stopRecording();
                }
            }, this.maxDuration);
            
        } catch (error) {
            console.error('Error starting recording:', error);
            alert(`Unable to start recording: ${error.message}`);
            this.updateUIForRecording(false);
        }
    }
    
    /**
     * Stop audio recording - FIXED VERSION
     */
    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            console.log('Manually stopping recording...');
            this.mediaRecorder.stop();
            this.isRecording = false;
            
            // Stop timer
            this.stopTimer();
            
            // Stop all tracks in the stream
            if (this.audioStream) {
                this.audioStream.getTracks().forEach(track => {
                    track.stop();
                    console.log('Stopped track:', track.kind);
                });
                this.audioStream = null;
            }
        } else {
            console.log('No active recording to stop');
        }
    }
    
    /**
     * Handle recording stop and process audio data - FIXED VERSION
     */
    handleRecordingStop() {
        console.log('Processing recorded audio...');
        
        // Determine the MIME type for the blob
        let mimeType = 'audio/webm';
        if (this.audioChunks.length > 0 && this.audioChunks[0].type) {
            mimeType = this.audioChunks[0].type;
        }
        
        // Create audio blob from collected chunks
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        
        // Store the recording
        this.recordedAudio = audioBlob;
        this.recordingDuration = (Date.now() - this.recordingStartTime) / 1000;
        
        console.log(`Recording completed: ${this.recordingDuration.toFixed(2)}s, Size: ${audioBlob.size} bytes`);
        
        // Update UI
        this.updateUIForRecording(false);
        
        // Enable generate button if we have text
        this.checkGenerateButtonState();
        
        // Create object URL for playback
        const audioUrl = URL.createObjectURL(audioBlob);
        this.recordedAudioUrl = audioUrl;
        
        // Set the audio source for playback
        const originalAudio = document.getElementById('originalAudio');
        if (originalAudio) {
            originalAudio.src = audioUrl;
            console.log('Audio source set for playback');
        }
        
        // Dispatch custom event for recording completion
        const event = new CustomEvent('recordingComplete', { 
            detail: { 
                audioBlob: audioBlob,
                duration: this.recordingDuration,
                audioUrl: audioUrl
            } 
        });
        document.dispatchEvent(event);
    }
    
    /**
     * Play the recorded audio - FIXED VERSION
     */
    playRecording() {
        if (this.recordedAudioUrl) {
            console.log('Playing recorded audio...');
            const audio = new Audio(this.recordedAudioUrl);
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
                alert('Error playing audio. The recording might be corrupted.');
            });
        } else if (this.recordedAudio) {
            // Fallback: create URL from blob
            const audioUrl = URL.createObjectURL(this.recordedAudio);
            const audio = new Audio(audioUrl);
            audio.play().catch(error => {
                console.error('Error playing audio:', error);
            });
        } else {
            console.log('No recording available to play');
            alert('No recording available. Please record your voice first.');
        }
    }
    
    /**
     * Start recording timer
     */
    startTimer() {
        this.elements.timer.textContent = '00:00';
        this.recordingTimer = setInterval(() => {
            const elapsed = Date.now() - this.recordingStartTime;
            this.elements.timer.textContent = formatTime(elapsed / 1000);
            
            // Update recording duration
            this.recordingDuration = elapsed / 1000;
            
            // Stop if exceeded max duration (safety check)
            if (elapsed > this.maxDuration + 1000) {
                this.stopRecording();
            }
        }, 100);
    }
    
    /**
     * Stop recording timer
     */
    stopTimer() {
        if (this.recordingTimer) {
            clearInterval(this.recordingTimer);
            this.recordingTimer = null;
        }
    }
    
    /**
     * Update UI based on recording state
     * @param {boolean} recording - Whether recording is in progress
     */
    updateUIForRecording(recording) {
        if (recording) {
            this.elements.startBtn.disabled = true;
            this.elements.stopBtn.disabled = false;
            this.elements.playBtn.disabled = true;
            this.elements.status.textContent = '🎤 Recording... Speak now!';
            this.elements.status.classList.add('recording');
            this.elements.waveform.classList.add('recording');
        } else {
            this.elements.startBtn.disabled = false;
            this.elements.stopBtn.disabled = true;
            this.elements.playBtn.disabled = false;
            this.elements.status.textContent = '✅ Recording complete! Click play to listen';
            this.elements.status.classList.remove('recording');
            this.elements.waveform.classList.remove('recording');
        }
    }
    
    /**
     * Check if we can enable the generate button
     */
    checkGenerateButtonState() {
        const textInput = document.getElementById('textInput');
        const generateBtn = document.getElementById('generateBtn');
        
        if (this.recordedAudio && textInput.value.trim().length > 0) {
            generateBtn.disabled = false;
            console.log('Generate button enabled');
        }
    }
    
    /**
     * Get the recorded audio blob
     * @returns {Blob|null} - Recorded audio blob or null
     */
    getRecordedAudio() {
        return this.recordedAudio || null;
    }
    
    /**
     * Get recording duration
     * @returns {number} - Recording duration in seconds
     */
    getRecordingDuration() {
        return this.recordingDuration || 0;
    }
    
    /**
     * Check if recording is available
     * @returns {boolean} - Whether recording is available
     */
    hasRecording() {
        return !!this.recordedAudio;
    }
    
    /**
     * Clean up resources
     */
    cleanup() {
        this.stopRecording();
        if (this.recordedAudioUrl) {
            URL.revokeObjectURL(this.recordedAudioUrl);
        }
    }
}

// Create global recorder instance
const voiceRecorder = new VoiceRecorder();