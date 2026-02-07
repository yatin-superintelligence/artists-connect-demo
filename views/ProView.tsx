import React, { useState, useEffect, useRef } from 'react';

interface ProViewProps {
  onClose: () => void;
  variant?: 'lastSeen' | 'likes' | 'general' | 'incognito';
}

const ProView: React.FC<ProViewProps> = ({ onClose, variant = 'general' }) => {
  const [selectedPlan, setSelectedPlan] = useState<number>(1); // 0: 1 mo, 1: 3 mo, 2: 1 yr
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Check buffer readiness - only show video when enough is buffered
  const handleVideoProgress = () => {
    const video = videoRef.current;
    if (video && video.buffered.length > 0) {
      const bufferedEnd = video.buffered.end(video.buffered.length - 1);
      if (bufferedEnd >= 1) { // At least 1 second buffered
        setShowVideo(true);
      }
    }
  };

  // Fallback timer for already-cached videos
  useEffect(() => {
    const timer = setTimeout(() => setShowVideo(true), 160);
    return () => clearTimeout(timer);
  }, []);

  const content: Record<string, { title: string; desc: string }> = {
    lastSeen: {
      title: "Last seen",
      desc: "Know when someone was last on Artist Circle, and see only members that have been active in the past 7 days."
    },
    likes: {
      title: "See who liked you",
      desc: "See everyone who's liked you, and filter them by your preferences and curiosities."
    },
    general: {
      title: "Become an Artist Pro",
      desc: "Send unlimited likes, see who's into you, and connect with more clarity and confidence."
    },
    incognito: {
      title: "Go incognito",
      desc: "Explore on your terms. Other members won't see your profile until you like them first."
    },

  };

  const activeContent = content[variant] || content.general;

  const plans = [
    { duration: '1 MONTH', price: '₹599.00', perMo: '₹599.00/mo', subtext: '', total: '₹599.00', ctaLabel: '1 month for ₹599.00' },
    { duration: '3 MONTHS', price: '₹399.67', perMo: '₹399.67/mo', subtext: '₹399.67/MONTH', popular: true, total: '₹1,199.00', ctaLabel: '3 months for ₹1,199.00' },
    { duration: '1 YEAR', price: '₹249.92', perMo: '₹249.92/mo', subtext: '₹249.92/MONTH', total: '₹2,999.00', ctaLabel: '1 year for ₹2999' }
  ];

  const mainFeatures = [
    { icon: 'user', label: 'See who liked you' },
    { icon: 'sun', label: 'One free Spark a day' },

    { icon: 'heart', label: 'Unlimited likes' }
  ];

  const subFeatures = [
    { title: 'Go incognito', desc: 'Hide your profile, but still send likes.' },
    { title: 'Last seen', desc: 'See when people were last active' },
    { title: 'Undo a dislike', desc: 'Go back and reconsider the last profile you disliked.' },
    { title: 'Private photos', desc: 'Make profile photos visible to Connections only' }
  ];

  const useVibrantBg = variant === 'likes' || variant === 'general' || variant === 'incognito';

  return (
    <div className="fixed inset-0 z-[150] bg-[#0a0118] overflow-hidden">
      {/* Background Layer */}
      <div className="fixed top-0 left-0 w-full h-[100vh] pointer-events-none overflow-hidden">
        {/* Solid app background - shows for 160ms before video fades in */}
        <div className={`absolute inset-0 bg-[#0a0118] z-20 transition-opacity duration-700 ${showVideo ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          onProgress={handleVideoProgress}
          onCanPlayThrough={() => setShowVideo(true)}
          style={{ visibility: showVideo ? 'visible' : 'hidden' }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${showVideo ? 'opacity-100' : 'opacity-0'}`}
        >
          <source src="https://videos.pexels.com/video-files/10994871/10994871-sd_540_960_25fps.mp4" type="video/mp4" />
        </video>
        {/* 20% dimmed overlay */}
        <div className={`absolute inset-0 bg-black/20 transition-opacity duration-700 ${showVideo ? 'opacity-100' : 'opacity-0'}`} />
        <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-black/20 to-transparent z-10" />
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-6 right-6 z-[160] w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white active:scale-90 transition border border-white/10 shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="absolute inset-0 overflow-y-auto overscroll-y-none no-scrollbar animate-in slide-in-from-bottom duration-300 z-20" style={{ willChange: 'scroll-position' }}>
        <div className="relative px-3 pt-16 pb-48">
          <div className="flex items-center gap-2 mb-4 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="w-6 h-6 bg-[#4c1d95] rounded-full flex items-center justify-center text-[10px] text-white font-black shadow-[0_0_10px_rgba(76,29,149,0.5)] border border-white/20">P</div>
            <span className="text-[11px] font-black text-white uppercase tracking-widest drop-shadow-sm opacity-80">Special offer</span>
          </div>

          <h1 className="text-5xl font-black text-white mb-6 tracking-tight leading-[1.05] animate-in fade-in slide-in-from-bottom-4 duration-700 drop-shadow-md">
            {activeContent.title}
          </h1>

          <p className="text-white text-[17px] font-medium leading-snug mb-10 max-w-[95%] animate-in fade-in duration-1000 drop-shadow-sm opacity-90">
            {activeContent.desc}
          </p>

          {/* Pricing Selection */}
          <div className="flex flex-row w-full justify-between items-stretch gap-2 px-1 mb-16 md:gap-3 md:px-0 md:justify-center">
            {plans.map((plan, i) => (
              <div
                key={i}
                onClick={() => setSelectedPlan(i)}
                className={`flex-1 min-w-0 h-[140px] rounded-2xl p-3 flex flex-col justify-center items-center text-center gap-2 transition-all duration-300 cursor-pointer border ${selectedPlan === i
                  ? 'bg-white text-black shadow-xl scale-[1.02] border-white'
                  : 'bg-white/5 text-white border-white/5 hover:bg-white/10'
                  }`}
              >
                <div className="space-y-0.5 w-full flex flex-col items-center">
                  <div className={`text-[9px] font-black tracking-widest uppercase mb-1 ${selectedPlan === i ? 'text-black/40' : 'text-white/30'}`}>
                    {plan.duration}
                  </div>
                  <div className="text-[18px] font-black tracking-tighter leading-none">
                    {plan.price}
                  </div>
                  <div className={`text-[11px] font-medium ${selectedPlan === i ? 'text-black/60' : 'text-white/40'}`}>
                    per month
                  </div>
                </div>
                {plan.subtext && (
                  <div className={`px-2 py-1 rounded-full text-[9px] font-bold tracking-tight ${selectedPlan === i ? 'bg-black/5 text-black' : 'bg-white/10 text-white/60'}`}>
                    {plan.subtext}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Consolidated Features List - Minimal & Clean */}
          <div className="mb-12 px-2">
            <h2 className="text-xl font-bold text-white mb-8 tracking-wide text-center opacity-90 relative right-[25px]">Everything included in Pro</h2>
            <div className="space-y-6 max-w-sm mx-auto">
              {[
                { title: 'See who liked you', desc: 'Reveal every person who wants to connect.', icon: 'user' },
                { title: 'Unlimited likes', desc: 'Send as many likes as you want, anytime.', icon: 'heart' },

                { title: 'Go incognito', desc: 'Only be seen by the people you like first.', icon: 'mask' },
                { title: 'Daily free Spark', desc: 'Stand out with one free priority message every day.', icon: 'sun' }
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-5 group">
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/90 flex-shrink-0 group-hover:bg-white/10 transition-colors">
                    <Icon type={feat.icon} />
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="text-[16px] font-bold text-white tracking-wide mb-1 leading-none">{feat.title}</h3>
                    <p className="text-white/50 text-[14px] font-medium leading-normal">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col items-center gap-4 mb-20 text-center">
            <button className="px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-[15px] active:scale-95 transition">
              Restore subscription
            </button>
            <button className="px-8 py-3 rounded-full bg-white/5 hover:bg-white/10 text-white/60 font-bold text-[11px] tracking-widest uppercase transition">
              Terms and conditions
            </button>
          </div>
        </div>
      </div>

      {/* Persistent Bottom CTA - Match screenshot orange button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 pb-10 bg-gradient-to-t from-[#0a0118] via-[#0a0118] to-transparent z-50">
        <button className="w-full bg-[#4c1d95] text-white py-5 rounded-full font-black text-lg shadow-[0_15px_40px_rgba(76,29,149,0.4)] flex items-center justify-center gap-3 active:scale-[0.98] transition transform hover:-translate-y-1">
          <div className="w-7 h-7 bg-white text-[#4c1d95] rounded-full flex items-center justify-center text-[9px] font-black">P</div>
          Get {plans[selectedPlan].ctaLabel}
        </button>
      </div>

      <style>{`
        @keyframes aurora {
          0% { background: radial-gradient(circle at 10% 20%, #4c1d95 0%, #831843 50%, #1e1b4b 100%); }
          33% { background: radial-gradient(circle at 90% 80%, #9f1239 0%, #4c1d95 50%, #0f172a 100%); }
          66% { background: radial-gradient(circle at 50% 50%, #be123c 0%, #701a75 50%, #020617 100%); }
          100% { background: radial-gradient(circle at 10% 20%, #4c1d95 0%, #831843 50%, #1e1b4b 100%); }
        }

        @keyframes glassSlow {
          0% { transform: translateX(-50%) translateY(-50%) rotate(12deg); }
          50% { transform: translateX(0%) translateY(0%) rotate(15deg); }
          100% { transform: translateX(-50%) translateY(-50%) rotate(12deg); }
        }

        .bg-aurora {
          background-size: 200% 200%;
        }

        .animate-aurora {
          animation: aurora 15s ease infinite;
        }

        .bg-glass-sweep {
          background: linear-gradient(
            135deg,
            transparent 0%,
            transparent 45%,
            rgba(255, 255, 255, 0.2) 48%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0.2) 52%,
            transparent 55%,
            transparent 100%
          );
          filter: blur(20px);
        }

        .animate-glass-slow {
          animation: glassSlow 25s ease-in-out infinite;
        }

        /* Hide Scrollbars but keep functionality */
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

const Icon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'user': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>;
    case 'sun': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
    case 'infinity': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>; // Correct infinity icon replacement or kept generic
    case 'mask': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.143-7.714L1 12l6.857-2.143L11 3z" /></svg>; /* Using a sparkle-like icon for incognito/magic feel, or actual mask: */
    case 'heart': return <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
    default: return null;
  }
};

export default ProView;