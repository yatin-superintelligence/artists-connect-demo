import React, { useState, useEffect, useRef } from 'react';

interface VerifyProfileViewProps {
  onBack: () => void;
}

const VerifyProfileView: React.FC<VerifyProfileViewProps> = ({ onBack }) => {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check buffer readiness
  const handleVideoProgress = () => {
    const video = videoRef.current;
    if (video && video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      if (bufferedEnd >= 1) {
        // Wait 0.3 seconds before starting fade-in
        setTimeout(() => setShowVideo(true), 300);
      }
    }
  };

  // Fallback timer for cached videos - 0.3 second delay
  useEffect(() => {
    // Reset on mount to ensure fade-in happens every visit
    setShowVideo(false);
    const timer = setTimeout(() => setShowVideo(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        {/* Black fallback background before video loads */}
        <div className={`absolute inset-0 bg-black transition-opacity duration-[800ms] ${showVideo ? 'opacity-0' : 'opacity-100'}`} />
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onProgress={handleVideoProgress}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-[800ms] ${showVideo ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src="https://videos.pexels.com/video-files/11499368/11499368-sd_640_360_30fps.mp4" type="video/mp4" />
        </video>
        {/* Light gradient only for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex flex-col h-full">
        {/* Header */}
        <header className="flex items-center gap-4 p-5 flex-shrink-0">
          <button onClick={onBack} className="p-1 -ml-1 text-white hover:opacity-80 transition-opacity">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-white text-[17px] font-bold">Verify profile</h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-between px-8 py-2 overflow-hidden">
          <div className="flex flex-col items-center w-full">
            {/* Main Badge Icon */}
            <div className="w-[72px] h-[72px] bg-white rounded-full flex items-center justify-center mb-5 shadow-lg">
              <svg className="w-9 h-9 text-purple-900" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>

            <h2 className="text-white text-[36px] font-bold text-center leading-[1.05] mb-8 drop-shadow-lg">
              Verify your<br />profile
            </h2>

            {/* Info List */}
            <div className="w-full space-y-5">
              <div className="flex gap-4">
                <div className="mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white text-[17px] font-bold mb-0.5">Build trust in the community</h3>
                  <p className="text-white/80 text-[14px] leading-snug">A Verified badge shows fellow artists you're a genuine member of our creative community.</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/10">
                <div className="mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white text-[17px] font-bold mb-0.5">Your privacy matters</h3>
                  <p className="text-white/80 text-[14px] leading-snug">Verification is secure and private — your selfie stays between you and us.</p>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-white/10">
                <div className="mt-1">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-white text-[17px] font-bold mb-0.5">Simple and fast</h3>
                  <p className="text-white/80 text-[14px] leading-snug">No ID needed — just a quick selfie and you're verified in moments.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Button */}
          <div className="w-full mt-6 mb-12 flex justify-center flex-shrink-0">
            <button className="w-[140px] h-[84px] bg-white text-[#6b21a8] rounded-full flex items-center justify-center text-[18px] font-bold shadow-2xl active:scale-95 transition-transform">
              Start
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyProfileView;