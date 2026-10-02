import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Square, Volume2 } from 'lucide-react';

interface NowPlayingProps {
  title: string;
  subtitle: string;
  audioUrl: string;
  onDone: () => void;
  onClose: () => void;
}

export function NowPlaying({ title, subtitle, audioUrl, onDone, onClose }: NowPlayingProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
      audio.play().catch(() => {
        setPlaying(false);
      });
    };
    const handleEnded = () => {
      setPlaying(false);
      onDone();
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
  }, [audioUrl, onDone]);

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
    onClose();
  };

  const formatTime = (s: number): string => {
    if (!s || isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="glass-panel rounded-3xl p-6 w-full max-w-md mx-auto animate-slide-up" dir="rtl">
      {/* Hidden audio element */}
      <audio ref={audioRef} src={audioUrl} preload="auto" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-600/30 flex items-center justify-center flex-shrink-0">
          <Volume2 className="w-6 h-6 text-gold-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-lg font-cairo font-bold text-cream-100 truncate">{title}</p>
          <p className="text-sm font-cairo text-cream-200/60 truncate">{subtitle}</p>
        </div>
      </div>

      {/* Loading state */}
      {loading && !error && (
        <div className="flex items-center justify-center gap-3 py-6">
          <div className="w-6 h-6 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
          <span className="font-cairo text-cream-200/70">جارٍ التحميل...</span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="text-center py-6 space-y-2">
          <p className="font-cairo text-red-400">تعذّر تشغيل الصوت</p>
          <p className="text-sm font-cairo text-cream-200/50">تحقق من اتصال الإنترنت</p>
        </div>
      )}

      {/* Progress bar */}
      {!loading && !error && (
        <>
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
          <div className="flex items-center justify-center gap-6">
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
            <button
              onClick={stop}
              className="touch-target w-14 h-14 rounded-full bg-emerald-900/50 hover:bg-emerald-800 flex items-center justify-center transition-colors active:scale-95"
              aria-label="إيقاف"
            >
              <Square className="w-6 h-6 text-cream-200" fill="currentColor" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
