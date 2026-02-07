
import React, { useState } from 'react';
import { Profile } from '../types';
import { useTheme } from '../theme/ThemeContext';
import ProfileDetail from '../components/ProfileDetail';

interface ProfileViewProps {
  profile: Profile;
  onEdit: () => void;
  onOpenPro: () => void;
  onOpenSparks: () => void;
  onOpenUplift: () => void;
  onOpenVerify: () => void;
  onOpenProfilePhotos: () => void;

  onOpenSearchSettings: () => void;
  onOpenAppSettings: () => void;
  onOpenHelpCenter: () => void;


  showMagazine: boolean;
  setShowMagazine: (show: boolean) => void;
  showThemes: boolean;
  setShowThemes: (show: boolean) => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onEdit,
  onOpenPro,
  onOpenSparks,
  onOpenUplift,
  onOpenVerify,
  onOpenProfilePhotos,

  onOpenSearchSettings,
  onOpenAppSettings,
  onOpenHelpCenter,


  showMagazine,
  setShowMagazine,
  showThemes,
  setShowThemes
}) => {
  const { currentTheme, setThemeName } = useTheme();
  const isColoredTheme = !['Dark', 'Light'].includes(currentTheme.name);
  const [showShareProfile, setShowShareProfile] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const menuItems = [
    { label: 'Search settings', icon: 'adjustments', onClick: onOpenSearchSettings },
    { label: 'Feel', icon: 'palette', onClick: () => setShowThemes(true) },
    { label: 'App settings', icon: 'cog', onClick: onOpenAppSettings },
    { label: 'Help center', icon: 'question', onClick: onOpenHelpCenter },
    { label: 'Share profile', icon: 'share', onClick: () => setShowShareProfile(true) },

    { label: 'Events Circle', icon: 'external', onClick: () => setShowMagazine(true) },

  ];

  /* -------------------------------------------------------------------------- */
  /*                             PREVIEW MODE                                   */
  /* -------------------------------------------------------------------------- */
  if (showPreview) {
    return (
      <div className="fixed inset-0 z-[200] overflow-y-auto bg-[var(--bg-primary)] no-scrollbar animate-in slide-in-from-right duration-300 pb-32">

        {/* Back Button for Preview */}
        <button
          onClick={() => setShowPreview(false)}
          className="fixed top-4 left-4 z-50 w-10 h-10 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/10 hover:bg-black/60 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Reusing ProfileDetail with isOwnProfile flag */}
        <ProfileDetail
          profile={profile}
          isOwnProfile={true}
          // Pass necessary handlers even if some are hidden or unused in preview mode
          onEditBio={onEdit}
          onEditArtForms={onEdit}
          onEditInterests={onEdit}
          onAddImage={onOpenProfilePhotos}
        />

        {/* Floating Edit Button in Preview */}
        <div className="fixed bottom-8 right-6 z-40">
          <button
            onClick={() => { setShowPreview(false); onEdit(); }}
            className="bg-[var(--text-primary)] text-[var(--bg-primary)] px-6 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 active:scale-95 transition-transform"
          >
            <Icon type="pencil" className="w-5 h-5" />
            <span>Edit Profile</span>
          </button>
        </div>

      </div>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                             DASHBOARD MODE                                 */
  /* -------------------------------------------------------------------------- */
  return (
    <div
      className="h-screen overflow-y-auto bg-[var(--bg-primary)] pb-32 no-scrollbar overscroll-y-contain"
      style={{
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div className="p-4 flex justify-between items-center mb-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-[var(--text-primary)]">{profile.name}</h1>
        <div
          onClick={onOpenPro}
          className={`w-10 h-10 rounded-full flex items-center justify-center border cursor-pointer active:scale-95 transition-transform ${isColoredTheme ? 'bg-[var(--bg-secondary)] border-[var(--bg-secondary)]' : 'bg-[#1a0b2e] border-[#4c1d95]'}`}
        >
          <span className="text-[10px] font-bold text-white">70%</span>
        </div>
      </div>

      <div className="px-1.5 mb-4">
        <div className="relative h-2 bg-[var(--bg-tertiary)] rounded-full overflow-hidden">
          <div className={`absolute left-0 top-0 h-full w-[70%] ${isColoredTheme ? 'bg-[var(--accent-primary)]' : 'bg-[#4c1d95]'}`} />
        </div>
      </div>

      <div className="md:flex md:gap-12 md:px-8 md:items-center">
        {/* Left Column (Desktop) */}
        <div className="md:w-1/3 md:sticky md:top-24 md:flex md:justify-center">
          <div className="px-1.5 mb-6 md:px-0">
            <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden shadow-2xl md:aspect-[3/4] max-w-lg mx-auto md:max-w-none md:mx-0">
              <img src={profile.images[0]} className="w-full h-full object-cover" alt="Me" />

              {/* Preview Button Overlay */}
              <button
                onClick={() => setShowPreview(true)}
                className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full font-bold text-sm border border-white/20 flex items-center gap-2 hover:bg-black/70 transition-all active:scale-95"
              >
                <Icon type="eye" className="w-4 h-4" />
                <span>Preview</span>
              </button>

            </div>
          </div>
        </div>

        {/* Right Column (Desktop) */}
        <div className="md:flex-1">
          <div className="flex justify-between gap-3 items-center px-1.5 mb-6 md:px-0 md:justify-center md:gap-12">
            <ProfileActionButton label="Edit profile" icon="pencil" onClick={onEdit} />
            <ProfileActionButton label="Sparks" count={0} icon="ping" onClick={onOpenSparks} />
            <ProfileActionButton label="Uplift your profile" icon="uplift" onClick={onOpenUplift} />
          </div>

          <div className="px-1.5 mb-12 md:px-0">
            <div
              onClick={onOpenPro}
              className="bg-[#4c1d95] rounded-[32px] p-6 flex items-center gap-4 group active:scale-[0.98] transition-transform cursor-pointer shadow-lg shadow-purple-900/20"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-[#4c1d95] font-extrabold text-xl">
                P
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white leading-tight">Upgrade to Artist Pro</h3>
                <p className="text-white/80 text-sm leading-tight">Find your people faster and access exclusive features.</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 px-1.5 mb-12 md:px-0 md:grid md:grid-cols-2 md:gap-4 md:space-y-0">
            <QuickActionCard
              label="Become Official"
              sub="Stand out as a genuine artist with the Verified badge."
              icon="verify-circle"
              bgColor="bg-green-900/20"
              iconColor="text-green-500"
              onClick={onOpenVerify}
            />
            <QuickActionCard
              label="Build your gallery"
              sub="You have empty slots. Fill them to show your true artistic breadth."
              progress="70%"
              icon="progress"
              bgColor="bg-[var(--bg-tertiary)]"
              onClick={onOpenProfilePhotos}
            />

          </div>

        </div>
      </div>

      <div className="px-2 mb-12 md:px-8">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={item.onClick}
            className="w-full flex items-center justify-between p-4 hover:bg-[var(--bg-tertiary)] rounded-2xl transition-colors text-left"
          >
            <div className="flex items-center gap-4">
              <Icon type={item.icon} />
              <span className="text-lg font-medium text-[var(--text-primary)]">{item.label}</span>
            </div>
            <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        ))}
      </div>

      {/* Events Circle Popup (formerly Magazine) */}
      {showMagazine && <EventsCirclePopup onClose={() => setShowMagazine(false)} />}

      {/* Share Profile Popup */}
      {showShareProfile && <ShareProfilePopup onClose={() => setShowShareProfile(false)} />}

      {/* Themes Popup */}
      {showThemes && (
        <div
          className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in duration-300"
          onClick={() => setShowThemes(false)}
        >
          <div
            className="w-full max-w-sm bg-[var(--bg-secondary)] rounded-[32px] border border-[var(--border-color)] p-6 animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-black text-[var(--text-primary)] mb-6">Themes</h2>
            <div className="grid grid-cols-1 gap-2">
              {[
                'Dark',
                'Light',
                'Orange',
                'Pink',
                'Brown'
              ].map((themeName) => (
                <button
                  key={themeName}
                  onClick={() => {
                    setThemeName(themeName as any);
                  }}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${currentTheme.name === themeName
                    ? 'border-[var(--accent-primary)] bg-[var(--accent-primary)]/10'
                    : 'border-[var(--border-color)] hover:bg-[var(--bg-tertiary)]'
                    }`}
                >
                  <span className={`font-medium text-sm ${currentTheme.name === themeName ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}>
                    {themeName}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowThemes(false)}
              className="w-full mt-6 py-3 bg-[var(--bg-tertiary)] text-[var(--text-primary)] rounded-full font-bold text-sm"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Events Circle Popup Component (formerly MagazinePopup) with buffer-ready video fade-in
const EventsCirclePopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [showVideo, setShowVideo] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

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
  React.useEffect(() => {
    const timer = setTimeout(() => setShowVideo(true), 160);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[300] bg-[#0a0118] animate-in fade-in duration-300 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        {/* App bg shows until video is ready */}
        <div className={`absolute inset-0 bg-[#0a0118] z-10 transition-opacity duration-700 ${showVideo ? 'opacity-0' : 'opacity-100'}`} />
        <video
          ref={videoRef}
          src="https://videos.pexels.com/video-files/7101967/7101967-sd_360_548_25fps.mp4"
          autoPlay
          loop
          muted
          playsInline
          onProgress={handleVideoProgress}
          onCanPlayThrough={() => setShowVideo(true)}
          style={{ visibility: showVideo ? 'visible' : 'hidden' }}
          className={`w-full h-full object-cover transition-opacity duration-700 ${showVideo ? 'opacity-60' : 'opacity-0'}`}
        />
        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#0a0118]" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center text-center px-10 animate-in zoom-in-95 slide-in-from-bottom-10 duration-1000">
        <div className="mb-10 p-4 border border-white/20 rounded-full backdrop-blur-md bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>

        <h2 className="text-white text-[32px] font-black tracking-tight leading-[1.1] mb-6 drop-shadow-2xl">
          Where art happens.<br />In real time.
        </h2>

        <p className="text-white/80 text-lg font-medium max-w-[320px] mb-4 leading-relaxed italic">
          "Step into the Events Circle. Exhibitions, pop-ups, and gatherings curated for connection. The next big moment is just around the corner."
        </p>

        <div className="h-px w-16 bg-white/20 mb-6" />

        <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.3em] mb-12">
          Thank you for using Yatin's Demo Mock of Artist Circle
        </p>

        <button
          onClick={onClose}
          className="w-full max-w-[240px] py-5 bg-white text-black rounded-full font-black text-xs tracking-[0.2em] uppercase shadow-[0_20px_50px_rgba(255,255,255,0.2)] active:scale-95 transition-all"
        >
          Check out events
        </button>
      </div>
    </div>
  );
};


// Share Profile Popup Component with buffer-ready video fade-in
const ShareProfilePopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [showVideo, setShowVideo] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

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
  React.useEffect(() => {
    const timer = setTimeout(() => setShowVideo(true), 160);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[300] bg-[#0a0118] animate-in fade-in duration-300 flex flex-col items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        {/* App bg shows until video is ready */}
        <div className={`absolute inset-0 bg-[#0a0118] z-10 transition-opacity duration-700 ${showVideo ? 'opacity-0' : 'opacity-100'}`} />
        <video
          ref={videoRef}
          src="https://videos.pexels.com/video-files/7565634/7565634-sd_540_960_25fps.mp4"
          autoPlay
          loop
          muted
          playsInline
          onProgress={handleVideoProgress}
          onCanPlayThrough={() => setShowVideo(true)}
          style={{ visibility: showVideo ? 'visible' : 'hidden' }}
          className={`w-full h-full object-cover transition-opacity duration-700 ${showVideo ? 'opacity-50' : 'opacity-0'}`}
        />
        {/* Cinematic Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0a0118]" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex flex-col items-center text-center px-10 animate-in zoom-in-95 slide-in-from-bottom-10 duration-1000">
        <div className="mb-10 p-4 border border-white/20 rounded-full backdrop-blur-md bg-white/5 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
          <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m.516 3.066l5.316 2.658m-5.316-5.724l5.316-2.658M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 10a3 3 0 11-6 0 3 3 0 016 0zm-6-5a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>

        <h2 className="text-white text-[32px] font-black tracking-tight leading-[1.1] mb-6 drop-shadow-2xl">
          Share your creative vision
        </h2>

        <p className="text-white/80 text-lg font-medium max-w-[320px] mb-4 leading-relaxed italic">
          "Connect with fellow artists and creators. Share your profile to inspire collaboration, discover new perspectives, and build meaningful artistic relationships."
        </p>

        <div className="h-px w-16 bg-white/20 mb-10" />

        <button
          onClick={onClose}
          className="w-full max-w-[240px] py-5 bg-white text-black rounded-full font-black text-xs tracking-[0.2em] uppercase shadow-[0_20px_50px_rgba(255,255,255,0.2)] active:scale-95 transition-all mb-4"
        >
          Go back
        </button>

        <p className="text-white/30 text-[10px] font-medium max-w-[280px] leading-relaxed">
          This is a demo feature. In the full app, you'll be able to share your artistic journey with others in the community.
        </p>
      </div>
    </div>
  );
};


const ProfileActionButton: React.FC<{ label: string; count?: number; icon: string; onClick?: () => void }> = ({ label, count, icon, onClick }) => {
  const { currentTheme } = useTheme();
  const isColoredTheme = !['Dark', 'Light'].includes(currentTheme.name);

  return (
    <div className="flex-1 flex flex-col items-center gap-2" onClick={onClick}>
      <div className="w-full h-14 bg-[var(--bg-tertiary)] backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg relative cursor-pointer active:scale-95 hover:scale-105 transition-transform max-w-[120px] border border-[var(--border-color)]">
        <Icon type={icon} className="w-7 h-7 text-[var(--text-primary)]" />
        {count !== undefined && (
          <div className={`absolute -top-2 -right-2 w-6 h-6 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-[var(--bg-primary)] ${isColoredTheme ? 'bg-[var(--accent-primary)]' : 'bg-[#4c1d95]'}`}>
            {count}
          </div>
        )}
      </div>
      <span className="text-xs font-semibold text-center text-[var(--text-secondary)] leading-tight">
        {label}
      </span>
    </div>
  );
};

const QuickActionCard: React.FC<{ label: string; sub: string; icon: string; bgColor: string; iconColor?: string; progress?: string; onClick?: () => void; className?: string }> = ({ label, sub, icon, bgColor, iconColor, progress, onClick, className }) => (
  <div
    onClick={onClick}
    className={`bg-[var(--bg-secondary)]/80 border border-[var(--border-color)] p-6 rounded-[32px] flex items-center gap-5 cursor-pointer active:opacity-80 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:border-[var(--text-primary)]/20 transition ${className}`}
  >
    <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${iconColor || 'text-[var(--text-primary)]/80'} ${progress ? 'border-2 border-[var(--border-color)]' : ''}`}>
      {progress ? <span className="text-xs font-bold text-[var(--text-secondary)]">{progress}</span> : <Icon type={icon} className="w-7 h-7" />}
    </div>
    <div className="flex-1">
      <h4 className="text-lg font-bold leading-tight text-[var(--text-primary)]">{label}</h4>
      <p className="text-sm text-[var(--text-secondary)] leading-tight mt-1">{sub}</p>
    </div>
  </div>
);

const Icon: React.FC<{ type: string; className?: string }> = ({ type, className = "w-6 h-6" }) => {
  switch (type) {
    case 'ping': return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    );
    case 'uplift': return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2L15 9L22 12L15 15L12 22L9 15L2 12L9 9L12 2Z" />
      </svg>
    );
    case 'pencil': return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    );
    case 'verify-circle': return (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    );

    case 'adjustments': return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>;
    case 'cog': return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>;
    case 'question': return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
    case 'share': return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
    case 'info': return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    case 'external': return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
    case 'users': return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>;
    case 'palette': return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
    case 'eye': return <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
    default: return null;
  }
}

export default ProfileView;
