
import React from 'react';
import { Tab } from '../../types';

interface BottomNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-50">
      <div className="bg-[#120d1d]/95 backdrop-blur-xl border border-white/5 rounded-[40px] px-8 py-4 flex items-center justify-around shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
        <button 
          onClick={() => onTabChange(Tab.Discover)}
          className={`p-2 transition-all duration-300 ${activeTab === Tab.Discover ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <rect x="5" y="5" width="14" height="14" rx="1" />
          </svg>
        </button>
        <button 
          onClick={() => onTabChange(Tab.Likes)}
          className={`p-2 transition-all duration-300 ${activeTab === Tab.Likes ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
        <button 
          onClick={() => onTabChange(Tab.Chat)}
          className={`p-2 transition-all duration-300 relative ${activeTab === Tab.Chat ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 10-9-9c0 4.97 4.03 9 9 9z" />
            <path d="M12 3c-4.97 0-9 4.03-9 9 0 1.657.448 3.208 1.232 4.544L3 21l4.456-1.232A8.963 8.963 0 0012 21c4.97 0 9-4.03 9-9s-4.03-9-9-9z" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {activeTab !== Tab.Chat && (
            <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
          )}
        </button>
        <button 
          onClick={() => onTabChange(Tab.Profile)}
          className={`p-2 transition-all duration-300 ${activeTab === Tab.Profile ? 'text-white' : 'text-white/20 hover:text-white/40'}`}
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;
