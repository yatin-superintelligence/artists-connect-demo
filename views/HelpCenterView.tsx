
import React, { useState, useEffect, useRef } from 'react';
import MiniBrowser from '../components/MiniBrowser/MiniBrowser';
import BufferedVideo from '../components/Media/BufferedVideo';

interface HelpCenterViewProps {
  onBack: () => void;
}

const HelpItem: React.FC<{ label: string; onClick?: () => void }> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center justify-between py-6 px-1 border-b border-[var(--border-color)] active:bg-[var(--bg-tertiary)] transition-colors group"
  >
    <span className="text-xl font-medium text-[var(--text-primary)]">{label}</span>
    <svg className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-10 10M17 7H7M17 7v10" />
    </svg>
  </button>
);

// Support popup with buffer-ready video fade-in
const SupportPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div
      className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-[40px] border border-white/10 p-10 flex flex-col items-center text-center shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-300 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Video */}
        <BufferedVideo src="https://videos.pexels.com/video-files/20525307/20525307-sd_360_640_30fps.mp4" />

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px] z-0 pointer-events-none" />

        <div className="relative z-10 w-full flex flex-col items-center">
          <div className="w-20 h-20 bg-indigo-500/20 rounded-[28px] flex items-center justify-center mb-8 shadow-inner border border-indigo-500/30">
            <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
            </svg>
          </div>

          <h2 className="text-2xl font-black text-white mb-6 leading-tight tracking-tight">
            Thank you for exploring Artist Circle
          </h2>

          <p className="text-white/60 text-[16px] leading-relaxed font-medium mb-10">
            This is a demonstration prototype showcasing the Artist Circle experience. For support with the full application, please visit our official channels or reach out to our team directly.
          </p>

          <button
            onClick={onClose}
            className="w-full bg-white text-black py-4 rounded-full font-black text-sm tracking-widest uppercase shadow-xl hover:bg-gray-100 active:scale-95 transition-all"
          >
            Back to discovery
          </button>
        </div>
      </div>
    </div>
  );
};

const HelpCenterView: React.FC<HelpCenterViewProps> = ({ onBack }) => {
  const [browserConfig, setBrowserConfig] = useState<{ url: string; title: string } | null>(null);
  const [showSupportPopup, setShowSupportPopup] = useState(false);
  const [showCancelPopup, setShowCancelPopup] = useState(false);

  // Handle back button for internal popups
  useEffect(() => {
    (window as any).__internalPopupOpen = browserConfig || showSupportPopup || showCancelPopup;
    return () => { (window as any).__internalPopupOpen = false; };
  }, [browserConfig, showSupportPopup, showCancelPopup]);

  useEffect(() => {
    const handlePopState = () => {
      if ((window as any).__backHandled) return;

      if (browserConfig) {
        (window as any).__backHandled = true;
        setBrowserConfig(null);
        setTimeout(() => (window as any).__backHandled = false, 50);
        return;
      }
      if (showSupportPopup) {
        (window as any).__backHandled = true;
        setShowSupportPopup(false);
        setTimeout(() => (window as any).__backHandled = false, 50);
        return;
      }
      if (showCancelPopup) {
        (window as any).__backHandled = true;
        setShowCancelPopup(false);
        setTimeout(() => (window as any).__backHandled = false, 50);
        return;
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [browserConfig, showSupportPopup, showCancelPopup]);

  return (
    <div className="fixed inset-0 bg-[var(--bg-primary)] z-[130] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="flex items-center gap-4 p-5 sticky top-0 bg-[var(--bg-primary)] z-10 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="p-1 -ml-1 hover:bg-[var(--bg-tertiary)] rounded-full transition-colors text-[var(--text-primary)]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">Help</h1>
      </header>

      {/* List */}
      <div className="flex-1 px-2 pt-4 overflow-y-auto no-scrollbar">
        <div className="flex flex-col">
          <HelpItem label="Contact support" onClick={() => setShowSupportPopup(true)} />
          <HelpItem
            label="Help center"
            onClick={() => setBrowserConfig({
              url: 'https://support.feeld.co/hc/en-gb',
              title: 'Artist Circle Help Center'
            })}
          />
          <HelpItem
            label="Cancel membership and refunds"
            onClick={() => setShowCancelPopup(true)}
          />
        </div>
      </div>

      {/* Mini Browser Popup */}
      {browserConfig && (
        <MiniBrowser
          url={browserConfig.url}
          title={browserConfig.title}
          onClose={() => setBrowserConfig(null)}
        />
      )}

      {/* Custom Support Popup */}
      {showSupportPopup && <SupportPopup onClose={() => setShowSupportPopup(false)} />}

      {/* Don't Leave Popup for Cancel Membership */}
      {showCancelPopup && (
        <div
          className="fixed inset-0 z-[300] bg-black animate-in fade-in duration-500 flex flex-col items-center justify-center"
          onClick={() => setShowCancelPopup(false)}
        >
          {/* Background Video */}
          <BufferedVideo
            src="https://videos.pexels.com/video-files/20525307/20525307-sd_360_640_30fps.mp4"
            className="opacity-90"
          />

          {/* Vignette / Dark Overlay - placed AFTER video to be on top */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#0a0118]/90 z-10 pointer-events-none" />

          {/* Content Over Video */}
          <div className="relative z-20 flex flex-col items-center text-center px-8">
            <h2 className="text-white text-[64px] font-black tracking-tighter leading-none mb-12 drop-shadow-2xl">
              We'll Miss<br />You
            </h2>

            <p className="text-white/80 text-xl font-medium max-w-[280px] mb-20 leading-tight">
              Your creative journey matters to us. We'd love for you to stay and continue building connections.
            </p>

            <button
              onClick={(e) => { e.stopPropagation(); setShowCancelPopup(false); }}
              className="px-12 py-5 bg-white text-black rounded-full font-black text-sm tracking-[0.2em] uppercase shadow-[0_20px_40px_rgba(0,0,0,0.5)] active:scale-95 transition-all"
            >
              Continue exploring
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HelpCenterView;
