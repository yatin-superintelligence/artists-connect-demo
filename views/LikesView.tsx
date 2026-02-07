import React, { useState } from 'react';
import { Profile } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface LikesViewProps {
  likes: Profile[];
  onOpenPro: () => void;
  onOpenUplift: () => void;
}

type LikesSubTab = 'likes' | 'sparks';

const LikesView: React.FC<LikesViewProps> = ({ likes, onOpenPro, onOpenUplift }) => {
  const { currentTheme } = useTheme();
  const isLightTheme = currentTheme.name === 'Classic Artist Circle Light';
  const [activeSubTab, setActiveSubTab] = useState<LikesSubTab>('likes');

  const renderSparksEmptyState = () => (
    <div className="flex-1 flex flex-col items-center justify-center px-8 text-center animate-in fade-in duration-500">
      <div className="mb-8 relative">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
          <svg className="w-10 h-10 text-[var(--accent-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
      </div>

      <h3 className={`text-[28px] font-bold leading-[1.1] mb-3 tracking-tight px-4 max-w-xs mx-auto ${isLightTheme ? 'text-black' : 'text-white'}`}>
        Awaiting a creative spark
      </h3>

      <p className={`text-[16px] leading-relaxed font-medium mb-10 px-6 max-w-xs mx-auto ${isLightTheme ? 'text-black/50' : 'text-white/40'}`}>
        When someone resonates deeply with your work, a Spark will appear here.
      </p>

      <button
        onClick={onOpenUplift}
        className="bg-[#4c1d95] text-white font-bold py-4 px-9 rounded-xl flex items-center gap-3 shadow-2xl active:scale-95 transition-all"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
        </svg>
        <span className="text-[16px]">Get seen quicker with Uplift</span>
      </button>
    </div>
  );

  return (
    <div className={`h-screen overflow-y-auto bg-[var(--bg-primary)] pt-2 pb-40 no-scrollbar flex flex-col`}>
      {/* Header */}
      <div className="flex items-center w-full border-b border-[var(--border-color)] mb-4 sticky top-0 bg-[var(--bg-primary)] z-10">
        <button
          onClick={() => setActiveSubTab('likes')}
          className={`flex-1 py-4 text-[16px] font-bold text-center transition-all relative ${activeSubTab === 'likes' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]/70'}`}
        >
          {likes.length} Likes
          {activeSubTab === 'likes' && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--text-primary)] rounded-t-full" />
          )}
        </button>
        <button
          onClick={() => setActiveSubTab('sparks')}
          className={`flex-1 py-4 text-[16px] font-bold text-center transition-all relative ${activeSubTab === 'sparks' ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]/70'}`}
        >
          Sparks
          {activeSubTab === 'sparks' && (
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[var(--text-primary)] rounded-t-full" />
          )}
        </button>
      </div>

      {activeSubTab === 'likes' ? (
        <div className="animate-in fade-in duration-300">
          {/* Filter Chips - All trigger Majestic view */}
          <div className="flex overflow-x-auto gap-2 no-scrollbar mb-5 px-5 border-none snap-start">
            <FilterChip label="Most recent" icon="swap" active onClick={onOpenPro} />
            <FilterChip label="Art forms" icon="down" onClick={onOpenPro} />
            <FilterChip label="Interests" icon="down" onClick={onOpenPro} />
            <FilterChip label="Location" icon="down" onClick={onOpenPro} />
          </div>

          {/* Majestic Banner */}
          <div className="px-5 mb-6 snap-start">
            <div
              onClick={onOpenPro}
              className="bg-[#4c1d95] rounded-2xl p-5 flex items-start gap-4 relative overflow-hidden cursor-pointer active:scale-[0.98] transition-all shadow-xl"
            >
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-[#4c1d95] font-black text-xl flex-shrink-0 mt-0.5">
                P
              </div>
              <div className="flex-1 flex flex-col items-start gap-3.5">
                <div>
                  <h3 className="text-[18px] font-bold text-white leading-tight mb-1">Upgrade to see your likes</h3>
                  <p className="text-white/90 text-[13px] leading-snug font-medium">
                    Join Artist Pro to instantly see who likes you.
                  </p>
                </div>
                <button className="bg-white text-black font-bold py-2.5 px-6 rounded-lg text-xs transition-transform active:scale-95 shadow-md">
                  Upgrade now
                </button>
              </div>
            </div>
          </div>

          {/* Vertical List of Profiles */}
          <div className="space-y-6 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6 md:px-5">
            {likes.map((like) => (
              <div key={like.id} className="flex flex-col snap-start">
                <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-2.5 pl-5 pr-5 scroll-pl-5 mb-3 md:px-0 md:scroll-pl-0">
                  {like.images.map((img, idx) => (
                    <div key={idx} className="flex-shrink-0 w-[78%] aspect-square rounded-xl overflow-hidden bg-white/5 border border-white/5 snap-start shadow-lg">
                      <img
                        src={img}
                        alt=""
                        className="w-full h-full object-cover blur-3xl opacity-60"
                      />
                    </div>
                  ))}
                </div>

                <div className="px-5">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="flex items-center gap-2.5 mb-2">
                        <span className={`text-[22px] font-medium tracking-tight truncate ${isLightTheme ? 'text-black' : 'text-white'}`}>{like.name}</span>
                        <div className="bg-[#1a1a1a] px-1.5 py-0.5 rounded-md text-[8px] font-black tracking-[0.1em] text-white/50 border border-white/5 flex-shrink-0">
                          LAST SEEN
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className={`h-1.5 w-[70%] rounded-sm ${isLightTheme ? 'bg-gray-400 opacity-40' : 'bg-white opacity-5'}`}></div>
                        <div className={`h-1.5 w-[40%] rounded-sm ${isLightTheme ? 'bg-gray-400 opacity-40' : 'bg-white opacity-5'}`}></div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-0.5">
                      <button
                        onClick={onOpenPro}
                        className="w-11 h-11 bg-[#1a1a1a] text-white rounded-xl flex items-center justify-center border border-white/10 active:scale-90 transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
                        </svg>
                      </button>
                      <button
                        onClick={onOpenPro}
                        className="w-11 h-11 bg-[var(--text-primary)] text-[var(--bg-primary)] rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Floating Uplift Button */}
          <div className="fixed bottom-28 right-5 z-[45]">
            <button
              onClick={onOpenUplift}
              className="bg-[#4c1d95] text-white font-bold py-3.5 px-7 rounded-xl flex items-center gap-2.5 shadow-2xl shadow-[#4c1d95]/30 whitespace-nowrap active:scale-95 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
              </svg>
              <span className="text-[14px]">Uplift your profile</span>
            </button>
          </div>
        </div>
      ) : (
        renderSparksEmptyState()
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

const FilterChip: React.FC<{ label: string; icon: 'swap' | 'down'; active?: boolean; onClick?: () => void }> = ({ label, icon, active, onClick }) => (
  <button onClick={onClick} className={`px-4 py-1.5 rounded-md text-[12px] font-bold flex items-center gap-2 whitespace-nowrap transition-all active:scale-95 border ${active
    ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-transparent shadow-sm'
    : 'bg-transparent text-[var(--text-secondary)] border-[var(--border-color)] hover:border-[var(--text-primary)]/30'
    }`}>
    {icon === 'swap' && (
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    )}
    {label}
    {icon === 'down' && (
      <svg className="w-3 h-3 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
      </svg>
    )}
  </button>
);

export default LikesView;