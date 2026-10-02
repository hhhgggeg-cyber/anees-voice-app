import { useCallback, useEffect, useRef, useState } from 'react';
import type { SpeechRecognition, SpeechRecognitionEvent, SpeechRecognitionErrorEvent } from '@/types/speech';

export interface UseSTTOptions {
  onResult: (transcript: string) => void;
  onError?: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export function useSTT(options: UseSTTOptions) {
  const { onResult, onError, onStart, onEnd } = options;
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  const onStartRef = useRef(onStart);
  const onEndRef = useRef(onEnd);

  // Keep refs current without re-creating the recognition instance
  useEffect(() => {
    onResultRef.current = onResult;
    onErrorRef.current = onError;
    onStartRef.current = onStart;
    onEndRef.current = onEnd;
  });

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) {
      setSupported(false);
      return;
    }

    setSupported(true);

    const recognition = new SR();
    recognition.lang = 'ar-SA';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => {
      setListening(true);
      onStartRef.current?.();
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          transcript = result[0].transcript.trim();
        }
      }
      if (transcript) {
        onResultRef.current(transcript);
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      onErrorRef.current?.(event.error);
    };

    recognition.onend = () => {
      setListening(false);
      onEndRef.current?.();
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onstart = null;
      recognition.onend = null;
      try {
        recognition.abort();
      } catch {
        // ignore
      }
      recognitionRef.current = null;
    };
  }, []);

  const startListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      recognition.start();
    } catch {
      // Recognition already started — restart
      try {
        recognition.abort();
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch {
            // ignore
          }
        }, 200);
      } catch {
        // ignore
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    try {
      recognition.stop();
    } catch {
      // ignore
    }
  }, []);

  return { listening, startListening, stopListening, supported };
}
