import { useCallback, useEffect, useRef, useState } from 'react';
import { BookOpen, Heart, Compass, GraduationCap, Clock, Sparkles, Mic } from 'lucide-react';
import { MicOrb } from '@/components/MicOrb';
import { AppLogo } from '@/components/AppLogo';
import { QuranPlayer } from '@/components/QuranPlayer';
import { AthkarView } from '@/components/AthkarView';
import { QiblaCompass } from '@/components/QiblaCompass';
import { LecturesView } from '@/components/LecturesView';
import { PrayerTimesView } from '@/components/PrayerTimesView';
import { useTTS } from '@/hooks/useTTS';
import { useSTT } from '@/hooks/useSTT';
import {
  parseCommand,
  getSurahAudioUrl,
  getAutoAthkarMode,
  type Intent,
} from '@/lib/commandParser';
import { lectures, lectureCategories, SAFETY_FALLBACK_TEXT, type LectureCategory, type Lecture } from '@/data/lectures';
import type { Surah } from '@/data/surahs';

type Screen = 'main' | 'quran' | 'athkar' | 'qibla' | 'lectures' | 'prayers';
type MicState = 'idle' | 'listening' | 'speaking' | 'processing';

const WELCOME_TEXT = 'أَهْلًا بِكَ فِي تَطْبِيقِ أَنِيس. قُلْ لِي مَاذَا تُرِيدُ: القُرْآنُ الكَرِيم، الأَذْكَار، الدُّرُوسُ وَالمُحَاضَرَات، مَوَاقِيتُ الصَّلَاة، أَوْ اِتِّجَاهُ القِبْلَة؟';

const HELP_TEXT = 'يُمْكِنُكَ أَنْ تَطْلُبَ: سُورَة الفَاتِحَة، أَوْ سُورَة يٰس، أَوْ الأَذْكَار، أَوْ أَحْكَام الصَّلَاة، أَوْ أَحْكَام الصَّوْم، أَوْ فَضْل ذِكْر اللَّه، أَوْ مَوَاقِيت الصَّلَاة، أَوْ القِبْلَة. فَقَطْ تَكَلَّمْ بِوُضُوح بَعْدَ سَمَاع الصَّوْت. وَلِلرُّجُوع قُلْ رُجُوع.';

const NOT_UNDERSTOOD_TEXT = 'لَمْ أَفْهَمْ مَا قُلْتَ. قُلْ: القُرْآن، أَوْ الأَذْكَار، أَوْ الدُّرُوس، أَوْ الصَّلَاة، أَوْ القِبْلَة';

const RECITATION_DONE_TEXT = 'اِنْتَهَتِ التِّلَاوَة';

