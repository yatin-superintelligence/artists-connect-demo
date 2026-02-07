import React, { useState, useRef, useEffect } from 'react';
import { Profile } from '../types';
import { getProfilePosts, Post } from '../data/profiles/posts';
import PostModal from './PostModal';
import { useTheme } from '../theme/ThemeContext';

// Native image component with GPU isolation for smooth scroll performance
const OptimizedImage: React.FC<{ src: string; alt?: string; className?: string }> = ({ src, alt, className }) => {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        contain: 'layout style paint',
        isolation: 'isolate',
      }}
    >
      <img
        src={src}
        alt={alt || ''}
        loading="lazy"
        decoding="async"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
        }}
      />
    </div>
  );
};

interface ProfileDetailProps {
  profile: Profile;
  userInterests?: string[];
  onOpenOutOfSparks?: () => void;
  hideBlockActions?: boolean;
  onEditBio?: () => void;
  onEditArtForms?: () => void;
  onEditInterests?: () => void;
  onAddImage?: () => void;
  onOpenLastSeen?: () => void;

  distanceUnit?: 'km' | 'miles';
  isOwnProfile?: boolean;
}

const ProfileDetail: React.FC<ProfileDetailProps> = ({
  profile,
  userInterests = [],
  onOpenOutOfSparks,
  hideBlockActions,
  onEditBio,
  onEditArtForms,
  onEditInterests,
  onAddImage,
  onOpenLastSeen,
  distanceUnit = 'km',
  isOwnProfile = false
}) => {
  const { currentTheme } = useTheme();
  const [bioRevealed, setBioRevealed] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const isLightTheme = currentTheme.name === 'Classic Artist Circle Light';
  const posts = getProfilePosts(profile.id);

  // Handle back button for PostModal
  useEffect(() => {
    if (selectedPost) {
      // Set global flag BEFORE pushing history state
      (window as any).__postModalOpen = true;
      window.history.pushState({ postModal: true }, '', window.location.href);
    } else {
      (window as any).__postModalOpen = false;
    }
  }, [selectedPost]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      (window as any).__postModalOpen = false;
    };
  }, []);

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // Check if we have an active post modal - this handler has priority
      if (selectedPost) {
        // Immediately mark as handled to prevent App.tsx from processing
        (window as any).__backHandled = true;
        setSelectedPost(null);
        // Clear the flag after a short delay
        setTimeout(() => (window as any).__backHandled = false, 50);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [selectedPost]);


  const getDisplayDistance = (distStr: string) => {
    if (!distStr || distanceUnit === 'km') return distStr;
    const match = distStr.match(/(\d+)/);
    if (!match) return distStr;
    const km = parseInt(match[1]);
    const miles = Math.round(km * 0.621371);
    return distStr.replace(match[1], miles.toString()).replace('km', 'miles');
  };

  const renderArtForms = () => {
    if (!profile.artistTypes || profile.artistTypes.length === 0) return null;

    // Use the same styling as interests but with a slightly different border/bg if desired
    // For now, keeping it consistent with the "Desires" styling but flattened (no linked groups)

    const getTagClass = () => {
      const base = "px-3 py-1.5 rounded-md text-[13px] font-bold border transition-colors tracking-wide";
      return `${base} bg-[var(--bg-tertiary)] border-[var(--border-color)] text-[var(--text-primary)]`;
    };

    return (
      <div className="flex flex-wrap gap-x-2 gap-y-3 mt-4">
        {profile.artistTypes.map(item => (
          <div key={item} className={getTagClass()}>
            {item}
          </div>
        ))}
      </div>
    );
  };

  const sharedCount = profile.interests?.filter(i => userInterests.includes(i)).length || 0;
  const isGroup = profile.profileType === 'Group' || profile.id.includes('group') || profile.id === 'p3';

  const renderGroupDP = () => {
    const imgs = profile.images;
    if (imgs.length <= 1) return <OptimizedImage src={imgs[0] || ''} alt={profile.name} className="w-full h-full" />;

    const count = imgs.length;
    // Determine grid columns: 2 for up to 4 members, 3 for up to 9, then 4
    const cols = count <= 4 ? 2 : count <= 9 ? 3 : 4;

    return (
      <div
        className="grid w-full h-full gap-0.5 bg-white/10"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {imgs.map((img, i) => (
          <div
            key={i}
            className={`relative bg-black/20 ${count === 3 && i === 2 ? 'col-span-2' : ''}`}
          >
            <OptimizedImage src={img} className="absolute inset-0 w-full h-full" />
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-start md:p-6 md:gap-8 animate-in fade-in duration-500 min-h-full">
        {/* Primary Photo Section - GPU composited for smooth horizontal scroll */}
        <div
          className="px-2.5 pt-2 md:w-1/2 md:p-0 md:sticky md:top-0"
          style={{
            transform: 'translate3d(0, 0, 0)',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
          }}
        >
          <div
            className={`relative ${isGroup ? 'aspect-[3/2]' : 'aspect-square'} rounded-[24px] overflow-hidden max-w-lg mx-auto md:mx-auto md:aspect-auto md:h-[80vh] shadow-sm`}
            style={{
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
            }}
          >
            {isGroup ? renderGroupDP() : <OptimizedImage src={profile.images[0]} alt={profile.name} className="w-full h-full" />}

            {isGroup && onAddImage && (
              <button
                onClick={(e) => { e.stopPropagation(); onAddImage(); }}
                className="absolute bottom-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center text-white border border-white/20 active:scale-90 transition-transform"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="pl-4 pr-3.5 pt-8 pb-12 space-y-5 md:w-1/2 md:pt-0 md:pb-32 md:max-w-3xl md:pl-0">
          {/* Name & Basic Info Header */}
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-black text-[var(--text-primary)] tracking-tight">{profile.name}</h1>
                {profile.isPro && (
                  <div className="w-[22px] h-[22px] bg-[#4c1d95] rounded-full flex items-center justify-center text-[11px] text-white font-black shadow-sm border border-white/10 mt-1">P</div>
                )}
              </div>
              {!isGroup && (
                <button
                  onClick={onOpenLastSeen}
                  className={`ml-auto px-2 py-0.5 rounded text-[10px] font-black tracking-widest border transition-all ${profile.lastSeen
                    ? `border-[var(--border-color)] text-[var(--text-secondary)] bg-[var(--bg-tertiary)] ${onOpenLastSeen ? 'cursor-pointer hover:bg-[var(--bg-secondary)] active:scale-95' : ''}`
                    : 'opacity-0'
                    }`}
                >
                  {profile.lastSeen ? 'LAST SEEN' : ''}
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 text-[var(--text-secondary)] text-[17px] font-bold">
              {profile.age > 0 && (
                <>
                  <span>{profile.age}</span>
                  <span className="opacity-30">•</span>
                </>
              )}
              <span>{profile.artistTypes?.[0] || 'Artist'}</span>


            </div>
            {profile.distance && !isOwnProfile && <p className="text-[var(--text-secondary)] text-[15px] font-medium mt-1">{getDisplayDistance(profile.distance)}</p>}
          </div>



          {/* Bio Section */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[var(--text-secondary)] text-[13px] font-black uppercase tracking-widest">About</h3>
              {isGroup && onEditBio && (
                <button onClick={onEditBio} className="text-indigo-400 font-bold text-xs">Edit</button>
              )}
            </div>
            <p className="text-[var(--text-primary)]/80 text-[16px] leading-relaxed whitespace-pre-wrap font-medium">
              {profile.bio || (isGroup ? "No bio yet." : "")}
            </p>
          </div>

          {/* Hidden Bio Implementation */}
          {profile.hiddenBio && !isGroup && (
            <div className="space-y-4">
              <h3 className="text-[var(--text-secondary)] text-[13px] font-black uppercase tracking-widest">Hidden bio</h3>
              <div
                onClick={() => setBioRevealed(!bioRevealed)}
                className="relative p-8 rounded-[32px] overflow-hidden cursor-pointer group transition-all"
              >
                <div className="absolute inset-0 bg-[var(--bg-tertiary)]/80 border border-[var(--border-color)] rounded-[32px]"></div>
                {!bioRevealed ? (
                  <div className="flex flex-col items-center justify-center gap-3 relative z-10 py-4">
                    <div className="blur-[2px] opacity-30 pointer-events-none select-none text-center text-[var(--text-primary)]">
                      {profile.hiddenBio}
                    </div>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                      <svg className="w-6 h-6 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="text-sm font-bold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Tap to reveal</span>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 text-center italic text-[var(--text-primary)] animate-in fade-in duration-300">
                    "{profile.hiddenBio}"
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Art Form Section (was Desires) */}
          {(profile.artistTypes && profile.artistTypes.length > 0) && (
            <div className="pt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="text-[var(--text-secondary)] text-[13px] font-black uppercase tracking-widest">ART FORM</h3>
                  {!isGroup && sharedCount > 0 && (
                    <span className="bg-gradient-to-r from-pink-400 to-[#c084fc] bg-clip-text text-transparent text-[13px] font-bold"></span>
                  )}
                </div>
                {isGroup && onEditArtForms && (
                  <button onClick={onEditArtForms} className="text-indigo-400 font-bold text-xs">Edit</button>
                )}
              </div>
              {renderArtForms()}
            </div>
          )}

          {/* Interests Section */}
          <div className="pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[var(--text-secondary)] text-[13px] font-black uppercase tracking-widest">Interests</h3>
              {isGroup && onEditInterests && (
                <button onClick={onEditInterests} className="text-indigo-400 font-bold text-xs">Edit</button>
              )}
            </div>
            {profile.interests && profile.interests.length > 0 ? (
              <div className="flex flex-wrap gap-2.5">
                {profile.interests.map(interest => {
                  const isShared = userInterests.includes(interest);
                  const highlightClass = isShared
                    ? (isLightTheme
                      ? 'bg-gradient-to-r from-pink-500/20 to-[#4c1d95]/20 border-pink-500/40 text-pink-600'
                      : 'bg-gradient-to-r from-pink-500/20 to-[#4c1d95]/20 border-pink-500/40 text-pink-300')
                    : 'bg-[var(--bg-tertiary)] border-[var(--border-color)] text-[var(--text-primary)]';

                  return (
                    <div key={interest} className={`px-3 py-1.5 border rounded-md text-[13px] font-bold transition-colors tracking-wide ${highlightClass}`}>
                      {interest}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className={`${isLightTheme ? 'text-[var(--text-secondary)]' : 'text-white/30'} text-sm italic`}>No interests listed.</p>
            )}
          </div>

          {/* Post & Art Section */}
          <div className="pt-4">
            <h3 className="text-[var(--text-secondary)] text-[13px] font-black uppercase tracking-widest mb-4">POSTS & ART</h3>
            {posts.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {posts.map((post) => (
                  <button
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="relative aspect-square overflow-hidden bg-white/5 hover:opacity-80 transition-opacity"
                  >
                    <img
                      src={post.images[0]}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {post.images.length > 1 && (
                      <div className="absolute top-1 right-1 bg-black/50 rounded px-1.5 py-0.5 text-[10px] text-white font-bold">
                        +{post.images.length - 1}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <p className={`${isLightTheme ? 'text-[var(--text-secondary)]' : 'text-white/30'} text-sm italic`}>No posts yet.</p>
            )}
          </div>

          {/* Footer Actions */}
          {!hideBlockActions && !isOwnProfile && (
            <div className="pt-12 border-t border-[var(--border-color)] flex flex-col items-center gap-6">
              <button className={`flex items-center gap-3 font-bold group ${isLightTheme ? 'text-black' : 'text-white/40'}`}>
                <svg className={`w-5 h-5 transition-colors ${isLightTheme ? 'text-[#c084fc]' : 'text-[#c084fc]/50 group-hover:text-[#c084fc]'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Block or report</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Post Modal */}
      {
        selectedPost && (
          <PostModal post={selectedPost} profile={profile} onClose={() => setSelectedPost(null)} distanceUnit={distanceUnit} />
        )
      }
    </>
  );
};

export default ProfileDetail;