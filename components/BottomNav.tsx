
import React from 'react';
import { Tab } from '../types';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

import { useTheme } from '../theme/ThemeContext';

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const { currentTheme } = useTheme();
  const isColoredTheme = !['Dark', 'Light'].includes(currentTheme.name);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md md:max-w-lg lg:max-w-xl z-50 pointer-events-none">
      <div className="bg-[var(--bottom-nav-bg)]/95 backdrop-blur-xl border border-[var(--border-color)] rounded-[40px] px-8 py-4 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto">
        {/* Discover Tab - Square Icon */}
        <button
          onClick={() => onTabChange(Tab.Discover)}
          className={`p-2 transition-colors duration-150 ${activeTab === Tab.Discover ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        </button>

        {/* Chat Tab - Rounded Droplet Icon */}
        <button
          onClick={() => onTabChange(Tab.Chat)}
          className={`p-2 transition-colors duration-150 relative ${activeTab === Tab.Chat ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
          </svg>
          {activeTab !== Tab.Chat && (
            <div className={`absolute top-[6.5px] right-[6.5px] w-1.5 h-1.5 rounded-full ${isColoredTheme ? 'bg-white' : 'bg-[#c084fc]'}`}></div>
          )}
        </button>

        {/* Likes Tab - Heart Icon */}
        <button
          onClick={() => onTabChange(Tab.Likes)}
          className={`p-2 transition-colors duration-150 ${activeTab === Tab.Likes ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>

        {/* Profile Tab - User Icon */}
        <button
          onClick={() => onTabChange(Tab.Profile)}
          className={`p-2 transition-colors duration-150 ${activeTab === Tab.Profile ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
