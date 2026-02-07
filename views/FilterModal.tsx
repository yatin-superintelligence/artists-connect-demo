import React, { useState, useRef, useEffect, useMemo } from 'react';


import { useTheme } from '../theme/ThemeContext';
import { INTEREST_OPTIONS, ARTIST_TYPE_OPTIONS } from '../data/filterOptions';

export enum FilterType {
  Interests = 'Interests',
  Location = 'Location',
  Distance = 'Distance',
  Age = 'Age',
  Artist = 'Artist',
  More = 'More'
}

interface FilterModalProps {
  onClose: () => void;
  onOpenPro: (variant?: 'lastSeen' | 'likes' | 'general' | 'incognito') => void;
  onSave: (data: any) => void;
  initialFilterName: string;
  initialSelectedInterests?: string[];
  initialLocation?: string;
  initialDistanceValue?: number;
  initialDistanceUnit?: 'km' | 'miles';
  initialMinAge?: number;
  initialMaxAge?: number;
  initialSelectedArtistTypes?: string[];
}

interface LocationItem {
  id: string;
  name: string;
  sub?: string;
  type: 'current' | 'popular' | 'virtual';
}

// Removed GENDER_OPTIONS consistent with request to use new artist_types.txt data structure


const FilterModal: React.FC<FilterModalProps> = ({
  onClose,
  onOpenPro,
  onSave,
  initialFilterName,
  initialSelectedInterests = [],
  initialLocation = 'current',
  initialDistanceValue = 114,
  initialDistanceUnit = 'km',
  initialMinAge = 18,
  initialMaxAge = 75,
  initialSelectedArtistTypes = []
}) => {
  const { currentTheme } = useTheme();

  const tabs = useMemo(() => [
    FilterType.Interests,
    FilterType.Location,
    FilterType.Distance,
    FilterType.Age,
    FilterType.Artist,
    FilterType.More
  ], []);

  const getInitialTab = (name: string): FilterType => {
    const n = name.toLowerCase();
    if (n.includes('interest')) return FilterType.Interests;
    if (n.includes('location')) return FilterType.Location;
    if (n.includes('km') || n.includes('miles') || n.includes('distance')) return FilterType.Distance;
    if (n.includes('age')) return FilterType.Age;
    if (n.includes('artist') || n.includes('type')) return FilterType.Artist;
    if (n.includes('more') || n.includes('recent') || n.includes('online')) return FilterType.More;
    return FilterType.Interests;
  };

  const [activeTab, setActiveTab] = useState<FilterType>(getInitialTab(initialFilterName));
  const [selectedInterests, setSelectedInterests] = useState<string[]>(initialSelectedInterests);
  const [selectedLocation, setSelectedLocation] = useState<string>(initialLocation);
  const [distanceValue, setDistanceValue] = useState<number>(initialDistanceValue);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'miles'>(initialDistanceUnit);
  const [minAge, setMinAge] = useState<number>(initialMinAge);
  const [maxAge, setMaxAge] = useState<number>(initialMaxAge);
  const [selectedArtistTypes, setSelectedArtistTypes] = useState<string[]>(initialSelectedArtistTypes);

  // Track when slider is being used to lock vertical scroll
  const [isSliderActive, setIsSliderActive] = useState(false);



  const [isDragging, setIsDragging] = useState(false);
  // Ref for the modal DOM element to manipulate style directly
  const modalRef = useRef<HTMLDivElement>(null);

  // We still need a state for 'closing' animation trigger, but not for the drag itself
  const [isClosing, setIsClosing] = useState(false);

  const startY = useRef(0);
  const currentDragY = useRef(0); // Track current translation WITHOUT state
  const dragLock = useRef<'none' | 'horizontal' | 'vertical' | 'scrolling' | 'slider'>('none');
  const carouselRef = useRef<HTMLDivElement>(null);

  const activeIndex = tabs.indexOf(activeTab);
  const [isReady, setIsReady] = useState(activeIndex === 0);

  const hasChanges = useMemo(() => {
    const interestsChanged = JSON.stringify([...selectedInterests].sort()) !== JSON.stringify([...initialSelectedInterests].sort());
    const locationChanged = selectedLocation !== initialLocation;
    const distanceChanged = distanceValue !== initialDistanceValue || distanceUnit !== initialDistanceUnit;
    const ageChanged = minAge !== initialMinAge || maxAge !== initialMaxAge;
    const artistTypesChanged = JSON.stringify([...selectedArtistTypes].sort()) !== JSON.stringify([...initialSelectedArtistTypes].sort());

    return interestsChanged || locationChanged || distanceChanged || ageChanged || artistTypesChanged;
  }, [selectedInterests, selectedLocation, distanceValue, distanceUnit, minAge, maxAge, selectedArtistTypes, initialSelectedInterests, initialLocation, initialDistanceValue, initialDistanceUnit, initialMinAge, initialMaxAge, initialSelectedArtistTypes]);

  // Sync active tab on scroll (debounced to prevent mid-scroll state updates)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleScroll = () => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    scrollTimeoutRef.current = setTimeout(() => {
      if (carouselRef.current) {
        const scrollLeft = carouselRef.current.scrollLeft;
        const width = carouselRef.current.clientWidth;
        const index = Math.round(scrollLeft / width);
        const newTab = tabs[index];
        if (newTab && newTab !== activeTab) {
          setActiveTab(newTab);
        }
      }
    }, 100); // Debounce 100ms
  };

  // Initial scroll to the correct tab using native scroll
  useEffect(() => {
    // Small delay to ensure layout is stable before scrolling
    setTimeout(() => {
      if (carouselRef.current && activeIndex !== -1) {
        const targetSection = carouselRef.current.children[activeIndex] as HTMLElement;
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'instant', block: 'nearest', inline: 'start' });
        }
      }
      setIsReady(true);
    }, 50);
  }, []); // Run on mount only

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const touchY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    startY.current = touchY;
    currentDragY.current = 0;

    const target = e.target as HTMLElement;
    const isHandle = !!target.closest('.drag-handle-zone');

    if (isHandle) {
      setIsDragging(true);
      dragLock.current = 'vertical';
      if (modalRef.current) {
        modalRef.current.style.transition = 'none';
      }
    } else {
      // Not on handle - will check during move if we should start dragging
      dragLock.current = 'none';
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    const isTouchEvent = 'touches' in e;
    const touchY = isTouchEvent ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
    const deltaY = touchY - startY.current;

    // If already dragging modal (from drag handle), continue
    if (isDragging && dragLock.current === 'vertical') {
      if (e.cancelable) e.preventDefault();
      const newY = Math.max(0, deltaY);
      currentDragY.current = newY;
      if (modalRef.current) {
        modalRef.current.style.transform = `translate3d(0, ${newY}px, 0)`;
      }
      return;
    }

    // Only allow overscroll-to-close for TOUCH events (mobile), not mouse (desktop)
    if (isTouchEvent && deltaY > 15 && dragLock.current === 'none') {
      const target = e.target as HTMLElement;
      const scrollableSection = target.closest('[id^="filter-section-"]') as HTMLElement;
      const isAtScrollTop = scrollableSection ? scrollableSection.scrollTop <= 0 : false;

      if (isAtScrollTop) {
        setIsDragging(true);
        dragLock.current = 'vertical';
        startY.current = touchY; // Reset start to current position
        if (modalRef.current) {
          modalRef.current.style.transition = 'none';
        }
        if (e.cancelable) e.preventDefault();
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    dragLock.current = 'none';

    // Re-enable transition for snap back or close
    if (modalRef.current) {
      modalRef.current.style.transition = 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)';
    }

    if (currentDragY.current > 120) {
      setIsClosing(true);
      // We accept the close, so let the transition happen (handled by state isClosing effect or just manually)
      // Since we are moving away from dragY state bindings, we must ensure visual consistency.
      // If we set isClosing=true, the render usually handles the exit animation. 
      // But we just manually messed with transform.
      // Let's manually animate it out or let React take over?
      // Simplest: slide it down manually then onClose.
      if (modalRef.current) {
        modalRef.current.style.transform = `translate3d(0, 100%, 0)`;
      }
      setTimeout(onClose, 250);
    } else {
      // Snap back
      if (modalRef.current) {
        modalRef.current.style.transform = `translate3d(0, 0px, 0)`;
      }
      currentDragY.current = 0;
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const isShortTab = activeTab === FilterType.Age || activeTab === FilterType.Distance;

  const isCustomTheme = ['Hot Pink', 'That Orange', 'More Brown'].includes(currentTheme.name);
  const inactiveRingClass = isCustomTheme ? 'ring-[var(--border-color)]' : 'ring-[var(--border-color)]/50';

  const toggleInterest = (item: string) => {
    setSelectedInterests(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const toggleInterestsSection = (sectionItems: string[]) => {
    const allSelected = sectionItems.every(item => selectedInterests.includes(item));
    if (allSelected) {
      // Deselect all
      setSelectedInterests(prev => prev.filter(i => !sectionItems.includes(i)));
    } else {
      // Select all (merge unique)
      setSelectedInterests(prev => [...new Set([...prev, ...sectionItems])]);
    }
  };

  const toggleArtistType = (type: string) => {
    setSelectedArtistTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const toggleArtistSection = (sectionItems: string[]) => {
    const allSelected = sectionItems.every(item => selectedArtistTypes.includes(item));
    if (allSelected) {
      // Deselect all
      setSelectedArtistTypes(prev => prev.filter(t => !sectionItems.includes(t)));
    } else {
      // Select all (merge unique)
      setSelectedArtistTypes(prev => [...new Set([...prev, ...sectionItems])]);
    }
  };

  const getTabLabel = (type: FilterType) => {
    switch (type) {
      case FilterType.Interests: return 'Interests';
      case FilterType.Location: return 'Location';
      case FilterType.Distance: return `${distanceValue} ${distanceUnit}`;
      case FilterType.Age: return maxAge === 75 ? `Age ${minAge}+` : `Age ${minAge}-${maxAge}`;
      case FilterType.Artist:
        const count = selectedArtistTypes.length;
        return `${count} Artist${count !== 1 ? 's' : ''}`;
      case FilterType.More: return 'More filters';
      default: return type;
    }
  };

  // desiresSections removed, replaced by INTEREST_OPTIONS


  const popularLocations: LocationItem[] = [
    { id: 'city', name: 'Same city', sub: 'Connect with artists in your immediate area.', type: 'popular' },
    { id: 'state', name: 'Same state', sub: 'Expand your search to your region.', type: 'popular' },
    { id: 'country', name: 'Same country', sub: 'Find collaborators nationwide.', type: 'popular' },
    { id: 'international', name: 'International', sub: 'Discover art from around the world.', type: 'popular' },
  ];

  const virtualLocations: LocationItem[] = [
    { id: 'atelier', name: 'The Digital Atelier', sub: 'A workspace for digital creators.', type: 'virtual' },
    { id: 'neural', name: 'Neural Gallery', sub: 'Where AI and human creativity merge.', type: 'virtual' },
    { id: 'infinite', name: 'Infinite Canvas', sub: 'Collaborate without boundaries.', type: 'virtual' },
    { id: 'pixel', name: 'Pixel Studio', sub: 'For pixel art and retro aesthetics.', type: 'virtual' },
  ];

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col justify-end bg-black/60 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        className={`bg-[var(--bg-secondary)] w-full max-w-2xl mx-auto rounded-t-[40px] flex flex-col overflow-hidden shadow-[0_-10px_40px_rgba(0,0,0,0.5)] transform-gpu transition-transform duration-[400ms] cubic-bezier(0.16, 1, 0.3, 1)`}
        style={{ height: isShortTab ? '62dvh' : '86dvh', transform: isClosing ? 'translate3d(0, 100%, 0)' : 'translate3d(0, 0, 0)' }}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="flex-1 flex flex-col overflow-hidden touch-pan-y overscroll-contain">
          <div className="drag-handle-zone flex flex-col items-center pt-5 pb-2 flex-shrink-0 z-20 bg-[var(--bg-secondary)] cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 bg-[var(--text-primary)] opacity-40 rounded-full mb-4" />
            <div className="px-4 w-full">
              <div className="flex bg-[var(--bg-primary)] p-1 rounded-full overflow-x-auto no-scrollbar gap-1 border border-[var(--border-color)] pointer-events-auto">
                {tabs.map((type) => {
                  const isActive = activeTab === type;
                  return (
                    <button
                      key={type}
                      onClick={(e) => {
                        e.stopPropagation();
                        const section = document.getElementById(`filter-section-${type}`);
                        section?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
                      }}
                      className={`flex-1 py-2.5 px-5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${isActive ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}
                    >
                      {getTabLabel(type)}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="relative flex-1 overflow-hidden bg-[var(--bg-secondary)]">
            <div
              ref={carouselRef}
              onScroll={handleScroll}
              className={`flex h-full overflow-x-auto snap-x snap-mandatory no-scrollbar transition-opacity duration-200 ${isReady ? 'opacity-100' : 'opacity-0'}`}
              style={{ transform: 'translateZ(0)', willChange: 'scroll-position' }}
            >
              {/* Desires */}
              {/* Interests (was Desires) - Rendered with Sections (or single section) without Majestic lock */}
              <div id="filter-section-Interests" className="min-w-full w-full flex-shrink-0 snap-center px-6 pt-4 space-y-6 pb-24 h-full overflow-y-auto no-scrollbar" style={{ transform: 'translateZ(0)', overscrollBehaviorY: 'contain', willChange: 'scroll-position', WebkitOverflowScrolling: 'touch' }}>
                <p className="text-[var(--text-secondary)] text-xs leading-relaxed pr-8">Select your interests to connect with like-minded artists.</p>
                {INTEREST_OPTIONS.map(section => {
                  const isAllSelected = section.items.every(item => selectedInterests.includes(item));
                  return (
                    <div key={section.title} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[var(--text-secondary)] text-sm font-semibold uppercase tracking-wider">{section.title}</h3>
                        <button
                          onClick={() => toggleInterestsSection(section.items)}
                          className="text-xs font-bold text-[var(--accent-primary)] hover:opacity-80 transition-opacity"
                        >
                          {isAllSelected ? 'Deselect all' : 'Select all'}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {section.items.map(item => (
                          <button key={item} onClick={() => toggleInterest(item)} className={`px-4 py-2 rounded-full text-[13px] font-semibold ring-1 ring-inset transition-colors ${selectedInterests.includes(item) ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] ring-[var(--text-primary)]' : `bg-[var(--bg-tertiary)]/80 text-[var(--text-primary)] ${inactiveRingClass} hover:bg-[var(--bg-tertiary)]`}`}>{item}</button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Location */}
              <div id="filter-section-Location" className="min-w-full w-full flex-shrink-0 snap-center px-6 pt-4 pb-24 h-full overflow-y-auto no-scrollbar" style={{ transform: 'translateZ(0)', overscrollBehaviorY: 'contain', willChange: 'scroll-position', WebkitOverflowScrolling: 'touch' }}>
                <p className="text-[var(--text-secondary)] text-[13px] mb-8 leading-relaxed">Artist Circle moves with you when you use your current location. Or you can set a fixed location to explore.</p>
                <div className="space-y-2">
                  <LocationRow item={{ id: 'current', name: 'Current location', type: 'current' }} selected={selectedLocation} onSelect={setSelectedLocation} />
                  <div className="h-px bg-[var(--border-color)] my-6" />
                  <h3 className="text-[var(--text-secondary)] text-[11px] font-bold uppercase tracking-[0.15em] mt-8 mb-4">Expanded reach</h3>
                  <div className="space-y-1">{popularLocations.map(city => (<LocationRow key={city.id} item={city} selected={selectedLocation} onSelect={setSelectedLocation} />))}</div>
                  <div className="h-px bg-[var(--border-color)] my-6" />
                  <h3 className="text-[var(--text-secondary)] text-[11px] font-bold uppercase tracking-[0.15em] mt-8 mb-4">Virtual art spaces</h3>
                  <div className="space-y-1">{virtualLocations.map(v => (<LocationRow key={v.id} item={v} selected={selectedLocation} onSelect={setSelectedLocation} />))}</div>
                </div>
              </div>

              {/* Distance */}
              <div id="filter-section-Distance" className="min-w-full w-full flex-shrink-0 snap-center px-6 pt-8 space-y-8 pb-24 h-full no-scrollbar" style={{ transform: 'translateZ(0)', overscrollBehaviorY: 'contain', willChange: 'scroll-position', WebkitOverflowScrolling: 'touch', overflowY: isSliderActive ? 'hidden' : 'auto' }}>
                <div className="flex justify-between items-center"><span className="text-lg font-bold text-[var(--text-primary)]">Maximum distance</span><span className="text-lg font-bold text-[var(--text-primary)]">{distanceValue} {distanceUnit}</span></div>
                <div className="relative flex items-center py-6 px-2">
                  <div className="absolute left-2 right-2 h-1 bg-[var(--bg-tertiary)] rounded-full pointer-events-none">
                    <div className="h-full bg-[var(--text-primary)] rounded-full transition-all duration-75" style={{ width: `${(distanceValue / (distanceUnit === 'km' ? 400 : 250)) * 100}%` }} />
                  </div>
                  <input
                    type="range"
                    min="1"
                    max={distanceUnit === 'km' ? 400 : 250}
                    value={distanceValue}
                    onChange={(e) => setDistanceValue(parseInt(e.target.value))}
                    onTouchStart={() => setIsSliderActive(true)}
                    onTouchEnd={() => setIsSliderActive(false)}
                    onMouseDown={() => setIsSliderActive(true)}
                    onMouseUp={() => setIsSliderActive(false)}
                    className="w-full h-1 appearance-none bg-transparent pointer-events-auto cursor-pointer z-10"
                    style={{ touchAction: 'none' }}
                  />
                </div>
                <div className="flex justify-center">
                  <div className="inline-flex bg-[var(--bg-primary)] p-1 rounded-full border border-[var(--border-color)]">
                    <button onClick={() => { setDistanceUnit('km'); if (distanceValue > 400) setDistanceValue(400); }} className={`px-8 py-2.5 rounded-full text-xs font-bold transition-colors ${distanceUnit === 'km' ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>KM</button>
                    <button onClick={() => { setDistanceUnit('miles'); if (distanceValue > 250) setDistanceValue(250); }} className={`px-8 py-2.5 rounded-full text-xs font-bold transition-colors ${distanceUnit === 'miles' ? 'bg-[var(--bg-tertiary)] text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>MILES</button>
                  </div>
                </div>
              </div>

              {/* Age */}
              <div id="filter-section-Age" className="min-w-full w-full flex-shrink-0 snap-center px-6 pt-8 space-y-8 pb-24 h-full no-scrollbar" style={{ transform: 'translateZ(0)', overscrollBehaviorY: 'contain', willChange: 'scroll-position', WebkitOverflowScrolling: 'touch', overflowY: isSliderActive ? 'hidden' : 'auto' }}>
                <div className="flex justify-between items-center"><span className="text-lg font-bold text-[var(--text-primary)]">Age range</span><span className="text-lg font-bold text-[var(--text-primary)]">{maxAge === 75 ? `${minAge}+` : `${minAge}-${maxAge}`}</span></div>
                <div className="relative pt-10 px-2">
                  <div className="relative h-1 bg-[var(--bg-tertiary)] rounded-full">
                    <div className="absolute h-full bg-[var(--text-primary)] rounded-full" style={{ left: `${((minAge - 18) / 57) * 100}%`, right: `${100 - ((maxAge - 18) / 57) * 100}%` }} />
                    <input
                      type="range"
                      min="18"
                      max="75"
                      value={minAge}
                      onChange={(e) => setMinAge(Math.min(parseInt(e.target.value), maxAge - 1))}
                      onTouchStart={() => setIsSliderActive(true)}
                      onTouchEnd={() => setIsSliderActive(false)}
                      onMouseDown={() => setIsSliderActive(true)}
                      onMouseUp={() => setIsSliderActive(false)}
                      className="absolute w-full top-0 h-0 appearance-none pointer-events-auto cursor-pointer"
                      style={{ touchAction: 'none' }}
                    />
                    <input
                      type="range"
                      min="18"
                      max="75"
                      value={maxAge}
                      onChange={(e) => setMaxAge(Math.max(parseInt(e.target.value), minAge + 1))}
                      onTouchStart={() => setIsSliderActive(true)}
                      onTouchEnd={() => setIsSliderActive(false)}
                      onMouseDown={() => setIsSliderActive(true)}
                      onMouseUp={() => setIsSliderActive(false)}
                      className="absolute w-full top-0 h-0 appearance-none pointer-events-auto cursor-pointer"
                      style={{ touchAction: 'none' }}
                    />
                  </div>
                </div>
              </div>

              {/* Genders */}
              {/* Artist (was Genders) - Rendered as Sections with Pills */}
              <div id="filter-section-Artist" className="min-w-full w-full flex-shrink-0 snap-center px-6 pt-4 space-y-6 pb-24 h-full overflow-y-auto no-scrollbar" style={{ transform: 'translateZ(0)', overscrollBehaviorY: 'contain', willChange: 'scroll-position', WebkitOverflowScrolling: 'touch' }}>
                <p className="text-[var(--text-secondary)] text-xs leading-relaxed pr-8">Select artist types to find collaborators or peers.</p>
                {ARTIST_TYPE_OPTIONS.map(section => {
                  const isAllSelected = section.items.every(item => selectedArtistTypes.includes(item));
                  return (
                    <div key={section.title} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[var(--text-secondary)] text-sm font-semibold uppercase tracking-wider">{section.title}</h3>
                        <button
                          onClick={() => toggleArtistSection(section.items)}
                          className="text-xs font-bold text-[var(--accent-primary)] hover:opacity-80 transition-opacity"
                        >
                          {isAllSelected ? 'Deselect all' : 'Select all'}
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {section.items.map(item => {
                          const isSelected = selectedArtistTypes.includes(item);
                          return (
                            <button
                              key={item}
                              onClick={() => toggleArtistType(item)}
                              className={`px-4 py-2 rounded-full text-[13px] font-semibold ring-1 ring-inset transition-colors ${isSelected ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] ring-[var(--text-primary)]' : `bg-[var(--bg-tertiary)]/80 text-[var(--text-primary)] ${inactiveRingClass} hover:bg-[var(--bg-tertiary)]`}`}
                            >
                              {item}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* More Filters */}
              <div id="filter-section-More" className="min-w-full w-full flex-shrink-0 snap-center px-6 pt-8 space-y-4 pb-24 h-full overflow-y-auto no-scrollbar" style={{ transform: 'translateZ(0)', overscrollBehaviorY: 'contain', willChange: 'scroll-position', WebkitOverflowScrolling: 'touch' }}>
                <div className="flex items-center justify-between py-5 bg-[var(--bg-tertiary)] rounded-3xl px-6 border border-[var(--border-color)]">
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-[var(--text-primary)]">Recently online</span>
                      <div className="w-[18px] h-[18px] bg-[#4c1d95] rounded-full flex items-center justify-center text-[10px] text-white font-black shadow-sm border border-white/10">P</div>
                    </div>
                    <p className="text-[var(--text-secondary)] text-xs font-medium">Only show people active in the last 7 days.</p>
                  </div>
                  <div onClick={() => onOpenPro()} className="w-12 h-7 bg-[var(--bg-primary)] rounded-full relative transition-colors cursor-pointer border border-[var(--border-color)]"><div className="absolute top-1 left-1 w-5 h-5 bg-[var(--text-primary)] rounded-full" /></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Save Button */}
        <div className="absolute bottom-0 left-0 right-0 p-8 pb-10 flex justify-center pointer-events-none bg-gradient-to-t from-[var(--bg-secondary)] via-[var(--bg-secondary)] to-transparent z-50">
          <button
            onClick={() => onSave({ interests: selectedInterests, location: selectedLocation, distanceValue, distanceUnit, minAge, maxAge, artistTypes: selectedArtistTypes })}
            disabled={!hasChanges}
            className={`pointer-events-auto w-full max-w-[260px] font-black py-5 rounded-full text-lg shadow-2xl transition-all active:scale-95 ${hasChanges
              ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] opacity-100'
              : 'bg-[var(--text-secondary)]/20 text-[var(--text-secondary)] cursor-not-allowed'
              }`}
          >
            Save
          </button>
        </div>
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 32px; width: 32px; border-radius: 50%; background: var(--text-primary); cursor: pointer; border: 2px solid var(--bg-secondary); margin-top: -14px; position: relative; z-index: 100; box-shadow: 0 2px 10px rgba(0,0,0,0.3); }
        input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 4px; background: transparent; }
        input[type=range] { -webkit-appearance: none; background: transparent; width: 100%; margin: 0; outline: none; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { 
            -ms-overflow-style: none; 
            scrollbar-width: none; 
            -webkit-overflow-scrolling: touch;
        }
        .touch-pan-y {
          touch-action: pan-y;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
};

const LocationRow: React.FC<{ item: LocationItem; selected: string; onSelect: (id: string) => void }> = ({ item, selected, onSelect }) => (
  <div
    onClick={() => onSelect(item.id)}
    className="flex items-center justify-between py-5 cursor-pointer active:bg-[var(--bg-tertiary)] transition-colors group px-1"
  >
    <div className="flex flex-col min-w-0 pr-4">
      <span className={`text-lg font-bold transition-colors ${selected === item.id ? 'text-[var(--text-primary)]' : 'text-[var(--text-primary)]/80'}`}>{item.name}</span>
      {item.sub && <span className="text-sm text-[var(--text-secondary)] truncate mt-0.5 font-medium">{item.sub}</span>}
    </div>
    <div className={`w-6 h-6 rounded-full border-[2.5px] flex items-center justify-center transition-colors flex-shrink-0 ${selected === item.id ? 'border-[var(--text-primary)]' : 'border-[var(--text-secondary)]'}`}>
      {selected === item.id && <div className="w-2.5 h-2.5 bg-[var(--text-primary)] rounded-full" />}
    </div>
  </div>
);

export default FilterModal;