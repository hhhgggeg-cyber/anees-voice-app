import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, Square, Repeat, SkipForward, ChevronLeft } from 'lucide-react';
import { getVersesForSurah, type Verse } from '@/data/quranVerses';
import type { Surah } from '@/data/surahs';

interface QuranPlayerProps {
  surah: Surah;
  audioUrl: string;
  onBack: () => void;
  onDone: () => void;
}

export function QuranPlayer({ surah, audioUrl, onBack, onDone }: QuranPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeVerse, setActiveVerse] = useState(0);
  const [repeatMode, setRepeatMode] = useState(false);
  const verses = getVersesForSurah(surah.number);
  const verseTimingsRef = useRef<{ start: number; end: number; verse: Verse }[]>([]);

  // Calculate verse timings from total duration
  useEffect(() => {
    if (!verses || !duration) return;
    const totalVerseTime = verses.reduce((sum, v) => sum + v.durationSec, 0);
    let offset = 0;
    verseTimingsRef.current = verses.map((v) => {
      const start = offset;
      offset += (v.durationSec / totalVerseTime) * duration;
      return { start, end: offset, verse: v };
    });
  }, [verses, duration]);

  // Track active verse during playback
  useEffect(() => {
    if (!verseTimingsRef.current.length || !playing) return;
    const timings = verseTimingsRef.current;
    const current = timings.findIndex((t) => currentTime >= t.start && currentTime < t.end);
    if (current !== -1 && current !== activeVerse) {
      setActiveVerse(current);
    }
  }, [currentTime, playing, activeVerse]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };
    const handleLoaded = () => {
      setDuration(audio.duration);
      setLoading(false);
      audio.play().catch(() => setPlaying(false));
    };
    const handleEnded = () => {
      if (repeatMode && verses) {
        audio.currentTime = 0;
        audio.play().catch(() => setError(true));
        setActiveVerse(0);
      } else {
        setPlaying(false);
        onDone();
      }
    };
    const handleError = () => {
      setLoading(false);
      setError(true);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [audioUrl, onDone, repeatMode, verses]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => setError(true));
      setPlaying(true);
    }
  };

  const stop = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setPlaying(false);
    onBack();
  };

  const repeatVerse = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !verseTimingsRef.current.length) return;
    const currentTiming = verseTimingsRef.current[activeVerse];
    if (currentTiming) {
      audio.currentTime = currentTiming.start;
      audio.play().catch(() => setError(true));
      setPlaying(true);
    }
  }, [activeVerse]);

  const nextVerse = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !verseTimingsRef.current.length) return;
    const nextIdx = Math.min(activeVerse + 1, verseTimingsRef.current.length - 1);
    const nextTiming = verseTimingsRef.current[nextIdx];
    if (nextTiming) {
      audio.currentTime = nextTiming.start;
      audio.play().catch(() => setError(true));
      setPlaying(true);
    }
  }, [activeVerse]);

  const formatTime = (s: number): string => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-[70vh] animate-fade-in px-4 py-6" dir="rtl">
      {/* Header */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between mb-6">
        <button
          onClick={stop}
          className="touch-target w-12 h-12 rounded-xl bg-emerald-800/50 hover:bg-emerald-700 flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-cream-100" />
        </button>
        <div className="text-center">
          <h2 className="text-2xl font-cairo font-bold text-gold-gradient">سُورَةُ {surah.name}</h2>
          <p className="text-sm font-cairo text-cream-200/50">تِلَاوَةُ الشَّيْخِ المُعَيْقِلِي</p>
        </div>
        <div className="w-12" />
      </div>

      <audio ref={audioRef} src={audioUrl} preload="auto" />

      {/* Verse follow-along */}
      {verses && !loading && !error && (
        <div className="flex-1 w-full max-w-md mx-auto overflow-y-auto scrollbar-hidden mb-4 max-h-[45vh]">
          <div className="space-y-3 py-2">
            {verses.map((verse, i) => (
              <div
                key={verse.numberInSurah}
                className={`
                  rounded-2xl p-4 transition-all duration-500
                  ${i === activeVerse
                    ? 'bg-gold-500/15 border border-gold-400/40 scale-[1.02] shadow-[0_0_20px_rgba(212,175,55,0.15)]'
                    : 'bg-emerald-900/20 border border-transparent'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <span className={`
                    flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-cairo font-bold
                    ${i === activeVerse ? 'bg-gold-400 text-charcoal-900' : 'bg-emerald-800/50 text-cream-200/50'}
                  `}>
                    {verse.numberInSurah}
                  </span>
                  <p className={`
                    font-amiri leading-loose text-right flex-1
                    ${i === activeVerse ? 'text-cream-100 text-xl' : 'text-cream-200/40 text-lg'}
                    transition-colors duration-500
                  `}>
                    {verse.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && !error && (
        <div className="flex items-center justify-center gap-3 py-12">
          <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
          <span className="font-cairo text-cream-200/70 text-lg">جَارٍ تَحْمِيلُ التِّلَاوَة...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-12 space-y-2">
          <p className="font-cairo text-red-400 text-lg">تَعَذَّرَ تَشْغِيلُ الصَّوْت</p>
          <p className="text-sm font-cairo text-cream-200/50">تَحَقَّقْ مِنْ اِتِّصَالِ الإِنْتَرْنَت</p>
        </div>
      )}

      {/* Player controls */}
      {!loading && !error && (
        <div className="w-full max-w-md mx-auto">
          {/* Progress bar */}
          <div className="w-full h-2 bg-emerald-900/50 rounded-full overflow-hidden mb-2">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-gold-400 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between text-sm font-cairo text-cream-200/50 mb-4">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            {/* Repeat verse */}
            {verses && (
              <button
                onClick={repeatVerse}
                className="touch-target w-14 h-14 rounded-full bg-emerald-800/60 hover:bg-emerald-700 flex items-center justify-center transition-colors active:scale-95"
                aria-label="تكرار الآية"
                title="تَكْرَارُ الآيَة"
              >
                <Repeat className="w-6 h-6 text-gold-400" />
              </button>
            )}

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="touch-target w-16 h-16 rounded-full bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center transition-colors active:scale-95"
              aria-label={playing ? 'إيقاف مؤقت' : 'تشغيل'}
            >
              {playing ? (
                <Pause className="w-8 h-8 text-white" fill="currentColor" />
              ) : (
                <Play className="w-8 h-8 text-white mr-1" fill="currentColor" />
              )}
            </button>

            {/* Next verse */}
            {verses && (
              <button
                onClick={nextVerse}
                className="touch-target w-14 h-14 rounded-full bg-emerald-800/60 hover:bg-emerald-700 flex items-center justify-center transition-colors active:scale-95"
                aria-label="الآية التالية"
                title="الآيَةُ التَّالِيَة"
              >
                <SkipForward className="w-6 h-6 text-gold-400" />
              </button>
            )}

            {/* Stop */}
            <button
              onClick={stop}
              className="touch-target w-14 h-14 rounded-full bg-emerald-900/50 hover:bg-emerald-800 flex items-center justify-center transition-colors active:scale-95"
              aria-label="إيقاف"
            >
              <Square className="w-6 h-6 text-cream-200" fill="currentColor" />
            </button>
          </div>

          {/* Repeat mode toggle */}
          {verses && (
            <div className="flex items-center justify-center mt-4">
              <button
                onClick={() => setRepeatMode(!repeatMode)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-cairo transition-colors ${
                  repeatMode
                    ? 'bg-gold-500/20 text-gold-300 border border-gold-400/40'
                    : 'bg-emerald-900/30 text-cream-200/40 border border-transparent'
                }`}
              >
                <Repeat className="w-4 h-4" />
                {repeatMode ? 'تِكْرَارُ السُّورَة مُفَعَّل' : 'تِكْرَارُ السُّورَة'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
