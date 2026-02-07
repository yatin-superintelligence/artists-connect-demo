import React, { useState, useRef, useEffect } from 'react';
import FilterHeader from '../components/FilterHeader';
import ProfileDetail from '../components/ProfileDetail';
import { Profile } from '../types';
import { useTheme } from '../theme/ThemeContext';

interface DiscoverViewProps {
  profiles: Profile[];
  userInterests?: string[];
  onOpenPro: () => void;
  onOpenOutOfSparks: (name: string) => void;
  onOpenFilter: (filterName: string) => void;
  onAction: (profile: Profile, type: 'like' | 'dislike') => void;
  hiddenProfileIds: string[];
  distanceLabel: string;
  ageLabel: string;
  artistTypeLabel: string;
  distanceUnit?: 'km' | 'miles';
  isInterestsActive?: boolean;
  isLocationActive?: boolean;
  isAgeActive?: boolean;
  isProfileHidden?: boolean;
  onUnhideProfile: () => void;
  activeIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  isActive?: boolean;
}


const DiscoverView: React.FC<DiscoverViewProps> = ({
  profiles,
  userInterests = [],
  onOpenPro,
  onOpenOutOfSparks,
  onOpenFilter,
  onAction,
  hiddenProfileIds,
  distanceLabel,
  ageLabel,
  artistTypeLabel,
  distanceUnit = 'km',
  isInterestsActive,
  isLocationActive,
  isAgeActive,
  isProfileHidden = false,
  onUnhideProfile,
  activeIndex: externalActiveIndex = 0,
  onActiveIndexChange,
  isActive = true
}) => {
  const { currentTheme } = useTheme();
  const isLightTheme = currentTheme.name === 'Classic Artist Circle Light';
  const [internalActiveIndex, setInternalActiveIndex] = useState(externalActiveIndex);

  const activeIndex = onActiveIndexChange ? externalActiveIndex : internalActiveIndex;
  const setActiveIndex = (index: number) => {
    if (onActiveIndexChange) {
      onActiveIndexChange(index);
    } else {
      setInternalActiveIndex(index);
    }
  };

  const [animationState, setAnimationState] = useState<'none' | 'heart' | 'fade'>('none');
  const [animatingProfileId, setAnimatingProfileId] = useState<string | null>(null);

  // Track when post modal is open to hide profiles for GPU optimization
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  useEffect(() => {
    const checkPostModal = () => {
      setIsPostModalOpen(!!(window as any).__postModalOpen);
    };
    // Check every frame (16ms) for near-instant detection
    const interval = setInterval(checkPostModal, 16);
    checkPostModal(); // Initial check
    return () => clearInterval(interval);
  }, []);

  // Track vertical scroll of active profile to move the header
  // Use ref for immediate updates without triggering re-renders
  const headerOffsetRef = useRef(0);
  const headerElementRef = useRef<HTMLDivElement>(null);
  const rafIdRef = useRef<number | null>(null);

  // Show fade-in header when swiping from a scrolled-down profile
  const [showFadeHeader, setShowFadeHeader] = useState(false);
  const [fadeType, setFadeType] = useState<'in' | 'out'>('in');
  const prevActiveIndex = useRef(externalActiveIndex);

  const visibleProfiles = profiles.filter(p => !hiddenProfileIds.includes(p.id));
  const currentProfile = visibleProfiles[activeIndex];

  // Clamp activeIndex when visibleProfiles shrinks (e.g., last profile was hidden)
  useEffect(() => {
    if (visibleProfiles.length > 0 && activeIndex >= visibleProfiles.length) {
      // Animate to the new last profile (slide from left)
      const newIndex = visibleProfiles.length - 1;
      setActiveIndex(newIndex);
    }
  }, [visibleProfiles.length, activeIndex]);

  // Transform-based touch scroll state with direction detection
  const containerRef = useRef<HTMLDivElement>(null);
  const touchState = useRef({
    isActive: false,
    startX: 0,
    startY: 0,
    currentOffset: 0,
    startOffset: 0,
    direction: null as 'horizontal' | 'vertical' | null  // null = not yet determined
  });
  const animationRef = useRef<number | null>(null);
  const swipeLockRef = useRef(false); // Lock touch input during swipe animation
  const isAnimatingRef = useRef(false); // Tracks if any animation is in progress (more reliable than checking animationRef)

  // Mouse drag for desktop (still uses scrollLeft)
  const mouseState = useRef({ isDown: false, startX: 0, scrollStart: 0 });

  // Calculate current transform offset based on activeIndex
  const getBaseOffset = () => {
    if (!containerRef.current) return 0;
    return activeIndex * containerRef.current.clientWidth;
  };

  // Apply transform to profiles container
  const setTransformOffset = (offset: number) => {
    if (!containerRef.current) return;
    containerRef.current.style.transform = `translateX(${-offset}px)`;
  };

  // Animate to target index (150ms)
  const animateToIndex = (targetIndex: number) => {
    if (!containerRef.current) return;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const width = containerRef.current.clientWidth;
    const start = touchState.current.currentOffset;
    const end = targetIndex * width;
    const distance = end - start;

    if (Math.abs(distance) < 1) {
      setTransformOffset(end);
      touchState.current.currentOffset = end;
      setActiveIndex(targetIndex);
      return;
    }

    // Lock touch input and mark animation as in progress
    swipeLockRef.current = true;
    isAnimatingRef.current = true;

    const duration = 150;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - (1 - progress) * (1 - progress); // easeOutQuad

      const currentPos = start + (distance * ease);
      setTransformOffset(currentPos);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setTransformOffset(end);
        touchState.current.currentOffset = end;
        setActiveIndex(targetIndex);
        animationRef.current = null;
        swipeLockRef.current = false;
        isAnimatingRef.current = false;
        // Reset swiping state after animation completes
        setIsSwiping(false);
        setSwipeDirection(null);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // Animate to target index for touchpad (300ms - slower for desktop)
  const animateToIndexTouchpad = (targetIndex: number) => {
    if (!containerRef.current) return;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);

    const width = containerRef.current.clientWidth;
    const start = touchState.current.currentOffset;
    const end = targetIndex * width;
    const distance = end - start;

    if (Math.abs(distance) < 1) {
      setTransformOffset(end);
      touchState.current.currentOffset = end;
      setActiveIndex(targetIndex);
      return;
    }

    // Lock touch input and mark animation as in progress
    swipeLockRef.current = true;
    isAnimatingRef.current = true;

    const duration = 300;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - (1 - progress) * (1 - progress); // easeOutQuad

      const currentPos = start + (distance * ease);
      setTransformOffset(currentPos);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setTransformOffset(end);
        touchState.current.currentOffset = end;
        setActiveIndex(targetIndex);
        animationRef.current = null;
        swipeLockRef.current = false;
        isAnimatingRef.current = false;
        // Reset swiping state after animation completes
        setIsSwiping(false);
        setSwipeDirection(null);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // Touch handlers with direction detection
  const onTouchStart = (e: React.TouchEvent) => {
    if (!containerRef.current) return;

    // Ignore touches when post modal is open
    if ((window as any).__postModalOpen) return;

    // Ignore touch if swipe animation is in progress
    if (swipeLockRef.current) return;

    // Cancel any running animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    touchState.current = {
      isActive: true,
      startX: e.touches[0].clientX,
      startY: e.touches[0].clientY,
      startOffset: touchState.current.currentOffset,
      currentOffset: touchState.current.currentOffset,
      direction: null  // Reset direction on new touch
    };
  };

  const onTouchMove = (e: React.TouchEvent) => {
    // Ignore touches when post modal is open
    if ((window as any).__postModalOpen) return;
    if (!touchState.current.isActive || !containerRef.current) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = touchState.current.startX - currentX;
    const deltaY = touchState.current.startY - currentY;

    // Determine direction if not yet set (after 5px total movement - reduced for faster response)
    if (touchState.current.direction === null) {
      const totalMovement = Math.abs(deltaX) + Math.abs(deltaY);
      if (totalMovement > 5) {
        // Set direction based on which axis has more movement
        touchState.current.direction = Math.abs(deltaX) > Math.abs(deltaY) ? 'horizontal' : 'vertical';
      }
    }

    // Only apply horizontal transform if direction is horizontal
    if (touchState.current.direction === 'horizontal') {
      const newOffset = touchState.current.startOffset + deltaX;

      // Clamp offset to valid range (no overscroll)
      const maxOffset = (visibleProfiles.length - 1) * containerRef.current.clientWidth;
      const clampedOffset = Math.max(0, Math.min(newOffset, maxOffset));

      // Set swiping state and direction for on-demand GPU painting
      if (!isSwiping) setIsSwiping(true);
      const direction = deltaX > 0 ? 'left' : 'right';
      if (swipeDirection !== direction) setSwipeDirection(direction);

      touchState.current.currentOffset = clampedOffset;
      setTransformOffset(clampedOffset);
    }
    // If vertical, let the browser handle native scroll (don't prevent default)
  };

  const onTouchEnd = () => {
    // Ignore touches when post modal is open
    if ((window as any).__postModalOpen) return;
    if (!touchState.current.isActive || !containerRef.current) return;
    touchState.current.isActive = false;

    // Only snap if we were doing horizontal scrolling
    if (touchState.current.direction === 'horizontal') {
      const dragDelta = touchState.current.currentOffset - touchState.current.startOffset;

      // Use activeIndex as starting point (one profile at a time)
      let targetIndex = activeIndex;

      // Determine target based on drag direction (no threshold - any movement counts)
      if (dragDelta > 0) {
        // Swiped left (next profile)
        targetIndex = Math.min(activeIndex + 1, visibleProfiles.length - 1);
      } else if (dragDelta < 0) {
        // Swiped right (previous profile)
        targetIndex = Math.max(activeIndex - 1, 0);
      }

      animateToIndex(targetIndex);
    }

    // Reset direction
    touchState.current.direction = null;
  };

  // Initialize transform offset when activeIndex changes externally
  useEffect(() => {
    if (containerRef.current && !touchState.current.isActive && !animationRef.current && !swipeLockRef.current) {
      const offset = activeIndex * containerRef.current.clientWidth;
      touchState.current.currentOffset = offset;
      setTransformOffset(offset);
    }
  }, [activeIndex]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && !touchState.current.isActive && !swipeLockRef.current) {
        const offset = activeIndex * containerRef.current.clientWidth;
        touchState.current.currentOffset = offset;
        setTransformOffset(offset);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeIndex]);

  // Sync transform when view becomes visible (container width changes from 0 to non-zero)
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        // Only sync if not actively touching/swiping/animating
        // Use isAnimatingRef for reliable detection (refs read synchronously)
        if (entry.contentRect.width > 0 && !touchState.current.isActive && !isAnimatingRef.current) {
          const offset = activeIndex * entry.contentRect.width;
          touchState.current.currentOffset = offset;
          setTransformOffset(offset);
        }
      }
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [activeIndex]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  // Initialize transform on mount (since we don't use inline transform style)
  useEffect(() => {
    if (containerRef.current) {
      const offset = activeIndex * containerRef.current.clientWidth;
      touchState.current.currentOffset = offset;
      setTransformOffset(offset);
    }
  }, []); // Only on mount

  // Detect horizontal swipe from scrolled-down profile and show fade header
  useEffect(() => {
    if (prevActiveIndex.current !== activeIndex) {
      // Get the scroll position of the new profile we are switching TO
      const newProfileEl = containerRef.current?.querySelector(`[data-index="${activeIndex}"]`) as HTMLElement;
      const newScroll = newProfileEl ? newProfileEl.scrollTop : 0;

      const cameFromScrolled = headerOffsetRef.current > 50;
      const goingToTop = newScroll < 50;

      // Sync header position directly to DOM for immediate response
      headerOffsetRef.current = newScroll;
      if (headerElementRef.current) {
        headerElementRef.current.style.transform = `translateY(${-newScroll}px)`;
      }

      // Fade in ONLY if we came from outside view ("scrolled down") AND we are going to inside view ("top")
      if (cameFromScrolled && goingToTop) {
        setFadeType('in');
        setShowFadeHeader(true);
      }
      // Fade out if we came from inside view ("top") AND we are going to outside view ("scrolled down")
      else if (!cameFromScrolled && !goingToTop) {
        setFadeType('out');
        setShowFadeHeader(true);
      }
      else {
        setShowFadeHeader(false);
      }

      prevActiveIndex.current = activeIndex;
    }
  }, [activeIndex]);


  // Track swiping state for on-demand GPU painting (only paint adjacent profile when swiping)
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | null>(null);

  // Simple wheel handler for touchpad - one profile at a time, no timeout
  const wheelLockRef = useRef(false);

  const onWheel = (e: React.WheelEvent) => {
    if (!containerRef.current) return;

    // Ignore wheel events when post modal is open
    if ((window as any).__postModalOpen) return;

    // Detect horizontal scroll (touchpad horizontal swipe)
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 15) {
      // ALWAYS prevent default to stop browser back gesture
      e.preventDefault();
      e.stopPropagation();

      // Prevent rapid-fire navigation
      if (wheelLockRef.current) return;
      wheelLockRef.current = true;

      // Determine direction and navigate one profile (use 400ms animation for touchpad)
      if (e.deltaX > 0) {
        // Swipe left = next profile
        setIsSwiping(true);
        setSwipeDirection('left');
        const targetIndex = Math.min(activeIndex + 1, visibleProfiles.length - 1);
        animateToIndexTouchpad(targetIndex);
      } else {
        // Swipe right = previous profile
        setIsSwiping(true);
        setSwipeDirection('right');
        const targetIndex = Math.max(activeIndex - 1, 0);
        animateToIndexTouchpad(targetIndex);
      }

      // Unlock after animation completes + buffer (400ms total)
      setTimeout(() => {
        wheelLockRef.current = false;
      }, 900);
    }
  };

  // Mouse drag handlers (desktop only) - also uses transforms now
  const onMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    e.preventDefault(); // Prevent text selection

    // Cancel any running animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    mouseState.current = {
      isDown: true,
      startX: e.pageX,
      scrollStart: touchState.current.currentOffset
    };
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!mouseState.current.isDown || !containerRef.current) return;
    e.preventDefault();

    const deltaX = mouseState.current.startX - e.pageX;
    const newOffset = mouseState.current.scrollStart + deltaX;

    // Clamp offset to valid range
    const maxOffset = (visibleProfiles.length - 1) * containerRef.current.clientWidth;
    const clampedOffset = Math.max(-50, Math.min(newOffset, maxOffset + 50));

    // Set swiping state and direction for on-demand GPU painting
    if (!isSwiping) setIsSwiping(true);
    const direction = deltaX > 0 ? 'left' : 'right';
    if (swipeDirection !== direction) setSwipeDirection(direction);

    touchState.current.currentOffset = clampedOffset;
    setTransformOffset(clampedOffset);
  };

  const onMouseUp = () => {
    if (!containerRef.current || !mouseState.current.isDown) return;
    mouseState.current.isDown = false;

    const dragDelta = touchState.current.currentOffset - mouseState.current.scrollStart;

    // Use activeIndex as starting point (one profile at a time) - matches touch behavior
    let targetIndex = activeIndex;

    // Determine target based on drag direction (no threshold - any movement counts)
    if (dragDelta > 0) {
      // Dragged left (next profile)
      targetIndex = Math.min(activeIndex + 1, visibleProfiles.length - 1);
    } else if (dragDelta < 0) {
      // Dragged right (previous profile)
      targetIndex = Math.max(activeIndex - 1, 0);
    }

    animateToIndex(targetIndex);
  };

  const handleOpenFilter = (filterName: string) => {
    if (filterName === 'Recently online') {
      onOpenPro();
      return;
    }
    onOpenFilter(filterName);
  };

  const handleAction = (type: 'like' | 'dislike') => {
    if (!currentProfile) return;

    setAnimatingProfileId(currentProfile.id);
    if (type === 'like') {
      setAnimationState('heart');
      setTimeout(() => {
        setAnimationState('none');
        setAnimatingProfileId(null);
        onAction(currentProfile, 'like');
      }, 700);
    } else {
      setAnimationState('fade');
      setTimeout(() => {
        setAnimationState('none');
        setAnimatingProfileId(null);
        onAction(currentProfile, 'dislike');
      }, 300);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore inputs
      const activeElement = document.activeElement;
      if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        const targetIndex = Math.min(activeIndex + 1, visibleProfiles.length - 1);
        if (targetIndex !== activeIndex) {
          animateToIndexTouchpad(targetIndex);
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        const targetIndex = Math.max(activeIndex - 1, 0);
        if (targetIndex !== activeIndex) {
          animateToIndexTouchpad(targetIndex);
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        // Scroll active profile card down
        const activeProfileEl = containerRef.current?.querySelector(`[data-index="${activeIndex}"]`) as HTMLElement;
        if (activeProfileEl) {
          activeProfileEl.scrollBy({ top: 300, behavior: 'smooth' });
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        // Scroll active profile card up
        const activeProfileEl = containerRef.current?.querySelector(`[data-index="${activeIndex}"]`) as HTMLElement;
        if (activeProfileEl) {
          activeProfileEl.scrollBy({ top: -300, behavior: 'smooth' });
        }
      } else if (e.code === 'Space') {
        e.preventDefault();
        // Use handleAction for visual feedback
        handleAction('like');
      }
    };

    if (isActive) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, visibleProfiles.length, handleAction, isActive]);

  if (isProfileHidden) {
    return (
      <div className="flex flex-col bg-[var(--bg-primary)] relative overflow-hidden" style={{ height: '100dvh' }}>
        <div className="fixed top-0 left-0 right-0 z-40 flex gap-2 p-4 overflow-x-auto no-scrollbar">
          <FilterChip label={artistTypeLabel} onClick={() => onOpenFilter('Artist')} isActive={artistTypeLabel !== '1 type'} />
          <FilterChip label={distanceLabel} onClick={() => onOpenFilter('Distance')} isActive={true} />
          <FilterChip label={ageLabel} onClick={() => onOpenFilter('Age')} isActive={isAgeActive} />
          <FilterChip label="Interests" onClick={() => onOpenFilter('Interests')} isActive={isInterestsActive} />
          <FilterChip label="More" onClick={() => onOpenFilter('More')} isActive={false} />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-8 text-center animate-in fade-in duration-700">
          <div className="relative w-48 h-32 mb-8 mx-auto flex justify-center items-center">
            <div className="absolute left-8 w-24 h-24 rounded-full bg-[var(--accent-secondary)] flex items-center justify-center z-10 shadow-lg border-[3px] border-[var(--bg-primary)]">
              <svg className="w-14 h-14 text-[var(--bg-tertiary)]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            </div>
            <div className="absolute right-8 w-24 h-24 rounded-full bg-[#4c1d95] flex items-center justify-center z-20 shadow-lg border-[3px] border-[var(--bg-primary)]">
              <div className="text-white font-black text-4xl">P</div>
            </div>
          </div>

          <h2 className="text-[32px] font-medium text-[var(--text-primary)] leading-tight mb-4 tracking-tight">
            Unhide your profile<br />to explore Discover
          </h2>

          <p className="text-[var(--text-secondary)] text-[17px] leading-snug max-w-xs mx-auto mb-16">
            People aren't seeing you, and you can't see them either. Edit your settings to see who's out there.
          </p>

          <button
            onClick={onUnhideProfile}
            className="px-10 py-3 bg-[#e4e4e7] hover:bg-white text-black text-[15px] font-bold rounded-full transition-all active:scale-95"
          >
            Unhide
          </button>
        </div>

        <div className="h-24" />
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `}</style>
      </div>
    );
  }

  if (visibleProfiles.length === 0) {
    return (
      <div className="flex flex-col bg-[var(--bg-primary)]" style={{ height: '100dvh' }}>
        <FilterHeader onOpenFilter={handleOpenFilter} distanceLabel={distanceLabel} ageLabel={ageLabel} artistTypeLabel={artistTypeLabel} />
        <div className="flex-1 flex flex-col items-center justify-center px-10 text-center space-y-6">
          <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-4">
            <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold">No more profiles nearby</h2>
          <p className={`text-sm ${currentTheme.name === 'Classic Artist Circle Light' ? 'text-black/60' : 'text-white/40'}`}>Expand your filters to find more connections.</p>
          <button
            onClick={() => onOpenFilter('Distance')}
            className={`px-8 py-3 rounded-full font-bold ${currentTheme.name === 'Classic Artist Circle Light' ? 'bg-black text-white' :
              currentTheme.name === 'Hot Pink' ? 'bg-pink-600 text-white' :
                currentTheme.name === 'That Orange' ? 'bg-orange-600 text-white' :
                  currentTheme.name === 'More Brown' ? 'bg-amber-700 text-white' :
                    'bg-[#4c1d95] text-white'
              }`}
          >Adjust filters</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col overflow-hidden bg-[var(--bg-primary)] relative" style={{ height: '100dvh' }}>
      {/* FilterHeader - scrolls vertically with profile but fixed horizontally */}
      <div
        ref={headerElementRef}
        className="fixed top-0 left-0 right-0 z-40"
        style={{
          willChange: 'transform',
          opacity: showFadeHeader ? 0 : 1 // Hide main header while fade overlay is playing
        }}
      >
        <FilterHeader
          onOpenFilter={handleOpenFilter}
          distanceLabel={distanceLabel}
          ageLabel={ageLabel}
          artistTypeLabel={artistTypeLabel}
          isInterestsActive={isInterestsActive}
          isLocationActive={isLocationActive}
          isAgeActive={isAgeActive}
        />
      </div>

      {/* Fade-in/out header overlay */}
      {showFadeHeader && (
        <div
          className={`fixed top-0 left-0 right-0 z-50 ${fadeType === 'in' ? 'fade-in-header' : 'fade-out-header'}`}
          onAnimationEnd={() => setShowFadeHeader(false)}
        >
          <FilterHeader
            onOpenFilter={handleOpenFilter}
            distanceLabel={distanceLabel}
            ageLabel={ageLabel}
            artistTypeLabel={artistTypeLabel}
            isInterestsActive={isInterestsActive}
            isLocationActive={isLocationActive}
            isAgeActive={isAgeActive}
          />
        </div>
      )}

      {/* Touch scroll wrapper */}
      <div
        className="flex-1 overflow-hidden touch-scroll-wrapper"
        style={{ overscrollBehaviorX: 'contain' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        onWheel={onWheel}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >

        {/* Profiles container - moves via transform */}
        <div
          ref={containerRef}
          className="flex h-full profiles-container"
          style={{
            willChange: 'transform',
            opacity: isPostModalOpen ? 0 : 1,
            transition: 'opacity 500ms ease-in-out',
            pointerEvents: isPostModalOpen ? 'none' : 'auto'
          }}
        >
          {visibleProfiles.map((profile, idx) => {
            // GPU optimization: Pre-render current + adjacent profiles for smooth swiping
            // This eliminates the 1-frame delay when swipe direction is detected
            const isCurrentProfile = idx === activeIndex;
            const isNextProfile = idx === activeIndex + 1;
            const isPrevProfile = idx === activeIndex - 1;

            // Always paint current + immediate neighbors for instant swipe response
            const shouldPaint = isCurrentProfile || isNextProfile || isPrevProfile;

            return (
              <div
                key={profile.id}
                data-index={idx}
                className={`profile-card flex-shrink-0 w-full h-full overflow-y-auto no-scrollbar pb-40 pt-[44px] ${animatingProfileId === profile.id && animationState === 'fade'
                  ? 'opacity-0 scale-95 blur-sm transition-all duration-300'
                  : 'opacity-100'
                  }`}
                style={{
                  overscrollBehaviorY: 'contain',
                  willChange: shouldPaint ? 'scroll-position' : 'auto',
                  transform: shouldPaint ? 'translateZ(0)' : 'none',
                  WebkitOverflowScrolling: 'touch'
                }}
                onScroll={(e) => {
                  // Only track scroll for the active profile
                  // Use requestAnimationFrame to avoid layout thrashing and React re-renders
                  if (idx === activeIndex) {
                    const scrollTop = e.currentTarget.scrollTop;
                    headerOffsetRef.current = scrollTop;

                    // Cancel any pending RAF to avoid stacking
                    if (rafIdRef.current) {
                      cancelAnimationFrame(rafIdRef.current);
                    }

                    // Apply transform directly to DOM for smooth 60fps scrolling
                    rafIdRef.current = requestAnimationFrame(() => {
                      if (headerElementRef.current) {
                        headerElementRef.current.style.transform = `translateY(${-scrollTop}px)`;
                      }
                      rafIdRef.current = null;
                    });
                  }
                }}
              >
                {shouldPaint && (
                  <ProfileDetail
                    profile={profile}
                    userInterests={userInterests}
                    onOpenOutOfSparks={() => onOpenOutOfSparks(profile.name)}
                    onOpenLastSeen={onOpenPro}
                    distanceUnit={distanceUnit}
                  />
                )}
              </div>
            );
          })}
        </div>

        {animationState === 'heart' && (
          <div className="fixed inset-0 z-[210] flex items-center justify-center pointer-events-none">
            <div className="animate-heart-pop">
              <svg className="w-48 h-48 text-[var(--accent-primary)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <div className="absolute left-0 right-0 px-3 pointer-events-none z-30" style={{ bottom: 'calc(107px + env(safe-area-inset-bottom, 0px))', touchAction: 'none' }}>
        <div className="flex justify-between items-center w-full">
          <button
            onClick={() => currentProfile && onOpenOutOfSparks(currentProfile.name)}
            className={`pointer-events-auto h-14 px-6 ${!['Dark', 'Light'].includes(currentTheme.name) ? 'bg-[var(--border-color)] hover:brightness-110 shadow-[0_10px_30px_rgba(0,0,0,0.3)]' : 'bg-[#4c1d95] hover:bg-[#5b21b6] shadow-[0_10px_30px_rgba(76,29,149,0.3)]'} text-white border border-white/10 rounded-full flex items-center gap-2.5 transition-all active:scale-90`}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-[1.3rem] font-black relative bottom-[1px]">0</span>
          </button>

          <div className="flex gap-3 pointer-events-auto">
            <button
              onClick={() => handleAction('dislike')}
              className="w-14 h-14 bg-white/10 text-white rounded-full flex items-center justify-center border border-white/5 hover:bg-white/20 transition-all active:scale-90 shadow-xl backdrop-blur-md"
            >
              <svg className="w-6 h-6" fill="none" stroke={isLightTheme ? 'black' : 'currentColor'} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 12H4" />
              </svg>
            </button>
            <button
              onClick={() => handleAction('like')}
              className="w-14 h-14 bg-white text-[var(--bg-primary)] rounded-full flex items-center justify-center hover:bg-gray-100 transition-all active:scale-90 shadow-[0_10px_30px_rgba(255,255,255,0.2)]"
            >
              <svg className="w-7 h-7" fill={isLightTheme ? 'black' : 'currentColor'} viewBox="0 0 24 24">
                <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heart-pop {
          0% { transform: scale(0.5) rotate(-15deg); opacity: 0; }
          40% { transform: scale(1.2) rotate(10deg); opacity: 1; }
          70% { transform: scale(1.1) rotate(0deg); opacity: 1; }
          100% { transform: scale(1.5) rotate(0deg); opacity: 0; }
        }
        .animate-heart-pop {
          animation: heart-pop 0.7s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        
        /* Transform-based touch scrolling */
        .touch-scroll-wrapper {
          user-select: none;
          -webkit-user-select: none;
          touch-action: none; /* We handle all touch gestures via JS */
          cursor: grab;
        }
        
        .touch-scroll-wrapper:active {
          cursor: grabbing;
        }
        
        .profiles-container {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
        
        .profile-card {
           transform: translateZ(0);
           backface-visibility: hidden;
        }
        
        @keyframes fadeInHeader {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .fade-in-header {
          animation: fadeInHeader 0.15s ease-out forwards;
        }

        @keyframes fadeOutHeader {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        .fade-out-header {
          animation: fadeOutHeader 0.15s ease-out forwards;
        }



        @keyframes fadeOutHeader {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        .fade-out-header {
          animation: fadeOutHeader 0.15s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const FilterChip: React.FC<{ label: string; onClick: () => void; isActive: boolean }> = ({ label, onClick, isActive }) => {
  const { currentTheme } = useTheme();
  // Helper to determine if we should use dark text (light theme)
  const isLightTheme = currentTheme.name === 'Classic Artist Circle Light';

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-[13px] font-bold whitespace-nowrap transition-all active:scale-95 border ${isActive
        ? (isLightTheme ? 'bg-black text-white border-black' : 'bg-white text-black border-white')
        : (isLightTheme ? 'bg-transparent text-black border-black/20' : 'bg-transparent text-white border-white/20')
        }`}
    >
      {label}
    </button>
  );
};

export default DiscoverView;