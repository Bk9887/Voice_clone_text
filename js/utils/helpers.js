/**
 * Utility functions for VoiceCloneText
 * Contains helper functions used across the application
 */

// Format time from seconds to MM:SS format
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Validate text input
function validateText(text) {
    if (!text || text.trim().length === 0) {
        return { isValid: false, message: 'Please enter some text' };
    }
    
    if (text.length > 1000) {
        return { isValid: false, message: 'Text too long (max 1000 characters)' };
    }
    
    return { isValid: true, message: 'Text is valid' };
}

// Calculate fake similarity score based on recording quality
function calculateSimilarityScore(recordingDuration, audioBlob) {
    // This is a mock function - in real implementation, 
    // this would use AI to compare voice embeddings
    
    // Base score on recording duration and some random factors
    let score = Math.min(recordingDuration / 7 * 70, 70); // Max 70% for base
    
    // Add some random variation to make it interesting
    score += Math.random() * 30;
    
    // Ensure score is between 0-95%
    return Math.min(Math.max(score, 10), 95);
}

// Get similarity level text and CSS class
function getSimilarityLevel(score) {
    if (score >= 80) return { level: 'High', class: 'high' };
    if (score >= 60) return { level: 'Medium', class: 'medium' };
    return { level: 'Low', class: 'low' };
}

// Download audio blob as file
function downloadAudio(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Show loading state
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

// Hide loading state
function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// Export utility functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formatTime,
        validateText,
        calculateSimilarityScore,
        getSimilarityLevel,
        downloadAudio,
        showLoading,
        hideLoading
    };
}