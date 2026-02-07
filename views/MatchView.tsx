import React from 'react';
import { Profile } from '../types';

interface MatchViewProps {
  profile: Profile;
  onSendMessage: () => void;
  onMaybeLater: () => void;
}

const MatchView: React.FC<MatchViewProps> = ({ profile, onSendMessage, onMaybeLater }) => {
  const isChloe = profile.name === 'Chloe';

  return (
    <div className="fixed inset-0 z-[200] bg-gradient-to-b from-[#2E1065] via-[#0F172A] to-[#000000] flex flex-col items-center justify-center p-8 animate-in fade-in duration-500 overflow-hidden">

      {/* Special Full-Screen Hearts for Chloe Match */}
      {/* Special Full-Screen Twinkles for Chloe Match */}
      {isChloe && (
        <div className="fixed inset-0 pointer-events-none z-[250]">
          {/* Top Left area */}
          <div className="absolute top-[15%] left-[10%] animate-twinkle-1">
            <TwinkleIcon size="w-12 h-12" opacity="opacity-90" />
          </div>
          {/* Top Right area */}
          <div className="absolute top-[12%] right-[15%] animate-twinkle-2">
            <TwinkleIcon size="w-10 h-10" opacity="opacity-80" />
          </div>
          {/* Bottom Left area */}
          <div className="absolute bottom-[20%] left-[12%] animate-twinkle-3">
            <TwinkleIcon size="w-14 h-14" opacity="opacity-85" />
          </div>
          {/* Bottom Right area */}
          <div className="absolute bottom-[25%] right-[10%] animate-twinkle-4">
            <TwinkleIcon size="w-8 h-8" opacity="opacity-70" />
          </div>
          {/* Center Left */}
          <div className="absolute top-[40%] left-[8%] animate-twinkle-5">
            <TwinkleIcon size="w-6 h-6" opacity="opacity-60" />
          </div>
          {/* Center Right */}
          <div className="absolute top-[45%] right-[8%] animate-twinkle-6">
            <TwinkleIcon size="w-9 h-9" opacity="opacity-75" />
          </div>
          {/* Top Center */}
          <div className="absolute top-[8%] left-[45%] animate-twinkle-2">
            <TwinkleIcon size="w-5 h-5" opacity="opacity-50" />
          </div>
        </div>
      )}

      {/* Profile Photo */}
      <div className="relative mb-12 animate-in zoom-in-50 duration-700 group">
        <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white/20 shadow-[0_0_60px_rgba(139,92,246,0.5)] relative z-10 ring-4 ring-white/10 animate-pulse-slow">
          <img src={profile.images[0]} alt={profile.name} className="w-full h-full object-cover" />
        </div>
        {/* Glow behind photo */}
        <div className="absolute inset-0 bg-indigo-500/40 blur-[250px] rounded-full -z-0 animate-pulse"></div>
      </div>

      {/* Text Content */}
      <div className="text-center space-y-4 mb-24 relative z-10">
        <div className="flex items-center justify-center gap-2 text-white/90 font-medium">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
          </svg>
          <span className="text-[17px]">You're Connected</span>
        </div>
        <h1 className="text-6xl font-black text-white tracking-tight animate-in slide-in-from-bottom-4 duration-500">
          {profile.name}
        </h1>
        <p className="text-white/80 text-lg font-medium mt-3 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-150">
          A new artistic journey begins
        </p>
      </div>

      {/* Action Buttons */}
      <div className="w-full max-w-xs space-y-6 flex flex-col items-center relative z-20">
        <button
          onClick={onSendMessage}
          className="w-full bg-gradient-to-r from-[#3B0764] to-[#581C87] text-white py-5 rounded-full font-black text-xl shadow-lg shadow-purple-900/40 transition-all active:scale-95 transform hover:-translate-y-1 hover:shadow-purple-900/60"
        >
          Send message
        </button>
        <button
          onClick={onMaybeLater}
          className="text-white/60 font-bold text-lg hover:text-white transition-colors active:opacity-60"
        >
          Maybe later
        </button>
      </div>

      <style>{`
        @keyframes pop-in {
          0% { transform: scale(0) rotate(-10deg); opacity: 0; }
          20% { transform: scale(1.1) rotate(5deg); opacity: 1; }
          40% { transform: scale(1) rotate(0deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        @keyframes dance {
          0% { transform: scale(1) rotate(0deg) translateY(0); }
          25% { transform: scale(1.1) rotate(5deg) translateY(-5px); }
          50% { transform: scale(1) rotate(-5deg) translateY(0); }
          75% { transform: scale(1.1) rotate(5deg) translateY(5px); }
          100% { transform: scale(1) rotate(0deg) translateY(0); }
        }

        @keyframes twinkle-fade {
          0% { transform: scale(0) rotate(0deg); opacity: 0; }
          20% { transform: scale(1.2) rotate(45deg); opacity: 1; }
          60% { transform: scale(1) rotate(25deg); opacity: 0.8; }
          100% { transform: scale(0.5) rotate(90deg); opacity: 0; }
        }

        .animate-twinkle-1 { animation: twinkle-fade 2.5s ease-in-out forwards; }
        .animate-twinkle-2 { animation: twinkle-fade 3.0s ease-in-out 0.3s forwards; }
        .animate-twinkle-3 { animation: twinkle-fade 2.8s ease-in-out 0.6s forwards; }
        .animate-twinkle-4 { animation: twinkle-fade 3.2s ease-in-out 0.2s forwards; }
        .animate-twinkle-5 { animation: twinkle-fade 2.7s ease-in-out 0.9s forwards; }
        .animate-twinkle-6 { animation: twinkle-fade 2.9s ease-in-out 0.5s forwards; }
      `}</style>
    </div>
  );
};

const TwinkleIcon = ({ size = "w-10 h-10", opacity = "opacity-100" }: { size?: string, opacity?: string }) => (
  <svg className={`${size} ${opacity} text-[#ffffff] drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]`} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
  </svg>
);

export default MatchView;