import React from 'react';
import { useTheme } from '../../theme/ThemeContext';

interface FilterHeaderProps {
  onOpenFilter: (filterName: string) => void;
  distanceLabel: string;
  ageLabel: string;
  artistTypeLabel: string;
  isDesiresActive?: boolean;
  isLocationActive?: boolean;
  isAgeActive?: boolean;
}

const FilterHeader: React.FC<FilterHeaderProps> = ({
  onOpenFilter,
  distanceLabel,
  ageLabel,
  artistTypeLabel,
  isDesiresActive,
  isLocationActive,
  isAgeActive
}) => {
  const { currentTheme } = useTheme();
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };

    el.addEventListener('wheel', onWheel);
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const filters = [
    { label: 'Desires', hasDropdown: true, isActive: isDesiresActive },
    { label: 'Location', hasDropdown: true, isActive: isLocationActive },
    { label: distanceLabel, hasDropdown: true, id: 'Distance', isActive: true },
    { label: ageLabel, hasDropdown: true, id: 'Age', isActive: isAgeActive },
    { label: artistTypeLabel, hasDropdown: true, id: 'Artist', isActive: true },
    { label: 'Recently online', hasBadge: true }
  ];

  const isSpecialTheme = ['That Orange', 'Hot Pink', 'More Brown'].includes(currentTheme.name);

  return (
    <div className="flex-shrink-0 flex items-center bg-transparent z-40">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto whitespace-nowrap gap-2 p-3 no-scrollbar flex-1 md:justify-center"
      >
        {filters.map((f, i) => (
          <button
            key={i}
            onClick={() => onOpenFilter(f.id || f.label)}
            className={`
              px-[13px] py-[6.5px] rounded-full text-[13px] font-bold flex items-center gap-1.5 transition-transform active:scale-95 relative border
              ${f.isActive
                ? 'text-[var(--text-primary)]'
                : 'hover:bg-[var(--bg-secondary)]/20'}
            `}
            style={{
              backgroundColor: f.isActive
                ? 'var(--bg-secondary)'
                : (isSpecialTheme ? 'var(--bg-primary)' : 'var(--bg-tertiary)'),
              borderColor: f.isActive ? 'rgba(128, 128, 128, 0.5)' : 'rgba(128, 128, 128, 0.4)',
              color: f.isActive
                ? 'var(--text-primary)'
                : (isSpecialTheme ? 'var(--text-primary)' : 'var(--text-secondary)')
            }}
          >
            {f.label}
            {f.hasDropdown && (
              <svg
                className={`w-3.5 h-3.5`}
                style={{ color: f.isActive ? 'rgba(var(--text-primary), 0.8)' : (isSpecialTheme ? 'color-mix(in srgb, var(--text-primary), transparent 20%)' : 'var(--text-secondary)') }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
              </svg>
            )}
            {f.hasBadge && (
              <span className="w-4 h-4 bg-[#4c1d95] rounded-full flex items-center justify-center text-[9px] text-white font-black ml-1 border border-white/10 shadow-[0_2px_8px_rgba(76,29,149,0.4)] leading-none pt-[0.5px]">P</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterHeader;
