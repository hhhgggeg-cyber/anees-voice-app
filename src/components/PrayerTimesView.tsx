import { useEffect, useState, useCallback } from 'react';
import { Clock, ChevronLeft, MapPin } from 'lucide-react';
import {
  calculatePrayerTimes,
  formatPrayerTime,
  getPrayerCountdownText,
  type PrayerTimesResult,
  type PrayerName,
} from '@/lib/prayerTimes';
import { useTTS } from '@/hooks/useTTS';

interface PrayerTimesViewProps {
  onBack: () => void;
}

const prayerIcons: Record<PrayerName, string> = {
  fajr: '🌄',
  dhuhr: '☀️',
  asr: '🌤️',
  maghrib: '🌅',
  isha: '🌙',
};

export function PrayerTimesView({ onBack }: PrayerTimesViewProps) {
  const [result, setResult] = useState<PrayerTimesResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { speak, stop } = useTTS();

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('الموقع غير متاح على هذا الجهاز');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const r = calculatePrayerTimes(pos.coords.latitude, pos.coords.longitude);
        setResult(r);
        setLoading(false);

        // Auto-speak the next prayer countdown
        if (r.nextPrayer && r.timeUntilNext) {
          const text = getPrayerCountdownText(r.nextPrayer, r.timeUntilNext);
          setTimeout(() => speak(text), 300);
        }
      },
      (err) => {
        setError(err.code === 1 ? 'يَرْجَى السَّمَاحُ بِالوُصُولِ إِلَى المَوْقِع' : 'تَعَذَّرَ تَحْدِيدُ مَوْقِعِك');
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );

    return () => stop();
  }, []);

  const handleSpeakCountdown = useCallback(() => {
    if (result?.nextPrayer && result?.timeUntilNext) {
      speak(getPrayerCountdownText(result.nextPrayer, result.timeUntilNext));
    }
  }, [result, speak]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in" dir="rtl">
        <Clock className="w-20 h-20 text-gold-400 animate-pulse" strokeWidth={1.5} />
        <p className="text-2xl font-cairo text-cream-100">جَارٍ تَحْدِيدُ مَوَاقِيتِ الصَّلَاة...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in px-6" dir="rtl">
        <MapPin className="w-20 h-20 text-gold-400" strokeWidth={1.5} />
        <p className="text-2xl font-cairo text-cream-100 text-center">{error}</p>
        <button
          onClick={() => { stop(); onBack(); }}
          className="touch-target px-8 py-4 bg-emerald-700 hover:bg-emerald-600 rounded-2xl text-xl font-cairo text-white transition-colors"
        >
          رُجُوع
        </button>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="flex flex-col min-h-[70vh] px-6 py-8 animate-fade-in" dir="rtl">
      {/* Header */}
      <div className="w-full max-w-md mx-auto flex items-center justify-between mb-8">
        <button
          onClick={() => { stop(); onBack(); }}
          className="touch-target w-12 h-12 rounded-xl bg-emerald-800/50 hover:bg-emerald-700 flex items-center justify-center transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-cream-100" />
        </button>
        <h2 className="text-2xl font-cairo font-bold text-gold-gradient">مَوَاقِيتُ الصَّلَاة</h2>
        <div className="w-12" />
      </div>

      <div className="w-full max-w-md mx-auto">
        {/* Next prayer card */}
        {result.nextPrayer && result.timeUntilNext && (
          <div className="glass-panel rounded-3xl p-6 mb-6 text-center">
            <p className="text-base font-cairo text-cream-200/60 mb-2">الصَّلَاةُ القَادِمَة</p>
            <p className="text-3xl font-cairo font-bold text-gold-gradient mb-2">
              {result.nextPrayer.displayNameDiacritics}
            </p>
            <p className="text-2xl font-cairo text-cream-100">
              {formatPrayerTime(result.nextPrayer.time)}
            </p>
            <div className="mt-4 pt-4 border-t border-gold-400/15">
              <p className="text-lg font-cairo text-emerald-300">
                {result.timeUntilNext.hours > 0 && `${result.timeUntilNext.hours} سَاعَة `}
                {result.timeUntilNext.minutes > 0 && `${result.timeUntilNext.minutes} دَقِيقَة`}
                {result.timeUntilNext.hours === 0 && result.timeUntilNext.minutes === 0 && 'أَقَلَّ مِنْ دَقِيقَة'}
              </p>
              <p className="text-sm font-cairo text-cream-200/40 mt-1">مُتْبَقِّي</p>
            </div>
            <button
              onClick={handleSpeakCountdown}
              className="touch-target mt-4 px-6 py-3 bg-emerald-700 hover:bg-emerald-600 rounded-2xl text-lg font-cairo text-cream-100 transition-colors active:scale-95 flex items-center gap-2 mx-auto"
            >
              <Clock className="w-5 h-5" />
              اِسْتَمِعْ لِلْوَقْتِ المُتَبَقِّي
            </button>
          </div>
        )}

        {/* All prayer times */}
        <div className="space-y-3">
          {result.prayers.map((prayer) => {
            const isNext = result.nextPrayer?.name === prayer.name;
            return (
              <div
                key={prayer.name}
                className={`flex items-center justify-between rounded-2xl p-4 transition-all ${
                  isNext
                    ? 'bg-gold-500/15 border border-gold-400/40'
                    : 'glass-panel'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{prayerIcons[prayer.name]}</span>
                  <span className={`text-lg font-cairo ${isNext ? 'text-gold-300 font-bold' : 'text-cream-100'}`}>
                    {prayer.displayNameDiacritics}
                  </span>
                </div>
                <span className={`text-lg font-cairo ${isNext ? 'text-gold-300 font-bold' : 'text-cream-200/70'}`}>
                  {formatPrayerTime(prayer.time)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
