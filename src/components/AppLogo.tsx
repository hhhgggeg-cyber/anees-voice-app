interface AppLogoProps {
  size?: number;
  showName?: boolean;
}

export function AppLogo({ size = 80, showName = false }: AppLogoProps) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="rounded-3xl flex items-center justify-center shadow-lg relative overflow-hidden"
        style={{
          width: size,
          height: size,
          background: 'linear-gradient(145deg, #1B4D3E 0%, #0F5132 60%, #064e3b 100%)',
          boxShadow: '0 8px 32px rgba(15, 81, 50, 0.4), inset 0 1px 0 rgba(212, 175, 55, 0.2)',
        }}
      >
        {/* Inner subtle glow */}
        <div
          className="absolute inset-0 opacity-20"
          style={{ background: 'radial-gradient(circle at 30% 30%, rgba(212,175,55,0.3), transparent 60%)' }}
        />

        {/* Crescent Moon */}
        <svg
          width={size * 0.42}
          height={size * 0.42}
          viewBox="0 0 48 48"
          fill="none"
          className="relative z-10"
        >
          <path
            d="M32 8C20.954 8 12 16.954 12 28s8.954 20 20 20c2.7 0 5.27-.535 7.62-1.502C33.93 44.01 30 39.45 30 34c0-7.18 5.82-13 13-13 1.73 0 3.37.335 4.87.94C44.7 12.99 38.9 8 32 8z"
            fill="#F0D97C"
            stroke="#D4AF37"
            strokeWidth="1.5"
          />
        </svg>

        {/* Microphone */}
        <svg
          width={size * 0.30}
          height={size * 0.30}
          viewBox="0 0 24 24"
          fill="none"
          className="absolute z-20"
          style={{ top: '58%', left: '50%', transform: 'translate(-50%, -50%)' }}
        >
          <path
            d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"
            fill="#FFFFFF"
            stroke="#F0D97C"
            strokeWidth="0.5"
          />
          <path
            d="M19 10v2a7 7 0 0 1-14 0v-2M12 19v3M8 22h8"
            stroke="#F0D97C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </div>

      {showName && (
        <span className="font-cairo font-black text-2xl text-gold-gradient tracking-wide">
          أَنِيس
        </span>
      )}
    </div>
  );
}
