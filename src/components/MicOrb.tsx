import { Mic, MicOff } from 'lucide-react';

interface MicOrbProps {
  state: 'idle' | 'listening' | 'speaking' | 'processing';
  onTap: () => void;
  supported: boolean;
}

export function MicOrb({ state, onTap, supported }: MicOrbProps) {
  const isListening = state === 'listening';
  const isSpeaking = state === 'speaking';
  const isProcessing = state === 'processing';

  return (
    <div className="relative flex items-center justify-center" dir="rtl">
      {/* Pulse rings */}
      {isListening && (
        <>
          <div className="absolute w-64 h-64 rounded-full border-2 border-red-500/40 animate-pulse-ring" />
          <div className="absolute w-72 h-72 rounded-full border border-red-500/25 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
          <div className="absolute w-80 h-80 rounded-full border border-red-500/15 animate-pulse-ring" style={{ animationDelay: '1s' }} />
        </>
      )}
      {isSpeaking && (
        <>
          <div className="absolute w-64 h-64 rounded-full border-2 border-gold-400/30 animate-pulse-ring" />
          <div className="absolute w-72 h-72 rounded-full border border-gold-400/20 animate-pulse-ring" style={{ animationDelay: '0.5s' }} />
        </>
      )}

      {/* Main button */}
      <button
        onClick={onTap}
        disabled={!supported}
        aria-label={isListening ? 'يستمع' : 'اضغط للتحدث'}
        className={`
          relative z-10 w-48 h-48 rounded-full flex items-center justify-center
          transition-all duration-300 ease-out
          ${isListening ? 'bg-red-600 scale-105 shadow-[0_0_60px_rgba(220,38,38,0.6)]' : ''}
          ${isSpeaking ? 'bg-gold-500 scale-105 shadow-[0_0_60px_rgba(212,175,55,0.5)]' : ''}
          ${isProcessing ? 'bg-emerald-700 scale-95 opacity-70' : ''}
          ${state === 'idle' ? 'bg-emerald-800 shadow-[0_0_40px_rgba(6,95,70,0.4)] hover:bg-emerald-700' : ''}
          ${!supported ? 'bg-charcoal-700 opacity-50 cursor-not-allowed' : ''}
          active:scale-95
        `}
      >
        {/* Inner glow */}
        <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/10 to-transparent" />

        {/* Icon */}
        <div className="relative z-10">
          {!supported ? (
            <MicOff className="w-16 h-16 text-cream-200/60" strokeWidth={1.5} />
          ) : isListening ? (
            <Mic className="w-16 h-16 text-white animate-breathe" strokeWidth={2.5} />
          ) : isSpeaking ? (
            <div className="flex items-end gap-1.5 h-16">
              <div className="w-2.5 bg-white rounded-full animate-pulse" style={{ height: '40%', animationDuration: '0.4s' }} />
              <div className="w-2.5 bg-white rounded-full animate-pulse" style={{ height: '70%', animationDuration: '0.6s' }} />
              <div className="w-2.5 bg-white rounded-full animate-pulse" style={{ height: '100%', animationDuration: '0.5s' }} />
              <div className="w-2.5 bg-white rounded-full animate-pulse" style={{ height: '60%', animationDuration: '0.7s' }} />
              <div className="w-2.5 bg-white rounded-full animate-pulse" style={{ height: '35%', animationDuration: '0.45s' }} />
            </div>
          ) : isProcessing ? (
            <div className="w-16 h-16 border-4 border-cream-200/30 border-t-cream-200 rounded-full animate-spin" />
          ) : (
            <Mic className="w-16 h-16 text-cream-100" strokeWidth={1.8} />
          )}
        </div>
      </button>
    </div>
  );
}
