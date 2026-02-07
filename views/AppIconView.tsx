
import React, { useState } from 'react';

interface AppIconViewProps {
  onBack: () => void;
  selectedIcon: string;
  onSelect: (id: string) => void;
}

interface AppIcon {
  id: string;
  name: string;
  style: string;
  hasText: boolean;
  textStyle?: string;
}

const APP_ICONS: AppIcon[] = [
  { id: 'midnight', name: 'Midnight Artist Circle', style: 'bg-[#1a1a1a]', hasText: true },
  {
    id: 'aurora',
    name: 'Aurora',
    style: 'bg-gradient-to-br from-[#4c1d95] via-[#2563eb] to-[#7c3aed]',
    hasText: false
  },
  {
    id: 'heart',
    name: 'Heart',
    style: 'bg-gradient-to-br from-[#f97316] via-[#dc2626] to-[#be123c]',
    hasText: true
  },
  {
    id: 'magenta',
    name: 'Magenta',
    style: 'bg-gradient-to-br from-[#db2777] via-[#9d174d] to-[#4c0519]',
    hasText: false
  },
  {
    id: 'azure',
    name: 'Azure',
    style: 'bg-gradient-to-br from-[#4f46e5] via-[#3b82f6] to-[#1e1b4b]',
    hasText: true
  },
  {
    id: 'classic',
    name: 'Classic',
    style: 'bg-[#7c8ef2]',
    hasText: true
  },
  {
    id: 'neon',
    name: 'Neon',
    style: 'bg-gradient-to-br from-[#ec4899] via-[#8b5cf6] to-[#10b981]',
    hasText: true
  },
];

const AppIconView: React.FC<AppIconViewProps> = ({ onBack, selectedIcon, onSelect }) => {
  return (
    <div className="fixed inset-0 bg-[var(--bg-primary)] z-[130] flex flex-col animate-in slide-in-from-right duration-300">
      {/* Header */}
      <header className="flex items-center gap-6 p-4 border-b border-[var(--border-color)]">
        <button onClick={onBack} className="p-1 -ml-1 hover:bg-[var(--bg-tertiary)] rounded-full transition-colors text-[var(--text-primary)]">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-[var(--text-primary)]">App icon</h1>
      </header>

      {/* Grid */}
      <div className="flex-1 p-5 overflow-y-auto no-scrollbar">
        <div className="grid grid-cols-3 gap-3">
          {APP_ICONS.map((icon) => (
            <button
              key={icon.id}
              onClick={() => onSelect(icon.id)}
              className={`relative aspect-square rounded-[22px] overflow-hidden group active:scale-95 transition-transform ${icon.style} border border-white/5`}
            >
              {icon.hasText && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-black text-xl tracking-tighter">ARTIST CIRCLE</span>
                </div>
              )}

              {selectedIcon === icon.id && (
                <div className="absolute bottom-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-lg">
                  <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppIconView;
