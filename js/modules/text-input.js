/**
 * Text Input Module
 * Handles text input and validation
 */

class TextInput {
    constructor() {
        this.textArea = document.getElementById('textInput');
        this.charCount = document.getElementById('charCount');
        this.clearBtn = document.getElementById('clearTextBtn');
        
        this.initializeEventListeners();
    }
    
    /**
     * Initialize event listeners for text input
     */
    initializeEventListeners() {
        // Update character count on input
        this.textArea.addEventListener('input', () => {
            this.updateCharCount();
            this.checkGenerateButtonState();
        });
        
        // Clear text button
        this.clearBtn.addEventListener('click', () => {
            this.clearText();
        });
        
        // Validate on blur
        this.textArea.addEventListener('blur', () => {
            this.validateText();
        });
    }
    
    /**
     * Update character count display
     */
    updateCharCount() {
        const count = this.textArea.value.length;
        this.charCount.textContent = count;
        
        // Add warning class if approaching limit
        if (count > 800) {
            this.charCount.classList.add('warning');
        } else {
            this.charCount.classList.remove('warning');
        }
    }
    
    /**
     * Validate text input
     * @returns {Object} - Validation result
     */
    validateText() {
        const result = validateText(this.textArea.value);
        
        if (!result.isValid) {
            // Show error visually (you could add more sophisticated error handling)
            this.textArea.style.borderColor = '#e53e3e';
            console.warn('Text validation failed:', result.message);
        } else {
            this.textArea.style.borderColor = '#e2e8f0';
        }
        
        return result;
    }
    
    /**
     * Clear text input
     */
    clearText() {
        this.textArea.value = '';
        this.updateCharCount();
        this.checkGenerateButtonState();
        this.textArea.focus();
    }
    
    /**
     * Check if generate button should be enabled
     */
    checkGenerateButtonState() {
        const generateBtn = document.getElementById('generateBtn');
        const hasRecording = voiceRecorder.hasRecording();
        const hasText = this.textArea.value.trim().length > 0;
        
        generateBtn.disabled = !(hasRecording && hasText);
    }
    
    /**
     * Get current text
     * @returns {string} - Current text content
     */
    getText() {
        return this.textArea.value.trim();
    }
    
    /**
     * Set text content
     * @param {string} text - Text to set
     */
    setText(text) {
        this.textArea.value = text;
        this.updateCharCount();
        this.checkGenerateButtonState();
    }
    
    /**
     * Check if text is available
     * @returns {boolean} - Whether text is available
     */
    hasText() {
        return this.textArea.value.trim().length > 0;
    }
}

// Create global text input instance
const textInput = new TextInput();