export default function App() {
  const [screen, setScreen] = useState<Screen>('main');
  const [micState, setMicState] = useState<MicState>('idle');
  const [activeSurah, setActiveSurah] = useState<Surah | null>(null);
  const [lastTranscript, setLastTranscript] = useState<string>('');
  const [athkarMode, setAthkarMode] = useState<'morning' | 'evening' | 'auto'>('auto');
  const [lectureCategory, setLectureCategory] = useState<LectureCategory | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const welcomeSpokenRef = useRef(false);
  const screenRef = useRef<Screen>('main');
  const pendingListenRef = useRef(false);

  // Keep screen ref in sync
  useEffect(() => {
    screenRef.current = screen;
  }, [screen]);

  const { speak, stop: stopSpeaking, speaking, supported: ttsSupported } = useTTS();

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  const goMain = useCallback(() => {
    setScreen('main');
    setActiveSurah(null);
    setLectureCategory(null);
    setMicState('idle');
  }, []);

  // The global intent handler — works from any screen
  const handleIntent = useCallback(
    (intent: Intent) => {
      // Handle "back" from any sub-screen
      if (intent.type === 'back') {
        if (screenRef.current !== 'main') {
          stopSpeaking();
          goMain();
          speak('رَجَعْنَا إِلَى الصَّفْحَة الرَّئِيسِيَّة', {
            onEnd: () => {
              setMicState('idle');
              setTimeout(() => startListeningAfterTTS(), 400);
            },
          });
          return;
        }
      }

      switch (intent.type) {
        case 'quran': {
          const surah = intent.surah;
          setActiveSurah(surah);
          setScreen('quran');
          setMicState('idle');
          speak(`سُورَةُ ${surah.name}`, {
            onEnd: () => setMicState('idle'),
          });
          break;
        }
        case 'athkar_morning':
        case 'athkar_evening':
        case 'athkar_auto': {
          const mode = intent.type === 'athkar_auto' ? 'auto' : intent.type === 'athkar_morning' ? 'morning' : 'evening';
          const actualMode = mode === 'auto' ? getAutoAthkarMode() : mode;
          setAthkarMode(mode);
          setScreen('athkar');
          setMicState('idle');
          speak(actualMode === 'morning' ? 'أَذْكَارُ الصَّبَاح' : 'أَذْكَارُ المَسَاء', {
            onEnd: () => setMicState('idle'),
          });
          break;
        }
        case 'qibla':
          setScreen('qibla');
          setMicState('idle');
          speak('اِتِّجَاهُ القِبْلَة', { onEnd: () => setMicState('idle') });
          break;
        case 'lecture_category':
          setLectureCategory(intent.category);
          setScreen('lectures');
          setMicState('idle');
          {
            const cat = lectureCategories.find((c) => c.id === intent.category);
            speak(cat?.titleDiacritics ?? 'الدُّرُوس', { onEnd: () => setMicState('idle') });
          }
          break;
        case 'lecture_specific': {
          const lecture = lectures.find((l) => l.id === intent.lectureId);
          if (lecture) {
            setLectureCategory(lecture.category);
            setScreen('lectures');
            setMicState('idle');
            speak(lecture.titleDiacritics, { onEnd: () => setMicState('idle') });
          }
          break;
        }
        case 'lecture_list':
          setLectureCategory(null);
          setScreen('lectures');
          setMicState('idle');
          speak('مَكْتَبَةُ الشَّيْخِ ابْنِ عُثَيْمِين. اِخْتَرْ: أَحْكَام الصَّلَاة، أَوْ أَحْكَام الصَّوْم، أَوْ فَضْل ذِكْر اللَّه', {
            onEnd: () => {
              setMicState('idle');
              setTimeout(() => startListeningAfterTTS(), 400);
            },
          });
          break;
        case 'prayer_times':
          setScreen('prayers');
          setMicState('idle');
          break;
        case 'fatwa_fallback':
          setMicState('speaking');
          speak(SAFETY_FALLBACK_TEXT, {
            onEnd: () => {
              setMicState('idle');
              setTimeout(() => startListeningAfterTTS(), 500);
            },
          });
          break;
        case 'help':
          setMicState('speaking');
          speak(HELP_TEXT, {
            onEnd: () => {
              setMicState('idle');
              setTimeout(() => startListeningAfterTTS(), 500);
            },
          });
          break;
        case 'unknown':
        default:
          speak(NOT_UNDERSTOOD_TEXT, {
            onEnd: () => {
              setMicState('idle');
              setTimeout(() => startListeningAfterTTS(), 500);
            },
          });
          break;
      }
    },
    [speak, stopSpeaking, goMain]
  );

  // Global STT handler — works on all screens
  const handleSTTResult = useCallback(
    (transcript: string) => {
      setLastTranscript(transcript);
      setMicState('processing');
      const intent = parseCommand(transcript);
      handleIntent(intent);
    },
    [handleIntent]
  );

  const handleSTTError = useCallback(
    (error: string) => {
      setMicState('idle');
      if (error === 'no-speech') {
        showToast('لَمْ أَسْمَعْ صَوْتَكَ. حَاوِلْ مَرَّةً أُخْرَى');
      } else if (error === 'not-allowed') {
        speak('يَرْجَى السَّمَاحُ بِالوُصُولِ إِلَى المِيكْرُوفُون');
      }
    },
    [speak, showToast]
  );

  const { listening, startListening, stopListening, supported: sttSupported } = useSTT({
    onResult: handleSTTResult,
    onError: handleSTTError,
    onEnd: () => {
      if (micState === 'listening') {
        setMicState('idle');
      }
    },
  });

  // Track speaking state
  useEffect(() => {
    if (speaking && micState !== 'processing') {
      setMicState('speaking');
    } else if (!speaking && micState === 'speaking') {
      setMicState('idle');
    }
  }, [speaking, micState]);

  useEffect(() => {
    if (listening) setMicState('listening');
  }, [listening]);

  const startListeningAfterTTS = useCallback(() => {
    if (sttSupported) startListening();
  }, [sttSupported, startListening]);

  // Auto welcome on first load
  useEffect(() => {
    if (welcomeSpokenRef.current || !ttsSupported) return;
    welcomeSpokenRef.current = true;

    const timer = setTimeout(() => {
      setMicState('speaking');
      speak(WELCOME_TEXT, {
        onEnd: () => {
          setMicState('idle');
          if (sttSupported) {
            setTimeout(() => startListening(), 300);
          }
        },
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [ttsSupported, speak, sttSupported, startListening]);

  // Mic tap handler — works globally
  const handleMicTap = useCallback(() => {
    if (micState === 'speaking') {
      stopSpeaking();
      setMicState('idle');
      setTimeout(() => {
        if (sttSupported) startListening();
      }, 200);
      return;
    }

    if (micState === 'listening') {
      stopListening();
      setMicState('idle');
      return;
    }

    if (sttSupported) {
      startListening();
    } else {
      speak('المِيكْرُوفُون غَيْرُ مُتَاح. يُمْكِنُكَ الضَّغْطُ عَلَى الأَزْرَار', {
        onEnd: () => setMicState('idle'),
      });
    }
  }, [micState, stopSpeaking, sttSupported, startListening, stopListening, speak]);

  // Tap anywhere on screen (global voice activation)
  const handleScreenTap = useCallback(
    (e: React.MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button') || target.closest('[role="button"]')) return;
      if (micState === 'speaking') {
        stopSpeaking();
        setMicState('idle');
        setTimeout(() => {
          if (sttSupported) startListening();
        }, 200);
      } else if (micState === 'idle' && sttSupported) {
        startListening();
      }
    },
    [micState, stopSpeaking, sttSupported, startListening]
  );

  // Quick select handlers
  const quickSelectQuran = useCallback((surah: Surah) => {
    setActiveSurah(surah);
    setScreen('quran');
    speak(`سُورَةُ ${surah.name}`);
  }, [speak]);

  const quickSelectAthkar = useCallback(() => {
    setAthkarMode('auto');
    setScreen('athkar');
    const mode = getAutoAthkarMode();
    speak(mode === 'morning' ? 'أَذْكَارُ الصَّبَاح' : 'أَذْكَارُ المَسَاء');
  }, [speak]);

  const quickSelectQibla = useCallback(() => {
    setScreen('qibla');
    speak('اِتِّجَاهُ القِبْلَة');
  }, [speak]);

  const quickSelectLectures = useCallback(() => {
    setLectureCategory(null);
    setScreen('lectures');
    speak('مَكْتَبَةُ الدُّرُوس');
  }, [speak]);

  const quickSelectPrayers = useCallback(() => {
    setScreen('prayers');
  }, []);

  // Render sub-screens (all wrapped with global mic support)
  if (screen === 'qibla') {
    return (
      <GlobalLayout onClick={handleScreenTap} micState={micState} onTapMic={handleMicTap} sttSupported={sttSupported} statusText={getStatusText(micState, lastTranscript)} toast={toast}>
        <QiblaCompass onBack={goMain} />
      </GlobalLayout>
    );
  }

  if (screen === 'athkar') {
    return (
      <GlobalLayout onClick={handleScreenTap} micState={micState} onTapMic={handleMicTap} sttSupported={sttSupported} statusText={getStatusText(micState, lastTranscript)} toast={toast}>
        <AthkarView mode={athkarMode} onBack={goMain} />
      </GlobalLayout>
    );
  }

  if (screen === 'prayers') {
    return (
      <GlobalLayout onClick={handleScreenTap} micState={micState} onTapMic={handleMicTap} sttSupported={sttSupported} statusText={getStatusText(micState, lastTranscript)} toast={toast}>
        <PrayerTimesView onBack={goMain} />
      </GlobalLayout>
    );
  }

  if (screen === 'lectures') {
    return (
      <GlobalLayout onClick={handleScreenTap} micState={micState} onTapMic={handleMicTap} sttSupported={sttSupported} statusText={getStatusText(micState, lastTranscript)} toast={toast}>
        <LecturesView
          onBack={goMain}
          initialCategory={lectureCategory}
          onSelectLecture={(lecture: Lecture) => {
            speak(lecture.descriptionDiacritics, {
              onEnd: () => setMicState('idle'),
            });
          }}
        />
      </GlobalLayout>
    );
  }

  if (screen === 'quran' && activeSurah) {
    return (
      <GlobalLayout onClick={handleScreenTap} micState={micState} onTapMic={handleMicTap} sttSupported={sttSupported} statusText={getStatusText(micState, lastTranscript)} toast={toast}>
        <QuranPlayer
          surah={activeSurah}
          audioUrl={getSurahAudioUrl(activeSurah.number)}
          onBack={goMain}
          onDone={() => {
            speak(RECITATION_DONE_TEXT, {
              onEnd: () => {
                setMicState('idle');
                setTimeout(() => startListeningAfterTTS(), 400);
              },
            });
          }}
        />
      </GlobalLayout>
    );
  }

  // Main screen
  return (
    <GlobalLayout onClick={handleScreenTap} micState={micState} onTapMic={handleMicTap} sttSupported={sttSupported} statusText={getStatusText(micState, lastTranscript)} toast={toast}>
      <div className="flex flex-col items-center justify-between min-h-screen relative overflow-hidden">
        {/* Decorative background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L80 40L40 80L0 40Z' fill='%23d4af37' fill-opacity='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px',
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

        {/* Header */}
        <header className="relative z-10 pt-8 sm:pt-12 px-6 text-center">
          <AppLogo size={72} showName />
          <p className="text-base font-cairo text-cream-200/50 mt-2">رَفِيقُكَ الصَّوْتِيُّ فِي الطَّاعَة</p>
        </header>

        {/* Main content */}
        <main className="relative z-10 flex flex-col items-center gap-8 py-8 flex-1 justify-center w-full max-w-md px-6">
          {/* Status */}
          <div className="h-10 flex items-center justify-center min-h-[2.5rem]">
            <p className={`text-xl sm:text-2xl font-cairo transition-opacity duration-300 ${micState !== 'idle' ? 'text-gold-300' : 'text-cream-200/60'}`}>
              {getStatusText(micState, lastTranscript)}
            </p>
          </div>

          {/* Mic orb */}
          <MicOrb state={micState} onTap={handleMicTap} supported={sttSupported} />

          {/* Quick access buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 max-w-md px-4">
            <QuickButton icon={BookOpen} label="القُرْآن" onClick={() => quickSelectQuran({ number: 1, name: 'الفاتحة', englishName: '', englishNameTranslation: '', numberOfAyahs: 7, revelationType: 'Meccan' })} />
            <QuickButton icon={Heart} label="الأَذْكَار" onClick={quickSelectAthkar} />
            <QuickButton icon={GraduationCap} label="الدُّرُوس" onClick={quickSelectLectures} />
            <QuickButton icon={Clock} label="الصَّلَاة" onClick={quickSelectPrayers} />
            <QuickButton icon={Compass} label="القِبْلَة" onClick={quickSelectQibla} />
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 pb-8 px-6 text-center">
          <p className="text-sm font-cairo text-cream-200/30">
            {ttsSupported && sttSupported
              ? 'تَحَدَّثْ بِوُضُوح بَعْدَ سَمَاع الصَّوْت'
              : !sttSupported
              ? 'اِضْغَطْ عَلَى الأَزْرَار لِلِاخْتِيَار'
              : ''}
          </p>
        </footer>
      </div>
    </GlobalLayout>
  );
}

function getStatusText(micState: MicState, lastTranscript: string): string {
  if (micState === 'listening') return 'أَسْتَمِعُ إِلَيْكَ...';
  if (micState === 'speaking') return 'أَتَكَلَّمُ...';
  if (micState === 'processing') return 'أُفَكِّرُ...';
  if (lastTranscript) return `قُلْتَ: ${lastTranscript}`;
  return 'اِضْغَطْ لِلتَّحَدُّث';
}

// Global layout wrapper that includes floating mic and global click handler
interface GlobalLayoutProps {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  micState: MicState;
  onTapMic: () => void;
  sttSupported: boolean;
  statusText: string;
  toast: string | null;
}

function GlobalLayout({ children, onClick, micState, onTapMic, sttSupported, statusText, toast }: GlobalLayoutProps) {
  return (
    <div
      onClick={onClick}
      className="min-h-screen relative overflow-hidden"
      dir="rtl"
      style={{
        background: 'radial-gradient(ellipse at top, #0F5132 0%, #064e3b 40%, #022c22 80%, #0a0f0d 100%)',
      }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M40 0L80 40L40 80L0 40Z' fill='%23d4af37' fill-opacity='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '80px 80px',
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

      {/* Page content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Global floating mic + status — visible on all screens */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2">
        {/* Status pill */}
        <div className="px-4 py-1.5 rounded-full bg-charcoal-900/70 backdrop-blur-sm border border-gold-400/10">
          <p className={`text-sm font-cairo ${micState !== 'idle' ? 'text-gold-300' : 'text-cream-200/50'}`}>
            {statusText}
          </p>
        </div>
        {/* Compact mic button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onTapMic();
          }}
          disabled={!sttSupported}
          aria-label="ميكروفون"
          className={`
            w-14 h-14 rounded-full flex items-center justify-center
            transition-all duration-300 shadow-lg
            ${micState === 'listening' ? 'bg-red-600 shadow-[0_0_30px_rgba(220,38,38,0.5)]' : ''}
            ${micState === 'speaking' ? 'bg-gold-500 shadow-[0_0_30px_rgba(212,175,55,0.4)]' : ''}
            ${micState === 'processing' ? 'bg-emerald-700 opacity-70' : ''}
            ${micState === 'idle' ? 'bg-emerald-800 shadow-[0_0_20px_rgba(6,95,70,0.3)]' : ''}
            ${!sttSupported ? 'bg-charcoal-700 opacity-50' : ''}
            active:scale-90
          `}
        >
          {micState === 'processing' ? (
            <div className="w-6 h-6 border-2 border-cream-200/30 border-t-cream-200 rounded-full animate-spin" />
          ) : (
            <Mic className={`w-6 h-6 ${micState === 'listening' ? 'text-white' : 'text-cream-100'}`} strokeWidth={2} />
          )}
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-charcoal-800/90 backdrop-blur-sm border border-gold-400/20 animate-slide-up">
          <p className="font-cairo text-cream-100 text-base">{toast}</p>
        </div>
      )}
    </div>
  );
}

interface QuickButtonProps {
  icon: typeof BookOpen;
  label: string;
  onClick: () => void;
}

function QuickButton({ icon: Icon, label, onClick }: QuickButtonProps) {
  return (
    <button
      onClick={onClick}
      className="touch-target flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-800/40 hover:bg-emerald-700/50 border border-gold-400/10 hover:border-gold-400/30 transition-all active:scale-95 group"
    >
      <Icon className="w-5 h-5 text-gold-400 group-hover:scale-110 transition-transform" />
      <span className="font-cairo text-cream-100 text-base">{label}</span>
    </button>
  );
}
