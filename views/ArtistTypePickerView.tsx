import React, { useState } from 'react';
import { useTheme } from '../theme/ThemeContext';

import { ARTIST_TYPE_OPTIONS } from '../data/filterOptions';

interface ArtistTypePickerViewProps {
    initialSelected: string[];
    onBack: () => void;
    onSave: (artistTypes: string[]) => void;
}


const ArtistTypePickerView: React.FC<ArtistTypePickerViewProps> = ({ initialSelected = [], onSave, onBack }) => {
    const { currentTheme } = useTheme();
    const isDarkTheme = currentTheme.name === 'Dark';
    const isLightTheme = currentTheme.name === 'Light';

    const [selectedTypes, setSelectedTypes] = useState<string[]>(initialSelected);

    const handleSave = () => {
        onSave(selectedTypes);
    };

    const toggle = (item: string) => {
        setSelectedTypes(prev =>
            prev.includes(item) ? prev.filter(i => i !== item) : (prev.length < 5 ? [...prev, item] : prev)
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-[var(--bg-primary)] animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
                <button onClick={onBack} className="p-2 -ml-2 text-[var(--text-primary)]">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">Select Artist Types</h2>
                <button
                    onClick={handleSave}
                    disabled={selectedTypes.length === 0}
                    className={`font-bold text-sm ${selectedTypes.length > 0 ? 'text-indigo-500' : 'text-[var(--text-secondary)] opacity-50'}`}
                >
                    Save
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 pb-20">
                <p className="text-[var(--text-secondary)] text-sm mb-6">
                    Select up to 5 artist types that describe you.
                </p>

                <div className="space-y-6">
                    {ARTIST_TYPE_OPTIONS.map((section) => (
                        <div key={section.title}>
                            <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-wider mb-3">
                                {section.title}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {section.items.map((item) => {
                                    const isSelected = selectedTypes.includes(item);
                                    return (
                                        <button
                                            key={item}
                                            onClick={() => toggle(item)}
                                            className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${isSelected
                                                ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] border-[var(--text-primary)]'
                                                : 'bg-[var(--bg-tertiary)] text-[var(--text-primary)] border-[var(--border-color)] hover:border-[var(--text-secondary)]'
                                                }`}
                                        >
                                            {item}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ArtistTypePickerView;
