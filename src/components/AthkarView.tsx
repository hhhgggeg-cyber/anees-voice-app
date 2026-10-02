import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft } from 'lucide-react';
import { morningAthkar, eveningAthkar, type AthkarItem } from '@/data/athkar';
import { useTTS } from '@/hooks/useTTS';
import { getAutoAthkarMode } from '@/lib/commandParser';

interface AthkarViewProps {
  mode: 'morning' | 'evening' | 'auto';
  onBack: () => void;
}

export function AthkarView({ mode, onBack }: AthkarViewProps) {
  const actualMode = mode === 'auto' ? getAutoAthkarMode() : mode;
  const items: AthkarItem[] = actualMode === 'morning' ? morningAthkar : eveningAthkar;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [repetition, setRepetition] = useState(1);
  const { speak, stop, speaking } = useTTS();

  const isLastItem = currentIndex === items.length - 1;
  const currentItem = items[currentIndex];

  const goNext = useCallback(() => {
    stop();
    if (isLastItem) {
      speak('تمت الأذكار بحمد الله');
      onBack();
      return;
    }
    setCurrentIndex((i) => i + 1);
    setRepetition(1);
  }, [currentIndex, isLastItem, speak, stop, onBack]);

  // Auto-read current dhikr
  useEffect(() => {
    speak(currentItem.arabicText, {
      onEnd: () => {
        if (repetition < currentItem.count) {
          setRepetition((r) => r + 1);
        } else {
          // Wait a moment then go next
          setTimeout(goNext, 800);
        }
      },
    });
  }, [currentIndex, repetition]);

  const handleBack = () => {
    stop();
    onBack();
  };

  const handleSkip = () => {
    goNext();
  };

  return (
    <div className="flex flex-col items-center min-h-[70vh] px-6 py-8 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="w-full max-w-md flex items-center justify-between mb-8">
        <button
          onClick={handleBack}
          className="touch-target w-12 h-12 rounded-xl bg-emerald-800/50 hover:bg-emerald-700 flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-cream-100" />
        </button>
        <h2 className="text-2xl font-cairo font-bold text-gold-gradient">
          {actualMode === 'morning' ? 'أذكار الصباح' : 'أذكار المساء'}
        </h2>
        <div className="w-12" />
      </div>

      {/* Progress indicator */}
      <div className="flex gap-1.5 mb-8">
        {items.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === currentIndex ? 'w-8 bg-gold-400' : i < currentIndex ? 'w-1.5 bg-gold-400/50' : 'w-1.5 bg-emerald-900/50'
            }`}
          />
        ))}
      </div>

      {/* Dhikr card */}
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 mb-6 min-h-[300px] flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-cairo text-gold-300 bg-gold-500/10 px-3 py-1 rounded-full">
            {currentIndex + 1} / {items.length}
          </span>
          {currentItem.count > 1 && (
            <span className="text-sm font-cairo text-emerald-300 bg-emerald-600/10 px-3 py-1 rounded-full">
              التكرار: {repetition} / {currentItem.count}
            </span>
          )}
        </div>

        <h3 className="text-xl font-cairo font-bold text-gold-400 mb-4 text-center">
          {currentItem.title}
        </h3>

        <p className="text-xl font-amiri leading-loose text-cream-100 text-center flex-1 flex items-center justify-center">
          {currentItem.arabicText}
        </p>

        <p className="text-sm font-cairo text-cream-200/40 text-center mt-4">
          {currentItem.source}
        </p>
      </div>

      {/* Speaking indicator */}
      {speaking && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-end gap-1 h-6">
            <div className="w-1.5 bg-gold-400 rounded-full animate-pulse" style={{ height: '40%' }} />
            <div className="w-1.5 bg-gold-400 rounded-full animate-pulse" style={{ height: '70%', animationDelay: '0.1s' }} />
            <div className="w-1.5 bg-gold-400 rounded-full animate-pulse" style={{ height: '100%', animationDelay: '0.2s' }} />
            <div className="w-1.5 bg-gold-400 rounded-full animate-pulse" style={{ height: '60%', animationDelay: '0.3s' }} />
          </div>
          <span className="font-cairo text-gold-300 text-sm">جارٍ التلاوة...</span>
        </div>
      )}

      {/* Controls */}
      <div className="flex gap-4">
        <button
          onClick={handleSkip}
          className="touch-target px-6 py-3 bg-emerald-700 hover:bg-emerald-600 rounded-2xl text-lg font-cairo text-cream-100 transition-colors active:scale-95"
        >
          التالي
        </button>
        <button
          onClick={handleBack}
          className="touch-target px-6 py-3 bg-emerald-900/50 hover:bg-emerald-800 rounded-2xl text-lg font-cairo text-cream-200/70 transition-colors active:scale-95"
        >
          إنهاء
        </button>
      </div>
    </div>
  );
}
