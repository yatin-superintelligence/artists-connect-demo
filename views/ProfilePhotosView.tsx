import React from 'react';

import { useTheme } from '../theme/ThemeContext';

interface ProfilePhotosViewProps {
  onBack: () => void;
  onOpenVerify: () => void;
  profileImage: string;
}

const ProfilePhotosView: React.FC<ProfilePhotosViewProps> = ({ onBack, onOpenVerify, profileImage }) => {
  const { currentTheme } = useTheme();
  const isDarkTheme = currentTheme.name === 'Dark';

  const photoSlots = [
    { id: 1, image: profileImage, isMain: true },
    { id: 2, image: null },
    { id: 3, image: null },
    { id: 4, image: null },
    { id: 5, image: null },
    { id: 6, image: null },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col animate-in slide-in-from-right duration-300 overflow-y-auto no-scrollbar bg-[var(--bg-primary)]">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-5 sticky top-0 z-10 w-full max-w-xl mx-auto bg-[var(--bg-primary)]">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className={`p-1 -ml-1 rounded-full transition-colors ${isDarkTheme ? 'hover:bg-white/5' : 'hover:bg-[var(--bg-tertiary)]'}`}>
            <svg className={`w-6 h-6 ${isDarkTheme ? 'text-white' : 'text-[var(--text-primary)]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className={`text-[19px] font-bold ${isDarkTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>Your Portfolio</h1>
        </div>
        <button className={`p-1 rounded-full transition-colors ${isDarkTheme ? 'hover:bg-white/5' : 'hover:bg-[var(--bg-tertiary)]'}`}>
          <svg className={`w-6 h-6 ${isDarkTheme ? 'text-white' : 'text-[var(--text-primary)]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </header>

      <div className="p-4 space-y-6 pb-20 w-full max-w-xl mx-auto">
        {/* Photo Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          {photoSlots.map((slot) => (
            <div key={slot.id} className={`relative aspect-square rounded-[14px] overflow-hidden group border ${isDarkTheme ? 'bg-[#1a1429] border-white/5' : 'bg-[var(--bg-tertiary)] border-[var(--border-color)]'}`}>
              {slot.image ? (
                <>
                  <img src={slot.image} className="w-full h-full object-cover" alt="" />
                  <button className="absolute bottom-2 right-2 w-7 h-7 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 active:scale-90 transition-transform">
                    <div className="flex gap-[2px]">
                      <div className="w-[3px] h-[3px] bg-white rounded-full"></div>
                      <div className="w-[3px] h-[3px] bg-white rounded-full"></div>
                      <div className="w-[3px] h-[3px] bg-white rounded-full"></div>
                    </div>
                  </button>
                </>
              ) : (
                <div className={`w-full h-full flex items-center justify-center cursor-pointer transition-colors ${isDarkTheme ? 'active:bg-white/5' : 'active:bg-black/5'}`}>
                  <svg className={`w-8 h-8 ${isDarkTheme ? 'text-white/80' : 'text-[var(--text-secondary)]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Get Verified Card */}
        <div
          onClick={onOpenVerify}
          className={`p-5 rounded-[22px] border flex items-center gap-5 cursor-pointer transition-colors ${isDarkTheme ? 'bg-[#1a1429] border-white/5 active:bg-white/5' : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] active:bg-[var(--bg-secondary)]'}`}
        >
          <div className="w-12 h-12 bg-[#064e3b] rounded-full flex items-center justify-center flex-shrink-0">
            <div className="w-7 h-7 bg-[#22c55e] rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="flex-1">
            <h3 className={`text-[18px] font-bold leading-tight mb-0.5 ${isDarkTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>Become Official</h3>
            <p className={`text-[14px] leading-snug ${isDarkTheme ? 'text-white/50' : 'text-[var(--text-secondary)]'}`}>Stand out as a genuine artist with the Verified badge.</p>
          </div>
        </div>

        {/* Tip Box - Keep specialized dark background #2d2847 even for dark theme, use tertiary for others */}
        <div className={`p-6 rounded-[22px] border ${isDarkTheme ? 'bg-[#2d2847] border-white/5' : 'bg-[var(--bg-tertiary)] border-[var(--border-color)]'}`}>
          <p className={`text-[15px] font-medium leading-[1.4] ${isDarkTheme ? 'text-white/95' : 'text-[var(--text-primary)]'}`}>
            Curate your best work. Insight: Artists who showcase at least three high-quality pieces receive 5x more connections.
          </p>
        </div>

        {/* Text Sections */}
        <div className="space-y-8 pt-2">
          <section className="space-y-3 px-1">
            <h2 className={`text-[22px] font-bold tracking-tight ${isDarkTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>Present your true self</h2>
            <p className={`text-[16px] leading-[1.4] ${isDarkTheme ? 'text-white/50' : 'text-[var(--text-secondary)]'}`}>
              Upload high-quality images that represent you and your art clearly to attract the right opportunities.
            </p>
          </section>

          <section className="space-y-3 px-1">
            <h2 className={`text-[22px] font-bold tracking-tight ${isDarkTheme ? 'text-white' : 'text-[var(--text-primary)]'}`}>Community Guidelines</h2>
            <p className={`text-[16px] leading-[1.4] ${isDarkTheme ? 'text-white/50' : 'text-[var(--text-secondary)]'}`}>
              Please keep content artistic and professional. Nudity and photos of minors are strictly prohibited.
            </p>
          </section>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default ProfilePhotosView;