import React, { useState, useEffect } from 'react';
import styles from '@/styles/VoiceInput.module.css';

interface VoiceInputProps {
  onQuerySubmit: (query: string) => void;
  defaultQuery?: string;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onQuerySubmit, 
  defaultQuery = 'What do I have scheduled this week?' 
}) => {
  const [query, setQuery] = useState<string>(defaultQuery);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [speechSupported, setSpeechSupported] = useState<boolean>(false);
  
  // Check if browser supports speech recognition
  useEffect(() => {
    const isSpeechRecognitionSupported = 
      'SpeechRecognition' in window || 
      'webkitSpeechRecognition' in window;
    
    setSpeechSupported(isSpeechRecognitionSupported);
  }, []);

  // Toggle voice recognition
  const toggleListening = () => {
    if (!speechSupported) return;
    
    // Using any type to avoid TypeScript errors with the Web Speech API
    // which has inconsistent browser support
    try {
      if (isListening) {
        setIsListening(false);
        // Stop recognition
        const SpeechRecognition = (window as any).SpeechRecognition || 
                                (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          // This is a workaround to stop any ongoing recognition
          const recognition = new SpeechRecognition();
          recognition.stop();
        }
      } else {
        const SpeechRecognition = (window as any).SpeechRecognition || 
                                (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.continuous = false;
          recognition.interimResults = false;
          recognition.lang = 'en-US';
          
          recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setQuery(transcript);
            setIsListening(false);
          };
          
          recognition.onerror = () => {
            setIsListening(false);
          };
          
          recognition.onend = () => {
            setIsListening(false);
          };
          
          recognition.start();
          setIsListening(true);
        }
      }
    } catch (error) {
      console.error('Speech recognition error:', error);
      setIsListening(false);
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onQuerySubmit(query);
    }
  };

  return (
    <div className={styles.voiceInputContainer}>
      <form onSubmit={handleSubmit} className={styles.inputForm}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask about your schedule..."
          className={styles.textInput}
        />
        
        <div className={styles.buttonGroup}>
          {speechSupported && (
            <button 
              type="button" 
              onClick={toggleListening}
              className={`${styles.voiceButton} ${isListening ? styles.listening : ''}`}
              title={isListening ? 'Stop listening' : 'Start voice input'}
            >
              🎤
            </button>
          )}
          
          <button type="submit" className={styles.submitButton}>
            Search
          </button>
        </div>
      </form>
      
      {isListening && (
        <div className={styles.listeningIndicator}>
          Listening...
        </div>
      )}
    </div>
  );
};

export default VoiceInput;

// TypeScript declarations for the Web Speech API are now in /types/speech-recognition.d.ts
