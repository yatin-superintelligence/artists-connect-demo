
import React from 'react';
import BufferedVideo from '../Media/BufferedVideo';
import { useTheme } from '../../theme/ThemeContext';

interface MiniBrowserProps {
  url: string;
  title: string;
  onClose: () => void;
}

/**
 * A demo browser-like modal for showcasing UI/UX.
 * Displays a placeholder message instead of an iframe to avoid connection issues in the demo.
 */
const MiniBrowser: React.FC<MiniBrowserProps> = ({ url, title, onClose }) => {
  const { currentTheme } = useTheme();

  // Use theme colors for Pink, Brown, Orange; keep #120d1d for classic dark/light
  const isColoredTheme = !['Dark', 'Light'].includes(currentTheme.name);
  const headerBg = isColoredTheme ? 'var(--bg-primary)' : '#120d1d';
  const containerBg = isColoredTheme ? 'var(--bg-primary)' : '#120d1d';
  const fallbackBg = isColoredTheme ? 'var(--bg-primary)' : '#120d1d';

  return (
    <div
      className="fixed inset-0 z-[300] bg-black/40 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl md:max-w-none md:w-[80vw] h-[90vh] rounded-[40px] shadow-[0_32px_80px_-12px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-12 duration-500"
        style={{ backgroundColor: containerBg }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Browser Header */}
        <header
          className="flex items-center justify-between px-8 py-6 backdrop-blur-md border-b border-white/10 text-white flex-shrink-0 absolute top-0 left-0 right-0 z-20"
          style={{ backgroundColor: headerBg }}
        >
          <div className="flex items-center gap-5 min-w-0 flex-1">
            <button
              onClick={onClose}
              className="w-10 h-10 flex items-center justify-center -ml-2 hover:bg-white/10 rounded-full transition-all active:scale-90"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex flex-col min-w-0">
              <h2 className="text-[15px] font-black truncate leading-tight tracking-tight uppercase">{title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-black text-white/40 tracking-widest uppercase">Secured</span>
          </div>
        </header>

        {/* Content Area - Placeholder Demo */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-12 text-center pt-32">
          {/* Background Video */}
          {/* Background Video */}
          <div className="absolute inset-0 z-0">
            <BufferedVideo
              src="https://videos.pexels.com/video-files/20525307/20525307-sd_360_640_30fps.mp4"
              fallbackColor={fallbackBg}
            />
            {/* Overlays */}
            <div className="absolute inset-0 z-[1] bg-black/60 backdrop-blur-[2px]" />
            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-[#120d1d]/80 via-transparent to-[#120d1d]/90" />
          </div>

          <div className="max-w-md relative z-10">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-[32px] flex items-center justify-center mx-auto mb-10 shadow-2xl animate-bounce">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>

            <h3 className="text-[32px] font-black text-white mb-6 leading-tight tracking-tight drop-shadow-lg">
              Browser Demo
            </h3>

            <p className="text-white/70 text-lg font-medium leading-relaxed drop-shadow-md">
              Since this is a demo app, the external browser is not opened. This is only intended to show how a sleek, integrated browser experience can look within the Artist Circle ecosystem.
            </p>

            <div className="mt-10 flex flex-col items-center gap-5">
              <button
                onClick={onClose}
                className="bg-white text-black px-12 py-5 rounded-full font-black text-sm tracking-widest uppercase shadow-[0_20px_40px_rgba(0,0,0,0.5)] hover:bg-gray-100 active:scale-95 transition-all"
              >
                Back to the app
              </button>
              <span className="text-white/30 text-xs font-bold uppercase tracking-widest">Interface Mockup v1.1</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniBrowser;
