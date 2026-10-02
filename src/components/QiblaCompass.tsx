import { useEffect, useState, useCallback, useRef } from 'react';
import { Navigation, MapPin, Crosshair, Volume2 } from 'lucide-react';
import { calculateQibla, calculateDistance, getCompassHeading, type GeoPosition } from '@/lib/qibla';
import { useTTS } from '@/hooks/useTTS';

interface QiblaCompassProps {
  onBack: () => void;
}

export function QiblaCompass({ onBack }: QiblaCompassProps) {
  const [position, setPosition] = useState<GeoPosition | null>(null);
  const [heading, setHeading] = useState<number | null>(null);
  const [qibla, setQibla] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const lastGuidanceRef = useRef<number>(0);
  const { speak, stop } = useTTS();

  // Get geolocation
  useEffect(() => {
    if (!navigator.geolocation) {
      setError('الموقع غير متاح على هذا الجهاز');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ latitude, longitude });
        setQibla(calculateQibla(latitude, longitude));
        setDistance(calculateDistance(latitude, longitude));
        setPermissionGranted(true);
      },
      (err) => {
        setError(err.code === 1 ? 'يَرْجَى السَّمَاحُ بِالوُصُولِ إِلَى المَوْقِع' : 'تَعَذَّرَ تَحْدِيدُ مَوْقِعِك');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );

    return () => stop();
  }, []);

  // Voice guidance when alignment changes
  const giveVoiceGuidance = useCallback(
    (arrowAngle: number) => {
      const now = Date.now();
      if (now - lastGuidanceRef.current < 3000) return; // Throttle to every 3s
      lastGuidanceRef.current = now;

      const normalizedAngle = ((arrowAngle % 360) + 360) % 360;

      if (normalizedAngle < 8 || normalizedAngle > 352) {
        speak('أَنْتَ فِي اِتِّجَاهِ القِبْلَة. تَوَجَّهْ بِثَبَات');
      } else if (normalizedAngle <= 180) {
        if (normalizedAngle < 45) {
          speak('اِتَّجِهْ إِلَى اليَمِينِ قَلِيلًا');
        } else if (normalizedAngle < 135) {
          speak('اِتَّجِهْ إِلَى اليَمِين');
        } else {
          speak('اِتَّجِهْ إِلَى اليَمِينِ كَثِيرًا');
        }
      } else {
        const leftAngle = 360 - normalizedAngle;
        if (leftAngle < 45) {
          speak('اِتَّجِهْ إِلَى اليَسَارِ قَلِيلًا');
        } else if (leftAngle < 135) {
          speak('اِتَّجِهْ إِلَى اليَسَار');
        } else {
          speak('اِتَّجِهْ إِلَى اليَسَارِ كَثِيرًا');
        }
      }
    },
    [speak]
  );

  // Track alignment and give voice guidance
  useEffect(() => {
    if (heading !== null && qibla !== null) {
      const arrowAngle = qibla - heading;
      giveVoiceGuidance(arrowAngle);
    }
  }, [heading, qibla, giveVoiceGuidance]);

  // Listen to device orientation for compass
  useEffect(() => {
    if (!permissionGranted) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const compassHeading = getCompassHeading(event);
      if (compassHeading !== null) {
        setHeading(compassHeading);
      }
    };

    const anyDeviceOrientation = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };

    if (typeof anyDeviceOrientation.requestPermission === 'function') {
      anyDeviceOrientation.requestPermission().then((response: string) => {
        if (response === 'granted') {
          window.addEventListener('deviceorientation', handleOrientation, true);
        }
      }).catch(() => {});
    } else {
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [permissionGranted]);

  const requestCompassPermission = useCallback(async () => {
    const anyDeviceOrientation = DeviceOrientationEvent as unknown as {
      requestPermission?: () => Promise<string>;
    };
    if (typeof anyDeviceOrientation.requestPermission === 'function') {
      try {
        const response = await anyDeviceOrientation.requestPermission();
        if (response === 'granted') {
          const handleOrientation = (event: DeviceOrientationEvent) => {
            const compassHeading = getCompassHeading(event);
            if (compassHeading !== null) {
              setHeading(compassHeading);
            }
          };
          window.addEventListener('deviceorientation', handleOrientation, true);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const arrowRotation = qibla !== null && heading !== null ? qibla - heading : qibla ?? 0;
  const normalizedArrow = ((arrowRotation % 360) + 360) % 360;
  const isAligned = heading !== null && qibla !== null && normalizedArrow < 5;

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

  if (!position) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 animate-fade-in" dir="rtl">
        <Crosshair className="w-20 h-20 text-gold-400 animate-pulse" strokeWidth={1.5} />
        <p className="text-2xl font-cairo text-cream-100">جَارٍ تَحْدِيدُ مَوْقِعِك...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-8 animate-fade-in px-6" dir="rtl">
      <h2 className="text-3xl font-cairo font-bold text-gold-gradient">اِتِّجَاهُ القِبْلَة</h2>

      {/* Compass */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80">
        {/* Compass ring */}
        <div
          className="absolute inset-0 rounded-full border-4 border-gold-400/30 bg-charcoal-900/60 backdrop-blur-sm transition-transform duration-200"
          style={{ transform: `rotate(${heading !== null ? -heading : 0}deg)` }}
        >
          {[
            { label: 'ش', angle: 0 },
            { label: 'ق', angle: 90 },
            { label: 'ج', angle: 180 },
            { label: 'غ', angle: 270 },
          ].map((dir) => (
            <div
              key={dir.label}
              className="absolute top-1/2 left-1/2 origin-bottom"
              style={{
                transform: `rotate(${dir.angle}deg) translateY(-128px)`,
                transformOrigin: '0 128px',
              }}
            >
              <span className="block -translate-x-1/2 text-2xl font-cairo font-bold text-gold-300">
                {dir.label}
              </span>
            </div>
          ))}

          {Array.from({ length: 72 }).map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 origin-bottom"
              style={{
                transform: `rotate(${i * 5}deg) translateY(-138px)`,
                transformOrigin: '0 138px',
              }}
            >
              <div className={`w-0.5 ${i % 9 === 0 ? 'h-4 bg-gold-400' : 'h-2 bg-gold-400/30'}`} />
            </div>
          ))}
        </div>

        {/* Qibla arrow */}
        <div
          className="absolute inset-0 flex items-center justify-center transition-transform duration-200"
          style={{ transform: `rotate(${arrowRotation}deg)` }}
        >
          <div className="flex flex-col items-center -mt-32">
            <div className={`w-10 h-10 rounded-md flex items-center justify-center transition-all ${isAligned ? 'bg-gold-400 scale-125 shadow-[0_0_20px_rgba(212,175,55,0.8)]' : 'bg-gold-500'}`}>
              <Navigation className="w-6 h-6 text-charcoal-900" strokeWidth={2.5} fill="currentColor" />
            </div>
            <div className={`w-1 h-28 ${isAligned ? 'bg-gold-400' : 'bg-gold-500/70'}`} />
          </div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gold-400 shadow-lg" />
      </div>

      {/* Status */}
      <div className="text-center space-y-2">
        {heading === null ? (
          <button
            onClick={requestCompassPermission}
            className="touch-target px-8 py-4 bg-gold-500 hover:bg-gold-400 rounded-2xl text-xl font-cairo text-charcoal-900 font-bold transition-colors"
          >
            اِضْغَطْ لِتَفْعِيلِ البُوصَلَة
          </button>
        ) : isAligned ? (
          <p className="text-2xl font-cairo font-bold text-emerald-400 animate-pulse">
            أَنْتَ فِي اِتِّجَاهِ القِبْلَة
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-xl font-cairo text-cream-200">
              {normalizedArrow <= 180
                ? `وَجِّهْ إِلَى اليَمِين ${Math.round(normalizedArrow)}°`
                : `وَجِّهْ إِلَى اليَسَار ${Math.round(360 - normalizedArrow)}°`}
            </p>
            <button
              onClick={() => giveVoiceGuidance(arrowRotation)}
              className="touch-target px-6 py-3 bg-emerald-800/50 hover:bg-emerald-700 rounded-xl text-base font-cairo text-cream-200 transition-colors inline-flex items-center gap-2"
            >
              <Volume2 className="w-5 h-5 text-gold-400" />
              اِسْتَمِعْ لِلتَّوْجِيه
            </button>
          </div>
        )}
        {distance !== null && (
          <p className="text-lg font-cairo text-cream-200/70">
            المَسَافَةُ إِلَى الكَعْبَة: {distance.toLocaleString('ar')} كَم
          </p>
        )}
        {qibla !== null && (
          <p className="text-base font-cairo text-cream-200/50">
            اِتِّجَاهُ القِبْلَة: {Math.round(qibla)}° مِنَ الشَّمَال
          </p>
        )}
      </div>

      <button
        onClick={() => { stop(); onBack(); }}
        className="touch-target px-8 py-4 bg-emerald-800 hover:bg-emerald-700 rounded-2xl text-xl font-cairo text-cream-100 transition-colors"
      >
        رُجُوع
      </button>
    </div>
  );
}
