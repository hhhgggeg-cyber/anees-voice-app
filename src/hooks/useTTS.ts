import { useCallback, useEffect, useRef, useState } from 'react';

export interface SpeakOptions {
  onEnd?: () => void;
  onStart?: () => void;
  rate?: number;
  pitch?: number;
}

export function useTTS() {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSupported(true);

      const loadVoices = () => {
        const allVoices = window.speechSynthesis.getVoices();
        voicesRef.current = allVoices;
      };

      loadVoices();
      window.speechSynthesis.onvoiceschanged = loadVoices;

      return () => {
        window.speechSynthesis.onvoiceschanged = null;
        window.speechSynthesis.cancel();
      };
    }
  }, []);

  const pickArabicVoice = useCallback((): SpeechSynthesisVoice | null => {
    const voices = voicesRef.current;
    if (!voices.length) return null;

    // Prefer male Arabic voices
    const maleArabic = voices.find(
      (v) => v.lang.startsWith('ar') && /male|mishary|hamed|saber|mohammad|ahmed/i.test(v.name)
    );
    if (maleArabic) return maleArabic;

    // Any Arabic voice
    const arabicVoice = voices.find((v) => v.lang.startsWith('ar'));
    if (arabicVoice) return arabicVoice;

    // Fallback: any voice
    return voices[0] ?? null;
  }, []);

  const speak = useCallback(
    (text: string, opts?: SpeakOptions) => {
      if (!('speechSynthesis' in window)) {
        opts?.onEnd?.();
        return;
      }

      window.speechSynthesis.cancel();

      // Split very long text into sentences for better reliability
      const sentences = text.match(/[^.!؟]+[.!؟]?/g) || [text];

      let chainEnded = false;
      const total = sentences.length;

      sentences.forEach((sentence, i) => {
        const utterance = new SpeechSynthesisUtterance(sentence.trim());
        const voice = pickArabicVoice();
        if (voice) {
          utterance.voice = voice;
          utterance.lang = voice.lang;
        } else {
          utterance.lang = 'ar-SA';
        }
        utterance.rate = opts?.rate ?? 0.85;
        utterance.pitch = opts?.pitch ?? 0.95;
        utterance.volume = 1;

        if (i === 0) {
          utterance.onstart = () => {
            setSpeaking(true);
            opts?.onStart?.();
          };
        }

        if (i === total - 1) {
          utterance.onend = () => {
            if (!chainEnded) {
              chainEnded = true;
              setSpeaking(false);
              opts?.onEnd?.();
            }
          };
          utterance.onerror = () => {
            if (!chainEnded) {
              chainEnded = true;
              setSpeaking(false);
              opts?.onEnd?.();
            }
          };
        }

        window.speechSynthesis.speak(utterance);
      });
    },
    [pickArabicVoice]
  );

  const stop = useCallback(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setSpeaking(false);
  }, []);

  return { speak, stop, speaking, supported };
}
